import { apiRequest } from './client'
import type {
  Account,
  Category,
  ConfirmPendingInput,
  CreateAccountInput,
  CreateAccountResult,
  CreateCategoryInput,
  CreateCategoryResult,
  CreateTransactionInput,
  CurrentUser,
  Debt,
  DiscardPendingInput,
  PayDebtInput,
  PendingMovement,
  Summary,
  Transaction,
  TransactionQuery,
  TransactionType,
} from './types'

function toQuery(params: { [key: string]: string | number | undefined }) {
  const search = new URLSearchParams()
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined) search.set(key, String(value))
  }
  const query = search.toString()
  return query ? `?${query}` : ''
}

export const financeApi = {
  getMe: () => apiRequest<CurrentUser>('/api/me'),
  listAccounts: () => apiRequest<Account[]>('/api/accounts'),
  createAccount: (input: CreateAccountInput) => apiRequest<CreateAccountResult>('/api/accounts', { method: 'POST', body: JSON.stringify(input) }),
  getSummary: () => apiRequest<Summary>('/api/summary'),
  listTransactions: (query: TransactionQuery = {}) => apiRequest<Transaction[]>(`/api/transactions${toQuery({ ...query })}`),
  createTransaction: (input: CreateTransactionInput) => apiRequest<Transaction>('/api/transactions', { method: 'POST', body: JSON.stringify(input) }),
  listCategories: (type?: TransactionType) => apiRequest<Category[]>(`/api/categories${toQuery({ type })}`),
  createCategory: (input: CreateCategoryInput) => apiRequest<CreateCategoryResult>('/api/categories', { method: 'POST', body: JSON.stringify(input) }),
  listDebts: () => apiRequest<Debt[]>('/api/debts'),
  payDebt: (id: string, input: PayDebtInput) => apiRequest<{ id: string }>(`/api/debts/${id}/pay`, { method: 'POST', body: JSON.stringify(input) }),
  listPendingMovements: (limit = 50) => apiRequest<PendingMovement[]>(`/api/pending-movements${toQuery({ limit })}`),
  confirmPendingMovement: (id: string, input: ConfirmPendingInput) => apiRequest<{ id: string }>(`/api/pending-movements/${id}/confirm`, { method: 'POST', body: JSON.stringify(input) }),
  discardPendingMovement: (id: string, input: DiscardPendingInput = {}) => apiRequest<{ id: string }>(`/api/pending-movements/${id}/discard`, { method: 'POST', body: JSON.stringify(input) }),
}
