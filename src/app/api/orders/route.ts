import { log } from '@logtail/next'
import type { Transaction } from '@prisma/client'
import { NextRequest, NextResponse } from 'next/server'

import prisma from '~/lib/prisma'

import { findOrCreateWallet, createDraftsFromShopifyOrder } from './route.utils'

export const dynamic = 'force-dynamic' // defaults to force-static

export async function GET () {
  const orders = await prisma.order.findMany()
  return NextResponse.json({ orders })
}

export async function POST (req: NextRequest) {
  try {
    const payload = await req.json()

    log.info('Processing new order', payload)

    const {
      draftOrder,
      draftTransaction,
      draftWallet,
    } = createDraftsFromShopifyOrder(payload)

    log.info('Drafts prepared', { draftOrder, draftTransaction, draftWallet })

    // Store everything into the database
    const wallet = await findOrCreateWallet(draftWallet)
    const order = await prisma.order.create({ data: draftOrder })

    // If wallet is found, create a transaction to link the order with the wallet
    if (wallet) {
      log.info('Wallet found!', wallet)

      const data = {
        ...draftTransaction,
        walletId: wallet.id,
        orderId: order.id,
      } satisfies Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>

      const transaction = await prisma.transaction.create({ data })
      log.info('Transaction stored!', transaction)
    }

    return new Response('ok')
  } catch (e) {
    log.error(e as unknown as any)
    return new Response('error', { status: 500 })
  }
}
