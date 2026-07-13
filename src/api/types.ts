export interface ApiEnvelope<T> {
  ok: boolean
  data?: T
  error?: string
  message?: string
}

export interface ApiErrorPayload {
  ok?: false
  error?: string
  message?: string
}

export interface CurrentUser {
  userId: string
  email?: string
  status: 'active' | string
  setupComplete: boolean
  gmailEnabled: boolean
  voiceEnabled: boolean
}

export type TransactionType = 'income' | 'expense'

export type AccountType = 'cash' | 'credit_card' | 'checking_account' | 'savings_account'

export interface Account {
  id: string
  name: string
  accountType: AccountType | string
  currency: string
  balance: number
}

export interface Transaction {
  id: string
  date: string
  type: TransactionType
  amount: number
  currency: string
  category: string
  account: string
  note?: string
  debtId?: string | null
}

export interface Category {
  id: string
  name: string
  type: TransactionType
  icon: string | null
}

export interface Debt {
  id: string
  description: string
  outstanding: number
  currency: string
  dueDate?: string | null
  account: string | null
  status: 'active' | 'paid' | 'overdue' | string
}

export interface PendingMovement {
  id: string
  detectedAt: string
  source: string
  account: string | null
  type: TransactionType
  amount: number
  currency: string
  description: string | null
  reference: string | null
  status: string
  confidence: number | null
  transactionId: string | null
  observation: string | null
}

export interface Summary {
  userId: string
  baseCurrency: string
  accounts: {
    totalAssets: number
    totalLiabilities: number
    netWorth: number
    count: number
  }
  month: {
    month: number
    year: number
    income: number
    expenses: number
    savings: number
  }
  debts: {
    activeCount: number
    pendingTotal: number
  }
}

export interface DashboardSummary {
  currency: string
  netWorth: number
  totalAssets: number
  totalLiabilities: number
  accountCount: number
  month: number
  year: number
  income: number
  expenses: number
  savings: number
  activeDebtCount: number
  pendingDebtTotal: number
}

export interface CreateAccountInput {
  name: string
  accountType: AccountType
  currency: string
  openingBalance: number
}

export interface CreateAccountResult {
  id: string
  name: string
  created: boolean
}

export interface CreateCategoryInput {
  name: string
  type: TransactionType
  icon?: string
}

export interface CreateCategoryResult {
  name: string
  type: TransactionType
  icon: string | null
  created: boolean
}

export interface CreateTransactionInput {
  type: TransactionType
  amount: number
  currency: string
  category: string
  account: string
  note?: string
  transactionDate?: string
}

export interface TransactionQuery {
  from?: string
  to?: string
  limit?: number
  offset?: number
}

export interface PayDebtInput {
  amount: number
  currency: string
  account: string
  note?: string
}

export interface ConfirmPendingInput {
  category: string
  note?: string
}

export interface DiscardPendingInput {
  reason?: string
}
