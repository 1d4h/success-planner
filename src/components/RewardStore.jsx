import React, { useState } from 'react';
import { Search, ShoppingBag, Send, Award, CheckCircle2, ShieldCheck, Tag } from 'lucide-react';
import confetti from 'canvas-confetti';
import { sendKtGiftishowOrder } from '../services/ktGiftishowApi';

export default function RewardStore({ userPoints, setUserPoints, gifticons, t }) {
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [phoneInput, setPhoneInput] = useState('010-1234-5678');
  const [purchasingItem, setPurchasingItem] = useState(null);

  const categories = [
    { id: 'ALL', label: '전체' },
    { id: 'cafe', label: '☕ 카페' },
    { id: 'fastfood', label: '🍔 패스트푸드' },
    { id: 'convenience', label: '🏪 편의점' },
    { id: 'culture', label: '🎬 문화' }
  ];

  const filteredItems = (gifticons || []).filter(item => {
    // categoryId vs category mapping fallback
    const itemCat = item.categoryId || item.category || 'ALL';
    const matchCat = selectedCategory === 'ALL' || itemCat.toLowerCase() === selectedCategory.toLowerCase();
    
    const itemName = item.name || '';
    const itemBrand = item.brand || '';
    const matchSearch = itemName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        itemBrand.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  const handleExchange = (item) => {
    const itemPoints = item.cost || item.points || 0;
    if (userPoints < itemPoints) {
      alert(`포인트가 부족합니다! (필요: ${itemPoints.toLocaleString()}P / 보유: ${userPoints.toLocaleString()}P)`);
      return;
    }
    setPurchasingItem(item);
  };

  const confirmPurchase = async () => {
    if (!purchasingItem) return;
    const itemPoints = purchasingItem.cost || purchasingItem.points || 0;

    if (!phoneInput || phoneInput.length < 10) {
      alert("올바른 쿠폰 수신 휴대폰 번호를 입력해 주세요.");
      return;
    }

    try {
      const result = await sendKtGiftishowOrder({
        receiverPhone: phoneInput,
        goodsCode: purchasingItem.goodsCode || `KT_${purchasingItem.id}`,
        goodsName: purchasingItem.name,
        brandName: purchasingItem.brand,
        cost: itemPoints
      });

      if (result.success) {
        setUserPoints(prev => prev - itemPoints);
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.5 }
        });
        alert(`🎉 [KT 기프티쇼] 발송 성공!\n\n쿠폰명: ${purchasingItem.name}\n수신번호: ${phoneInput}\n핀번호: ${result.data.pinNo}\n\n잠시 후 MMS 문자로 쿠폰이 수신됩니다.`);
        setPurchasingItem(null);
      }
    } catch (err) {
      alert("쿠폰 발송 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      
      {/* Store Header Banner */}
      <div className="glass-card" style={{
        padding: '16px 18px',
        background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.15) 0%, rgba(139, 92, 246, 0.1) 100%)',
        borderColor: 'rgba(236, 72, 153, 0.3)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: '14px',
            background: 'linear-gradient(135deg, #EC4899, #8B5CF6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            boxShadow: '0 4px 12px rgba(236, 72, 153, 0.4)'
          }}>
            <ShoppingBag size={24} color="#FFFFFF" />
          </div>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, whiteSpace: 'nowrap', background: 'linear-gradient(90deg, #F472B6, #A78BFA)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              🎁 KT 기프티쇼 상점
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', marginTop: '2px' }}>
              KT 기프티쇼 비즈 API 실시간 MMS 모바일 쿠폰 발송
            </p>
          </div>
        </div>

        {/* My Points Display */}
        <div style={{
          background: 'rgba(236, 72, 153, 0.15)',
          border: '1px solid rgba(236, 72, 153, 0.4)',
          padding: '8px 14px',
          borderRadius: 'var(--radius-md)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          width: '100%'
        }}>
          <Award size={20} color="#EC4899" />
          <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>{t.myPoints}</span>
            <span style={{ fontSize: '1.1rem', fontWeight: 800, color: '#F472B6' }}>
              {userPoints.toLocaleString()} P
            </span>
          </div>
        </div>
      </div>

      {/* Category Tabs & Search Bar */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        
        <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '4px' }}>
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              style={{
                background: selectedCategory === cat.id ? 'linear-gradient(135deg, #EC4899, #8B5CF6)' : 'rgba(255,255,255,0.04)',
                color: selectedCategory === cat.id ? '#FFF' : 'var(--text-secondary)',
                border: selectedCategory === cat.id ? 'none' : '1px solid var(--border-color)',
                padding: '6px 10px',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.78rem',
                fontWeight: 700,
                cursor: 'pointer',
                whiteSpace: 'nowrap'
              }}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div style={{ position: 'relative', width: '100%' }}>
          <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            className="glass-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t.searchPlaceholder}
            style={{ paddingLeft: '36px', fontSize: '0.82rem' }}
          />
        </div>
      </div>

      {/* Gifticon Mobile Cards Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
        gap: '12px'
      }}>
        {filteredItems.map((item) => {
          const itemPoints = item.cost || item.points || 0;
          return (
            <div
              key={item.id}
              className="glass-card"
              style={{
                padding: '12px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '8px'
              }}
            >
              <div>
                <div style={{
                  height: '74px',
                  borderRadius: '8px',
                  background: item.imgBg || 'rgba(255,255,255,0.05)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '2rem',
                  marginBottom: '6px'
                }}>
                  {item.icon || item.image || '🎁'}
                </div>

                <span style={{ fontSize: '0.68rem', color: '#EC4899', fontWeight: 700 }}>
                  {item.brand}
                </span>
                <h4 style={{ fontSize: '0.82rem', fontWeight: 700, margin: '2px 0 4px 0', lineHeight: '1.3' }}>
                  {item.name}
                </h4>
              </div>

              <div>
                <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#FFD700', marginBottom: '6px' }}>
                  {itemPoints.toLocaleString()} P
                </div>

                <button
                  className="glass-button"
                  onClick={() => handleExchange(item)}
                  disabled={userPoints < itemPoints}
                  style={{
                    width: '100%',
                    padding: '6px',
                    fontSize: '0.75rem',
                    background: userPoints >= itemPoints ? 'linear-gradient(135deg, #EC4899, #8B5CF6)' : 'rgba(255,255,255,0.08)',
                    cursor: userPoints >= itemPoints ? 'pointer' : 'not-allowed',
                    opacity: userPoints >= itemPoints ? 1 : 0.6
                  }}
                >
                  교환하기
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* MMS Send Modal */}
      {purchasingItem && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.8)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '16px'
        }}>
          <div className="glass-card" style={{
            padding: '20px',
            width: '100%',
            maxWidth: '360px',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px',
            border: '1px solid rgba(236, 72, 153, 0.4)'
          }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#EC4899' }}>📱 KT 기프티쇼 MMS 쿠폰 발송</h3>
            
            <div style={{ background: 'rgba(0,0,0,0.3)', padding: '12px', borderRadius: '8px', fontSize: '0.85rem' }}>
              <div><strong>상품:</strong> {purchasingItem.brand} {purchasingItem.name}</div>
              <div><strong>차감 포인트:</strong> <span style={{ color: '#FFD700', fontWeight: 700 }}>{(purchasingItem.cost || purchasingItem.points).toLocaleString()}P</span></div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                수신 휴대폰 번호 입력
              </label>
              <input
                type="text"
                className="glass-input"
                value={phoneInput}
                onChange={(e) => setPhoneInput(e.target.value)}
                placeholder="010-0000-0000"
              />
            </div>

            <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
              <button
                className="glass-button"
                onClick={() => setPurchasingItem(null)}
                style={{ flex: 1, background: 'rgba(255,255,255,0.1)' }}
              >
                취소
              </button>
              <button
                className="glass-button"
                onClick={confirmPurchase}
                style={{ flex: 1, background: 'linear-gradient(135deg, #EC4899, #8B5CF6)' }}
              >
                <Send size={14} /> 발송하기
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
