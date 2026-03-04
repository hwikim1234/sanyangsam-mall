import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import InquiryStatusForm from './status-form'

export default async function AdminInquiriesPage() {
  const session = await getServerSession(authOptions)
  if (!session || (session.user as any)?.role !== 'ADMIN') redirect('/login')

  const inquiries = await prisma.inquiry.findMany({ orderBy: { createdAt: 'desc' }, take: 100 })
  const statusLabel: Record<string, string> = {
    RECEIVED: '접수',
    IN_PROGRESS: '처리중',
    ANSWERED: '답변완료',
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">문의 관리</h1>
      <div className="space-y-4">
        {inquiries.length === 0 && <div className="bg-white border rounded-xl p-8 text-gray-500">문의가 없습니다.</div>}
        {inquiries.map((q) => (
          <div key={q.id} className="bg-white border rounded-xl p-5">
            <div className="flex justify-between items-start gap-3 mb-3">
              <div>
                <p className="font-semibold">{q.subject || '문의'}</p>
                <p className="text-sm text-gray-500">{q.name} · {q.phone || q.email || '-'} · {new Date(q.createdAt).toLocaleString('ko-KR')}</p>
              </div>
              <span className="text-xs px-2 py-1 rounded-full bg-gray-100">{statusLabel[q.status] || q.status}</span>
            </div>
            <p className="text-sm text-gray-700 whitespace-pre-wrap mb-4">{q.message}</p>
            {q.answer && <div className="text-sm bg-green-50 border border-green-200 rounded-lg p-3 mb-4 whitespace-pre-wrap">답변: {q.answer}</div>}
            <InquiryStatusForm inquiryId={q.id} currentStatus={q.status} currentAnswer={q.answer || ''} />
          </div>
        ))}
      </div>
    </div>
  )
}
