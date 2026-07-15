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
                  <svg className="svg-hanging-ivy" viewBox="0 0 100 40" width="80" height="30" shapeRendering="crispEdges">
                    <rect x="10" y="4" width="80" height="4" fill="#5B7065" />
                    <rect x="20" y="8" width="6" height="6" fill="#A3B19B" />
                    <rect x="35" y="10" width="8" height="6" fill="#5B7065" />
                    <rect x="50" y="8" width="6" height="6" fill="#A3B19B" />
                    <rect x="68" y="10" width="8" height="6" fill="#5B7065" />
                    <rect x="80" y="8" width="6" height="6" fill="#A3B19B" />
                  </svg>
                </div>
              )}
            </div>
            
            {/* Fireplace (Left wall position) */}
            {isUnlocked('fireplace') && (
              <div className="floor-object fireplace-wrapper">
                <div className="flat-shadow fireplace-shadow"></div>
                <div className="billboard-object">
                  <svg className="svg-fireplace" viewBox="0 0 24 24" width="85" height="85" shapeRendering="crispEdges">
                    {/* Wood Mantel */}
                    <rect x="1" y="1" width="22" height="3" fill="#5D4037" />
                    {/* Bricks */}
                    <rect x="3" y="4" width="18" height="20" fill="#8D6E63" />
                    {/* Brick details */}
                    <rect x="5" y="6" width="4" height="2" fill="#5D4037" />
                    <rect x="15" y="6" width="4" height="2" fill="#5D4037" />
                    <rect x="10" y="10" width="4" height="2" fill="#5D4037" />
                    <rect x="5" y="14" width="4" height="2" fill="#5D4037" />
                    <rect x="15" y="14" width="4" height="2" fill="#5D4037" />
                    {/* Hearth */}
                    <path d="M 6 24 L 6 15 A 6 6 0 0 1 18 15 L 18 24 Z" fill="#212121" />
                    {/* Log */}
                    <rect x="9" y="21" width="6" height="2" fill="#3E2723" />
                    {/* Pixel flames */}
                    <path className="fire-flame flame-main" d="M 10 24 L 10 19 L 12 17 L 14 19 L 14 24 Z" fill="#FF5722" />
                    <path className="fire-flame flame-sub" d="M 11 24 L 11 20 L 13 20 L 13 24 Z" fill="#FFAD60" />
                    <path className="fire-flame flame-core" d="M 11.5 24 L 11.5 21 L 12.5 21 L 12.5 24 Z" fill="#FFF176" />
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
                  <svg className="svg-bookshelf" viewBox="0 0 24 36" width="70" height="105" shapeRendering="crispEdges">
                    <rect x="1" y="1" width="22" height="34" fill="#5D4037" rx="1"/>
                    <rect x="3" y="3" width="18" height="30" fill="#3E2723" rx="1"/>
                    {/* Shelves */}
                    <rect x="3" y="12" width="18" height="2" fill="#5D4037" />
                    <rect x="3" y="22" width="18" height="2" fill="#5D4037" />
                    {/* Pixel Books */}
                    <rect x="5" y="6" width="2" height="6" fill="#E76F51" />
                    <rect x="8" y="7" width="2" height="5" fill="#F4A261" />
                    <rect x="11" y="5" width="3" height="7" fill="#E9C46A" />
                    {/* Plant */}
                    <rect x="6" y="17" width="4" height="5" fill="#A3B19B" />
                    <circle cx="8" cy="15" r="2" fill="#5B7065" />
                    {/* Mug */}
                    <rect x="14" y="28" width="4" height="4" fill="#F4A261" />
                    <rect x="12" y="29" width="2" height="2" fill="#F4A261" />
                  </svg>
                </div>
              </div>
            )}
          </div>

          {/* RUG */}
          {isUnlocked('rug') && (
            <div className="floor-rug"></div>
          )}

          {/* CAT */}
          {isUnlocked('cat') && (
            <div className="floor-object cat-wrapper">
              <div className="flat-shadow pet-shadow"></div>
              <div className="billboard-object">
                <svg className="svg-cat" viewBox="0 0 24 20" width="42" height="35" shapeRendering="crispEdges">
                  {/* Sleeping body */}
                  <rect x="2" y="6" width="16" height="12" fill="#F4A261" rx="1" />
                  {/* Stripes */}
                  <rect x="5" y="6" width="2" height="6" fill="#E76F51" />
                  <rect x="9" y="6" width="2" height="6" fill="#E76F51" />
                  <rect x="13" y="6" width="2" height="6" fill="#E76F51" />
                  {/* Head */}
                  <rect x="12" y="3" width="9" height="9" fill="#F4A261" />
                  {/* Ears */}
                  <rect x="13" y="1" width="2" height="2" fill="#E76F51" />
                  <rect x="18" y="1" width="2" height="2" fill="#E76F51" />
                  {/* Closed eyes */}
                  <rect x="14" y="6" width="2" height="1" fill="#2D1F1D" />
                  <rect x="18" y="6" width="2" height="1" fill="#2D1F1D" />
                  {/* Pink Nose */}
                  <rect x="17" y="7" width="1" height="1" fill="#E76F51" />
                  {/* Tail */}
                  <rect x="1" y="9" width="3" height="6" fill="#F4A261" className="cat-tail" />
                  {/* Outlines */}
                  <rect x="2" y="18" width="16" height="1" fill="#2D1F1D" />
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
                <svg className="svg-barista" viewBox="0 0 24 32" width="36" height="48" shapeRendering="crispEdges">
                  {/* Chef Hat */}
                  <rect x="6" y="2" width="12" height="6" fill="#FFFFFF" />
                  <rect x="8" y="0" width="8" height="2" fill="#FFFFFF" />
                  <rect x="5" y="6" width="14" height="2" fill="#E2E8F0" />
                  {/* Face */}
                  <rect x="7" y="8" width="10" height="8" fill="#FFCCBC" />
                  {/* Eyes */}
                  <rect x="9" y="11" width="2" height="2" fill="#2D1F1D" />
                  <rect x="13" y="11" width="2" height="2" fill="#2D1F1D" />
                  {/* Blush cheeks */}
                  <rect x="8" y="13" width="1" height="1" fill="#FF8A80" />
                  <rect x="15" y="13" width="1" height="1" fill="#FF8A80" />
                  {/* Hair */}
                  <rect x="6" y="8" width="12" height="2" fill="#5D4037" />
                  <rect x="6" y="10" width="1" height="3" fill="#5D4037" />
                  <rect x="17" y="10" width="1" height="3" fill="#5D4037" />
                  {/* Body */}
                  <rect x="5" y="16" width="14" height="14" fill="#37474F" />
                  {/* Green Apron */}
                  <rect x="7" y="16" width="10" height="14" fill="#2E7D32" />
                  <rect x="8" y="19" width="8" height="11" fill="#1B5E20" />
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
                      <svg className="svg-deluxe-machine" viewBox="0 0 50 50" width="40" height="40" shapeRendering="crispEdges">
                        <rect x="5" y="10" width="40" height="35" fill="#BCAAA4" />
                        <rect x="8" y="5" width="34" height="6" fill="#8D6E63" />
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
                      <svg className="svg-basic-machine" viewBox="0 0 50 50" width="30" height="30" shapeRendering="crispEdges">
                        <rect x="10" y="40" width="30" height="4" fill="#37474F" />
                        <path d="M 18 18 L 32 18 L 35 38 A 3 3 0 0 1 32 41 L 18 41 A 3 3 0 0 1 15 38 Z" fill="rgba(224, 242, 241, 0.4)" stroke="#37474F" strokeWidth="2"/>
                        <path d="M 16.5 28 L 33.5 28 L 34.5 38 A 2 2 0 0 1 32.5 40 L 17.5 40 A 2 2 0 0 1 15.5 38 Z" fill="#4E342E"/>
                        <path d="M 15 22 L 8 22 L 8 35 L 15 35" fill="none" stroke="#37474F" strokeWidth="2" />
                      </svg>
                    </div>
                  )}
                </div>

                {/* Pastry Dome */}
                <div className="pastry-container">
                  {(isUnlocked('croissant') || isUnlocked('cake')) && (
                    <svg className="svg-pastry-dome" viewBox="0 0 40 40" width="35" height="35" shapeRendering="crispEdges">
                      <path d="M 10 35 L 30 35 L 25 32 L 15 32 Z" fill="#BCAAA4"/>
                      <rect x="5" y="30" width="30" height="3" fill="#D7CCC8" />
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
                  <svg className="svg-customer c-typing" viewBox="0 0 24 32" width="32" height="42" shapeRendering="crispEdges">
                    {/* Head */}
                    <rect x="7" y="6" width="10" height="8" fill="#F5CBA7" />
                    <rect x="6" y="4" width="12" height="4" fill="#264653" /> {/* Hair */}
                    <rect x="6" y="8" width="1" height="4" fill="#264653" />
                    <rect x="17" y="8" width="1" height="4" fill="#264653" />
                    {/* Eyes */}
                    <rect x="9" y="9" width="1" height="2" fill="#2D1F1D" />
                    <rect x="14" y="9" width="1" height="2" fill="#2D1F1D" />
                    {/* Body */}
                    <rect x="6" y="14" width="12" height="16" fill="#E76F51" />
                    {/* Laptop */}
                    <rect x="2" y="22" width="10" height="6" fill="#78909C" />
                    <rect x="3" y="27" width="9" height="1" fill="#CFD8DC" />
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
                  <svg className="svg-customer c-reading" viewBox="0 0 24 32" width="32" height="42" shapeRendering="crispEdges">
                    {/* Head */}
                    <rect x="7" y="6" width="10" height="8" fill="#E0AC9D" />
                    <rect x="6" y="4" width="12" height="3" fill="#8D6E63" /> {/* Hair */}
                    <rect x="6" y="7" width="1" height="4" fill="#8D6E63" />
                    <rect x="17" y="7" width="1" height="4" fill="#8D6E63" />
                    {/* Eyes */}
                    <rect x="9" y="9" width="2" height="1" fill="#2D1F1D" />
                    <rect x="13" y="9" width="2" height="1" fill="#2D1F1D" />
                    {/* Body */}
                    <rect x="6" y="14" width="12" height="16" fill="#2A9D8F" />
                    {/* Book */}
                    <rect x="8" y="20" width="8" height="6" fill="#E9C46A" />
                    <rect x="12" y="20" width="1" height="6" fill="#5D4037" />
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
                  <svg className="svg-customer c-drinking" viewBox="0 0 24 32" width="32" height="42" shapeRendering="crispEdges">
                    {/* Head */}
                    <rect x="7" y="6" width="10" height="8" fill="#E0AC9D" />
                    <rect x="6" y="2" width="12" height="4" fill="#E76F51" /> {/* Hat */}
                    <rect x="11" y="0" width="2" height="2" fill="#E76F51" />
                    {/* Eyes */}
                    <rect x="9" y="9" width="1" height="2" fill="#2D1F1D" />
                    <rect x="14" y="9" width="1" height="2" fill="#2D1F1D" />
                    {/* Body */}
                    <rect x="6" y="14" width="12" height="16" fill="#F4A261" />
                    {/* Mug */}
                    <rect x="8" y="20" width="4" height="4" fill="#457B9D" />
                    <rect x="6" y="21" width="2" height="2" fill="#457B9D" />
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
                <svg className="svg-customer c-window" viewBox="0 0 24 32" width="32" height="42" shapeRendering="crispEdges">
                  {/* Head */}
                  <rect x="7" y="6" width="10" height="8" fill="#FFE0B2" />
                  <rect x="6" y="4" width="12" height="3" fill="#4E342E" /> {/* Hair */}
                  {/* Glasses */}
                  <rect x="8" y="8" width="3" height="2" fill="none" stroke="#212121" strokeWidth="1" />
                  <rect x="13" y="8" width="3" height="2" fill="none" stroke="#212121" strokeWidth="1" />
                  <rect x="11" y="9" width="2" height="1" fill="#212121" />
                  {/* Body */}
                  <rect x="6" y="14" width="12" height="16" fill="#1D3557" />
                </svg>
                {activeSpeech?.customerId === 3 && (
                  <div className="speech-bubble">{activeSpeech.text}</div>
                )}
              </div>
            </div>
          )}

          {/* DOG (Shiba Inu from User logo/inspiration!) */}
          {isUnlocked('dog') && (
            <div className="floor-object dog-wrapper">
              <div className="flat-shadow pet-shadow"></div>
              <div className="billboard-object">
                <svg className="svg-dog" viewBox="0 0 24 24" width="46" height="46" shapeRendering="crispEdges">
                  {/* Ears */}
                  <rect x="3" y="3" width="3" height="3" fill="#2D1F1D" />
                  <rect x="4" y="4" width="1" height="2" fill="#E76F51" />
                  <rect x="18" y="3" width="3" height="3" fill="#2D1F1D" />
                  <rect x="19" y="4" width="1" height="2" fill="#E76F51" />
                  {/* Head contour */}
                  <rect x="5" y="6" width="14" height="10" fill="#E76F51" />
                  <rect x="4" y="8" width="16" height="6" fill="#E76F51" />
                  {/* White muzzle */}
                  <rect x="7" y="10" width="10" height="6" fill="#FFFFFF" />
                  {/* Eyes */}
                  <rect x="7" y="8" width="2" height="2" fill="#2D1F1D" />
                  <rect x="15" y="8" width="2" height="2" fill="#2D1F1D" />
                  {/* Nose */}
                  <rect x="11" y="11" width="2" height="2" fill="#2D1F1D" />
                  {/* Mouth / Tongue */}
                  <rect x="10" y="13" width="4" height="2" fill="#2D1F1D" />
                  <rect x="11" y="14" width="2" height="2" fill="#FF8A80" />
                  {/* Body */}
                  <rect x="5" y="16" width="14" height="6" fill="#E76F51" />
                  <rect x="7" y="16" width="10" height="5" fill="#FFFFFF" /> {/* Chest */}
                  {/* Paws */}
                  <rect x="6" y="21" width="3" height="3" fill="#FFFFFF" />
                  <rect x="15" y="21" width="3" height="3" fill="#FFFFFF" />
                  <rect x="6" y="21" width="3" height="1" fill="#2D1F1D" />
                  <rect x="15" y="21" width="3" height="1" fill="#2D1F1D" />
                  {/* Tail */}
                  <rect x="19" y="17" width="3" height="3" fill="#E76F51" className="dog-tail" />
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
