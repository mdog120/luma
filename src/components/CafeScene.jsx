import React, { useEffect, useState } from 'react';
import { Coffee, Flame, Heart, BookOpen, Laptop, Sparkles } from 'lucide-react';

const MESSAGES = [
  "So peaceful here...",
  "Back to studying!",
  "Mmm, the matcha latte is amazing.",
  "Deep focus mode...",
  "Let's get this work done!",
  "This coffee shop is my favorite.",
  "Love the background music.",
  "Almost finished with my focus session!",
  "Writing code, sipping tea.",
  "Cozy vibes only."
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

      {/* Main Room Container */}
      <div className="cafe-room">
        
        {/* WALL ITEMS */}
        {/* Windows */}
        <div className="cafe-window">
          <div className="window-pane"></div>
          <div className="window-ledge">
            {/* Hanging ivy if unlocked */}
            {isUnlocked('plants') && (
              <div className="hanging-ivy">
                <svg className="svg-hanging-ivy" viewBox="0 0 100 40" width="100" height="40">
                  <path d="M 10 0 Q 30 15 50 0 Q 70 15 90 0" fill="none" stroke="#5B7065" strokeWidth="2"/>
                  <path d="M 20 5 C 15 15 10 10 20 5" fill="#A3B19B"/>
                  <path d="M 35 7 C 38 18 43 14 35 7" fill="#5B7065"/>
                  <path d="M 50 5 C 55 15 60 10 50 5" fill="#A3B19B"/>
                  <path d="M 68 8 C 65 18 60 15 68 8" fill="#5B7065"/>
                  <path d="M 80 5 C 85 15 90 10 80 5" fill="#A3B19B"/>
                </svg>
              </div>
            )}
          </div>
        </div>

        {/* Poster / Menu Chalkboard */}
        <div className="chalkboard">
          <h4>Menu Special</h4>
          <ul>
            <li>Espresso .. $3</li>
            {isUnlocked('matcha') && <li className="chalk-item">Matcha Latte .. $5 🍵</li>}
            {isUnlocked('croissant') && <li className="chalk-item">Croissant .. $4 🥐</li>}
            {isUnlocked('cake') && <li className="chalk-item">Berry Cake .. $6 🍰</li>}
          </ul>
        </div>

        {/* Bookshelf */}
        {isUnlocked('bookshelf') && (
          <div className="scene-bookshelf">
            <svg className="svg-bookshelf" viewBox="0 0 80 150" width="100%" height="100%">
              <rect x="0" y="0" width="80" height="150" fill="#5D4037" rx="3"/>
              <rect x="4" y="4" width="72" height="142" fill="#3E2723" rx="2"/>
              <rect x="4" y="40" width="72" height="6" fill="#5D4037"/>
              <rect x="4" y="80" width="72" height="6" fill="#5D4037"/>
              <rect x="4" y="120" width="72" height="6" fill="#5D4037"/>
              {/* Top Shelf: Books */}
              <rect x="10" y="15" width="8" height="25" fill="#E76F51" rx="1"/>
              <rect x="20" y="18" width="6" height="22" fill="#F4A261" rx="1"/>
              <rect x="28" y="12" width="7" height="28" fill="#E9C46A" rx="1"/>
              <rect x="38" y="20" width="6" height="23" fill="#2A9D8F" rx="1" transform="rotate(15, 38, 20)"/>
              {/* Middle Shelf: Plant */}
              <rect x="15" y="65" width="16" height="15" fill="#CD7F32" rx="2"/>
              <path d="M 12 65 C 10 50, 0 55, 5 65 C 10 65, 12 55, 18 50 C 25 55, 20 65, 25 65 C 28 55, 32 60, 30 65" fill="none" stroke="#A3B19B" strokeWidth="2.5" strokeLinecap="round"/>
              <path d="M 28 65 C 32 55, 35 58, 32 65" fill="none" stroke="#A3B19B" strokeWidth="2.5" strokeLinecap="round"/>
              {/* Bottom Shelf: Mug & Books */}
              <path d="M 15 110 L 25 110 A 3 3 0 0 1 28 113 L 28 118 A 3 3 0 0 1 25 121 L 15 121 Z" fill="#F4A261"/>
              <rect x="35" y="95" width="8" height="25" fill="#457B9D" rx="1"/>
              <rect x="45" y="98" width="9" height="22" fill="#E76F51" rx="1"/>
            </svg>
          </div>
        )}

        {/* Fireplace */}
        {isUnlocked('fireplace') && (
          <div className="scene-fireplace">
            <svg className="svg-fireplace" viewBox="0 0 100 120" width="100%" height="100%">
              {/* Mantel */}
              <rect x="0" y="0" width="100" height="12" fill="#5D4037" rx="2"/>
              {/* Structure */}
              <rect x="10" y="12" width="80" height="108" fill="#8D6E63"/>
              {/* Brick details */}
              <line x1="10" y1="30" x2="90" y2="30" stroke="#5D4037" strokeWidth="2"/>
              <line x1="10" y1="60" x2="90" y2="60" stroke="#5D4037" strokeWidth="2"/>
              <line x1="10" y1="90" x2="90" y2="90" stroke="#5D4037" strokeWidth="2"/>
              <line x1="30" y1="12" x2="30" y2="30" stroke="#5D4037" strokeWidth="2"/>
              <line x1="70" y1="12" x2="70" y2="30" stroke="#5D4037" strokeWidth="2"/>
              <line x1="50" y1="30" x2="50" y2="60" stroke="#5D4037" strokeWidth="2"/>
              <line x1="30" y1="60" x2="30" y2="90" stroke="#5D4037" strokeWidth="2"/>
              <line x1="70" y1="60" x2="70" y2="90" stroke="#5D4037" strokeWidth="2"/>
              {/* Hearth arch */}
              <path d="M 25 120 L 25 70 A 25 25 0 0 1 75 70 L 75 120 Z" fill="#212121"/>
              {/* Log */}
              <rect x="35" y="110" width="30" height="8" fill="#3E2723" rx="2"/>
              <rect x="42" y="103" width="16" height="8" fill="#4E342E" rx="2" transform="rotate(15, 50, 107)"/>
              {/* Fire Flame */}
              <path className="fire-flame flame-main" d="M 40 112 C 40 92, 50 75, 50 75 C 50 75, 60 92, 60 112 Z" fill="#FF5722"/>
              <path className="fire-flame flame-sub" d="M 45 112 C 45 98, 50 86, 50 86 C 50 86, 55 98, 55 112 Z" fill="#FFAD60"/>
              <path className="fire-flame flame-core" d="M 48 112 C 48 103, 50 96, 50 96 C 50 96, 52 103, 52 112 Z" fill="#FFF176"/>
            </svg>
            <div className="fire-glow"></div>
          </div>
        )}

        {/* FLOOR ITEMS */}
        {/* Plush Rug */}
        {isUnlocked('rug') && (
          <div className="scene-rug"></div>
        )}

        {/* Pets */}
        {isUnlocked('cat') && (
          <div className={`scene-pet pet-cat ${isUnlocked('rug') ? 'on-rug' : ''}`} title="Sleepy Ginger Cat">
            <svg className="svg-cat" viewBox="0 0 40 30" width="45" height="35">
              {/* Body */}
              <ellipse cx="20" cy="18" rx="15" ry="10" fill="#F4A261"/>
              {/* Head */}
              <circle cx="28" cy="13" r="7.5" fill="#F4A261"/>
              {/* Ears */}
              <polygon points="23,8 27,2 28,8" fill="#E76F51"/>
              <polygon points="30,8 34,2 33,8" fill="#E76F51"/>
              {/* Closed eyes */}
              <path d="M 23.5 13.5 Q 25 15 26.5 13.5" fill="none" stroke="#4A3E3D" strokeWidth="1" strokeLinecap="round"/>
              <path d="M 29.5 13.5 Q 31 15 32.5 13.5" fill="none" stroke="#4A3E3D" strokeWidth="1" strokeLinecap="round"/>
              {/* Nose */}
              <polygon points="28,15 27,16 29,16" fill="#E76F51"/>
              {/* Tail */}
              <path className="cat-tail" d="M 6 18 Q 2 24 5 16" fill="none" stroke="#F4A261" strokeWidth="3.5" strokeLinecap="round"/>
            </svg>
          </div>
        )}

        {/* Main Bar Counter & Kitchen */}
        <div className="cafe-counter">
          {/* Espresso Machine */}
          <div className="counter-machine-slot">
            {isUnlocked('espresso_machine') ? (
              <div className="deluxe-machine" title="Deluxe Espresso Machine">
                <svg className="svg-deluxe-machine" viewBox="0 0 50 50" width="45" height="45">
                  <rect x="5" y="10" width="40" height="35" fill="#BCAAA4" rx="2"/>
                  <rect x="8" y="5" width="34" height="6" fill="#8D6E63" rx="1"/>
                  {/* Gauge dials */}
                  <circle cx="15" cy="18" r="4" fill="#FFFFFF" stroke="#5D4037" strokeWidth="1"/>
                  <line x1="15" y1="18" x2="17" y2="15" stroke="#E76F51" strokeWidth="1"/>
                  <circle cx="35" cy="18" r="4" fill="#FFFFFF" stroke="#5D4037" strokeWidth="1"/>
                  <line x1="35" y1="18" x2="33" y2="16" stroke="#E76F51" strokeWidth="1"/>
                  {/* Group head */}
                  <rect x="18" y="25" width="14" height="8" fill="#4E342E"/>
                  <rect x="12" y="30" width="26" height="3" fill="#78909C"/>
                  {/* Drip tray */}
                  <rect x="8" y="40" width="34" height="3" fill="#37474F"/>
                </svg>
                <div className="steam-container">
                  <div className="steam-line s1"></div>
                  <div className="steam-line s2"></div>
                </div>
              </div>
            ) : (
              <div className="basic-machine" title="Simple Coffee Pot">
                <svg className="svg-basic-machine" viewBox="0 0 50 50" width="35" height="35">
                  {/* Base plate */}
                  <rect x="10" y="40" width="30" height="4" fill="#37474F" rx="1"/>
                  {/* Glass Carafe */}
                  <path d="M 18 18 L 32 18 L 35 38 A 3 3 0 0 1 32 41 L 18 41 A 3 3 0 0 1 15 38 Z" fill="rgba(224, 242, 241, 0.4)" stroke="#37474F" strokeWidth="2"/>
                  {/* Coffee inside */}
                  <path d="M 16.5 28 L 33.5 28 L 34.5 38 A 2 2 0 0 1 32.5 40 L 17.5 40 A 2 2 0 0 1 15.5 38 Z" fill="#4E342E"/>
                  {/* Handle */}
                  <path d="M 15 22 L 8 22 L 8 35 L 15 35" fill="none" stroke="#37474F" strokeWidth="2.5" strokeLinecap="round"/>
                </svg>
              </div>
            )}
          </div>

          {/* Pastries on Counter */}
          <div className="counter-food-slot">
            {(isUnlocked('croissant') || isUnlocked('cake')) && (
              <div className="pastry-dome" title="Pastry Display">
                <svg className="svg-pastry-dome" viewBox="0 0 40 40" width="40" height="40">
                  {/* Stand */}
                  <path d="M 10 35 L 30 35 L 25 32 L 15 32 Z" fill="#BCAAA4"/>
                  <rect x="5" y="30" width="30" height="3" fill="#D7CCC8" rx="1"/>
                  {/* Croissant */}
                  <path d="M 12 28 C 15 22, 25 22, 28 28 C 24 25, 16 25, 12 28" fill="#E9C46A" stroke="#CD7F32" strokeWidth="1"/>
                  {/* Dome */}
                  <path d="M 6 30 A 14 14 0 0 1 34 30 Z" fill="rgba(224, 242, 241, 0.3)" stroke="rgba(255,255,255,0.7)" strokeWidth="1"/>
                  <circle cx="20" cy="15" r="2" fill="rgba(255, 255, 255, 0.9)"/>
                </svg>
              </div>
            )}
          </div>

          <div className="barista" title="Barista">
            <svg className="svg-barista" viewBox="0 0 40 50" width="40" height="50">
              <defs>
                <clipPath id="hair-clip">
                  <rect x="0" y="12" width="40" height="15" />
                </clipPath>
              </defs>
              {/* Body */}
              <path d="M 10 50 L 30 50 L 26 30 L 14 30 Z" fill="#37474F"/>
              {/* Apron */}
              <path d="M 14 32 L 26 32 L 27 50 L 13 50 Z" fill="#2E7D32"/>
              <rect x="17" y="24" width="6" height="8" fill="#2E7D32"/>
              <rect x="18" y="26" width="4" height="5" fill="#FFCCBC"/>
              <circle cx="20" cy="20" r="7.5" fill="#FFCCBC"/>
              {/* Hair */}
              <circle cx="20" cy="11" r="4.5" fill="#5D4037"/>
              {/* Eyes */}
              <circle cx="17.5" cy="19.5" r="0.8" fill="#212121"/>
              <circle cx="22.5" cy="19.5" r="0.8" fill="#212121"/>
              <circle cx="16" cy="21" r="1.2" fill="#FF8A80" opacity="0.6"/>
              <circle cx="24" cy="21" r="1.2" fill="#FF8A80" opacity="0.6"/>
              {/* Chef Hat */}
              <path d="M 14 14 Q 20 8 26 14 L 24 16 L 16 16 Z" fill="#FFFFFF" stroke="#ECEFF1" strokeWidth="0.5"/>
            </svg>
            {isTimerRunning && !isBreak && (
              <span className="barista-busy-icon">✨</span>
            )}
          </div>
        </div>

        {/* Bar Stool */}
        <div className="bar-stool stool-main"></div>

        {/* Tables & Seating for Customers */}
        <div className="table-zone table-left">
          <div className="table-surface"></div>
          <div className="chair chair-left"></div>
          <div className="chair chair-right"></div>
          
          {/* Customer 1 (Left Table, Left Seat) */}
          {customerCount >= 1 && (
            <div className="customer c1">
              <svg className="svg-customer c-typing" viewBox="0 0 40 50" width="35" height="45">
                <path d="M 10 50 L 30 50 L 27 32 L 13 32 Z" fill="#E76F51"/>
                <rect x="18" y="26" width="4" height="6" fill="#F5CBA7"/>
                <circle cx="20" cy="20" r="7" fill="#F5CBA7"/>
                {/* Hair */}
                <path d="M 11 18 C 11 11, 29 11, 29 18" fill="#264653" stroke="#264653" strokeWidth="2.5"/>
                {/* Laptop */}
                <path d="M 6 36 L 18 36 L 22 45 L 10 45 Z" fill="#78909C"/>
                <line x1="10" y1="45" x2="22" y2="45" stroke="#CFD8DC" strokeWidth="2"/>
              </svg>
              {activeSpeech?.customerId === 0 && (
                <div className="speech-bubble">{activeSpeech.text}</div>
              )}
            </div>
          )}

          {/* Customer 2 (Left Table, Right Seat) */}
          {customerCount >= 2 && (
            <div className="customer c2">
              <svg className="svg-customer c-reading" viewBox="0 0 40 50" width="35" height="45">
                <path d="M 10 50 L 30 50 L 27 32 L 13 32 Z" fill="#2A9D8F"/>
                <rect x="18" y="26" width="4" height="6" fill="#E0AC9D"/>
                <circle cx="20" cy="20" r="7" fill="#E0AC9D"/>
                {/* Hair */}
                <path d="M 13 16 C 13 12, 27 12, 27 16" fill="#8D6E63" stroke="#8D6E63" strokeWidth="2"/>
                {/* Book */}
                <path d="M 12 36 L 20 34 L 28 36 L 26 44 L 14 44 Z" fill="#E9C46A"/>
                <line x1="20" y1="34" x2="20" y2="44" stroke="#5D4037" strokeWidth="1"/>
              </svg>
              {activeSpeech?.customerId === 1 && (
                <div className="speech-bubble">{activeSpeech.text}</div>
              )}
            </div>
          )}
        </div>

        <div className="table-zone table-right">
          <div className="table-surface"></div>
          <div className="chair chair-left"></div>
          
          {/* Customer 3 (Right Table) */}
          {customerCount >= 3 && (
            <div className="customer c3">
              <svg className="svg-customer c-drinking" viewBox="0 0 40 50" width="35" height="45">
                <path d="M 10 50 L 30 50 L 27 32 L 13 32 Z" fill="#F4A261"/>
                <rect x="18" y="26" width="4" height="6" fill="#E0AC9D"/>
                <circle cx="20" cy="20" r="7" fill="#E0AC9D"/>
                {/* Hat */}
                <ellipse cx="20" cy="13" rx="8" ry="3" fill="#E76F51"/>
                <circle cx="20" cy="11" r="2.5" fill="#E76F51"/>
                {/* Coffee Mug */}
                <rect x="12" y="32" width="8" height="8" fill="#457B9D" rx="1"/>
                <path d="M 20 34 C 22 34, 22 38, 20 38" fill="none" stroke="#457B9D" strokeWidth="1.5"/>
              </svg>
              {activeSpeech?.customerId === 2 && (
                <div className="speech-bubble">{activeSpeech.text}</div>
              )}
            </div>
          )}
        </div>

        {/* Customer 4 (sitting at Window Stool) */}
        {customerCount >= 4 && (
          <div className="customer c4">
            <svg className="svg-customer c-window" viewBox="0 0 40 50" width="35" height="45">
              <path d="M 10 50 L 30 50 L 27 32 L 13 32 Z" fill="#1D3557"/>
              <rect x="18" y="26" width="4" height="6" fill="#FFE0B2"/>
              <circle cx="20" cy="20" r="7" fill="#FFE0B2"/>
              {/* Hair */}
              <path d="M 12 18 C 12 12, 28 12, 28 18" fill="#4E342E" stroke="#4E342E" strokeWidth="2"/>
              {/* Glasses */}
              <rect x="14" y="18" width="5" height="3" fill="none" stroke="#212121" strokeWidth="1"/>
              <rect x="21" y="18" width="5" height="3" fill="none" stroke="#212121" strokeWidth="1"/>
              <line x1="19" y1="19" x2="21" y2="19" stroke="#212121" strokeWidth="1"/>
            </svg>
            {activeSpeech?.customerId === 3 && (
              <div className="speech-bubble">{activeSpeech.text}</div>
            )}
          </div>
        )}

        {/* Dog by window */}
        {isUnlocked('dog') && (
          <div className="scene-pet pet-dog" title="Golden Retriever">
            <svg className="svg-dog" viewBox="0 0 40 40" width="50" height="50">
              {/* Body */}
              <path d="M 10 32 L 28 32 L 25 18 L 13 18 Z" fill="#E9C46A"/>
              {/* Legs */}
              <rect x="12" y="30" width="3" height="10" fill="#E9C46A" rx="1"/>
              <rect x="23" y="30" width="3" height="10" fill="#E9C46A" rx="1"/>
              {/* Head */}
              <circle cx="14" cy="13" r="7" fill="#E9C46A"/>
              <rect x="7" y="12" width="7" height="5" fill="#FFE082" rx="1"/>
              <circle cx="7" cy="13" r="1.2" fill="#212121"/>
              <circle cx="12" cy="11.5" r="0.8" fill="#212121"/>
              {/* Ear */}
              <path d="M 15 11 C 17 11, 20 16, 17 19 C 15 17, 15 12, 15 11" fill="#CD7F32"/>
              {/* Tail */}
              <path className="dog-tail" d="M 28 28 Q 36 24 32 18" fill="none" stroke="#E9C46A" strokeWidth="3.5" strokeLinecap="round"/>
            </svg>
          </div>
        )}

        {/* Light Overlay / Cafe Ambient Particles */}
        <div className="cafe-lighting"></div>

      </div>

      {/* Floating Steam/Vibe particles during focus sessions */}
      {isTimerRunning && !isBreak && (
        <div className="focus-particles">
          <div className="particle p1"><Coffee size={10} /></div>
          <div className="particle p2"><BookOpen size={10} /></div>
          <div className="particle p3"><Laptop size={10} /></div>
        </div>
      )}
    </div>
  );
}
