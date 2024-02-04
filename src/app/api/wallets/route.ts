import { NextResponse } from 'next/server'

import prisma from '~/lib/prisma'
import { computeCredits } from '~/lib/utils'
import { WalletWithTransactions } from '~/types'

export const dynamic = 'force-dynamic' // defaults to force-static

export async function GET () {
  const _wallets = await prisma.wallet.findMany({
    include: {
      transactions: true,
    },
  })

  const wallets = _wallets.map((wallet: WalletWithTransactions) => {
    const creditsFromTransactions = wallet.transactions ? computeCredits(wallet.transactions) : 0

    return {
      ...wallet,
      credits: wallet.credits + creditsFromTransactions,
    }
  })

  return NextResponse.json({ wallets })
}
