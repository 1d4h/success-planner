import React, { useState, useEffect } from 'react';
import { Sun, Moon, TrendingUp, Sparkles, UserCheck, Gift, Crown, LogOut, Award, Globe, Bell, BellOff } from 'lucide-react';
import MorningRoutine from './components/MorningRoutine';
import EveningRoutine from './components/EveningRoutine';
import GoalTracking from './components/GoalTracking';
import RewardStore from './components/RewardStore';
import SubscriptionPricing from './components/SubscriptionPricing';
import AuthModal from './components/AuthModal';
import { SidebarAd } from './components/AdComponents';
import FooterMeta from './components/FooterMeta';
import { getDailyQuote, MOOD_EMOJIS, SUBSCRIPTION_PLANS, GIFTICONS, INITIAL_GOALS_TREE, INITIAL_ROUTINE_DATA } from './constants';
import { translations } from './i18n';
import confetti from 'canvas-confetti';

export default function App() {
  const [activeTab, setActiveTab] = useState('morning'); // 'morning', 'evening', 'goals', 'store', 'pricing'
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [pushEnabled, setPushEnabled] = useState(() => {
    return localStorage.getItem('sp_push_enabled') === 'true';
  });

  // i18n Language State
  const [lang, setLang] = useState(() => {
    const savedLang = localStorage.getItem('sp_lang');
    return savedLang || 'ko';
  });

  const t = translations[lang] || translations.ko;

  // User State
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('sp_user');
    return saved ? JSON.parse(saved) : { name: '성공 러너', email: 'guest@success.com', points: 180, plan: 'free', isLoggedIn: true };
  });

  const [routineData, setRoutineData] = useState(() => {
    const saved = localStorage.getItem('sp_routine_data');
    return saved ? JSON.parse(saved) : INITIAL_ROUTINE_DATA;
  });

  const [goalsTree, setGoalsTree] = useState(() => {
    const saved = localStorage.getItem('sp_goals_tree');
    return saved ? JSON.parse(saved) : INITIAL_GOALS_TREE;
  });

  const dailyQuote = getDailyQuote();

  useEffect(() => {
    localStorage.setItem('sp_lang', lang);
  }, [lang]);

  useEffect(() => {
    localStorage.setItem('sp_user', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('sp_routine_data', JSON.stringify(routineData));
  }, [routineData]);

  useEffect(() => {
    localStorage.setItem('sp_goals_tree', JSON.stringify(goalsTree));
  }, [goalsTree]);

  useEffect(() => {
    localStorage.setItem('sp_push_enabled', pushEnabled ? 'true' : 'false');
  }, [pushEnabled]);

  const addPoints = (baseAmount, reason) => {
    let multiplier = 1.0;
    if (user.plan === 'pro') multiplier = 1.2;
    if (user.plan === 'master') multiplier = 1.5;

    const earned = Math.round(baseAmount * multiplier);
    setUser(prev => ({
      ...prev,
      points: prev.points + earned
    }));
  };

  // Real-time Live Clock API Sync State
  const [timeOffset, setTimeOffset] = useState(0);
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    let isMounted = true;
    const syncTimeApi = async () => {
      try {
        const res = await fetch('https://worldtimeapi.org/api/timezone/Asia/Seoul');
        if (res.ok) {
          const data = await res.json();
          const apiTime = new Date(data.datetime).getTime();
          const offset = apiTime - Date.now();
          if (isMounted) setTimeOffset(offset);
          return;
        }
      } catch (e) {
        try {
          const res2 = await fetch('https://timeapi.io/api/v1/time/current/zone?timeZone=Asia/Seoul');
          if (res2.ok) {
            const data2 = await res2.json();
            const apiTime2 = new Date(data2.dateTime).getTime();
            const offset2 = apiTime2 - Date.now();
            if (isMounted) setTimeOffset(offset2);
          }
        } catch (err) {
          // Fallback to local device time
        }
      }
    };
    syncTimeApi();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date(Date.now() + timeOffset));
    }, 1000);
    return () => clearInterval(timer);
  }, [timeOffset]);

  const isTimeBetween = (startHH, startMM, endHH, endMM) => {
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    const startMinutes = startHH * 60 + startMM;
    const endMinutes = endHH * 60 + endMM;
    return currentMinutes >= startMinutes && currentMinutes <= endMinutes;
  };

  const isEarlyBirdWindow = isTimeBetween(5, 0, 6, 30);
  const isMorningTimeWindow = isTimeBetween(5, 0, 9, 0);

  const isNightOwlWindow = isTimeBetween(21, 30, 22, 30);
  const isEveningTimeWindow = isTimeBetween(20, 0, 23, 59);

  const togglePushNotification = () => {
    if (!pushEnabled) {
      if ('Notification' in window) {
        Notification.requestPermission().then((permission) => {
          if (permission === 'granted') {
            setPushEnabled(true);
            new Notification("SUCCESS PLANNER 🔔", {
              body: "습관 알림이 설정되었습니다!"
            });
          } else {
            alert("알림 권한이 거부되었습니다.");
          }
        });
      } else {
        alert("현재 브라우저는 Web Notification을 지원하지 않습니다.");
      }
    } else {
      setPushEnabled(false);
    }
  };

  const handleCheckInMorning = () => {
    const todayStr = new Date(Date.now() + timeOffset).toISOString().split("T")[0];
    if (routineData.lastMorningCheckIn !== todayStr || !routineData.morningCheckInTime) {
      const rewardPoints = isEarlyBirdWindow ? 15 : 10;
      const checkInTimeFormatted = now.toLocaleTimeString(
        lang === 'ko' ? 'ko-KR' : lang === 'ja' ? 'ja-JP' : 'en-US',
        { hour12: true, hour: '2-digit', minute: '2-digit', second: '2-digit' }
      );
      setRoutineData(prev => ({
        ...prev,
        lastMorningCheckIn: todayStr,
        morningCheckInTime: checkInTimeFormatted
      }));
      addPoints(rewardPoints, 'Morning check-in');
      confetti({ particleCount: 90, spread: 80, origin: { y: 0.5 } });
    }
  };

  const handleResetMorningCheckIn = () => {
    setRoutineData(prev => ({
      ...prev,
      lastMorningCheckIn: null,
      morningCheckInTime: null
    }));
  };

  const handleCheckInEvening = () => {
    if (!isEveningTimeWindow) {
      alert(t.eveningCheckInDisabledMsg);
      return;
    }
    const todayStr = new Date().toISOString().split("T")[0];
    if (routineData.lastEveningCheckIn !== todayStr) {
      const rewardPoints = isNightOwlWindow ? 15 : 10;
      setRoutineData(prev => ({
        ...prev,
        lastEveningCheckIn: todayStr
      }));
      addPoints(rewardPoints, 'Evening check-in');
      confetti({ particleCount: 90, spread: 80, origin: { y: 0.5 } });
    }
  };

  const handleCheckInToday = () => {
    const todayStr = new Date().toISOString().split("T")[0];
    if (routineData.lastCompletedDate !== todayStr) {
      setRoutineData(prev => ({
        ...prev,
        streak: prev.streak + 1,
        lastCompletedDate: todayStr
      }));
      addPoints(10, 'Dashboard check-in');
      confetti({ particleCount: 100, spread: 80, origin: { y: 0.5 } });
    }
  };

  const handleSelectPlan = (planId) => {
    setUser(prev => ({
      ...prev,
      plan: planId
    }));
  };

  const handleLogout = () => {
    setUser({ name: 'Guest', email: '', points: 0, plan: 'free', isLoggedIn: false });
  };

  const todayStr = new Date().toISOString().split("T")[0];
  const isMorningCheckedIn = routineData.lastMorningCheckIn === todayStr;
  const isEveningCheckedIn = routineData.lastEveningCheckIn === todayStr;

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* Header Bar */}
      <header style={{
        background: 'rgba(11, 14, 20, 0.95)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--border-color)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        padding: '10px 14px'
      }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          
          {/* Top Header Row: Left Title & Right User Action Controls */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', flexWrap: 'wrap', gap: '8px' }}>
            
            {/* Left: Logo Title */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '9px',
                background: 'linear-gradient(135deg, #6366F1, #EC4899)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(99, 102, 241, 0.4)'
              }}>
                <Sparkles size={18} color="#FFFFFF" />
              </div>
              <h1 style={{ fontSize: '1.15rem', fontWeight: 800, background: 'linear-gradient(90deg, #FFFFFF, #9CA3AF)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: '-0.5px' }}>
                {t.appTitle}
              </h1>
              <span style={{
                fontSize: '0.62rem',
                fontWeight: 800,
                padding: '2px 6px',
                borderRadius: '6px',
                background: user.plan === 'master' ? 'linear-gradient(135deg, #8B5CF6, #EC4899)' : user.plan === 'pro' ? '#3B82F6' : 'rgba(255,255,255,0.1)',
                color: '#FFF'
              }}>
                {user.plan.toUpperCase()}
              </span>
            </div>

            {/* Right: Push Bell, Language Select, Points, Login Profile (Moved to Top Right) */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              
              {/* Push Notification Bell */}
              <button
                onClick={togglePushNotification}
                title={pushEnabled ? t.pushNoticeActive : t.pushNoticeEnable}
                style={{
                  background: pushEnabled ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255,255,255,0.06)',
                  border: pushEnabled ? '1px solid #10B981' : '1px solid var(--border-color)',
                  borderRadius: '10px',
                  padding: '4px 8px',
                  color: pushEnabled ? '#10B981' : 'var(--text-muted)',
                  cursor: 'pointer',
                  fontSize: '0.72rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                {pushEnabled ? <Bell size={13} color="#10B981" /> : <BellOff size={13} color="var(--text-muted)" />}
                <span>{pushEnabled ? 'ON' : 'OFF'}</span>
              </button>

              {/* Language Select */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Globe size={13} color="var(--text-muted)" />
                <select
                  value={lang}
                  onChange={(e) => setLang(e.target.value)}
                  style={{
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '10px',
                    color: 'var(--text-primary)',
                    fontSize: '0.75rem',
                    padding: '4px 8px',
                    outline: 'none',
                    cursor: 'pointer'
                  }}
                >
                  <option value="ko" style={{ background: '#111' }}>🇰🇷 한국어</option>
                  <option value="en" style={{ background: '#111' }}>🇺🇸 English</option>
                  <option value="ja" style={{ background: '#111' }}>🇯🇵 日本語</option>
                </select>
              </div>

              {/* User Points Badge */}
              <div 
                onClick={() => setActiveTab('store')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  background: 'rgba(236, 72, 153, 0.15)',
                  border: '1px solid rgba(236, 72, 153, 0.3)',
                  padding: '3px 10px',
                  borderRadius: '14px',
                  cursor: 'pointer'
                }}
              >
                <Award size={14} color="#EC4899" />
                <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#F472B6' }}>
                  {user.points.toLocaleString()} P
                </span>
              </div>

              {/* Login/Profile Logout Status */}
              {user.isLoggedIn ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                    👤 {user.name}
                  </span>
                  <button
                    onClick={handleLogout}
                    title={t.logout}
                    style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '2px' }}
                  >
                    <LogOut size={15} />
                  </button>
                </div>
              ) : (
                <button
                  className="glass-button"
                  onClick={() => setIsAuthOpen(true)}
                  style={{ padding: '4px 8px', fontSize: '0.72rem' }}
                >
                  <UserCheck size={13} /> {t.login}
                </button>
              )}

            </div>
          </div>

          {/* Row 2: 5 Main Categories Grid */}
          <nav style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(5, 1fr)',
            gap: '4px',
            background: 'rgba(255, 255, 255, 0.03)',
            padding: '4px',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-color)'
          }}>
            <button
              onClick={() => setActiveTab('morning')}
              style={{
                background: activeTab === 'morning' ? 'var(--grad-morning)' : 'transparent',
                color: activeTab === 'morning' ? '#FFFFFF' : 'var(--text-secondary)',
                border: 'none',
                padding: '6px 2px',
                borderRadius: 'var(--radius-sm)',
                fontWeight: 700,
                fontSize: '0.75rem',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '2px'
              }}
            >
              <Sun size={15} />
              <span>{t.morningTab}</span>
            </button>

            <button
              onClick={() => setActiveTab('evening')}
              style={{
                background: activeTab === 'evening' ? 'var(--grad-evening)' : 'transparent',
                color: activeTab === 'evening' ? '#FFFFFF' : 'var(--text-secondary)',
                border: 'none',
                padding: '6px 2px',
                borderRadius: 'var(--radius-sm)',
                fontWeight: 700,
                fontSize: '0.75rem',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '2px'
              }}
            >
              <Moon size={15} />
              <span>{t.eveningTab}</span>
            </button>

            <button
              onClick={() => setActiveTab('goals')}
              style={{
                background: activeTab === 'goals' ? 'var(--grad-fire)' : 'transparent',
                color: activeTab === 'goals' ? '#FFFFFF' : 'var(--text-secondary)',
                border: 'none',
                padding: '6px 2px',
                borderRadius: 'var(--radius-sm)',
                fontWeight: 700,
                fontSize: '0.75rem',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '2px'
              }}
            >
              <TrendingUp size={15} />
              <span>{t.goalsTab}</span>
            </button>

            <button
              onClick={() => setActiveTab('store')}
              style={{
                background: activeTab === 'store' ? 'linear-gradient(135deg, #EC4899, #8B5CF6)' : 'transparent',
                color: activeTab === 'store' ? '#FFFFFF' : 'var(--text-secondary)',
                border: 'none',
                padding: '6px 2px',
                borderRadius: 'var(--radius-sm)',
                fontWeight: 700,
                fontSize: '0.75rem',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '2px'
              }}
            >
              <Gift size={15} />
              <span>{t.storeTab}</span>
            </button>

            <button
              onClick={() => setActiveTab('pricing')}
              style={{
                background: activeTab === 'pricing' ? 'linear-gradient(135deg, #F59E0B, #6366F1)' : 'transparent',
                color: activeTab === 'pricing' ? '#FFFFFF' : 'var(--text-secondary)',
                border: 'none',
                padding: '6px 2px',
                borderRadius: 'var(--radius-sm)',
                fontWeight: 700,
                fontSize: '0.75rem',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '2px'
              }}
            >
              <Crown size={15} />
              <span style={{ whiteSpace: 'nowrap' }}>{t.pricingTab}</span>
            </button>
          </nav>

        </div>
      </header>

      {/* Main Workspace Layout (Centered) */}
      <div style={{ maxWidth: '1000px', margin: '0 auto', width: '100%', padding: '14px 12px', flex: 1, display: 'flex', flexDirection: 'column', gap: '20px' }}>
        
        {/* Main Category Content Area */}
        <main style={{ width: '100%' }}>
          {activeTab === 'morning' && (
            <MorningRoutine
              routineData={routineData}
              setRoutineData={setRoutineData}
              dailyQuote={dailyQuote}
              userPlan={user.plan}
              onAddPoints={addPoints}
              onCheckInMorning={handleCheckInMorning}
              onResetMorningCheckIn={handleResetMorningCheckIn}
              isMorningCheckedIn={isMorningCheckedIn && !!routineData.morningCheckInTime}
              isMorningTimeWindow={isMorningTimeWindow}
              isEarlyBirdWindow={isEarlyBirdWindow}
              currentTime={now}
              lang={lang}
              t={t}
            />
          )}

          {activeTab === 'evening' && (
            <EveningRoutine
              routineData={routineData}
              setRoutineData={setRoutineData}
              moodEmojis={MOOD_EMOJIS}
              onCheckInEvening={handleCheckInEvening}
              isEveningCheckedIn={isEveningCheckedIn}
              isEveningTimeWindow={isEveningTimeWindow}
              isNightOwlWindow={isNightOwlWindow}
              userPlan={user.plan}
              currentTime={now}
              lang={lang}
              t={t}
            />
          )}

          {activeTab === 'goals' && (
            <GoalTracking
              goalsTree={goalsTree}
              setGoalsTree={setGoalsTree}
              streak={routineData.streak}
              lastCompletedDate={routineData.lastCompletedDate}
              onCheckInToday={handleCheckInToday}
              t={t}
            />
          )}

          {activeTab === 'store' && (
            <RewardStore
              userPoints={user.points}
              setUserPoints={(updater) => setUser(prev => ({ ...prev, points: typeof updater === 'function' ? updater(prev.points) : updater }))}
              gifticons={GIFTICONS}
              t={t}
            />
          )}

          {activeTab === 'pricing' && (
            <SubscriptionPricing
              plans={SUBSCRIPTION_PLANS}
              currentPlan={user.plan}
              onSelectPlan={handleSelectPlan}
              t={t}
            />
          )}
        </main>

        {/* Sponsored AD Component & Footer Info */}
        <footer style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '12px' }}>
          {user.plan === 'free' && (
            <>
              <SidebarAd userPlan={user.plan} />
              <div className="glass-card" style={{ padding: '12px 16px', fontSize: '0.78rem', color: 'var(--text-muted)', textAlign: 'center' }}>
                💡 <strong>Pro Upgrade:</strong> Remove all ads and get 1.2x point boosters.
              </div>
            </>
          )}
          <FooterMeta t={t} />
        </footer>
      </div>

      {/* Auth Login Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onLoginSuccess={(userData) => {
          setUser(userData);
          setIsAuthOpen(false);
        }}
        t={t}
      />

    </div>
  );
}
