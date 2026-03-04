import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('시딩 시작...')

  const adminEmail = process.env.SEED_ADMIN_EMAIL || 'admin@sanyangsam.com'
  const adminName = process.env.SEED_ADMIN_NAME || '관리자'
  const adminPasswordPlain = process.env.SEED_ADMIN_PASSWORD || 'ChangeMe123!'
  const bankName = process.env.BANK_NAME || '국민은행'
  const bankAccount = process.env.BANK_ACCOUNT || '000-000-000000'
  const bankHolder = process.env.BANK_HOLDER || '산양삼농장'

  // 관리자 계정 생성
  const adminPassword = await bcrypt.hash(adminPasswordPlain, 12)
  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      name: adminName,
      password: adminPassword,
      role: 'ADMIN',
    },
  })
  console.log('관리자 계정 생성:', admin.email)

  // 기본 설정값
  const settings = [
    { key: 'FREE_SHIPPING_THRESHOLD', value: '50000' },
    { key: 'SHIPPING_FEE', value: '3000' },
    { key: 'BANK_NAME', value: bankName },
    { key: 'BANK_ACCOUNT', value: bankAccount },
    { key: 'BANK_HOLDER', value: bankHolder },
    { key: 'DEPOSIT_DEADLINE_HOURS', value: '24' },
  ]

  for (const s of settings) {
    await prisma.setting.upsert({
      where: { key: s.key },
      update: { value: s.value },
      create: s,
    })
  }
  console.log('기본 설정 완료')

  // 상품 생성
  const product1 = await prisma.product.upsert({
    where: { slug: 'sanyangsam-5-6nyeon-10ppuri' },
    update: {},
    create: {
      slug: 'sanyangsam-5-6nyeon-10ppuri',
      name: '지리산 산양삼 5-6년근',
      description: `## 지리산 해발 800m 자연 그대로 자라난 산양삼

지리산의 기를 품고 자연의 침을 이겨냈기에 다른 것과 영양분이 다릅니다.

### 상품 특징
- **100% 무농약 · 100% 국내산** 산양삼
- 지리산 해발 800m 청정 환경에서 **5~6년** 자연 재배
- 한국임업진흥원 **국내산·무농약 합격증** 인증
- 전문 재배기술 교육 수료 농가 직송
- **인삼보다 진세노이드 성분 풍부**

### 이런 분들께 추천드려요
- 체력 회복이 필요하신 분
- 면역력을 높이고 싶으신 분
- 피로가 쉽게 쌓이시는 분
- 부모님 건강 선물로 고려 중인 분

### 복용 방법
- **생식**: 깨끗이 씻어 그대로 드세요
- **즙**: 물 600~700ml에 산양삼을 넣고 끓여 드세요
- **담금주**: 소주에 담가 3개월 후 드세요

### 보관 방법
- 냉장 보관 (0~5℃) 권장
- 개봉 후 1주일 내 드시는 것을 권장합니다`,
      price: 60000,
      salePrice: 49800,
      stock: 100,
      isActive: true,
      isFeatured: true,
      images: {
        create: [
          { url: '/images/products/product-hero.jpg', altText: '지리산 산양삼 메인', sortOrder: 0 },
          { url: '/images/products/product-roots-1.jpg', altText: '산양삼 10뿌리', sortOrder: 1 },
          { url: '/images/products/field-harvest.jpg', altText: '산양삼 재배지', sortOrder: 2 },
        ],
      },
      options: {
        create: [
          { name: '10뿌리', priceAdj: 0, stock: 50 },
          { name: '15뿌리', priceAdj: 24800, stock: 30 },
          { name: '20뿌리', priceAdj: 49800, stock: 20 },
        ],
      },
    },
  })
  console.log('상품 생성:', product1.name)

  console.log('시딩 완료!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
