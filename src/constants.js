export const FAMOUS_QUOTES = [
  { quote: "위대한 일을 하는 유일한 방법은 당신이 하는 일을 사랑하는 것입니다.", author: "스티브 잡스" },
  { quote: "당신이 할 수 있다고 믿든 할 수 없다고 믿든, 당신이 옳다.", author: "헨리 포드" },
  { quote: "미래를 예측하는 가장 좋은 방법은 미래를 창조하는 것이다.", author: "피터 드러커" },
  { quote: "성공은 매일 반복되는 작은 노력들의 합이다.", author: "로버트 콜리어" },
  { quote: "오늘의 작은 변화가 내일의 거대한 성공을 만든다.", author: "아놀드 슈워제네거" },
  { quote: "시작하는 방법은 말하기를 그만두고 행동하는 것이다.", author: "월트 디즈니" },
  { quote: "당신이 걸어온 길이 당신의 역사가 되고, 걸어갈 길이 당신의 비전이 된다.", author: "무명" }
];

export function getDailyQuote() {
  const today = new Date();
  const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
  return FAMOUS_QUOTES[dayOfYear % FAMOUS_QUOTES.length];
}

export const MOOD_EMOJIS = [
  { emoji: "🔥", label: "최고예요!", score: 5, color: "#EF4444" },
  { emoji: "😊", label: "좋았어요", score: 4, color: "#F59E0B" },
  { emoji: "😐", label: "무난해요", score: 3, color: "#10B981" },
  { emoji: "😮‍💨", label: "지쳤어요", score: 2, color: "#3B82F6" },
  { emoji: "🌧️", label: "힘들었어요", score: 1, color: "#8B5CF6" }
];

export const SUBSCRIPTION_PLANS = [
  {
    id: "free",
    name: "Starter (무료)",
    price: "₩0 / 월",
    badge: "기본",
    features: [
      "기본 모닝 루틴 & 핵심 To-Do 3개",
      "일일 명언 & 기상 체크인",
      "포인트 1x 기본 적립 (루틴당 +2P ~ +5P)",
      "하단 및 사이드바 기본 광고 노출"
    ],
    highlight: false,
    cta: "현재 이용 중"
  },
  {
    id: "pro",
    name: "Pro (프로)",
    price: "₩29,000 / 월",
    badge: "인기 선택",
    features: [
      "모닝 & 이브닝 루틴 전체 무제한 이용",
      "포인트 1.2x 부스터 적립 (루틴당 +6P)",
      "광고 50% 제거 (배너 광고 숨김)",
      "성장 대시보드 트리 구조 연간 5개 지원"
    ],
    highlight: false,
    cta: "Pro 업그레이드"
  },
  {
    id: "master",
    name: "Master (마스터)",
    price: "₩59,000 / 월",
    badge: "최고 프리미엄",
    features: [
      "모든 루틴 + AI 회고 피드백 요약 리포트",
      "포인트 1.5x 부스터 적립 (루틴당 +8P)",
      "모든 광고 100% 완전 제거 (Ad-Free)",
      "기프티콘 교환 전용 할인관 혜택 제공"
    ],
    highlight: true,
    cta: "Master 시작하기"
  }
];

export const STORE_CATEGORIES = [
  { id: 'all', name: '전체 상품', icon: '🛍️' },
  { id: 'cafe', name: '카페 & 디저트', icon: '☕' },
  { id: 'fastfood', name: '치킨 & 피자 & 버거', icon: '🍔' },
  { id: 'convenience', name: '편의점 & 상품권', icon: '🏪' },
  { id: 'culture', name: '영화 & 문화', icon: '🎬' }
];

export const GIFTICONS = [
  // 카페 & 디저트
  { id: 'kt_c1', categoryId: 'cafe', brand: '스타벅스', name: '아이스 아메리카노 T', cost: 4500, imgBg: '#00704A', icon: '☕', goodsCode: 'GIFT_SB_01' },
  { id: 'kt_c2', categoryId: 'cafe', brand: '스타벅스', name: '부드러운 생크림 카스테라 세트', cost: 10800, imgBg: '#00704A', icon: '🍰', goodsCode: 'GIFT_SB_02' },
  { id: 'kt_c3', categoryId: 'cafe', brand: '투썸플레이스', name: '스트로베리 초콜릿 생크림 피스', cost: 6700, imgBg: '#D32F2F', icon: '🎂', goodsCode: 'GIFT_TW_01' },
  { id: 'kt_c4', categoryId: 'cafe', brand: '메가MGC커피', name: '아이스 아메리카노 1잔', cost: 2000, imgBg: '#FFC107', icon: '🥤', goodsCode: 'GIFT_MG_01' },
  { id: 'kt_c5', categoryId: 'cafe', brand: '공차', name: '블랙밀크티 + 타피오카펄 L', cost: 4700, imgBg: '#8D6E63', icon: '🧋', goodsCode: 'GIFT_GC_01' },

  // 치킨 & 피자 & 버거
  { id: 'kt_f1', categoryId: 'fastfood', brand: 'BHC', name: '뿌링클 + 콜라 1.25L 세트', cost: 21000, imgBg: '#F39C12', icon: '🍗', goodsCode: 'GIFT_BHC_01' },
  { id: 'kt_f2', categoryId: 'fastfood', brand: 'BBQ', name: '황금올리브치킨 + 콜라 세트', cost: 23000, imgBg: '#E67E22', icon: '🍗', goodsCode: 'GIFT_BBQ_01' },
  { id: 'kt_f3', categoryId: 'fastfood', brand: '도미노피자', name: '블랙타이거 슈림프 M + 콜라', cost: 31000, imgBg: '#C0392B', icon: '🍕', goodsCode: 'GIFT_DOM_01' },
  { id: 'kt_f4', categoryId: 'fastfood', brand: '버거킹', name: '와퍼 세트', cost: 9100, imgBg: '#D35400', icon: '🍔', goodsCode: 'GIFT_BK_01' },
  { id: 'kt_f5', categoryId: 'fastfood', brand: '맥도날드', name: '빅맥 세트', cost: 7200, imgBg: '#E74C3C', icon: '🍟', goodsCode: 'GIFT_MCD_01' },

  // 편의점 & 상품권
  { id: 'kt_cv1', categoryId: 'convenience', brand: 'GS25', name: '모바일 금전권 5,000원권', cost: 5000, imgBg: '#00A3E0', icon: '🏪', goodsCode: 'GIFT_GS_05' },
  { id: 'kt_cv2', categoryId: 'convenience', brand: 'CU', name: '모바일 금전권 10,000원권', cost: 10000, imgBg: '#6F2C91', icon: '🏪', goodsCode: 'GIFT_CU_10' },
  { id: 'kt_cv3', categoryId: 'convenience', brand: '배달의민족', name: '모바일 상품권 10,000원권', cost: 10000, imgBg: '#2AC1BC', icon: '🛵', goodsCode: 'GIFT_BM_10' },
  { id: 'kt_cv4', categoryId: 'convenience', brand: '네이버페이', name: '포인트 쿠폰 5,000원권', cost: 5000, imgBg: '#03CF5D', icon: '💚', goodsCode: 'GIFT_NP_05' },

  // 영화 & 문화
  { id: 'kt_m1', categoryId: 'culture', brand: 'CGV', name: '2D 2인 2인 관람권 (주말/평일)', cost: 28000, imgBg: '#E74C3C', icon: '🎬', goodsCode: 'GIFT_CGV_02' },
  { id: 'kt_m2', categoryId: 'culture', brand: '롯데시네마', name: '영화 1인 관람권', cost: 14000, imgBg: '#8E44AD', icon: '🍿', goodsCode: 'GIFT_LOTTE_01' },
  { id: 'kt_m3', categoryId: 'culture', brand: '교보문고', name: '도서문화상품권 10,000원권', cost: 10000, imgBg: '#2980B9', icon: '📚', goodsCode: 'GIFT_KYOBO_10' }
];

export const INITIAL_GOALS_TREE = [
  {
    id: "y1",
    title: "2026년 자기계발 & 성공 습관 완성",
    category: "성장/커리어",
    progress: 75,
    months: [
      {
        id: "m1",
        title: "7월: 모닝 & 이브닝 시스템 정착",
        progress: 80,
        days: [
          { id: "d1", title: "매일 아침 6시 기상 및 확언 쓰기", completed: true },
          { id: "d2", title: "핵심 To-Do 3개 완료하기", completed: false },
          { id: "d3", title: "취침 전 감사일기 3줄 작성", completed: true }
        ]
      },
      {
        id: "m2",
        title: "8월: 건강 루틴 및 10만 원 저축하기",
        progress: 40,
        days: [
          { id: "d4", title: "주 3회 러닝 5km", completed: false },
          { id: "d5", title: "매일 물 2리터 마시기", completed: false }
        ]
      }
    ]
  },
  {
    id: "y2",
    title: "2026년 사이드 프로젝트 프로토타입 런칭",
    category: "비즈니스",
    progress: 50,
    months: [
      {
        id: "m3",
        title: "7월: Success Planner MVP 개발",
        progress: 90,
        days: [
          { id: "d6", title: "React 대시보드 UI 구현", completed: true },
          { id: "d7", title: "스트릭 및 로컬스토리지 연동", completed: true }
        ]
      }
    ]
  }
];

export const INITIAL_ROUTINE_DATA = {
  wakeTime: "06:30",
  affirmation: "나는 매일 더 지혜로워지고 내 목표에 한 걸음씩 확실하게 다가가고 있다.",
  personalNote: "오늘도 포기하지 않고 최선을 다하자!",
  todos: [
    { id: 1, text: "Success Planner 앱 MVP 완성하기", completed: true },
    { id: 2, text: "30분 유산소 운동 & 스트레칭", completed: false },
    { id: 3, text: "감사 일기 및 하루 회고 작성", completed: false }
  ],
  gratitudeEntries: [
    "오늘 아침 맑은 공기를 마시며 기분 좋게 기상할 수 있었음에 감사합니다.",
    "내가 계획한 일을 차근차근 해결해 나갈 지혜가 있음에 감사합니다.",
    "나를 응원해주는 소중한 사람들과 함께할 수 있음에 감사합니다."
  ],
  selfPraise: "오늘도 피곤한 상황에서도 집중력을 잃지 않고 프로젝트를 잘 이끌어 나간 나 자신이 대견하다!",
  feedbackDone: "핵심 3가지 업무 중 2가지를 집중해서 빠르게 처리한 점.",
  feedbackBetter: "오후 타임 폰 보는 시간을 줄이고 깊은 몰입(Deep Work)을 늘릴 것.",
  moodEmoji: "🔥",
  energyScore: 90,
  streak: 7,
  lastCompletedDate: new Date().toISOString().split("T")[0]
};
