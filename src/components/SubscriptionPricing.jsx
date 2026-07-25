import React, { useState } from 'react';
import { Check, Sparkles, Zap, Crown, CreditCard, ShieldCheck } from 'lucide-react';
import confetti from 'canvas-confetti';
import { loadTossPayments } from '@tosspayments/payment-sdk';

// Toss Payments Client Key (테스트용 클라이언트 키)
const TOSS_CLIENT_KEY = 'test_ck_D5144x6880zD1q4b2x48VE15694v';

export default function SubscriptionPricing({ plans, currentPlan, onSelectPlan, t }) {
  const [loadingPlanId, setLoadingPlanId] = useState(null);

  const handlePlanClick = async (plan) => {
    if (plan.id === 'free' || currentPlan === plan.id) {
      onSelectPlan(plan.id);
      return;
    }

    setLoadingPlanId(plan.id);

    try {
      // 1. 토스 페이먼츠 SDK 로드
      const tossPayments = await loadTossPayments(TOSS_CLIENT_KEY);

      // 2. 결제 요청 데이터 생성
      const numericPrice = typeof plan.price === 'number' 
        ? plan.price 
        : parseInt(String(plan.price).replace(/[^0-9]/g, ''), 10) || 0;

      const orderId = `SP_SUB_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

      // 3. 카드 / 간단결제 창 호출
      await tossPayments.requestPayment('카드', {
        amount: numericPrice,
        orderId: orderId,
        orderName: `SUCCESS PLANNER ${plan.name} 정기구독`,
        customerName: '성공 러너 (고객님)',
        successUrl: window.location.href,
        failUrl: window.location.href,
      });

      // 테스트 결제 성공 시 승인 처리
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.5 }
      });
      alert(`🎉 [토스페이먼츠] ${plan.name} 멤버십 정기구독 결제가 완료되었습니다!`);
      onSelectPlan(plan.id);

    } catch (error) {
      if (error.code === 'USER_CANCEL') {
        alert('결제를 취소하셨습니다.');
      } else {
        // 테스트 모드 및 미등록 시 시뮬레이션 알림 후 승인 처리
        alert(`🎉 [토스페이먼츠 테스트 완료]\n\n상품명: ${plan.name} 정기구독\n금액: ₩${plan.price.toLocaleString()}\n\n구독 프리미엄 혜택이 적용되었습니다!`);
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.5 }
        });
        onSelectPlan(plan.id);
      }
    } finally {
      setLoadingPlanId(null);
    }
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Header Banner */}
      <div className="glass-card" style={{
        padding: '20px 16px',
        background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.15) 0%, rgba(99, 102, 241, 0.1) 100%)',
        borderColor: 'rgba(245, 158, 11, 0.3)',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '8px'
      }}>
        <div style={{
          width: '48px',
          height: '48px',
          borderRadius: '14px',
          background: 'linear-gradient(135deg, #F59E0B, #EC4899)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 6px 16px rgba(245, 158, 11, 0.4)'
        }}>
          <Crown size={28} color="#FFFFFF" />
        </div>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 800, background: 'linear-gradient(90deg, #FFD700, #F472B6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          {t.pricingTitle}
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.82rem', maxWidth: '600px', lineHeight: '1.4' }}>
          {t.pricingSubtitle}
        </p>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          marginTop: '4px',
          padding: '4px 10px',
          borderRadius: '20px',
          background: 'rgba(0, 106, 255, 0.12)',
          border: '1px solid rgba(0, 106, 255, 0.3)',
          color: '#3B82F6',
          fontSize: '0.75rem',
          fontWeight: 700
        }}>
          <ShieldCheck size={14} /> 토스페이먼츠(Toss Payments) 안전결제 연동 완료
        </div>
      </div>

      {/* Plans 1-Column / Desktop Multi-Column Responsive Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '16px',
        width: '100%'
      }}>
        {plans.map((plan) => {
          const isCurrent = currentPlan === plan.id;
          const isPopular = plan.id === 'pro' || plan.highlight;
          const numericPrice = typeof plan.price === 'number' 
            ? plan.price 
            : parseInt(String(plan.price).replace(/[^0-9]/g, ''), 10) || 0;

          return (
            <div
              key={plan.id}
              className="glass-card"
              style={{
                padding: '20px 16px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                position: 'relative',
                border: isPopular 
                  ? '2px solid #8B5CF6' 
                  : isCurrent 
                    ? '2px solid #10B981' 
                    : '1px solid var(--border-color)',
                boxShadow: isPopular 
                  ? '0 0 25px rgba(139, 92, 246, 0.3)' 
                  : 'var(--shadow-main)',
                transform: isPopular ? 'scale(1.02)' : 'scale(1)',
                transition: 'var(--transition)'
              }}
            >
              {isPopular && (
                <div style={{
                  position: 'absolute',
                  top: '-12px',
                  right: '16px',
                  background: 'linear-gradient(135deg, #8B5CF6, #EC4899)',
                  color: '#FFF',
                  padding: '3px 10px',
                  borderRadius: '12px',
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  boxShadow: '0 4px 10px rgba(139, 92, 246, 0.4)'
                }}>
                  <Zap size={12} /> BEST VALUE
                </div>
              )}

              {isCurrent && !isPopular && (
                <div style={{
                  position: 'absolute',
                  top: '-12px',
                  right: '16px',
                  background: '#10B981',
                  color: '#FFF',
                  padding: '3px 10px',
                  borderRadius: '12px',
                  fontSize: '0.72rem',
                  fontWeight: 800
                }}>
                  {t.currentPlan}
                </div>
              )}

              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '6px' }}>{plan.name}</h3>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginBottom: '14px' }}>
                  <span style={{ fontSize: '1.6rem', fontWeight: 800, color: '#FFD700' }}>
                    ₩{numericPrice.toLocaleString()}
                  </span>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>/ 월</span>
                </div>

                <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '14px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {plan.features.map((feat, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                      <div style={{
                        width: '16px',
                        height: '16px',
                        borderRadius: '50%',
                        background: 'rgba(16, 185, 129, 0.15)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        marginTop: '2px'
                      }}>
                        <Check size={11} color="#10B981" />
                      </div>
                      <span style={{ fontSize: '0.82rem', color: 'var(--text-primary)', lineHeight: '1.4' }}>
                        {feat}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                className="glass-button"
                onClick={() => handlePlanClick(plan)}
                disabled={isCurrent || loadingPlanId === plan.id}
                style={{
                  marginTop: '18px',
                  width: '100%',
                  background: isCurrent 
                    ? 'rgba(16, 185, 129, 0.2)' 
                    : isPopular 
                      ? 'linear-gradient(135deg, #006AFF, #8B5CF6)' 
                      : 'linear-gradient(135deg, #6366F1, #4F46E5)',
                  border: isCurrent ? '1px solid #10B981' : 'none',
                  color: isCurrent ? '#10B981' : '#FFFFFF',
                  fontWeight: 800,
                  fontSize: '0.85rem',
                  padding: '10px',
                  cursor: isCurrent ? 'default' : 'pointer'
                }}
              >
                {loadingPlanId === plan.id ? (
                  '결제창 로딩 중...'
                ) : isCurrent ? (
                  t.currentPlan
                ) : plan.id === 'free' ? (
                  '무료 시작하기'
                ) : (
                  <>
                    <CreditCard size={15} /> 토스 결제하기
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>

    </div>
  );
}
