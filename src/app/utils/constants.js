export const PER_PAGE = 20

export const validationError = err => ({
  error: 'Validation failed',
  messages: err.inner,
})

export const CACHE = {
  ORDERS: 'orders',
}

export const WITHDRAW_PER_DAY = 5
