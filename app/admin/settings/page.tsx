import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import SettingsForm from './settings-form'

const keys = ['BANK_NAME', 'BANK_ACCOUNT', 'BANK_HOLDER', 'SHIPPING_FEE', 'FREE_SHIPPING_THRESHOLD', 'DEPOSIT_DEADLINE_HOURS']

export default async function AdminSettingsPage() {
  const session = await getServerSession(authOptions)
  if (!session || (session.user as any)?.role !== 'ADMIN') redirect('/login')

  const settings = await prisma.setting.findMany({ where: { key: { in: keys } } })
  const valueMap = Object.fromEntries(settings.map((s) => [s.key, s.value]))

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">운영 설정</h1>
      <SettingsForm initial={valueMap} />
    </div>
  )
}
