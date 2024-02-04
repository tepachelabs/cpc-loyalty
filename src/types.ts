import { Prisma, Wallet } from '@prisma/client'

export type WalletWithTransactions = Wallet &
Partial<Prisma.WalletGetPayload<{ include: { transactions: true } }>>
