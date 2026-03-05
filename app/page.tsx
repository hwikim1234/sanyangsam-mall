export const dynamic = 'force-dynamic'

import Link from 'next/link'
import Image from 'next/image'

export default function HomePage() {
  return (
    <div style={{ background: '#f6f5f0' }}>

      {/* ═══ 히어로 ═══ */}
      <section className="relative overflow-hidden h-[400px] md:h-[560px]" style={{ background: '#1b4332' }}>
        <Image
          src="/images/products/product-roots-1.jpg"
          alt="지리산 산양삼"
          fill
          className="object-cover object-center"
          style={{ opacity: 0.7 }}
          priority
        />
        <div className="absolute inset-0 flex items-center px-6 md:px-20">
          <div>
            <p className="text-xs font-bold tracking-[3px] uppercase mb-3" style={{ color: '#a67c2e' }}>
              Jirisan · Altitude 800m · 5–6 Years Grown
            </p>
            <h1
              className="font-black leading-tight text-white text-[28px] sm:text-[36px] md:text-[54px]"
              style={{ letterSpacing: '-1px', textShadow: '0 2px 20px rgba(0,0,0,.3)' }}
            >
              지리산 해발 800m<br />산양삼 직거래
            </h1>
            <p className="text-sm md:text-base mt-4 leading-relaxed" style={{ color: 'rgba(255,255,255,.85)' }}>
              화학 농약 무사용 · 한국임업진흥원 국내산·무농약 인증<br />
              농장주 이금팔이 직접 키우고 직접 보내드립니다
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href="/products"
                className="font-bold text-white rounded-lg px-7 py-3 text-sm md:text-base"
                style={{ background: '#2d6a4f' }}
              >
                지금 주문하기
              </Link>
              <Link
                href="/about"
                className="font-bold rounded-lg px-7 py-3 text-sm md:text-base"
                style={{ border: '2px solid #fff', color: '#fff', background: 'transparent' }}
              >
                농장 소개
              </Link>
            </div>
          </div>
        </div>
        {/* 히어로 배지 (데스크톱) */}
        <div
          className="hidden md:block absolute right-20 top-1/2 -translate-y-1/2 text-white text-center"
          style={{
            background: 'rgba(0,0,0,.6)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255,255,255,.2)',
            borderRadius: '16px',
            padding: '20px 24px',
            minWidth: '180px',
          }}
        >
          <div className="font-black leading-none" style={{ fontSize: '42px', color: '#a67c2e' }}>118배</div>
          <div className="mt-1 text-sm" style={{ opacity: 0.8 }}>인삼 대비 진세노사이드</div>
        </div>
      </section>

      {/* ═══ 트러스트 바 ═══ */}
      <div className="py-3.5 text-white" style={{ background: '#2d6a4f' }}>
        <div className="max-w-site mx-auto px-5">
          <div className="flex justify-center flex-wrap gap-6 md:gap-10">
            {['📜 한국임업진흥원 인증', '🚫 100% 무농약', '🏔️ 지리산 해발 800m', '📦 농가 직접 발송', '⭐ 1,000명+ 단골 고객'].map((item) => (
              <div key={item} className="text-sm font-semibold">{item}</div>
            ))}
          </div>
        </div>
      </div>

      {/* ═══ 대표 상품 ═══ */}
      <section className="py-16">
        <div className="max-w-site mx-auto px-5">
          {/* 섹션 타이틀 */}
          <div className="text-center mb-10">
            <p className="text-xs font-bold tracking-[2px] uppercase mb-1.5" style={{ color: '#a67c2e' }}>Best Products</p>
            <h2 className="text-[28px] font-black" style={{ color: '#111827' }}>대표 상품</h2>
            <div className="w-9 h-[3px] rounded-sm mx-auto mt-2.5" style={{ background: '#a67c2e' }} />
          </div>
          {/* 상품 카드 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            {[
              { img: '/images/products/new-product-comparison.png', badge: '베스트', badgeColor: '#a67c2e', name: '산양삼 5-6년근 10뿌리', sale: '49,800원', orig: '60,000원', rate: '17%↓', slug: 'sanyangsam-5-6nyeon-10ppuri' },
              { img: '/images/products/new-product-detail.png', badge: '인기', badgeColor: '#1d4ed8', name: '산양삼 5-6년근 15뿌리', sale: '67,800원', orig: '82,000원', rate: '17%↓', slug: 'sanyangsam-5-6nyeon-10ppuri' },
              { img: '/images/products/new-packaging.png', badge: '', badgeColor: '', name: '산양삼 5-6년근 20뿌리', sale: '89,800원', orig: '108,000원', rate: '17%↓', slug: 'sanyangsam-5-6nyeon-10ppuri' },
            ].map((p) => (
              <div
                key={p.name}
                className="bg-white overflow-hidden transition-all duration-200 hover:shadow-xl hover:-translate-y-0.5"
                style={{ borderRadius: '12px', border: '1px solid #e5e7eb' }}
              >
                <div className="relative h-[230px] overflow-hidden">
                  <Image src={p.img} alt={p.name} fill className="object-cover transition-transform duration-300 hover:scale-[1.04]" />
                  {p.badge && (
                    <span
                      className="absolute top-2.5 left-2.5 text-white text-[11px] font-bold px-2.5 py-1 rounded-full"
                      style={{ background: p.badgeColor }}
                    >
                      {p.badge}
                    </span>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="text-[15px] font-bold mb-1">{p.name}</h3>
                  <p className="text-xs mb-3" style={{ color: '#6b7280' }}>지리산 자연재배 · 무농약 인증 · 직송</p>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-[22px] font-black" style={{ color: '#2d6a4f' }}>{p.sale}</span>
                    <span className="text-sm line-through" style={{ color: '#9ca3af' }}>{p.orig}</span>
                    <span className="text-sm font-bold text-red-500">{p.rate}</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 px-4 pb-3" style={{ borderTop: '1px solid #e5e7eb', paddingTop: '12px' }}>
                  <Link
                    href={`/products/${p.slug}`}
                    className="text-center py-2.5 rounded-lg text-[13px] font-bold"
                    style={{ border: '1.5px solid #2d6a4f', background: '#fff', color: '#2d6a4f' }}
                  >
                    장바구니
                  </Link>
                  <Link
                    href={`/products/${p.slug}`}
                    className="text-center py-2.5 rounded-lg text-[13px] font-bold text-white"
                    style={{ background: '#2d6a4f' }}
                  >
                    상품보기
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ 이벤트 배너 ═══ */}
      <div className="py-11 px-5 text-center text-white" style={{ background: '#1b4332' }}>
        <div className="max-w-site mx-auto">
          <p className="text-xs font-bold tracking-[2px] uppercase mb-2.5" style={{ color: '#a67c2e' }}>LIMITED EVENT</p>
          <h2 className="text-[28px] font-black mb-5">너무 감사해서 또 이벤트합니다!</h2>
          <div
            className="inline-flex flex-wrap justify-center gap-6 mb-6 px-8 py-4"
            style={{ background: 'rgba(255,255,255,.1)', borderRadius: '12px' }}
          >
            {[
              { qty: '10뿌리 주문', bonus: '2뿌리' },
              { qty: '15뿌리 주문', bonus: '3뿌리' },
              { qty: '20뿌리 주문', bonus: '4뿌리' },
            ].map((item) => (
              <span key={item.qty} className="text-sm font-semibold">
                {item.qty} → <b className="text-lg" style={{ color: '#a67c2e' }}>{item.bonus}</b> 추가
              </span>
            ))}
          </div>
          <br />
          <Link
            href="/products"
            className="inline-block font-bold text-white text-base px-9 py-4 rounded-lg mt-2"
            style={{ background: '#2d6a4f' }}
          >
            지금 주문하기 →
          </Link>
        </div>
      </div>

      {/* ═══ 농장 소개 ═══ */}
      <section className="bg-white py-16">
        <div className="max-w-site mx-auto px-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-14 items-center">
            <div>
              <p className="text-xs font-bold tracking-[2px] uppercase mb-2" style={{ color: '#a67c2e' }}>Farm Story</p>
              <h2 className="text-[30px] font-black leading-snug mb-5">
                안녕하세요,<br />농장주 <em className="not-italic" style={{ color: '#2d6a4f' }}>이금팔</em>입니다.
              </h2>
              <p className="text-[15px] leading-[1.9] mb-2.5" style={{ color: '#4b5563' }}>
                지리산 해발 800m의 청정 자연에서 산양삼을 재배한 지 10여 년이 넘었습니다. 처음 시작할 때의 마음 그대로 정직하고 정성스럽게 키우고 있습니다.
              </p>
              <p className="text-[15px] leading-[1.9] mb-2.5" style={{ color: '#4b5563' }}>
                화학 농약과 비료를 전혀 사용하지 않고, 한국임업진흥원 국내산·무농약 합격증을 보유한 공인된 농장입니다.
              </p>
              <p className="text-[15px] font-bold mt-4" style={{ color: '#111827' }}>— 지리산 산양삼 농장주 이금팔 드림</p>
              <div className="mt-6">
                <Link
                  href="/about"
                  className="font-bold text-white text-[15px] px-7 py-3 rounded-lg inline-block"
                  style={{ background: '#2d6a4f' }}
                >
                  농장 자세히 보기
                </Link>
              </div>
            </div>
            <div className="rounded-[20px] overflow-hidden" style={{ boxShadow: '0 4px 20px rgba(0,0,0,.08)' }}>
              <Image
                src="/images/products/new-farmer-intro.png"
                alt="농장주 이금팔"
                width={600}
                height={500}
                className="w-full h-auto block"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ═══ 농장 특징 ═══ */}
      <section className="py-16" style={{ background: '#f9fafb' }}>
        <div className="max-w-site mx-auto px-5">
          <div className="text-center mb-10">
            <p className="text-xs font-bold tracking-[2px] uppercase mb-1.5" style={{ color: '#a67c2e' }}>Why Choose Us</p>
            <h2 className="text-[28px] font-black" style={{ color: '#111827' }}>저희 농장의 특징</h2>
            <div className="w-9 h-[3px] rounded-sm mx-auto mt-2.5" style={{ background: '#a67c2e' }} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { icon: '🏔️', title: '지리산 해발 800m', desc: '맑은 공기와 일교차가 큰 고지대에서 자연 그대로 재배합니다.' },
              { icon: '🌱', title: '5~6년 자연 재배', desc: '최소 5년 이상 충분히 자란 후 선별하여 수확합니다.' },
              { icon: '📜', title: '임업진흥원 인증', desc: '국내산·무농약 합격증을 보유한 공인 농장입니다.' },
              { icon: '🚫', title: '100% 무농약', desc: '화학 농약 및 비료를 전혀 사용하지 않습니다.' },
              { icon: '📦', title: '농장 직송', desc: '중간 유통 없이 농장에서 고객님께 직접 발송합니다.' },
              { icon: '💯', title: '정직한 포장', desc: '고객님이 보시는 그대로 직접 선별·포장하여 발송합니다.' },
            ].map((feat) => (
              <div
                key={feat.title}
                className="bg-white text-center px-[22px] py-7"
                style={{ borderRadius: '12px', border: '1px solid #e5e7eb' }}
              >
                <div className="text-[38px] mb-3">{feat.icon}</div>
                <h3 className="text-[15px] font-bold mb-2">{feat.title}</h3>
                <p className="text-[13px] leading-[1.7]" style={{ color: '#6b7280' }}>{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ 추천 대상 ═══ */}
      <section className="bg-white py-16">
        <div className="max-w-site mx-auto px-5">
          <div className="text-center mb-10">
            <p className="text-xs font-bold tracking-[2px] uppercase mb-1.5" style={{ color: '#a67c2e' }}>Recommended For</p>
            <h2 className="text-[28px] font-black" style={{ color: '#111827' }}>이런 분들께 추천드려요</h2>
            <div className="w-9 h-[3px] rounded-sm mx-auto mt-2.5" style={{ background: '#a67c2e' }} />
          </div>
          <div className="max-w-[680px] mx-auto overflow-hidden rounded-xl" style={{ boxShadow: '0 4px 20px rgba(0,0,0,.08)' }}>
            <Image
              src="/images/products/new-recommend.png"
              alt="추천"
              width={680}
              height={400}
              className="w-full block"
            />
          </div>
        </div>
      </section>

    </div>
  )
}
