import { log } from '@logtail/next'
import type { Order } from '@prisma/client'
import { NextRequest } from 'next/server'

import prisma from '~/lib/prisma'

export const dynamic = 'force-dynamic' // defaults to force-static

export async function POST (req: NextRequest) {
  try {
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

    log.info('Storing new order', order)
    await prisma.order.create({ data: order })

    return new Response('ok')
  } catch (e) {
    log.error(e as unknown as any)
    return new Response('error', { status: 500 })
  }
}
