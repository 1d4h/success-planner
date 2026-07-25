import React from 'react';
import { ExternalLink, X, Sparkles } from 'lucide-react';

export function BannerAd({ userPlan, position = 'bottom' }) {
  // If user has Master (ad-free), don't show ad
  if (userPlan === 'master') {
    return null;
  }

  const isPro = userPlan === 'pro';

  return (
    <div style={{
      width: '100%',
      background: 'linear-gradient(90deg, rgba(30, 27, 75, 0.9), rgba(15, 23, 42, 0.9))',
      border: '1px dashed rgba(139, 92, 246, 0.4)',
      borderRadius: 'var(--radius-md)',
      padding: '12px 20px',
      margin: position === 'bottom' ? '20px 0 0 0' : '0 0 20px 0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '12px'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <span style={{
          background: '#F59E0B',
          color: '#000',
          fontSize: '0.65rem',
          fontWeight: 900,
          padding: '2px 6px',
          borderRadius: '4px'
        }}>
          AD
        </span>
        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          {isPro ? (
            <span>🚀 <strong>Pro 혜택 적용 중:</strong> 사이드바 광고가 차단되었습니다.</span>
          ) : (
            <span>🔥 <strong>스폰서 광고:</strong> "하루 10분 영어 습관 - 7일 무료 체험 신청하기"</span>
          )}
        </div>
      </div>

      <a 
        href="#" 
        onClick={(e) => { e.preventDefault(); alert('광고 링크 클릭! (수익 창출 모듈)'); }}
        style={{
          color: '#8B5CF6',
          fontSize: '0.8rem',
          fontWeight: 700,
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          textDecoration: 'none'
        }}
      >
        자세히 보기 <ExternalLink size={14} />
      </a>
    </div>
  );
}

export function SidebarAd({ userPlan }) {
  if (userPlan === 'pro' || userPlan === 'master') {
    return null; // Ads removed for Pro+ users
  }

  return (
    <div className="glass-card" style={{
      padding: '16px',
      background: 'rgba(255, 255, 255, 0.02)',
      borderColor: 'rgba(245, 158, 11, 0.2)',
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
      marginTop: '20px'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ background: '#3B82F6', color: '#FFF', fontSize: '0.65rem', fontWeight: 800, padding: '2px 6px', borderRadius: '4px' }}>
          SPONSORED AD
        </span>
        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>스폰서</span>
      </div>

      <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#F59E0B' }}>
        ☕ 이번 주 커피 무료 쿠폰 당첨 이벤트!
      </div>
      <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
        설문조사 참여 시 100% 스타벅스 아메리카노 기프티콘 즉시 증정.
      </p>

      <button
        onClick={() => alert('이벤트 참여 링크로 이동합니다.')}
        style={{
          background: 'rgba(245, 158, 11, 0.2)',
          border: '1px solid #F59E0B',
          color: '#FFD700',
          padding: '8px',
          borderRadius: 'var(--radius-sm)',
          fontSize: '0.8rem',
          fontWeight: 700,
          cursor: 'pointer'
        }}
      >
        이벤트 응모하기 ➔
      </button>
    </div>
  );
}
