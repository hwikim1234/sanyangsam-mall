import { prisma } from '@/lib/prisma'

interface NotifyPayload {
  title: string
  message: string
  toEmail?: string | null
  toPhone?: string | null
}

const ADMIN_NOTIFY_EMAIL = process.env.ADMIN_NOTIFY_EMAIL
const ADMIN_NOTIFY_PHONE = process.env.ADMIN_NOTIFY_PHONE

async function sendResendEmail(payload: NotifyPayload) {
  const apiKey = process.env.RESEND_API_KEY
  const from = process.env.RESEND_FROM_EMAIL
  if (!apiKey || !from || !payload.toEmail) return

  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from,
      to: [payload.toEmail],
      subject: payload.title,
      text: payload.message,
    }),
  })
}

async function sendAligoSms(payload: NotifyPayload) {
  const key = process.env.ALIGO_API_KEY
  const userId = process.env.ALIGO_USER_ID
  const sender = process.env.ALIGO_SENDER
  if (!key || !userId || !sender || !payload.toPhone) return

  const form = new URLSearchParams({
    key,
    user_id: userId,
    sender,
    receiver: payload.toPhone.replace(/[^0-9]/g, ''),
    msg: payload.message,
    title: payload.title,
    testmode_yn: process.env.ALIGO_TESTMODE_YN || 'Y',
  })

  await fetch('https://apis.aligo.in/send/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: form,
  })
}

async function sendWebhook(payload: NotifyPayload) {
  const webhook = process.env.NOTIFY_WEBHOOK_URL
  if (!webhook) return

  await fetch(webhook, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
}

export async function notify(payload: NotifyPayload) {
  try {
    await Promise.allSettled([sendResendEmail(payload), sendAligoSms(payload), sendWebhook(payload)])
  } catch (error) {
    console.error('notify error:', error)
  }
}

export async function notifyOrderCreated(orderId: string) {
  const order = await prisma.order.findUnique({ where: { id: orderId } })
  if (!order) return

  const payload = {
    title: `[산양삼] 주문 접수 ${order.orderNumber}`,
    message: `주문이 접수되었습니다. 주문번호: ${order.orderNumber}, 결제금액: ${order.totalAmount.toLocaleString()}원`,
  }

  await Promise.allSettled([
    notify({
      ...payload,
      toEmail: order.guestEmail,
      toPhone: order.shippingPhone,
    }),
    notify({
      ...payload,
      toEmail: ADMIN_NOTIFY_EMAIL,
      toPhone: ADMIN_NOTIFY_PHONE,
    }),
  ])
}

export async function notifyPaymentConfirmed(orderId: string) {
  const order = await prisma.order.findUnique({ where: { id: orderId } })
  if (!order) return

  const payload = {
    title: `[산양삼] 결제 확인 ${order.orderNumber}`,
    message: `결제가 확인되었습니다. 곧 발송 준비를 진행합니다. 주문번호: ${order.orderNumber}`,
  }

  await Promise.allSettled([
    notify({
      ...payload,
      toEmail: order.guestEmail,
      toPhone: order.shippingPhone,
    }),
    notify({
      ...payload,
      toEmail: ADMIN_NOTIFY_EMAIL,
      toPhone: ADMIN_NOTIFY_PHONE,
    }),
  ])
}

export async function notifyShipped(orderId: string) {
  const order = await prisma.order.findUnique({ where: { id: orderId } })
  if (!order) return

  const payload = {
    title: `[산양삼] 배송 시작 ${order.orderNumber}`,
    message: `상품이 발송되었습니다. 택배사: ${order.courierCode || '-'}, 운송장: ${order.trackingNumber || '-'}`,
  }

  await Promise.allSettled([
    notify({
      ...payload,
      toEmail: order.guestEmail,
      toPhone: order.shippingPhone,
    }),
    notify({
      ...payload,
      toEmail: ADMIN_NOTIFY_EMAIL,
      toPhone: ADMIN_NOTIFY_PHONE,
    }),
  ])
}
