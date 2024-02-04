import { NextResponse } from 'next/server'

import prisma from '~/lib/prisma'

export const dynamic = 'force-dynamic' // defaults to force-static

export async function GET () {
  const wallets = await prisma.wallet.findMany({
    include: {
      transactions: true,
    },
  })
  return NextResponse.json({ wallets })
}
