export interface ApiEnvelope<T> {
  ok: boolean
  data?: T
  error?: string
  message?: string
}

export interface Account {
  id: string
  name: string
  accountType: string
  currency: string
  balance: number
}

export interface Transaction {
  id: string
  type: 'income' | 'expense'
  amount: number
  currency: string
  category: string
  account: string
  note?: string
  date?: string
}

export interface Debt {
  id: string
  description: string
  outstanding: number
  currency: string
  status: string
  dueDate?: string
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
