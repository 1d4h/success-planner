import React, { useState } from 'react';
import { Sun, CheckCircle2, Circle, Sparkles, Clock, Plus, Trash2, Award, Zap } from 'lucide-react';
import confetti from 'canvas-confetti';
import { BannerAd } from './AdComponents';

export default function MorningRoutine({ 
  routineData, 
  setRoutineData, 
  dailyQuote, 
  userPlan, 
  onAddPoints, 
  onCheckInMorning, 
  onResetMorningCheckIn,
  isMorningCheckedIn, 
  isEarlyBirdWindow,
  isStandardMorningWindow,
  currentTime,
  lang,
  t 
}) {
  const [newTodo, setNewTodo] = useState('');

  const liveClockString = (currentTime || new Date()).toLocaleTimeString(
    lang === 'ko' ? 'ko-KR' : lang === 'ja' ? 'ja-JP' : 'en-US',
    { hour12: true, hour: '2-digit', minute: '2-digit', second: '2-digit' }
  );

  const displayClockString = (isMorningCheckedIn && routineData?.morningCheckInTime)
    ? routineData.morningCheckInTime
    : liveClockString;

  const triggerCelebration = () => {
    confetti({
      particleCount: 60,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  const handleWakeTimeChange = (e) => {
    setRoutineData({ ...routineData, wakeTime: e.target.value });
  };

  const handleAffirmationChange = (e) => {
    setRoutineData({ ...routineData, affirmation: e.target.value });
  };

  const handlePersonalNoteChange = (e) => {
    setRoutineData({ ...routineData, personalNote: e.target.value });
  };

  const toggleTodo = (id) => {
    const updated = routineData.todos.map(todo => {
      if (todo.id === id) {
        const nextCompleted = !todo.completed;
        if (nextCompleted) {
          triggerCelebration();
          onAddPoints(2, 'To-Do completed');
        }
        return { ...todo, completed: nextCompleted };
      }
      return todo;
    });
    setRoutineData({ ...routineData, todos: updated });
  };

  const addTodo = () => {
    if (!newTodo.trim()) return;
    const newItem = {
      id: Date.now(),
      text: newTodo.trim(),
      completed: false
    };
    setRoutineData({
      ...routineData,
      todos: [...routineData.todos, newItem]
    });
    setNewTodo('');
  };

  const removeTodo = (id) => {
    setRoutineData({
      ...routineData,
      todos: routineData.todos.filter(t => t.id !== id)
    });
  };

  const completedCount = routineData.todos.filter(t => t.completed).length;

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      
      {/* Compact Banner Card for Mobile */}
      <div className="glass-card" style={{
        padding: '16px 20px',
        background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.15) 0%, rgba(239, 68, 68, 0.08) 100%)',
        borderColor: 'rgba(245, 158, 11, 0.3)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: '220px' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            background: 'var(--grad-morning)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            boxShadow: '0 4px 12px rgba(245, 158, 11, 0.4)'
          }}>
            <Sun size={24} color="#FFFFFF" />
          </div>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, whiteSpace: 'nowrap', background: 'linear-gradient(90deg, #FFD700, #FFA500)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              ☀️ 모닝 루틴
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.78rem', marginTop: '2px', whiteSpace: 'nowrap' }}>
              하루 승리를 결정짓는 든든한 아침 체크인
            </p>
          </div>
        </div>

        {/* Real-time Electronic Digital Clock, Target Wake Time & Morning Check-in Button */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px', width: '100%', maxWidth: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', gap: '8px', flexWrap: 'wrap' }}>
            
            {/* Real-Time Digital Clock Badge */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: isMorningCheckedIn 
                ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(6, 95, 70, 0.3))' 
                : 'linear-gradient(135deg, rgba(0, 0, 0, 0.6), rgba(30, 25, 15, 0.8))',
              padding: '8px 14px',
              borderRadius: '12px',
              border: isMorningCheckedIn ? '1.5px solid #10B981' : '1.5px solid #FFD700',
              boxShadow: isMorningCheckedIn ? '0 0 15px rgba(16, 185, 129, 0.3)' : '0 0 15px rgba(255, 215, 0, 0.3)'
            }}>
              <Clock size={18} color={isMorningCheckedIn ? "#10B981" : "#FFD700"} className={isMorningCheckedIn ? "" : "animate-pulse"} />
              <span style={{
                color: isMorningCheckedIn ? '#10B981' : '#FFD700',
                fontWeight: 900,
                fontSize: '1.1rem',
                letterSpacing: '1px',
                fontFamily: 'monospace, var(--font-family)',
                fontVariantNumeric: 'tabular-nums',
                textShadow: isMorningCheckedIn ? '0 0 8px rgba(16, 185, 129, 0.5)' : '0 0 8px rgba(255, 215, 0, 0.6)'
              }}>
                {displayClockString}
              </span>
              {isMorningCheckedIn ? (
                <span style={{ fontSize: '0.7rem', color: '#10B981', fontWeight: 800 }}>[멈춤 🔒]</span>
              ) : (
                <span style={{ fontSize: '0.65rem', color: '#FFF', background: '#EF4444', padding: '2px 6px', borderRadius: '4px', fontWeight: 800 }}>LIVE</span>
              )}
            </div>

            {/* Middle Box: Target Wake Time */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: 'rgba(0,0,0,0.25)',
              padding: '6px 10px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid rgba(245, 158, 11, 0.2)'
            }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>{t.targetWakeTime || '목표 기상:'}</span>
              <input 
                type="time" 
                value={routineData.wakeTime} 
                onChange={handleWakeTimeChange}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#F59E0B',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  outline: 'none',
                  cursor: 'pointer'
                }}
              />
            </div>

            {/* Right Box: Always-Active Check-in Button */}
            <button
              className="glass-button"
              onClick={onCheckInMorning}
              disabled={isMorningCheckedIn}
              style={{
                background: isMorningCheckedIn 
                  ? 'rgba(16, 185, 129, 0.2)' 
                  : isEarlyBirdWindow
                    ? 'linear-gradient(135deg, #FF416C, #FFD700)'
                    : isStandardMorningWindow
                      ? 'var(--grad-morning)'
                      : 'linear-gradient(135deg, #6366F1, #8B5CF6)',
                border: isMorningCheckedIn 
                  ? '1.5px solid #10B981' 
                  : 'none',
                boxShadow: isMorningCheckedIn ? 'none' : '0 4px 16px rgba(245, 158, 11, 0.4)',
                color: '#FFFFFF',
                fontWeight: 800,
                fontSize: '0.82rem',
                padding: '10px 14px',
                whiteSpace: 'nowrap',
                cursor: isMorningCheckedIn ? 'not-allowed' : 'pointer',
                opacity: 1
              }}
            >
              {isEarlyBirdWindow && !isMorningCheckedIn ? <Zap size={16} color="#FFF" /> : <Award size={16} />}
              {isMorningCheckedIn 
                ? t.morningCheckedInBtn 
                : isEarlyBirdWindow 
                  ? '⚡ 얼리버드 출석체크 (+10P)' 
                  : isStandardMorningWindow
                    ? '☀️ 일반 모닝 출석체크 (+7P)'
                    : '☀️ 출석체크 (+5P)'}
            </button>
          </div>

          {/* Point Tiers Explanation Subtext */}
          <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px', flexWrap: 'wrap' }}>
            <Clock size={12} color="#F59E0B" />
            <span>⚡ 얼리버드: 05:00~06:00 (+10P) | ☀️ 일반 모닝: 06:00~08:00 (+7P) | 📌 출석체크: 08:00~24:00 (+5P)</span>
          </div>
        </div>
      </div>

      <BannerAd userPlan={userPlan} position="top" />

      {/* Grid Content */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
        
        {/* Affirmation Card */}
        <div className="glass-card" style={{ padding: '18px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sparkles size={18} color="#F59E0B" />
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>{t.affirmationTitle}</h3>
          </div>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
            {t.affirmationSubtitle}
          </p>
          <textarea
            className="glass-input"
            rows={3}
            value={routineData.affirmation}
            onChange={handleAffirmationChange}
            placeholder={t.affirmationPlaceholder}
            style={{ resize: 'vertical', lineHeight: '1.5', fontSize: '0.85rem' }}
          />
        </div>

        {/* Daily Top Goals Card */}
        <div className="glass-card" style={{ padding: '18px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CheckCircle2 size={18} color="#10B981" />
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>{t.topGoalsTitle}</h3>
            </div>
            <span style={{ fontSize: '0.75rem', padding: '2px 8px', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.15)', color: '#10B981', fontWeight: 600 }}>
              {completedCount} / {routineData.todos.length} {t.completed}
            </span>
          </div>

          <div style={{ display: 'flex', gap: '6px' }}>
            <input
              type="text"
              className="glass-input"
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addTodo()}
              placeholder={t.todoPlaceholder}
              style={{ fontSize: '0.82rem', padding: '8px 12px' }}
            />
            <button className="glass-button" onClick={addTodo} style={{ padding: '8px 12px' }}>
              <Plus size={16} />
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '4px' }}>
            {routineData.todos.map((todo, idx) => (
              <div 
                key={todo.id} 
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 12px',
                  background: todo.completed ? 'rgba(16, 185, 129, 0.08)' : 'rgba(255,255,255,0.03)',
                  border: todo.completed ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-sm)'
                }}
              >
                <div 
                  onClick={() => toggleTodo(todo.id)} 
                  style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', flex: 1 }}
                >
                  {todo.completed ? (
                    <CheckCircle2 size={16} color="#10B981" />
                  ) : (
                    <Circle size={16} color="var(--text-muted)" />
                  )}
                  <span style={{
                    fontSize: '0.85rem',
                    textDecoration: todo.completed ? 'line-through' : 'none',
                    color: todo.completed ? 'var(--text-muted)' : 'var(--text-primary)',
                    fontWeight: todo.completed ? 400 : 500
                  }}>
                    <strong style={{ color: '#F59E0B', marginRight: '4px' }}>[{idx + 1}]</strong>
                    {todo.text}
                  </span>
                </div>
                <button
                  onClick={() => removeTodo(todo.id)}
                  style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', opacity: 0.7 }}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Quote & Personal Note Card */}
      <div className="glass-card" style={{ padding: '18px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#FFD700', display: 'flex', alignItems: 'center', gap: '6px' }}>
            {t.dailyQuoteTitle}
          </h3>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', background: 'rgba(255,255,255,0.05)', padding: '2px 6px', borderRadius: '4px' }}>
            {t.autoUpdated}
          </span>
        </div>

        <blockquote style={{
          borderLeft: '3px solid #F59E0B',
          paddingLeft: '12px',
          fontStyle: 'italic',
          color: 'var(--text-primary)',
          fontSize: '0.9rem',
          lineHeight: '1.5'
        }}>
          "{dailyQuote.quote}"
          <span style={{ display: 'block', fontStyle: 'normal', fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            — {dailyQuote.author}
          </span>
        </blockquote>

        <div>
          <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>
            {t.personalNoteLabel}
          </label>
          <input
            type="text"
            className="glass-input"
            value={routineData.personalNote}
            onChange={handlePersonalNoteChange}
            placeholder={t.personalNotePlaceholder}
            style={{ fontSize: '0.85rem', padding: '8px 12px' }}
          />
        </div>
      </div>

    </div>
  );
}
