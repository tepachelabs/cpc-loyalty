import { Transaction } from '@prisma/client'

export async function fetchFromPath (path: string) {
  const res = await fetch(path)

  if (!res.ok) {
    throw new Error('Failed to fetch data')
  }

  return res.json()
}

export function computeCredits (transactions: Transaction[]) {
  return transactions.reduce((acc, transaction) => {
    return acc + transaction.amount
  }, 0)
}
