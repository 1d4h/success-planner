import React, { useState } from 'react';
import { Flame, Target, ChevronDown, ChevronRight, CheckSquare, Plus, Award, Calendar } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function GoalTracking({ goalsTree, setGoalsTree, streak, lastCompletedDate, onCheckInToday, t }) {
  const [expandedYears, setExpandedYears] = useState({ y1: true, y2: true });
  const [expandedMonths, setExpandedMonths] = useState({ m1: true, m3: true });

  const [newYearGoal, setNewYearGoal] = useState('');
  const [newMonthGoal, setNewMonthGoal] = useState({});
  const [newDayGoal, setNewDayGoal] = useState({});

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
  const todayDateNum = new Date().getDate();

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
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Calendar size={20} color="#10B981" />
          <div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800 }}>{t.monthlyCalendarTitle}</h3>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>이번 달 일별 습관 달성 현황</p>
          </div>
        </div>

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

            return (
              <div
                key={dayNum}
                title={`Day ${dayNum}: ${isCompleted ? 'Achieved' : 'Pending'}`}
                style={{
                  height: '28px',
                  borderRadius: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: '0.75rem',
                  background: isCompleted 
                    ? 'linear-gradient(135deg, #10B981, #059669)' 
                    : isToday 
                      ? 'rgba(245, 158, 11, 0.3)' 
                      : 'rgba(255,255,255,0.04)',
                  color: isCompleted ? '#FFFFFF' : isToday ? '#FFD700' : 'var(--text-muted)',
                  border: isToday ? '2px solid #F59E0B' : '1px solid transparent'
                }}
              >
                {dayNum}
              </div>
            );
          })}
        </div>
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
