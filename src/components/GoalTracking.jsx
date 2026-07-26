import React, { useState, useEffect } from 'react';
import { Flame, Target, ChevronDown, ChevronRight, CheckSquare, Plus, Award, Calendar, Edit3, Save, X, FileText, Check, Trash2 } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function GoalTracking({ goalsTree, setGoalsTree, streak, lastCompletedDate, onCheckInToday, t }) {
  const [expandedYears, setExpandedYears] = useState({ y1: true, y2: true });
  const [expandedMonths, setExpandedMonths] = useState({ m1: true, m3: true });

  const [newYearGoal, setNewYearGoal] = useState('');
  const [newMonthGoal, setNewMonthGoal] = useState({});
  const [newDayGoal, setNewDayGoal] = useState({});

  // Daily Records State (Habit Tracker Calendar Note Storage)
  const [dailyRecords, setDailyRecords] = useState(() => {
    const saved = localStorage.getItem('sp_daily_records');
    return saved ? JSON.parse(saved) : {};
  });

  const todayDateNum = new Date().getDate();
  const [selectedDay, setSelectedDay] = useState(todayDateNum);
  const [recordInput, setRecordInput] = useState(() => {
    const now = new Date();
    const key = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(todayDateNum).padStart(2, '0')}`;
    const saved = localStorage.getItem('sp_daily_records');
    if (saved) {
      const parsed = JSON.parse(saved);
      return parsed[key]?.note || '';
    }
    return '';
  });
  const [savedNotice, setSavedNotice] = useState(false);

  useEffect(() => {
    localStorage.setItem('sp_daily_records', JSON.stringify(dailyRecords));
  }, [dailyRecords]);

  const getDayKey = (dayNum) => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(dayNum).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handleSelectDay = (dayNum) => {
    setSelectedDay(dayNum);
    const key = getDayKey(dayNum);
    setRecordInput(dailyRecords[key]?.note || '');
    setSavedNotice(false);
  };

  const handleSaveRecord = () => {
    if (!selectedDay) return;
    const key = getDayKey(selectedDay);
    const existing = dailyRecords[key] || {};
    const updated = {
      ...dailyRecords,
      [key]: {
        ...existing,
        note: recordInput.trim(),
        updatedAt: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })
      }
    };
    setDailyRecords(updated);
    setSavedNotice(true);
    confetti({ particleCount: 35, spread: 55, origin: { y: 0.6 } });
    setTimeout(() => setSavedNotice(false), 2500);
  };

  const handleDeleteRecord = () => {
    if (!selectedDay) return;
    const key = getDayKey(selectedDay);
    const updated = { ...dailyRecords };
    delete updated[key];
    setDailyRecords(updated);
    setRecordInput('');
  };

  const toggleYear = (id) => {
    setExpandedYears(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleMonth = (id) => {
    setExpandedMonths(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleDayItem = (yearId, monthId, dayId) => {
    confetti({ particleCount: 30, spread: 50, origin: { y: 0.6 } });
    const updatedTree = goalsTree.map(y => {
      if (y.id !== yearId) return y;
      const updatedMonths = y.months.map(m => {
        if (m.id !== monthId) return m;
        const updatedDays = m.days.map(d => {
          if (d.id === dayId) return { ...d, completed: !d.completed };
          return d;
        });
        const completedCount = updatedDays.filter(d => d.completed).length;
        const monthProg = updatedDays.length > 0 ? Math.round((completedCount / updatedDays.length) * 100) : 0;
        return { ...m, days: updatedDays, progress: monthProg };
      });
      const avgMonthProg = Math.round(updatedMonths.reduce((acc, curr) => acc + curr.progress, 0) / updatedMonths.length);
      return { ...y, months: updatedMonths, progress: avgMonthProg };
    });
    setGoalsTree(updatedTree);
  };

  const addYearGoal = () => {
    if (!newYearGoal.trim()) return;
    const newY = {
      id: `y_${Date.now()}`,
      title: newYearGoal.trim(),
      category: 'New Goal',
      progress: 0,
      months: []
    };
    setGoalsTree([...goalsTree, newY]);
    setNewYearGoal('');
  };

  const addMonthGoal = (yearId) => {
    const text = newMonthGoal[yearId];
    if (!text || !text.trim()) return;
    const updatedTree = goalsTree.map(y => {
      if (y.id !== yearId) return y;
      const newM = {
        id: `m_${Date.now()}`,
        title: text.trim(),
        progress: 0,
        days: []
      };
      return { ...y, months: [...y.months, newM] };
    });
    setGoalsTree(updatedTree);
    setNewMonthGoal({ ...newMonthGoal, [yearId]: '' });
  };

  const addDayGoal = (yearId, monthId) => {
    const text = newDayGoal[monthId];
    if (!text || !text.trim()) return;
    const updatedTree = goalsTree.map(y => {
      if (y.id !== yearId) return y;
      const updatedMonths = y.months.map(m => {
        if (m.id !== monthId) return m;
        const newD = { id: `d_${Date.now()}`, title: text.trim(), completed: false };
        return { ...m, days: [...m.days, newD] };
      });
      return { ...y, months: updatedMonths };
    });
    setGoalsTree(updatedTree);
    setNewDayGoal({ ...newDayGoal, [monthId]: '' });
  };

  const isCheckedInToday = lastCompletedDate === new Date().toISOString().split("T")[0];

  // Generating Month Calendar Grass Grid (31 days representation)
  const currentMonthDays = Array.from({ length: 31 }, (_, i) => i + 1);

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      
      {/* Flame Streak Header */}
      <div className="glass-card" style={{
        padding: '16px 18px',
        background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.15) 0%, rgba(245, 158, 11, 0.1) 100%)',
        borderColor: 'rgba(239, 68, 68, 0.3)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
          <div className="animate-fire" style={{
            width: '44px',
            height: '44px',
            borderRadius: '14px',
            background: 'var(--grad-fire)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <Flame size={26} color="#FFFFFF" />
          </div>
          <div>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 800, whiteSpace: 'nowrap', background: 'linear-gradient(90deg, #FF416C, #FF4B2B)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              {streak} {t.streakTitle}
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.78rem', marginTop: '2px' }}>
              연속 기록이 높을수록 습관 성공률 상승!
            </p>
          </div>
        </div>

        <button 
          className="glass-button"
          onClick={onCheckInToday}
          disabled={isCheckedInToday}
          style={{
            width: '100%',
            background: isCheckedInToday ? 'rgba(16, 185, 129, 0.2)' : 'var(--grad-fire)',
            border: isCheckedInToday ? '1px solid #10B981' : 'none',
            boxShadow: isCheckedInToday ? 'none' : '0 4px 16px rgba(239, 68, 68, 0.4)',
            fontSize: '0.8rem',
            padding: '8px 12px',
            cursor: isCheckedInToday ? 'default' : 'pointer'
          }}
        >
          <Award size={15} />
          {isCheckedInToday ? t.checkedInBtn : t.checkInBtn}
        </button>
      </div>

      {/* Monthly Habit Success Calendar Grid */}
      <div className="glass-card" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Calendar size={20} color="#10B981" />
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800 }}>{t.monthlyCalendarTitle}</h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>날짜를 클릭하여 해당 일자의 기록을 저장하고 조회해보세요!</p>
            </div>
          </div>

          {selectedDay && (
            <span style={{ fontSize: '0.75rem', color: '#10B981', background: 'rgba(16, 185, 129, 0.15)', padding: '4px 10px', borderRadius: '12px', fontWeight: 700 }}>
              선택된 날짜: {new Date().getMonth() + 1}월 {selectedDay}일
            </span>
          )}
        </div>

        {/* 31 Days Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          gap: '6px',
          padding: '10px',
          background: 'rgba(0,0,0,0.2)',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-color)'
        }}>
          {currentMonthDays.map((dayNum) => {
            const isCompleted = dayNum <= todayDateNum - 1 || (dayNum === todayDateNum && isCheckedInToday);
            const isToday = dayNum === todayDateNum;
            const isSelected = selectedDay === dayNum;
            const dayKey = getDayKey(dayNum);
            const hasRecord = !!(dailyRecords[dayKey]?.note);

            return (
              <div
                key={dayNum}
                onClick={() => handleSelectDay(dayNum)}
                title={`Day ${dayNum}: ${isCompleted ? '달성 완료' : '미달성'}${hasRecord ? ' (기록 있음)' : ''}`}
                style={{
                  height: '32px',
                  borderRadius: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: '0.78rem',
                  position: 'relative',
                  cursor: 'pointer',
                  background: isSelected
                    ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.5), rgba(139, 92, 246, 0.5))'
                    : isCompleted 
                      ? 'linear-gradient(135deg, #10B981, #059669)' 
                      : isToday 
                        ? 'rgba(245, 158, 11, 0.3)' 
                        : 'rgba(255,255,255,0.04)',
                  color: isSelected ? '#FFFFFF' : isCompleted ? '#FFFFFF' : isToday ? '#FFD700' : 'var(--text-muted)',
                  border: isSelected
                    ? '2px solid #A78BFA'
                    : isToday 
                      ? '2px solid #F59E0B' 
                      : '1px solid transparent',
                  boxShadow: isSelected ? '0 0 10px rgba(167, 139, 250, 0.5)' : 'none',
                  transition: 'all 0.15s ease'
                }}
              >
                {dayNum}
                {hasRecord && (
                  <span style={{
                    position: 'absolute',
                    top: '2px',
                    right: '3px',
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    background: '#FFD700',
                    boxShadow: '0 0 4px #FFD700'
                  }} />
                )}
              </div>
            );
          })}
        </div>

        {/* Selected Day Record Input & View Box */}
        {selectedDay && (
          <div style={{
            marginTop: '8px',
            background: 'rgba(15, 23, 42, 0.6)',
            border: '1px solid rgba(139, 92, 246, 0.3)',
            borderRadius: 'var(--radius-md)',
            padding: '14px',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FileText size={18} color="#A78BFA" />
                <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#A78BFA' }}>
                  {new Date().getMonth() + 1}월 {selectedDay}일 일기 & 습관 회고
                </h4>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {dailyRecords[getDayKey(selectedDay)]?.updatedAt && (
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                    마지막 수정: {dailyRecords[getDayKey(selectedDay)].updatedAt}
                  </span>
                )}
                {savedNotice && (
                  <span style={{ fontSize: '0.75rem', color: '#10B981', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '3px' }}>
                    <Check size={14} /> 저장 완료!
                  </span>
                )}
              </div>
            </div>

            <textarea
              className="glass-input"
              rows={3}
              value={recordInput}
              onChange={(e) => setRecordInput(e.target.value)}
              placeholder={`${new Date().getMonth() + 1}월 ${selectedDay}일에 무엇을 성취하셨나요? 생각, 성과, 회고를 적어 저장하세요.`}
              style={{
                fontSize: '0.85rem',
                padding: '10px',
                lineHeight: '1.5',
                width: '100%'
              }}
            />

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
              {dailyRecords[getDayKey(selectedDay)]?.note && (
                <button
                  onClick={handleDeleteRecord}
                  style={{
                    background: 'rgba(239, 68, 68, 0.15)',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    color: '#EF4444',
                    padding: '6px 12px',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <Trash2 size={14} /> 삭제
                </button>
              )}

              <button
                className="glass-button"
                onClick={handleSaveRecord}
                style={{
                  background: 'linear-gradient(135deg, #10B981, #059669)',
                  color: '#FFFFFF',
                  padding: '6px 14px',
                  fontSize: '0.8rem',
                  fontWeight: 800,
                  whiteSpace: 'nowrap'
                }}
              >
                <Save size={14} /> {selectedDay}일 기록 저장
              </button>
            </div>
          </div>
        )}

      </div>

      {/* Goal Tree Visualizer Header */}
      <div className="glass-card" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Target size={20} color="#6366F1" />
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>{t.goalTreeTitle}</h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                Year ➔ Month ➔ Day 트리 구조 액션 플랜
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '6px', width: '100%' }}>
            <input
              type="text"
              className="glass-input"
              value={newYearGoal}
              onChange={(e) => setNewYearGoal(e.target.value)}
              placeholder={t.yearPlaceholder}
              style={{ flex: 1, fontSize: '0.8rem', padding: '6px 10px' }}
            />
            <button className="glass-button" onClick={addYearGoal} style={{ padding: '6px 10px', fontSize: '0.8rem', whiteSpace: 'nowrap' }}>
              <Plus size={14} /> 연간
            </button>
          </div>
        </div>

        {/* Tree Container */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '4px' }}>
          {goalsTree.map((year) => {
            const isYearExpanded = expandedYears[year.id];
            return (
              <div 
                key={year.id}
                style={{
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-md)',
                  overflow: 'hidden'
                }}
              >
                {/* Year Goal Row */}
                <div 
                  style={{
                    padding: '12px 14px',
                    background: 'rgba(99, 102, 241, 0.08)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    userSelect: 'none'
                  }}
                  onClick={() => toggleYear(year.id)}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflow: 'hidden' }}>
                    {isYearExpanded ? <ChevronDown size={16} color="#6366F1" /> : <ChevronRight size={16} color="#6366F1" />}
                    <span style={{
                      background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
                      padding: '2px 6px',
                      borderRadius: '6px',
                      fontSize: '0.68rem',
                      fontWeight: 700,
                      color: 'white',
                      whiteSpace: 'nowrap'
                    }}>
                      YEAR
                    </span>
                    <h4 style={{ fontSize: '0.92rem', fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{year.title}</h4>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#8B5CF6' }}>{year.progress}%</span>
                  </div>
                </div>

                {/* Sub-Months */}
                {isYearExpanded && (
                  <div style={{ padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: '10px', borderTop: '1px solid var(--border-color)' }}>
                    
                    <div style={{ display: 'flex', gap: '6px', width: '100%' }}>
                      <input
                        type="text"
                        className="glass-input"
                        placeholder="Add monthly goal..."
                        value={newMonthGoal[year.id] || ''}
                        onChange={(e) => setNewMonthGoal({ ...newMonthGoal, [year.id]: e.target.value })}
                        style={{ padding: '6px 10px', fontSize: '0.78rem', flex: 1 }}
                      />
                      <button 
                        className="glass-button" 
                        onClick={() => addMonthGoal(year.id)}
                        style={{ padding: '6px 10px', fontSize: '0.78rem', whiteSpace: 'nowrap' }}
                      >
                        + 월간
                      </button>
                    </div>

                    {year.months.map((month) => {
                      const isMonthExpanded = expandedMonths[month.id];
                      return (
                        <div 
                          key={month.id}
                          style={{
                            background: 'rgba(0,0,0,0.2)',
                            border: '1px solid rgba(255,255,255,0.05)',
                            borderRadius: 'var(--radius-sm)',
                            padding: '10px'
                          }}
                        >
                          <div 
                            style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}
                            onClick={() => toggleMonth(month.id)}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', overflow: 'hidden' }}>
                              {isMonthExpanded ? <ChevronDown size={15} color="#F59E0B" /> : <ChevronRight size={15} color="#F59E0B" />}
                              <span style={{
                                background: 'rgba(245, 158, 11, 0.2)',
                                color: '#F59E0B',
                                border: '1px solid rgba(245, 158, 11, 0.3)',
                                padding: '1px 5px',
                                borderRadius: '4px',
                                fontSize: '0.65rem',
                                fontWeight: 700,
                                whiteSpace: 'nowrap'
                              }}>
                                MONTH
                              </span>
                              <span style={{ fontSize: '0.85rem', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{month.title}</span>
                            </div>

                            <span style={{ fontSize: '0.75rem', color: '#F59E0B', fontWeight: 600, whiteSpace: 'nowrap' }}>{month.progress}%</span>
                          </div>

                          {/* Sub-Days */}
                          {isMonthExpanded && (
                            <div style={{ marginTop: '10px', paddingLeft: '12px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                              
                              <div style={{ display: 'flex', gap: '6px', width: '100%', marginBottom: '4px' }}>
                                <input
                                  type="text"
                                  className="glass-input"
                                  placeholder="Add daily action..."
                                  value={newDayGoal[month.id] || ''}
                                  onChange={(e) => setNewDayGoal({ ...newDayGoal, [month.id]: e.target.value })}
                                  style={{ padding: '4px 8px', fontSize: '0.75rem', flex: 1 }}
                                />
                                <button 
                                  className="glass-button" 
                                  onClick={() => addDayGoal(year.id, month.id)}
                                  style={{ padding: '4px 8px', fontSize: '0.75rem', whiteSpace: 'nowrap' }}
                                >
                                  + 일일
                                </button>
                              </div>

                              {month.days.map((day) => (
                                <div 
                                  key={day.id}
                                  onClick={() => toggleDayItem(year.id, month.id, day.id)}
                                  style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    padding: '6px 10px',
                                    background: day.completed ? 'rgba(16, 185, 129, 0.1)' : 'rgba(255,255,255,0.02)',
                                    borderRadius: '6px',
                                    cursor: 'pointer',
                                    border: day.completed ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid transparent'
                                  }}
                                >
                                  <CheckSquare size={14} color={day.completed ? "#10B981" : "var(--text-muted)"} />
                                  <span style={{
                                    fontSize: '0.8rem',
                                    color: day.completed ? 'var(--text-muted)' : 'var(--text-primary)',
                                    textDecoration: day.completed ? 'line-through' : 'none'
                                  }}>
                                    {day.title}
                                  </span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}

                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
