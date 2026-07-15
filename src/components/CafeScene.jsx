import React, { useEffect, useState } from 'react';
import { Coffee, Flame, Heart, BookOpen, Laptop, Sparkles } from 'lucide-react';

const MESSAGES = [
  "So peaceful here...",
  "Back to studying!",
  "Mmm, this matcha is 10/10.",
  "Deep focus mode...",
  "Let's get this work done!",
  "Love the retro vibes.",
  "Relaxing lo-fi beats...",
  "Almost finished with my session!",
  "Writing code, sipping tea.",
  "Cozy 8-bit vibes."
];

export default function CafeScene({ 
  unlockedItems, 
  activeTheme, 
  isTimerRunning, 
  currentSessionDuration, 
  elapsedTime,
  isBreak 
}) {
  const [customerCount, setCustomerCount] = useState(0);
  const [activeSpeech, setActiveSpeech] = useState(null);

  // Determine how many customers are present
  useEffect(() => {
    if (!isTimerRunning) {
      setCustomerCount(0);
      return;
    }

    if (isBreak) {
      setCustomerCount(3);
      return;
    }

    // Active focus: more customers join as time goes on
    const minutesFocused = Math.floor(elapsedTime / 60);
    if (minutesFocused < 5) {
      setCustomerCount(1);
    } else if (minutesFocused < 15) {
      setCustomerCount(2);
    } else if (minutesFocused < 30) {
      setCustomerCount(3);
    } else {
      setCustomerCount(4);
    }
  }, [isTimerRunning, elapsedTime, isBreak]);

  // Periodic customer speech bubbles during focus
  useEffect(() => {
    if (customerCount === 0) {
      setActiveSpeech(null);
      return;
    }

    const interval = setInterval(() => {
      const randomCustomerIdx = Math.floor(Math.random() * customerCount);
      const randomText = MESSAGES[Math.floor(Math.random() * MESSAGES.length)];
      
      setActiveSpeech({
        customerId: randomCustomerIdx,
        text: randomText
      });

      // Clear bubble after 4 seconds
      setTimeout(() => {
        setActiveSpeech(null);
      }, 4000);

    }, 12000); // speech every 12 seconds

    return () => clearInterval(interval);
  }, [customerCount]);

  // Helper checking if item is unlocked
  const isUnlocked = (itemId) => unlockedItems.includes(itemId);

  return (
    <div className={`cafe-scene theme-${activeTheme}`}>
      {/* Weather Background Window effect */}
      <div className="scene-window-backdrop">
        {activeTheme === 'rainy' && (
          <div className="rain-effect">
            <div className="rain-drop d1"></div>
            <div className="rain-drop d2"></div>
            <div className="rain-drop d3"></div>
            <div className="rain-drop d4"></div>
            <div className="rain-drop d5"></div>
            <div className="rain-drop d6"></div>
          </div>
        )}
        {activeTheme === 'autumn' && (
          <div className="leaf-effect">
            <div className="leaf l1">🍁</div>
            <div className="leaf l2">🍂</div>
            <div className="leaf l3">🍁</div>
            <div className="leaf l4">🍂</div>
          </div>
        )}
        <div className="sun-or-moon"></div>
      </div>

      {/* 3D Room Stage */}
      <div className="cafe-stage">
        
        {/* FLOOR PLANE */}
        <div className="room-floor">
          
          {/* LEFT WALL */}
          <div className="room-wall-left">
            {/* Window */}
            <div className="wall-window">
              <div className="window-glare"></div>
              {/* Hanging ivy if unlocked */}
              {isUnlocked('plants') && (
                <div className="wall-ivy">
                  <svg className="svg-hanging-ivy" viewBox="0 0 100 40" width="80" height="30">
                    <path d="M 10 0 Q 30 15 50 0 Q 70 15 90 0" fill="none" stroke="#5B7065" strokeWidth="2.5"/>
                    <path d="M 20 5 C 15 15 10 10 20 5" fill="#A3B19B"/>
                    <path d="M 35 7 C 38 18 43 14 35 7" fill="#5B7065"/>
                    <path d="M 50 5 C 55 15 60 10 50 5" fill="#A3B19B"/>
                    <path d="M 68 8 C 65 18 60 15 68 8" fill="#5B7065"/>
                    <path d="M 80 5 C 85 15 90 10 80 5" fill="#A3B19B"/>
                  </svg>
                </div>
              )}
            </div>
            
            {/* Fireplace (Left wall position) */}
            {isUnlocked('fireplace') && (
              <div className="floor-object fireplace-wrapper">
                <div className="flat-shadow fireplace-shadow"></div>
                <div className="billboard-object">
                  <svg className="svg-fireplace" viewBox="0 0 100 120" width="90" height="110">
                    <rect x="5" y="0" width="90" height="10" fill="#4E342E" rx="1"/>
                    <rect x="10" y="10" width="80" height="110" fill="#8D6E63"/>
                    {/* 8bit bricks details */}
                    <rect x="15" y="20" width="15" height="8" fill="#5D4037"/>
                    <rect x="70" y="20" width="15" height="8" fill="#5D4037"/>
                    <rect x="40" y="40" width="20" height="8" fill="#5D4037"/>
                    <rect x="20" y="60" width="15" height="8" fill="#5D4037"/>
                    <rect x="65" y="60" width="15" height="8" fill="#5D4037"/>
                    {/* Arch */}
                    <path d="M 25 120 L 25 80 A 25 25 0 0 1 75 80 L 75 120 Z" fill="#212121"/>
                    <rect x="35" y="112" width="30" height="8" fill="#3E2723" rx="1"/>
                    {/* Glowing pixel fire */}
                    <path className="fire-flame flame-main" d="M 42 114 C 42 94, 50 80, 50 80 C 50 80, 58 94, 58 114 Z" fill="#FF5722"/>
                    <path className="fire-flame flame-sub" d="M 46 114 C 46 102, 50 90, 50 90 C 50 90, 54 102, 54 114 Z" fill="#FFAD60"/>
                    <path className="fire-flame flame-core" d="M 48 114 C 48 106, 50 98, 50 98 C 50 98, 52 106, 52 114 Z" fill="#FFF176"/>
                  </svg>
                </div>
              </div>
            )}
          </div>

          {/* RIGHT WALL */}
          <div className="room-wall-right">
            {/* Chalkboard Menu */}
            <div className="wall-chalkboard">
              <h4>MENU</h4>
              <div className="chalk-line">Matcha .. $5</div>
              {isUnlocked('croissant') && <div className="chalk-line">Croissant .. $4</div>}
              {isUnlocked('cake') && <div className="chalk-line">Cake .. $6</div>}
            </div>

            {/* Bookshelf */}
            {isUnlocked('bookshelf') && (
              <div className="floor-object bookshelf-wrapper">
                <div className="flat-shadow bookshelf-shadow"></div>
                <div className="billboard-object">
                  <svg className="svg-bookshelf" viewBox="0 0 80 150" width="70" height="130">
                    <rect x="0" y="0" width="80" height="150" fill="#5D4037" rx="2"/>
                    <rect x="5" y="5" width="70" height="140" fill="#3E2723" rx="1"/>
                    <rect x="5" y="45" width="70" height="5" fill="#5D4037"/>
                    <rect x="5" y="90" width="70" height="5" fill="#5D4037"/>
                    {/* Pixel Books */}
                    <rect x="10" y="20" width="10" height="25" fill="#E76F51"/>
                    <rect x="22" y="25" width="8" height="20" fill="#F4A261"/>
                    <rect x="32" y="15" width="12" height="30" fill="#E9C46A"/>
                    {/* Plant */}
                    <rect x="15" y="70" width="14" height="20" fill="#A3B19B" rx="1"/>
                    <circle cx="22" cy="65" r="5" fill="#5B7065"/>
                    <circle cx="17" cy="67" r="4" fill="#5B7065"/>
                    <circle cx="27" cy="68" r="4" fill="#5B7065"/>
                    {/* Mug */}
                    <path d="M 45 125 L 53 125 A 3 3 0 0 1 56 128 L 56 132 A 3 3 0 0 1 53 135 L 45 135 Z" fill="#F4A261"/>
                    <rect x="15" y="110" width="10" height="25" fill="#457B9D"/>
                    <rect x="27" y="115" width="10" height="20" fill="#E76F51"/>
                  </svg>
                </div>
              </div>
            )}
          </div>

          {/* RUG */}
          {isUnlocked('rug') && (
            <div className="floor-rug">
              {/* Rug lies flat on the floor - no billboard! */}
            </div>
          )}

          {/* CAT */}
          {isUnlocked('cat') && (
            <div className="floor-object cat-wrapper">
              <div className="flat-shadow pet-shadow"></div>
              <div className="billboard-object">
                <svg className="svg-cat" viewBox="0 0 40 30" width="40" height="30">
                  <ellipse cx="20" cy="18" rx="14" ry="9" fill="#F4A261"/>
                  <circle cx="28" cy="12" r="7" fill="#F4A261"/>
                  {/* Ears */}
                  <polygon points="23,8 27,2 28,8" fill="#E76F51"/>
                  <polygon points="30,8 34,2 33,8" fill="#E76F51"/>
                  {/* Eyes */}
                  <path d="M 24 13 Q 25.5 14.5 27 13" fill="none" stroke="#4A3E3D" strokeWidth="1" strokeLinecap="round"/>
                  <path d="M 29 13 Q 30.5 14.5 32 13" fill="none" stroke="#4A3E3D" strokeWidth="1" strokeLinecap="round"/>
                  {/* Tail */}
                  <path className="cat-tail" d="M 7 18 Q 3 24 6 16" fill="none" stroke="#F4A261" strokeWidth="3" strokeLinecap="round"/>
                </svg>
              </div>
            </div>
          )}

          {/* BAR COUNTER ZONE */}
          <div className="floor-object counter-wrapper">
            <div className="flat-shadow counter-shadow"></div>
            <div className="billboard-object">
              
              {/* Barista behind counter */}
              <div className="barista-container">
                <svg className="svg-barista" viewBox="0 0 40 50" width="38" height="48">
                  <path d="M 10 50 L 30 50 L 26 30 L 14 30 Z" fill="#37474F"/>
                  <path d="M 14 32 L 26 32 L 27 50 L 13 50 Z" fill="#2E7D32"/>
                  <rect x="17" y="24" width="6" height="8" fill="#2E7D32"/>
                  <rect x="18" y="26" width="4" height="5" fill="#FFCCBC"/>
                  <circle cx="20" cy="20" r="7" fill="#FFCCBC"/>
                  {/* Hair */}
                  <circle cx="20" cy="11" r="4" fill="#5D4037"/>
                  {/* Chef Hat */}
                  <path d="M 13 14 Q 20 7 27 14 L 25 16 L 15 16 Z" fill="#FFFFFF" stroke="#ECEFF1" strokeWidth="0.5"/>
                  {/* Face details */}
                  <circle cx="17.5" cy="19.5" r="0.8" fill="#212121"/>
                  <circle cx="22.5" cy="19.5" r="0.8" fill="#212121"/>
                </svg>
                {isTimerRunning && !isBreak && (
                  <span className="barista-busy-icon">✨</span>
                )}
              </div>

              {/* Counter desk */}
              <div className="counter-desk">
                
                {/* Coffee Machine */}
                <div className="machine-container">
                  {isUnlocked('espresso_machine') ? (
                    <div className="deluxe-machine">
                      <svg className="svg-deluxe-machine" viewBox="0 0 50 50" width="40" height="40">
                        <rect x="5" y="10" width="40" height="35" fill="#BCAAA4" rx="1"/>
                        <rect x="8" y="5" width="34" height="6" fill="#8D6E63" rx="1"/>
                        <circle cx="15" cy="18" r="4" fill="#FFFFFF" stroke="#5D4037" strokeWidth="1"/>
                        <circle cx="35" cy="18" r="4" fill="#FFFFFF" stroke="#5D4037" strokeWidth="1"/>
                        <rect x="18" y="25" width="14" height="8" fill="#4E342E"/>
                        <rect x="12" y="30" width="26" height="3" fill="#78909C"/>
                        <rect x="8" y="40" width="34" height="3" fill="#37474F"/>
                      </svg>
                      <div className="steam-container">
                        <div className="steam-line s1"></div>
                        <div className="steam-line s2"></div>
                      </div>
                    </div>
                  ) : (
                    <div className="basic-machine">
                      <svg className="svg-basic-machine" viewBox="0 0 50 50" width="30" height="30">
                        <rect x="10" y="40" width="30" height="4" fill="#37474F" rx="1"/>
                        <path d="M 18 18 L 32 18 L 35 38 A 3 3 0 0 1 32 41 L 18 41 A 3 3 0 0 1 15 38 Z" fill="rgba(224, 242, 241, 0.4)" stroke="#37474F" strokeWidth="2"/>
                        <path d="M 16.5 28 L 33.5 28 L 34.5 38 A 2 2 0 0 1 32.5 40 L 17.5 40 A 2 2 0 0 1 15.5 38 Z" fill="#4E342E"/>
                        <path d="M 15 22 L 8 22 L 8 35 L 15 35" fill="none" stroke="#37474F" strokeWidth="2" strokeLinecap="round"/>
                      </svg>
                    </div>
                  )}
                </div>

                {/* Pastry Dome */}
                <div className="pastry-container">
                  {(isUnlocked('croissant') || isUnlocked('cake')) && (
                    <svg className="svg-pastry-dome" viewBox="0 0 40 40" width="35" height="35">
                      <path d="M 10 35 L 30 35 L 25 32 L 15 32 Z" fill="#BCAAA4"/>
                      <rect x="5" y="30" width="30" height="3" fill="#D7CCC8" rx="1"/>
                      <path d="M 12 28 C 15 22, 25 22, 28 28 C 24 25, 16 25, 12 28" fill="#E9C46A"/>
                      <path d="M 6 30 A 14 14 0 0 1 34 30 Z" fill="rgba(224, 242, 241, 0.3)" stroke="rgba(255,255,255,0.7)" strokeWidth="1"/>
                    </svg>
                  )}
                </div>

              </div>
            </div>
          </div>

          {/* TABLE ZONE LEFT */}
          <div className="floor-object table-left-wrapper">
            <div className="flat-shadow table-shadow"></div>
            
            {/* Table Billboard */}
            <div className="billboard-object table-obj">
              <div className="cafe-table">
                {/* Surface */}
                <div className="table-top"></div>
                {/* Legs */}
                <div className="table-leg"></div>
              </div>
            </div>

            {/* Customer 1 (Left Seat) */}
            {customerCount >= 1 && (
              <div className="customer-wrapper cust-left">
                <div className="flat-shadow char-shadow"></div>
                <div className="billboard-object">
                  <svg className="svg-customer c-typing" viewBox="0 0 40 50" width="32" height="42">
                    <path d="M 10 50 L 30 50 L 27 32 L 13 32 Z" fill="#E76F51"/>
                    <rect x="18" y="26" width="4" height="6" fill="#F5CBA7"/>
                    <circle cx="20" cy="20" r="7.5" fill="#F5CBA7"/>
                    <path d="M 11 18 C 11 11, 29 11, 29 18" fill="#264653" stroke="#264653" strokeWidth="2"/>
                    <path d="M 6 36 L 18 36 L 22 45 L 10 45 Z" fill="#78909C"/>
                    <line x1="10" y1="45" x2="22" y2="45" stroke="#CFD8DC" strokeWidth="2"/>
                  </svg>
                  {activeSpeech?.customerId === 0 && (
                    <div className="speech-bubble">{activeSpeech.text}</div>
                  )}
                </div>
              </div>
            )}

            {/* Customer 2 (Right Seat) */}
            {customerCount >= 2 && (
              <div className="customer-wrapper cust-right">
                <div className="flat-shadow char-shadow"></div>
                <div className="billboard-object">
                  <svg className="svg-customer c-reading" viewBox="0 0 40 50" width="32" height="42">
                    <path d="M 10 50 L 30 50 L 27 32 L 13 32 Z" fill="#2A9D8F"/>
                    <rect x="18" y="26" width="4" height="6" fill="#E0AC9D"/>
                    <circle cx="20" cy="20" r="7.5" fill="#E0AC9D"/>
                    <path d="M 13 16 C 13 12, 27 12, 27 16" fill="#8D6E63" stroke="#8D6E63" strokeWidth="2"/>
                    <path d="M 12 36 L 20 34 L 28 36 L 26 44 L 14 44 Z" fill="#E9C46A"/>
                  </svg>
                  {activeSpeech?.customerId === 1 && (
                    <div className="speech-bubble">{activeSpeech.text}</div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* TABLE ZONE RIGHT */}
          <div className="floor-object table-right-wrapper">
            <div className="flat-shadow table-shadow"></div>
            
            {/* Table Billboard */}
            <div className="billboard-object table-obj">
              <div className="cafe-table">
                <div className="table-top"></div>
                <div className="table-leg"></div>
              </div>
            </div>

            {/* Customer 3 */}
            {customerCount >= 3 && (
              <div className="customer-wrapper cust-center">
                <div className="flat-shadow char-shadow"></div>
                <div className="billboard-object">
                  <svg className="svg-customer c-drinking" viewBox="0 0 40 50" width="32" height="42">
                    <path d="M 10 50 L 30 50 L 27 32 L 13 32 Z" fill="#F4A261"/>
                    <rect x="18" y="26" width="4" height="6" fill="#E0AC9D"/>
                    <circle cx="20" cy="20" r="7.5" fill="#E0AC9D"/>
                    <ellipse cx="20" cy="13" rx="8" ry="3" fill="#E76F51"/>
                    <rect x="12" y="32" width="8" height="8" fill="#457B9D" rx="1"/>
                    <path d="M 20 34 C 22 34, 22 38, 20 38" fill="none" stroke="#457B9D" strokeWidth="1.5"/>
                  </svg>
                  {activeSpeech?.customerId === 2 && (
                    <div className="speech-bubble">{activeSpeech.text}</div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Customer 4 (Window seat) */}
          {customerCount >= 4 && (
            <div className="floor-object window-seat-wrapper">
              <div className="flat-shadow char-shadow"></div>
              <div className="billboard-object">
                <svg className="svg-customer c-window" viewBox="0 0 40 50" width="32" height="42">
                  <path d="M 10 50 L 30 50 L 27 32 L 13 32 Z" fill="#1D3557"/>
                  <rect x="18" y="26" width="4" height="6" fill="#FFE0B2"/>
                  <circle cx="20" cy="20" r="7.5" fill="#FFE0B2"/>
                  <path d="M 12 18 C 12 12, 28 12, 28 18" fill="#4E342E" stroke="#4E342E" strokeWidth="2"/>
                  <rect x="14" y="18" width="5" height="3" fill="none" stroke="#212121" strokeWidth="1"/>
                  <rect x="21" y="18" width="5" height="3" fill="none" stroke="#212121" strokeWidth="1"/>
                </svg>
                {activeSpeech?.customerId === 3 && (
                  <div className="speech-bubble">{activeSpeech.text}</div>
                )}
              </div>
            </div>
          )}

          {/* DOG */}
          {isUnlocked('dog') && (
            <div className="floor-object dog-wrapper">
              <div className="flat-shadow pet-shadow"></div>
              <div className="billboard-object">
                <svg className="svg-dog" viewBox="0 0 40 40" width="44" height="44">
                  <path d="M 10 32 L 28 32 L 25 18 L 13 18 Z" fill="#E9C46A"/>
                  <rect x="12" y="30" width="3" height="10" fill="#E9C46A" rx="1"/>
                  <rect x="23" y="30" width="3" height="10" fill="#E9C46A" rx="1"/>
                  <circle cx="14" cy="13" r="7" fill="#E9C46A"/>
                  <rect x="7" y="12" width="7" height="5" fill="#FFE082" rx="1"/>
                  <circle cx="7" cy="13" r="1.2" fill="#212121"/>
                  <circle cx="12" cy="11.5" r="0.8" fill="#212121"/>
                  <path d="M 15 11 C 17 11, 20 16, 17 19 C 15 17, 15 12, 15 11" fill="#CD7F32"/>
                  <path className="dog-tail" d="M 28 28 Q 36 24 32 18" fill="none" stroke="#E9C46A" strokeWidth="3" strokeLinecap="round"/>
                </svg>
              </div>
            </div>
          )}

        </div>

      </div>

      {/* Floating 8-bit particles during focus */}
      {isTimerRunning && !isBreak && (
        <div className="focus-particles">
          <div className="particle p1"><Coffee size={12} className="pixel-icon" /></div>
          <div className="particle p2"><BookOpen size={12} className="pixel-icon" /></div>
          <div className="particle p3"><Laptop size={12} className="pixel-icon" /></div>
        </div>
      )}
    </div>
  );
}
