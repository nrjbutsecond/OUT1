// Mock Payment Service
// This is a placeholder for VNPay/PayOS integration

export interface PaymentRequest {
  amount: number
  orderId: string
  returnUrl: string
  cancelUrl: string
  description: string
}

export interface PaymentResponse {
  success: boolean
  paymentUrl?: string
  transactionId?: string
  error?: string
}

export interface PaymentVerification {
  success: boolean
  orderId: string
  amount: number
  transactionId: string
}

/**
 * Mock payment initiation
 * TODO: Replace with VNPay/PayOS implementation
 * 
 * VNPay Integration Guide:
 * 1. Register at https://vnpay.vn
 * 2. Get TMN_CODE and HASH_SECRET
 * 3. Install vnpay package: npm install vnpay
 * 4. Replace this function with VNPay createPaymentUrl
 * 
 * PayOS Integration Guide:
 * 1. Register at https://payos.vn
 * 2. Get API_KEY and CLIENT_ID
 * 3. Install @payos/node package
 * 4. Replace this function with PayOS createPaymentLink
 */
export async function initiatePayment(request: PaymentRequest): Promise<PaymentResponse> {
  // Simulate payment processing
  console.log('💳 Mock Payment Initiated:', request)
  
  // In production, this would call VNPay/PayOS API
  const mockPaymentUrl = `/api/payment/mock?orderId=${request.orderId}&amount=${request.amount}`
  const mockTransactionId = `MOCK_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  
  return {
    success: true,
    paymentUrl: mockPaymentUrl,
    transactionId: mockTransactionId
  }
}

/**
 * Mock payment verification
 * TODO: Replace with VNPay/PayOS webhook handler
 */
export async function verifyPayment(paymentData: Record<string, unknown>): Promise<PaymentVerification> {
  console.log('✅ Mock Payment Verification:', paymentData)
  
  // In production, verify signature and transaction status
  return {
    success: true,
    orderId: (paymentData.orderId as string) || 'UNKNOWN',
    amount: (paymentData.amount as number) || 0,
    transactionId: (paymentData.transactionId as string) || 'MOCK_TRANSACTION'
  }
}

/**
 * Mock refund processing
 * TODO: Replace with VNPay/PayOS refund API
 */
export async function processRefund(transactionId: string, amount: number): Promise<PaymentResponse> {
  console.log('💸 Mock Refund Processed:', { transactionId, amount })
  
  return {
    success: true,
    transactionId: `REFUND_${transactionId}`
  }
}

// Payment status constants
export const PaymentStatus = {
  PENDING: 'PENDING',
  PROCESSING: 'PROCESSING',
  COMPLETED: 'COMPLETED',
  FAILED: 'FAILED',
  REFUNDED: 'REFUNDED'
} as const

export type PaymentStatusType = typeof PaymentStatus[keyof typeof PaymentStatus]

