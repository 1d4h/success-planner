import React from 'react';

export default function FooterMeta({ t }) {
  return (
    <footer className="glass-card" style={{ marginTop: '24px', padding: '24px 20px', fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '20px' }}>
        <div>
          <h4 style={{ color: 'var(--text-primary)', fontWeight: '600', marginBottom: '8px', fontSize: '0.95rem' }}>
            SUCCESS PLANNER
          </h4>
          <p style={{ color: 'var(--text-muted)' }}>
            성공 습관 형성을 돕는 모닝/이브닝 루틴 플래너 & KT 기프티쇼 보상 플랫폼입니다.
          </p>
        </div>
        <div>
          <h4 style={{ color: 'var(--text-primary)', fontWeight: '600', marginBottom: '8px', fontSize: '0.9rem' }}>
            서비스 정책 및 안내
          </h4>
          <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <li><a href="#privacy" onClick={(e) => { e.preventDefault(); alert("개인정보 처리방침: 본 앱은 사용자의 루틴 기록 및 이메일 정보를 암호화하여 안전하게 관리합니다."); }} style={{ color: 'var(--accent-blue)', textDecoration: 'none' }}>개인정보 처리방침 (Privacy Policy)</a></li>
            <li><a href="#terms" onClick={(e) => { e.preventDefault(); alert("이용약관: 본 서비스를 이용함에 있어 규칙과 리워드 획득 조건 준수를 원칙으로 합니다."); }} style={{ color: 'var(--accent-blue)', textDecoration: 'none' }}>서비스 이용약관 (Terms of Service)</a></li>
            <li><a href="#adsense" onClick={(e) => { e.preventDefault(); alert("애드센스 정책 준수: 본 사이트는 Google AdSense 품질 가이드라인 및 게시자 정책을 엄격히 준수합니다."); }} style={{ color: 'var(--accent-blue)', textDecoration: 'none' }}>광고 및 콘텐츠 정책 준수</a></li>
          </ul>
        </div>
        <div>
          <h4 style={{ color: 'var(--text-primary)', fontWeight: '600', marginBottom: '8px', fontSize: '0.9rem' }}>
            고객지원 & 문의
          </h4>
          <p style={{ color: 'var(--text-muted)' }}>이메일: support@successplanner.app</p>
          <p style={{ color: 'var(--text-muted)' }}>운영시간: 평일 09:00 - 18:00</p>
        </div>
      </div>

      <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '16px', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '10px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
        <div>
          © {new Date().getFullYear()} SUCCESS PLANNER. All rights reserved. | Google AdSense Publisher: pub-7511857276293910
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <span>PWA Ready</span>
          <span>•</span>
          <span>SEO Optimized</span>
          <span>•</span>
          <span>KT Giftishow Partner</span>
        </div>
      </div>
    </footer>
  );
}
