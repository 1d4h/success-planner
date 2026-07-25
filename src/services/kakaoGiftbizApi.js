// 카카오 선물하기 비즈니스 API 모킹 연동 클라이언트 서비스
// 실환경 적용 시: KAKAO_BIZ_APP_KEY 및 API Server Endpoint 발급 후 fetch/axios 연동

export const KAKAO_BIZ_CONFIG = {
  apiEndpoint: "https://giftbiz-api.kakao.com/v1/orders",
  appKey: "YOUR_KAKAO_BIZ_APP_KEY_SAMPLE",
  senderName: "Success Planner"
};

/**
 * 카카오 선물하기 비즈니스 API 선물 발송 요청 (Mock Engine)
 * @param {Object} params
 * @param {string} params.receiverPhone 수신자 전화번호
 * @param {string} params.gifticonId 상품 ID
 * @param {string} params.gifticonName 상품명
 * @param {number} params.cost 소모 포인트
 */
export async function sendKakaoGiftbizOrder({ receiverPhone, gifticonId, gifticonName, cost }) {
  // 실제 API 요청 모뮬레이션 (네트워크 딜레이 1초)
  await new Promise(resolve => setTimeout(resolve, 1000));

  // 입력값 검증
  if (!receiverPhone || receiverPhone.length < 10) {
    return {
      success: false,
      message: "유효한 대한민국 휴대폰 번호(- 없이 입력)를 입력해주세요."
    };
  }

  // 성공 트랜잭션 응답 모킹 (카카오 비즈니스 규격)
  const transactionId = `KAKAO_BIZ_${Date.now()}_${Math.floor(Math.random() * 10000)}`;
  const barcodeNumber = `99${Math.floor(100000000000 + Math.random() * 900000000000)}`;

  return {
    success: true,
    code: 200,
    data: {
      orderId: transactionId,
      kakaoTraceId: `TR_${Date.now()}`,
      receiverPhone: receiverPhone,
      productName: gifticonName,
      barcode: barcodeNumber,
      validDays: 90,
      sentAt: new Date().toISOString()
    },
    message: "카카오톡 선물하기 비즈니스 API를 통해 모바일 쿠폰 발송이 성공적으로 완료되었습니다!"
  };
}
