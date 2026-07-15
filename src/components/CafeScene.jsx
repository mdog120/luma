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
  "Almost finished with my task!",
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
  const [ambientBubbles, setAmbientBubbles] = useState([]);

  // Determine how many customers are present
  useEffect(() => {
    if (!isTimerRunning) {
      // Idle mode - maybe 1 default customer or 0
      setCustomerCount(0);
      return;
    }

    if (isBreak) {
      // Break mode - cafe is full of customers relaxing!
      setCustomerCount(3);
      return;
    }

    // Active focus: more customers join as time goes on
    // 1 customer for first 5 mins, 2 for 15 mins, 3 for 25 mins, 4 for 45+ mins
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
            {isUnlocked('plants') && <div className="hanging-ivy">🌱🌿🌱</div>}
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
            <div className="shelf s1">📚 🪴 ☕</div>
            <div className="shelf s2">📖 🏺 📚</div>
            <div className="shelf s3">📦 📚 🪴</div>
          </div>
        )}

        {/* Fireplace */}
        {isUnlocked('fireplace') && (
          <div className="scene-fireplace">
            <div className="fireplace-mantel">🧱🧱🧱</div>
            <div className="fireplace-hearth">
              <Flame className="fireplace-fire" size={24} />
              <div className="fire-glow"></div>
            </div>
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
            🐱💤
          </div>
        )}

        {/* Main Bar Counter & Kitchen */}
        <div className="cafe-counter">
          {/* Espresso Machine */}
          <div className="counter-machine-slot">
            {isUnlocked('espresso_machine') ? (
              <div className="deluxe-machine" title="Deluxe Espresso Machine">
                ☕⚙️
                <div className="steam-container">
                  <div className="steam-line s1"></div>
                  <div className="steam-line s2"></div>
                </div>
              </div>
            ) : (
              <div className="basic-machine" title="Simple Coffee Pot">
                ☕🏺
              </div>
            )}
          </div>

          {/* Pastries on Counter */}
          <div className="counter-food-slot">
            {(isUnlocked('croissant') || isUnlocked('cake')) && (
              <div className="pastry-dome" title="Pastry Display">
                🧁🥐🍰
              </div>
            )}
          </div>

          <div className="barista" title="Barista">
            🧑‍🍳
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
              👩‍💻
              {activeSpeech?.customerId === 0 && (
                <div className="speech-bubble">{activeSpeech.text}</div>
              )}
            </div>
          )}

          {/* Customer 2 (Left Table, Right Seat) */}
          {customerCount >= 2 && (
            <div className="customer c2">
              👨‍💻
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
              👩‍🎨
              {activeSpeech?.customerId === 2 && (
                <div className="speech-bubble">{activeSpeech.text}</div>
              )}
            </div>
          )}
        </div>

        {/* Customer 4 (sitting at Window Stool) */}
        {customerCount >= 4 && (
          <div className="customer c4">
            👨‍🏫
            {activeSpeech?.customerId === 3 && (
              <div className="speech-bubble">{activeSpeech.text}</div>
            )}
          </div>
        )}

        {/* Dog by window */}
        {isUnlocked('dog') && (
          <div className="scene-pet pet-dog" title="Golden Retriever">
            🐶
            <div className="tail-wag"></div>
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
