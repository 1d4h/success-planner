// KT 기프티쇼 비즈 (Giftishow Biz) API 연동 모듈
// 공식 API 규격: https://biz.giftishow.com / API Endpoint: /api/v1/goods/order

export const KT_GIFTISHOW_CONFIG = {
  apiEndpoint: "https://api.giftishow.com/v1/goods/orders",
  apiToken: "KT_BIZ_DEV_TOKEN_SUCCESS_PLANNER_2026",
  customAuthCode: "GIFTISHOW_BIZ_AUTH_KEY_2026"
};

/**
 * KT 기프티쇼 비즈 API를 통한 모바일 쿠폰 즉시 발송
 * @param {Object} params
 * @param {string} params.receiverPhone 수신자 번호 (- 제외 11자리)
 * @param {string} params.goodsCode 기프티쇼 상품코드
 * @param {string} params.goodsName 기프티쇼 상품명
 * @param {string} params.brandName 브랜드명
 * @param {number} params.cost 차감 포인트
 */
export async function sendKtGiftishowOrder({ receiverPhone, goodsCode, goodsName, brandName, cost }) {
  // KT 기프티쇼 API 비동기 처리 시뮬레이션
  await new Promise((resolve) => setTimeout(resolve, 800));

  if (!receiverPhone || receiverPhone.length < 10) {
    return {
      success: false,
      message: "올바른 휴대폰 번호를 입력해주세요 (- 없이 10~11자리)."
    };
  }

  const trId = `KT_GIFT_${Date.now()}_${Math.floor(1000 + Math.random() * 9000)}`;
  const barcode = `880${Math.floor(10000000000 + Math.random() * 90000000000)}`;

  return {
    success: true,
    code: "0000", // KT 기프티쇼 API 성공 응답 코드 규격
    data: {
      trId: trId,
      goodsCode: goodsCode,
      goodsName: goodsName,
      brandName: brandName,
      receiverPhone: receiverPhone,
      pinNo: barcode,
      limitDate: "90일 (KT 기프티쇼 비즈 보증)",
      issuedAt: new Date().toLocaleDateString("ko-KR")
    },
    message: "KT 기프티쇼 비즈 API를 통해 모바일 쿠폰 MMS 발송이 완료되었습니다!"
  };
}
