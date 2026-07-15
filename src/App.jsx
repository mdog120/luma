import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import Auth from './components/Auth';
import Timer from './components/Timer';
import CafeScene from './components/CafeScene';
import Shop from './components/Shop';
import SoundMixer from './components/SoundMixer';
import { Coffee, Coins, ShoppingBag, LogOut, Award, Sparkles, BookOpen } from 'lucide-react';

export default function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  // User profile / game states
  const [coins, setCoins] = useState(100);
  const [highScore, setHighScore] = useState(0);
  const [unlockedItems, setUnlockedItems] = useState([]);
  const [activeTheme, setActiveTheme] = useState('default');
  
  // App UI states
  const [shopOpen, setShopOpen] = useState(false);
  const [rewardModal, setRewardModal] = useState(null); // { minutes, coinsEarned }

  // Timer shared states (for café scene animation)
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isBreak, setIsBreak] = useState(false);

  // Monitor auth state changes
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (!session) {
        // Clear state on sign out
        setCoins(100);
        setUnlockedItems([]);
        setActiveTheme('default');
        setIsTimerRunning(false);
        setElapsedTime(0);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Fetch profile and unlocked items once user logs in
  useEffect(() => {
    if (session?.user) {
      fetchUserData();
    }
  }, [session]);

  const fetchUserData = async () => {
    try {
      const user = session.user;

      if (user.id === 'guest-user') {
        const localProfile = localStorage.getItem('luma_guest_profile');
        if (localProfile) {
          const parsed = JSON.parse(localProfile);
          setCoins(parsed.coins ?? 100);
          setHighScore(parsed.high_score ?? 0);
          setActiveTheme(parsed.active_theme ?? 'default');
        } else {
          setCoins(100);
          setHighScore(0);
          setActiveTheme('default');
        }

        const localItems = localStorage.getItem('luma_guest_items');
        if (localItems) {
          setUnlockedItems(JSON.parse(localItems));
        } else {
          setUnlockedItems([]);
        }
        return;
      }

      // 1. Fetch profile (coins, theme, high score)
      let { data: profile, error: profileErr } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileErr) {
        console.error("Error fetching profile:", profileErr);
      } else if (profile) {
        setCoins(profile.coins ?? 100);
        setHighScore(profile.high_score ?? 0);
        setActiveTheme(profile.active_theme ?? 'default');
      }

      // 2. Fetch unlocked items
      let { data: items, error: itemsErr } = await supabase
        .from('unlocked_items')
        .select('item_id')
        .eq('user_id', user.id);

      if (itemsErr) {
        console.error("Error fetching items:", itemsErr);
      } else if (items) {
        // extract string IDs
        setUnlockedItems(items.map(x => x.item_id));
      }
    } catch (err) {
      console.error("Failed to load user data:", err);
    }
  };

  const handleSessionComplete = async ({ duration, isBreak: sessionIsBreak }) => {
    if (sessionIsBreak) {
      // Completed break, no coins
      alert("Break over! Time to get back to focusing in your café. ☕");
      return;
    }

    // Complete focus session: award coins (1 per minute + 5 bonus)
    const coinsEarned = duration + 5;
    const newCoinCount = coins + coinsEarned;
    const newHighScore = highScore + duration;

    setCoins(newCoinCount);
    setHighScore(newHighScore);

    // Save to Supabase / Local Storage
    if (session?.user) {
      const user = session.user;
      
      if (user.id === 'guest-user') {
        localStorage.setItem('luma_guest_profile', JSON.stringify({
          coins: newCoinCount,
          high_score: newHighScore,
          active_theme: activeTheme
        }));
      } else {
        // Update profile
        await supabase
          .from('profiles')
          .update({ coins: newCoinCount, high_score: newHighScore })
          .eq('id', user.id);

        // Log session
        await supabase
          .from('focus_sessions')
          .insert({
            user_id: user.id,
            duration: duration,
            completed: true
          });
      }
    }

    // Trigger reward modal overlay
    setRewardModal({
      minutes: duration,
      coinsEarned: coinsEarned
    });
  };

  const handleSessionGiveUp = async (minutesFocused) => {
    // Deduct small penalty for leaving (e.g. 10 coins, min 0)
    const penalty = 10;
    const newCoinCount = Math.max(0, coins - penalty);
    setCoins(newCoinCount);

    if (session?.user) {
      const user = session.user;
      if (user.id === 'guest-user') {
        localStorage.setItem('luma_guest_profile', JSON.stringify({
          coins: newCoinCount,
          high_score: highScore,
          active_theme: activeTheme
        }));
      } else {
        await supabase
          .from('profiles')
          .update({ coins: newCoinCount })
          .eq('id', user.id);

        // Log incomplete session
        if (minutesFocused > 0) {
          await supabase
            .from('focus_sessions')
            .insert({
              user_id: user.id,
              duration: minutesFocused,
              completed: false
            });
        }
      }
    }

    alert(`You left early. Some customers left, and you lost ${penalty} coins. Let's try again! ☕`);
  };

  const handlePurchaseItem = async (item) => {
    if (coins < item.cost) {
      alert("You don't have enough coins!");
      return;
    }

    const newCoins = coins - item.cost;
    const newUnlocked = [...unlockedItems, item.id];

    setCoins(newCoins);
    setUnlockedItems(newUnlocked);

    if (session?.user) {
      const user = session.user;

      if (user.id === 'guest-user') {
        localStorage.setItem('luma_guest_profile', JSON.stringify({
          coins: newCoins,
          high_score: highScore,
          active_theme: activeTheme
        }));
        localStorage.setItem('luma_guest_items', JSON.stringify(newUnlocked));
      } else {
        // 1. Deduct coins
        await supabase
          .from('profiles')
          .update({ coins: newCoins })
          .eq('id', user.id);

        // 2. Add item to unlocked
        await supabase
          .from('unlocked_items')
          .insert({
            user_id: user.id,
            item_id: item.id
          });
      }
    }
  };

  const handleThemeChange = async (themeName) => {
    setActiveTheme(themeName);
    if (session?.user) {
      const user = session.user;
      if (user.id === 'guest-user') {
        localStorage.setItem('luma_guest_profile', JSON.stringify({
          coins: coins,
          high_score: highScore,
          active_theme: themeName
        }));
      } else {
        await supabase
          .from('profiles')
          .update({ active_theme: themeName })
          .eq('id', user.id);
      }
    }
  };

  const handleLogout = async () => {
    if (session?.user?.id === 'guest-user') {
      setSession(null);
    } else {
      await supabase.auth.signOut();
    }
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="coffee-loader">
          <img src="/logo.jpg" alt="Luma Logo" className="loader-logo-img" />
          <p>Opening Luma Cafe...</p>
        </div>
      </div>
    );
  }

  // If not logged in, show Auth
  if (!session) {
    return <Auth onAuthSuccess={(sess) => setSession(sess)} />;
  }

  return (
    <div className="app-container">
      {/* HEADERBAR */}
      <header className="app-header">
        <div className="logo-section">
          <img src="/logo.jpg" alt="Luma Logo" className="header-logo-img" />
          <h1>Luma</h1>
        </div>

        <div className="header-actions">
          {/* Theme Selector */}
          <div className="theme-selector">
            <button 
              className={`theme-opt-btn ${activeTheme === 'default' ? 'active' : ''}`}
              onClick={() => handleThemeChange('default')}
            >
              Default
            </button>
            <button 
              className={`theme-opt-btn ${activeTheme === 'autumn' ? 'active' : ''}`}
              onClick={() => handleThemeChange('autumn')}
            >
              Autumn 🍁
            </button>
            <button 
              className={`theme-opt-btn ${activeTheme === 'rainy' ? 'active' : ''}`}
              onClick={() => handleThemeChange('rainy')}
            >
              Rainy 🌧️
            </button>
          </div>

          {/* Coins Display */}
          <div className="coins-badge" title="Earn coins by focusing!">
            <Coins size={16} />
            <span>{coins} coins</span>
          </div>

          {/* Total Focus Time */}
          <div className="user-badge" title="Total focus duration">
            <BookOpen size={16} />
            <span>{highScore}m focused</span>
          </div>

          {/* Shop Toggle */}
          <button className="nav-btn shop-btn" onClick={() => setShopOpen(true)}>
            <ShoppingBag size={16} />
            <span>Shop</span>
          </button>

          {/* Logout */}
          <button className="nav-btn logout-btn" onClick={handleLogout} title="Log Out">
            <LogOut size={16} />
          </button>
        </div>
      </header>

      {/* CORE VIEW */}
      <main className="main-content">
        {/* Café Illustration View */}
        <CafeScene 
          unlockedItems={unlockedItems} 
          activeTheme={activeTheme}
          isTimerRunning={isTimerRunning}
          currentSessionDuration={0}
          elapsedTime={elapsedTime}
          isBreak={isBreak}
        />

        {/* Focus Timer controls */}
        <Timer 
          onSessionComplete={handleSessionComplete}
          onSessionGiveUp={handleSessionGiveUp}
          isTimerRunning={isTimerRunning}
          setIsTimerRunning={setIsTimerRunning}
          elapsedTime={elapsedTime}
          setElapsedTime={setElapsedTime}
          isBreak={isBreak}
          setIsBreak={setIsBreak}
        />
      </main>

      {/* Ambient Audio Mixer (Floating) */}
      <SoundMixer />

      {/* Drawer Shop Menu */}
      <Shop 
        coins={coins} 
        unlockedItems={unlockedItems} 
        onPurchaseItem={handlePurchaseItem} 
        isOpen={shopOpen} 
        onClose={() => setShopOpen(false)}
      />

      {/* Session reward modal */}
      {rewardModal && (
        <div className="give-up-overlay">
          <div className="give-up-modal reward-modal">
            <Award className="reward-icon" size={48} style={{ color: '#F59E0B', margin: '0 auto 16px', animation: 'float 2s infinite' }} />
            <h3>Focus Session Complete!</h3>
            <p>You stayed focused for <strong>{rewardModal.minutes} minutes</strong>.</p>
            <div className="reward-coins-earned">
              <Coins size={20} style={{ color: '#D97706' }} />
              <span>+{rewardModal.coinsEarned} coins</span>
            </div>
            <p className="reward-flavour-text">Your café attracted some customers, and they loved the vibes! Let's take a quick break or jump right back in.</p>
            <button className="modal-btn resume" onClick={() => setRewardModal(null)}>
              <Sparkles size={16} />
              <span>Awesome!</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
