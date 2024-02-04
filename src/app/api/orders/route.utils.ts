import { log } from '@logtail/next'
import type { Order, Transaction, Wallet } from '@prisma/client'

import prisma from '~/lib/prisma'

export async function findOrCreateWallet (wallet: Pick<Wallet, 'email' | 'phone'>): Promise<Wallet | null> {
  let existingWallet = null

  if (exists(wallet.email)) {
    log.info(`💳 Looking for wallet with email ${ wallet.email }`)
    existingWallet = await prisma.wallet.upsert({
      where: {
        email: wallet.email!,
      },
      update: { ...wallet },
      create: { ...wallet },
    })
  } else if (exists(wallet.phone)) {
    log.info(`💳 Looking for wallet with phone ${ wallet.phone }`)
    existingWallet = await prisma.wallet.upsert({
      where: {
        phone: wallet.phone!,
      },
      update: { ...wallet },
      create: { ...wallet },
    })
  } else {
    log.info('💳 No email or phone provided, cannot find or create wallet.')
  }

  return existingWallet
}

export function createDraftsFromShopifyOrder (payload: any): {
  draftOrder: Omit<Order, 'id' | 'updatedAt'>,
  draftWallet: Pick<Wallet, 'email' | 'phone'>,
  draftTransaction: Pick<Transaction, 'description' | 'amount'>,
} {
  const order: Omit<Order, 'id' | 'updatedAt'> = {
    shopifyOrderId: `${ payload.id }`,
    createdAt: payload.created_at,
    email: payload.email,
    orderNumber: payload.order_number,
    phone: payload.phone,
    test: payload.test,
    total: payload.total_price,
  }

  const wallet: Pick<Wallet, 'email' | 'phone'> = {
    email: payload.email,
    phone: payload.phone,
  }

  const transaction: Pick<Transaction, 'description' | 'amount'> = {
    description: `Crédito por orden #${ payload.order_number }. Total: $${ payload.total_price }.`,
    amount: parseInt(payload.total_price, 10),
  }

  return { draftOrder: order, draftWallet: wallet, draftTransaction: transaction }
}

function exists (value: string | null | undefined): boolean {
  return value !== null && value !== undefined && value.trim() !== ''
}
