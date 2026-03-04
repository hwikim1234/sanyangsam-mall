export const dynamic = 'force-dynamic'

import Link from 'next/link'
import Image from 'next/image'
import { CheckCircle, Leaf, Award, Truck } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="bg-brand-cream">
      <section className="relative bg-gradient-to-b from-green-900 to-green-700 text-white overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 py-16 md:py-24">
          <div className="md:grid md:grid-cols-2 md:gap-12 md:items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-white/20 rounded-full px-4 py-1.5 text-sm mb-6">
                <Leaf className="w-4 h-4" />
                <span>100% 무농약 · 국내산</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-black leading-tight mb-4">
                지리산 해발 800m<br />
                <span className="text-yellow-300">자연 그대로</span><br />
                산양삼
              </h1>
              <p className="text-green-100 text-lg mb-8 leading-relaxed">
                5~6년 정성껏 재배한 산양삼을<br />
                농가에서 직접 보내드립니다
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  href="/products/sanyangsam-5-6nyeon-10ppuri"
                  className="bg-yellow-400 text-gray-900 font-bold py-4 px-8 rounded-xl text-center text-lg hover:bg-yellow-300 transition-colors"
                >
                  지금 구매하기
                </Link>
                <Link
                  href="#about"
                  className="border-2 border-white/50 text-white font-medium py-4 px-8 rounded-xl text-center hover:bg-white/10 transition-colors"
                >
                  더 알아보기
                </Link>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="rounded-2xl overflow-hidden border border-white/20 shadow-2xl">
                <Image
                  src="/images/products/product-hero.jpg"
                  alt="지리산 산양삼 대표 이미지"
                  width={720}
                  height={540}
                  className="w-full h-[360px] object-cover"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-10">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: '🏆', label: '한국임업진흥원', sub: '무농약 인증' },
              { icon: '🌱', label: '5~6년 재배', sub: '자연 성장' },
              { icon: '📦', label: '농가 직송', sub: '당일 발송' },
              { icon: '⭐', label: '4.9점', sub: '고객 만족도' },
            ].map((item) => (
              <div key={item.label} className="text-center p-4">
                <div className="text-3xl mb-2">{item.icon}</div>
                <div className="font-bold text-gray-800">{item.label}</div>
                <div className="text-sm text-gray-500">{item.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="about" className="py-14">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl font-black text-center text-gray-800 mb-12">왜 지리산 산양삼인가요?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: '🏔️',
                title: '청정 자연 환경',
                desc: '지리산 해발 800m, 맑은 공기와 깨끗한 토양에서 자란 산양삼입니다.',
              },
              {
                icon: '📜',
                title: '공식 인증 완료',
                desc: '한국임업진흥원에서 국내산·무농약 합격증을 취득했습니다.',
              },
              {
                icon: '🎁',
                title: '선물로도 최고',
                desc: '소중한 분들께 드리는 건강 선물로 정성껏 포장해 직접 발송합니다.',
              },
            ].map((item) => (
              <div key={item.title} className="card p-6 text-center">
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="font-bold text-xl text-gray-800 mb-3">{item.title}</h3>
                <p className="text-gray-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 rounded-2xl overflow-hidden border border-gray-200">
            <Image
              src="/images/products/field-harvest.jpg"
              alt="산양삼 재배지"
              width={1200}
              height={500}
              className="w-full h-[280px] object-cover"
            />
          </div>
        </div>
      </section>

      <section className="bg-green-900 text-white py-14">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl font-black text-center mb-12">산양삼의 효능</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {['체력 증진', '면역력 강화', '노화 방지', '피로 회복', '항산화 작용', '피부 개선'].map((effect) => (
              <div key={effect} className="flex items-center gap-3 bg-white/10 rounded-xl p-4">
                <CheckCircle className="w-5 h-5 text-yellow-400 shrink-0" />
                <span className="font-medium">{effect}</span>
              </div>
            ))}
          </div>
          <p className="text-green-300 text-xs text-center mt-6">* 본 제품은 식품이며 질병 치료를 목적으로 하지 않습니다.</p>
        </div>
      </section>

      <section className="bg-yellow-50 py-14">
        <div className="max-w-xl mx-auto px-4 text-center">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-black text-gray-800 mb-2">특별 증정 이벤트</h2>
            <p className="text-gray-600 mb-6">지금 주문 수량에 따라 추가 증정!</p>
            <div className="space-y-3 mb-8 text-left">
              {[
                { qty: '10뿌리 주문', bonus: '2뿌리 추가 증정' },
                { qty: '15뿌리 주문', bonus: '3뿌리 추가 증정' },
                { qty: '20뿌리 주문', bonus: '4뿌리 추가 증정' },
              ].map((item) => (
                <div key={item.qty} className="flex justify-between items-center bg-green-50 rounded-lg px-4 py-3">
                  <span className="font-medium text-gray-700">{item.qty}</span>
                  <span className="font-bold text-brand-green">{item.bonus}</span>
                </div>
              ))}
            </div>
            <Link href="/products/sanyangsam-5-6nyeon-10ppuri" className="btn-primary w-full block text-center text-lg">
              지금 주문하기 →
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-white py-10">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-center">
            {[
              { icon: <Truck className="w-6 h-6" />, text: '50,000원 이상 무료배송' },
              { icon: <CheckCircle className="w-6 h-6" />, text: '당일 발송 (오전 11시 이전 주문)' },
              { icon: <Award className="w-6 h-6" />, text: '신선 냉장 포장 보장' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 text-gray-700 bg-gray-50 rounded-xl px-6 py-4">
                <span className="text-brand-green">{item.icon}</span>
                <span className="font-medium">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
