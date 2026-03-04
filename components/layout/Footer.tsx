import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="hidden md:block bg-gray-900 text-gray-400 py-10 mt-16">
      <div className="max-w-5xl mx-auto px-4">
        <div className="grid grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="text-white font-bold text-lg mb-4">지리산 산양삼</h3>
            <p className="text-sm leading-relaxed">
              지리산 해발 800m 청정 환경에서<br />
              5~6년 자연 재배한 무농약 산양삼<br />
              한국임업진흥원 인증 농가 직송
            </p>
          </div>
          <div>
            <h4 className="text-white font-medium mb-4">고객센터</h4>
            <p className="text-sm">전화: 010-0000-0000</p>
            <p className="text-sm">운영시간: 평일 09:00 ~ 18:00</p>
            <p className="text-sm mt-2">카카오톡 채널: @지리산산양삼</p>
          </div>
          <div>
            <h4 className="text-white font-medium mb-4">바로가기</h4>
            <ul className="text-sm space-y-2">
              <li><Link href="/products/sanyangsam-5-6nyeon-10ppuri" className="hover:text-white transition-colors">상품 보기</Link></li>
              <li><Link href="/orders/track" className="hover:text-white transition-colors">주문 조회</Link></li>
              <li><Link href="/login" className="hover:text-white transition-colors">로그인</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-700 pt-6 text-sm">
          <p>상호: 지리산산양삼 | 사업자등록번호: 000-00-00000</p>
          <p className="mt-1">주소: 경남 하동군 지리산로 000</p>
          <p className="mt-2 text-gray-600">© 2025 지리산 산양삼. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
