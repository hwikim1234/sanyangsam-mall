export const dynamic = 'force-dynamic'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '농장 소개',
  description: '지리산 해발 800m, 정성껏 산양삼을 재배하는 농장을 소개합니다.',
}

export default function AboutPage() {
  return (
    <div className="max-w-site mx-auto px-4 py-12">
      {/* 페이지 헤더 */}
      <div className="text-center mb-12">
        <p className="text-brand-gold font-medium mb-2">ABOUT US</p>
        <h1 className="text-3xl font-black text-gray-800">농장 소개</h1>
        <div className="w-12 h-0.5 bg-brand-gold mx-auto mt-4" />
      </div>

      {/* 인사말 */}
      <div className="md:grid md:grid-cols-2 md:gap-16 items-center mb-16">
        <div>
          <p className="text-brand-gold font-medium mb-3">안녕하세요!</p>
          <h2 className="text-2xl font-black text-gray-800 mb-6 leading-snug">
            지리산 산양삼 농장<br />
            <span className="text-brand-green">인근팔</span>입니다.
          </h2>
          <div className="text-gray-600 leading-relaxed space-y-4">
            <p>
              지리산의 청정한 자연 속에서 산양삼을 재배한 지 10여 년이 넘었습니다.
              처음 시작할 때의 마음 그대로, 정직하고 정성스럽게 키우고 있습니다.
            </p>
            <p>
              화학 비료와 농약을 전혀 사용하지 않고, 자연이 주는 그대로의 환경에서
              산양삼이 자랄 수 있도록 최선을 다하고 있습니다.
            </p>
            <p>
              한국임업진흥원으로부터 국내산·무농약 합격증을 취득하였으며,
              전문 재배기술 교육 과정을 수료하여 품질을 보장합니다.
            </p>
            <p className="font-medium text-gray-700">
              농장주 인근팔 드림
            </p>
          </div>
        </div>
        <div className="mt-8 md:mt-0">
          <div className="bg-green-50 rounded-2xl overflow-hidden aspect-[4/3] flex items-center justify-center">
            <div className="text-center text-gray-400 p-8">
              <div className="text-6xl mb-3">👨‍🌾</div>
              <p>농장주 사진</p>
            </div>
          </div>
        </div>
      </div>

      {/* 농장 특징 */}
      <div className="bg-brand-cream rounded-2xl p-8 mb-16">
        <h2 className="text-xl font-black text-gray-800 text-center mb-8">저희 농장의 특징</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { icon: '🏔️', title: '지리산 해발 800m', desc: '맑은 공기와 깨끗한 토양, 일교차가 큰 고지대에서 자연 그대로 재배합니다.' },
            { icon: '🌱', title: '5~6년 자연 재배', desc: '인내심을 가지고 최소 5년 이상 충분히 자란 후 수확합니다.' },
            { icon: '📜', title: '한국임업진흥원 인증', desc: '국내산·무농약 합격증을 보유한 공인된 농장입니다.' },
            { icon: '🚫', title: '100% 무농약', desc: '화학 농약 및 비료를 전혀 사용하지 않습니다.' },
            { icon: '📦', title: '농가 직송', desc: '중간 유통 없이 농장에서 소비자에게 직접 발송합니다.' },
            { icon: '❤️', title: '정성 포장', desc: '모든 상품은 직접 선별하고 정성껏 포장하여 발송합니다.' },
          ].map((item) => (
            <div key={item.title} className="text-center p-4">
              <div className="text-4xl mb-3">{item.icon}</div>
              <h3 className="font-bold text-gray-800 mb-2">{item.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 인증 현황 */}
      <div className="mb-16">
        <h2 className="text-xl font-black text-gray-800 text-center mb-8">인증 현황</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {[
            { title: '무농약 농산물 인증', org: '한국임업진흥원 (Kofpi)', desc: '화학 농약 미사용 공식 인증' },
            { title: '국내산 산양삼 인증', org: '한국임업진흥원 (Kofpi)', desc: '100% 국내 지리산 재배 인증' },
            { title: '산양삼 재배기술 교육', org: '남원교육센터', desc: '전문 재배기술과정 수료' },
            { title: '산양삼 현장 실습 교육', org: '한국임업진흥원', desc: '현장 교육 및 실습 이수' },
          ].map((cert) => (
            <div key={cert.title} className="card p-5 flex gap-4">
              <div className="w-12 h-12 bg-brand-green rounded-lg flex items-center justify-center shrink-0">
                <span className="text-white text-xl">📜</span>
              </div>
              <div>
                <p className="font-bold text-gray-800">{cert.title}</p>
                <p className="text-sm text-brand-green font-medium">{cert.org}</p>
                <p className="text-sm text-gray-500 mt-1">{cert.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 재배 환경 */}
      <div>
        <h2 className="text-xl font-black text-gray-800 text-center mb-8">산양삼이 자라는 환경</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {[
            { label: '지리산 해발 800m 자생지', img: '' },
            { label: '자연 숲 속 재배', img: '' },
            { label: '장마 이후 쑥대 친환경 관리', img: '' },
          ].map((item, i) => (
            <div key={i} className="bg-green-50 rounded-xl overflow-hidden">
              <div className="aspect-video flex items-center justify-center text-5xl">🌲</div>
              <p className="text-center text-sm font-medium text-gray-600 py-3">{item.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
