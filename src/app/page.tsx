import { Order, Wallet } from '@prisma/client'

import { fetchFromPath } from '~/lib/utils'

async function getData () {
  const [{ orders }, { wallets }] = await Promise.all([
    fetchFromPath('http://localhost:3000/api/orders'),
    fetchFromPath('http://localhost:3000/api/wallets'),
  ])

  return { orders, wallets }
}

export default async function Home () {
  const { orders, wallets } = await getData()

  return (
    <main>
      <h1>Loyalty</h1>

      <hr/>

      <h2>Orders</h2>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          { orders.map((order: Order) => (
            <tr key={ order.id }>
              <td>{ order.id }</td>
              <td>{ order.total }</td>
            </tr>
          )) }
        </tbody>
      </table>

      <hr/>

      <h2>Wallets</h2>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Balance</th>
          </tr>
        </thead>
        <tbody>
          { wallets.map((wallet: Wallet) => (
            <tr key={ wallet.id }>
              <td>{ wallet.id }</td>
              <td>{ wallet.credits }</td>
            </tr>
          )) }
        </tbody>
      </table>
    </main>
  )
}
