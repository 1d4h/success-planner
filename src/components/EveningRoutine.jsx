import React, { useState } from 'react';
import { Moon, Heart, Award, MessageSquare, Zap, Plus, Trash2, Clock, Bot, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function EveningRoutine({ 
  routineData, 
  setRoutineData, 
  moodEmojis, 
  onCheckInEvening, 
  isEveningCheckedIn, 
  isEveningTimeWindow,
  isNightOwlWindow,
  userPlan,
  t 
}) {
  const [aiReport, setAiReport] = useState(routineData.aiReport || null);
  const [isAiAnalyzing, setIsAiAnalyzing] = useState(false);

  const handleGratitudeChange = (index, value) => {
    const updated = [...routineData.gratitudeEntries];
    updated[index] = value;
    setRoutineData({ ...routineData, gratitudeEntries: updated });
  };

  const addGratitudeLine = () => {
    setRoutineData({
      ...routineData,
      gratitudeEntries: [...routineData.gratitudeEntries, '']
    });
  };

  const removeGratitudeLine = (index) => {
    const updated = routineData.gratitudeEntries.filter((_, i) => i !== index);
    setRoutineData({ ...routineData, gratitudeEntries: updated });
  };

  const handleSelfPraiseChange = (e) => {
    setRoutineData({ ...routineData, selfPraise: e.target.value });
  };

  const handleFeedbackDoneChange = (e) => {
    setRoutineData({ ...routineData, feedbackDone: e.target.value });
  };

  const handleFeedbackBetterChange = (e) => {
    setRoutineData({ ...routineData, feedbackBetter: e.target.value });
  };

  const selectMood = (emojiObj) => {
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 }
    });
    setRoutineData({
      ...routineData,
      moodEmoji: emojiObj.emoji,
      energyScore: emojiObj.score * 20
    });
  };

  const handleEnergySlider = (e) => {
    setRoutineData({ ...routineData, energyScore: Number(e.target.value) });
  };

  // AI Feedback Generation Module
  const generateAiFeedback = () => {
    setIsAiAnalyzing(true);
    setTimeout(() => {
      setIsAiAnalyzing(false);
      const doneText = routineData.feedbackDone || "오늘의 주요 목표 완수";
      const betterText = routineData.feedbackBetter || "내일 몰입도 향상";
      
      const generatedReport = {
        summary: `🌟 **하루 종합 평가**: 오늘 기록하신 감사일기(${routineData.gratitudeEntries.filter(g => g.trim()).length}건)와 성과(${doneText.slice(0, 15)}...)는 뛰어난 성장을 입증합니다.`,
        advice: `💡 **AI 맞춤 코칭**: "${betterText.slice(0, 20)}" 목표를 위해 내일 아침 가장 집중도가 높은 시간대에 우선 배치해보세요!`,
        score: routineData.energyScore || 85
      };

      setAiReport(generatedReport);
      setRoutineData(prev => ({ ...prev, aiReport: generatedReport }));

      confetti({
        particleCount: 70,
        spread: 80,
        origin: { y: 0.5 }
      });
    }, 1500);
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      
      {/* Banner Card */}
      <div className="glass-card" style={{
        padding: '16px 20px',
        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(236, 72, 153, 0.1) 100%)',
        borderColor: 'rgba(139, 92, 246, 0.3)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            background: 'var(--grad-evening)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            boxShadow: '0 4px 12px rgba(139, 92, 246, 0.4)'
          }}>
            <Moon size={24} color="#FFFFFF" />
          </div>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, whiteSpace: 'nowrap', background: 'linear-gradient(90deg, #A78BFA, #F472B6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              🌙 이브닝 루틴
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.78rem', marginTop: '2px', whiteSpace: 'nowrap' }}>
              오늘 하루를 돌아보고 마음을 정리하는 시간
            </p>
          </div>
        </div>

        {/* Evening Check-in Button & Time Window Info */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px', width: '100%' }}>
          <button
            className="glass-button"
            onClick={onCheckInEvening}
            disabled={isEveningCheckedIn || !isEveningTimeWindow}
            title={!isEveningTimeWindow ? t.eveningCheckInDisabledMsg : ''}
            style={{
              width: '100%',
              background: isEveningCheckedIn 
                ? 'rgba(16, 185, 129, 0.2)' 
                : isNightOwlWindow
                  ? 'linear-gradient(135deg, #8B5CF6, #EC4899)'
                  : isEveningTimeWindow 
                    ? 'var(--grad-evening)' 
                    : 'rgba(255, 255, 255, 0.08)',
              border: isEveningCheckedIn 
                ? '1px solid #10B981' 
                : isEveningTimeWindow 
                  ? 'none' 
                  : '1px solid rgba(255,255,255,0.1)',
              boxShadow: isEveningCheckedIn || !isEveningTimeWindow ? 'none' : '0 4px 16px rgba(139, 92, 246, 0.4)',
              color: isEveningTimeWindow || isEveningCheckedIn ? '#FFFFFF' : 'var(--text-muted)',
              fontWeight: 800,
              fontSize: '0.8rem',
              padding: '8px 12px',
              whiteSpace: 'nowrap',
              cursor: (isEveningCheckedIn || !isEveningTimeWindow) ? 'not-allowed' : 'pointer',
              opacity: (!isEveningTimeWindow && !isEveningCheckedIn) ? 0.7 : 1
            }}
          >
            {isNightOwlWindow && !isEveningCheckedIn ? <Zap size={15} color="#FFF" /> : <Award size={15} />}
            {isEveningCheckedIn 
              ? t.eveningCheckedInBtn 
              : isNightOwlWindow 
                ? t.eveningEarlyBonusBtn 
                : t.eveningCheckInBtn}
          </button>

          <span style={{ fontSize: '0.72rem', color: isNightOwlWindow ? '#EC4899' : isEveningTimeWindow ? '#A78BFA' : 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px', whiteSpace: 'nowrap' }}>
            <Clock size={11} /> {t.eveningTimeInfo}
          </span>
        </div>
      </div>

      {/* AI Coach Reflection Report Card */}
      <div className="glass-card" style={{
        padding: '16px',
        background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.12) 0%, rgba(59, 130, 246, 0.12) 100%)',
        border: '1px solid rgba(139, 92, 246, 0.3)',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Bot size={22} color="#A78BFA" />
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#A78BFA', whiteSpace: 'nowrap' }}>🤖 AI 코치 분석 리포트</h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Master & Pro 전용 인공지능 코칭 서비스</p>
            </div>
          </div>

          <button
            className="glass-button"
            onClick={generateAiFeedback}
            disabled={isAiAnalyzing}
            style={{
              background: 'linear-gradient(135deg, #8B5CF6, #6366F1)',
              color: '#FFF',
              fontWeight: 700,
              padding: '6px 12px',
              fontSize: '0.8rem',
              whiteSpace: 'nowrap'
            }}
          >
            <Sparkles size={14} />
            {isAiAnalyzing ? t.aiAnalyzing : t.aiFeedbackBtn}
          </button>
        </div>

        {aiReport && (
          <div style={{
            background: 'rgba(0,0,0,0.3)',
            padding: '14px',
            borderRadius: 'var(--radius-md)',
            border: '1px solid rgba(167, 139, 250, 0.3)',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
          }}>
            <div style={{ fontSize: '0.85rem', lineHeight: '1.5', color: '#FFF' }}>
              {aiReport.summary}
            </div>
            <div style={{ fontSize: '0.82rem', lineHeight: '1.5', color: '#FFD700', background: 'rgba(245, 158, 11, 0.1)', padding: '8px 10px', borderRadius: '6px', borderLeft: '3px solid #F59E0B' }}>
              {aiReport.advice}
            </div>
          </div>
        )}
      </div>

      {/* Grid Section */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
        
        {/* Gratitude Journal Card */}
        <div className="glass-card" style={{ padding: '18px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Heart size={18} color="#EC4899" />
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>{t.gratitudeTitle}</h3>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {routineData.gratitudeEntries.map((entry, idx) => (
              <div key={idx} style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                <span style={{ color: '#EC4899', fontWeight: 700, fontSize: '0.85rem' }}>{idx + 1}.</span>
                <input
                  type="text"
                  className="glass-input"
                  value={entry}
                  onChange={(e) => handleGratitudeChange(idx, e.target.value)}
                  placeholder={`Gratitude #${idx + 1}`}
                  style={{ fontSize: '0.82rem', padding: '8px 10px' }}
                />
                {routineData.gratitudeEntries.length > 1 && (
                  <button
                    onClick={() => removeGratitudeLine(idx)}
                    style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
            ))}
            <button
              onClick={addGratitudeLine}
              style={{
                background: 'rgba(236, 72, 153, 0.1)',
                border: '1px dashed rgba(236, 72, 153, 0.3)',
                color: '#EC4899',
                padding: '6px',
                borderRadius: 'var(--radius-sm)',
                cursor: 'pointer',
                fontSize: '0.78rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '4px',
                marginTop: '4px'
              }}
            >
              <Plus size={14} /> {t.addGratitude}
            </button>
          </div>

          <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Award size={16} color="#F59E0B" />
              <h4 style={{ fontSize: '0.92rem', fontWeight: 700 }}>{t.selfPraiseTitle}</h4>
            </div>
            <textarea
              className="glass-input"
              rows={2}
              value={routineData.selfPraise}
              onChange={handleSelfPraiseChange}
              placeholder={t.selfPraisePlaceholder}
              style={{ fontSize: '0.82rem', padding: '8px 10px' }}
            />
          </div>
        </div>

        {/* Daily Reflection Card */}
        <div className="glass-card" style={{ padding: '18px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <MessageSquare size={18} color="#8B5CF6" />
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>{t.reflectionTitle}</h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', color: '#10B981', fontWeight: 600, marginBottom: '4px' }}>
                {t.feedbackDoneLabel}
              </label>
              <textarea
                className="glass-input"
                rows={2}
                value={routineData.feedbackDone}
                onChange={handleFeedbackDoneChange}
                placeholder={t.feedbackDonePlaceholder}
                style={{ fontSize: '0.82rem', padding: '8px 10px' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', color: '#3B82F6', fontWeight: 600, marginBottom: '4px' }}>
                {t.feedbackBetterLabel}
              </label>
              <textarea
                className="glass-input"
                rows={2}
                value={routineData.feedbackBetter}
                onChange={handleFeedbackBetterChange}
                placeholder={t.feedbackBetterPlaceholder}
                style={{ fontSize: '0.82rem', padding: '8px 10px' }}
              />
            </div>
          </div>
        </div>

      </div>

      {/* Mood & Energy Assessment */}
      <div className="glass-card" style={{ padding: '18px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Zap size={18} color="#F59E0B" />
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>{t.moodTitle}</h3>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', flexWrap: 'wrap', gap: '8px', padding: '6px 0' }}>
          {moodEmojis.map((m) => {
            const isSelected = routineData.moodEmoji === m.emoji;
            return (
              <button
                key={m.emoji}
                onClick={() => selectMood(m)}
                style={{
                  background: isSelected ? 'rgba(139, 92, 246, 0.25)' : 'rgba(255,255,255,0.03)',
                  border: isSelected ? `2px solid ${m.color}` : '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-md)',
                  padding: '10px 14px',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '4px',
                  transition: 'var(--transition)',
                  transform: isSelected ? 'scale(1.05)' : 'scale(1)'
                }}
              >
                <span style={{ fontSize: '1.8rem' }}>{m.emoji}</span>
                <span style={{ fontSize: '0.75rem', color: isSelected ? '#FFFFFF' : 'var(--text-secondary)', fontWeight: 600 }}>
                  {m.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Slider for exact Energy score */}
        <div style={{ background: 'rgba(0,0,0,0.2)', padding: '12px 16px', borderRadius: 'var(--radius-md)', display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>{t.energyScoreLabel}</span>
            <span style={{ fontSize: '1.1rem', fontWeight: 800, color: '#F59E0B' }}>
              {routineData.energyScore}%
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={routineData.energyScore}
            onChange={handleEnergySlider}
            style={{
              width: '100%',
              accentColor: '#8B5CF6',
              height: '6px',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          />
        </div>
      </div>

    </div>
  );
}
