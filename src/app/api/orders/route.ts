import type { Order } from '@prisma/client'
import { NextRequest } from 'next/server'

import prisma from '~/lib/prisma'

export const dynamic = 'force-dynamic' // defaults to force-static

export async function POST (req: NextRequest) {
  const payload = await req.json()

  const order: Omit<Order, 'id' | 'updatedAt'> = {
    shopifyOrderId: `${ payload.id }`,
    createdAt: payload.created_at,
    email: payload.email,
    orderNumber: payload.order_number,
    phone: payload.phone,
    test: payload.test,
    total: payload.total_price,
  }

  await prisma.order.create({ data: order })

  return new Response('ok')
}