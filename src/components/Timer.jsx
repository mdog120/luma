import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Award, Coffee, AlertTriangle, ChevronDown } from 'lucide-react';

const FOCUS_DURATIONS = [
  { value: 25, label: '25 Min (Standard)' },
  { value: 45, label: '45 Min (Deep Study)' },
  { value: 60, label: '60 Min (Power Focus)' },
  { value: 90, label: '90 Min (Double session)' },
  { value: 120, label: '120 Min (Hyper Focus)' },
  { value: 180, label: '180 Min (Half Day Focus)' },
  { value: 240, label: '240 Min (Full Café Shift)' },
];

const BREAK_DURATIONS = [
  { value: 5, label: '5 Min (Short Break)' },
  { value: 10, label: '10 Min (Coffee Refill)' },
  { value: 15, label: '15 Min (Long Break)' },
  { value: 30, label: '30 Min (Lunch Break)' },
];

export default function Timer({ 
  onSessionComplete, 
  onSessionGiveUp, 
  isTimerRunning, 
  setIsTimerRunning,
  elapsedTime,
  setElapsedTime,
  isBreak,
  setIsBreak
}) {
  const [duration, setDuration] = useState(25); // minutes
  const [timeLeft, setTimeLeft] = useState(25 * 60); // seconds
  const [showConfirmGiveUp, setShowConfirmGiveUp] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  
  const timerRef = useRef(null);

  // Sync timeLeft when duration or break mode changes (only if timer is not active)
  useEffect(() => {
    if (!isTimerRunning) {
      setTimeLeft(duration * 60);
      setElapsedTime(0);
    }
  }, [duration, isBreak]);

  // Main Timer Countdown loop
  useEffect(() => {
    if (isTimerRunning) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            handleTimerComplete();
            return 0;
          }
          // Increment elapsed time
          setElapsedTime(e => e + 1);
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }

    return () => clearInterval(timerRef.current);
  }, [isTimerRunning]);

  const handleStartPause = () => {
    setIsTimerRunning(!isTimerRunning);
    setShowConfirmGiveUp(false);
  };

  const handleTimerComplete = () => {
    setIsTimerRunning(false);
    onSessionComplete({
      duration: duration,
      isBreak: isBreak
    });

    // Automatically suggest transition
    if (!isBreak) {
      // Suggest break
      setIsBreak(true);
      setDuration(5);
      setTimeLeft(5 * 60);
    } else {
      // Suggest focus
      setIsBreak(false);
      setDuration(25);
      setTimeLeft(25 * 60);
    }
    setElapsedTime(0);
  };

  const triggerGiveUp = () => {
    if (isTimerRunning) {
      setShowConfirmGiveUp(true);
    }
  };

  const confirmGiveUp = () => {
    setIsTimerRunning(false);
    setShowConfirmGiveUp(false);
    onSessionGiveUp(duration - Math.ceil(timeLeft / 60)); // pass the minutes spent
    
    // Reset timer
    setTimeLeft(duration * 60);
    setElapsedTime(0);
  };

  const cancelGiveUp = () => {
    setShowConfirmGiveUp(false);
  };

  const selectDuration = (minutes) => {
    setDuration(minutes);
    setTimeLeft(minutes * 60);
    setElapsedTime(0);
    setShowMenu(false);
  };

  const toggleMode = () => {
    if (isTimerRunning) {
      triggerGiveUp();
      return;
    }
    const newIsBreak = !isBreak;
    setIsBreak(newIsBreak);
    const defaultDur = newIsBreak ? 5 : 25;
    setDuration(defaultDur);
    setTimeLeft(defaultDur * 60);
    setElapsedTime(0);
  };

  // Format digital clock text
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Circle radial stroke calculations
  const totalSeconds = duration * 60;
  const percentage = totalSeconds > 0 ? (timeLeft / totalSeconds) : 0;
  const strokeRadius = 110;
  const strokeCircumference = 2 * Math.PI * strokeRadius;
  const strokeOffset = strokeCircumference - (percentage * strokeCircumference);

  return (
    <div className={`timer-card ${isBreak ? 'mode-break' : 'mode-focus'}`}>
      <div className="timer-mode-switcher">
        <button 
          className={`mode-btn ${!isBreak ? 'active' : ''}`}
          onClick={() => isBreak && toggleMode()}
          disabled={isTimerRunning}
        >
          Study Focus
        </button>
        <button 
          className={`mode-btn ${isBreak ? 'active' : ''}`}
          onClick={() => !isBreak && toggleMode()}
          disabled={isTimerRunning}
        >
          Take a Break
        </button>
      </div>

      {/* Radial Progress Ring */}
      <div className="radial-timer-container">
        <svg width="250" height="250" className="radial-timer-svg">
          <circle
            className="radial-circle-bg"
            cx="125"
            cy="125"
            r={strokeRadius}
            strokeWidth="8"
          />
          <circle
            className="radial-circle-progress"
            cx="125"
            cy="125"
            r={strokeRadius}
            strokeWidth="10"
            strokeDasharray={strokeCircumference}
            strokeDashoffset={strokeOffset}
            strokeLinecap="round"
          />
        </svg>

        <div className="radial-timer-content">
          <span className="timer-countdown">{formatTime(timeLeft)}</span>
          <span className="timer-status-text">
            {isTimerRunning ? (isBreak ? 'Relaxing...' : 'Focused studying') : 'Ready'}
          </span>
        </div>
      </div>

      {/* Custom Dropdown Selector */}
      <div className="duration-selector-container">
        <button 
          className="duration-dropdown-toggle"
          disabled={isTimerRunning}
          onClick={() => setShowMenu(!showMenu)}
        >
          <span>{isBreak ? BREAK_DURATIONS.find(d => d.value === duration)?.label : FOCUS_DURATIONS.find(d => d.value === duration)?.label}</span>
          <ChevronDown size={16} />
        </button>

        {showMenu && (
          <div className="duration-dropdown-menu">
            {(isBreak ? BREAK_DURATIONS : FOCUS_DURATIONS).map(opt => (
              <button
                key={opt.value}
                className={`duration-option ${duration === opt.value ? 'selected' : ''}`}
                onClick={() => selectDuration(opt.value)}
              >
                {opt.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Action Controls */}
      <div className="timer-controls">
        {isTimerRunning && !isBreak && (
          <button className="timer-control-btn give-up" onClick={triggerGiveUp}>
            <RotateCcw size={18} />
            <span>Give Up</span>
          </button>
        )}

        <button 
          className={`timer-control-btn play-pause ${isTimerRunning ? 'active' : ''}`} 
          onClick={handleStartPause}
        >
          {isTimerRunning ? <Pause size={22} /> : <Play size={22} />}
          <span>{isTimerRunning ? 'Pause' : 'Start Focus'}</span>
        </button>
      </div>

      {/* Give Up Modal / Warning */}
      {showConfirmGiveUp && (
        <div className="give-up-overlay">
          <div className="give-up-modal">
            <AlertTriangle className="give-up-icon" size={36} />
            <h3>Leaving early?</h3>
            <p>If you give up now, your customers will leave, your ambient music will pause, and you will lose progress towards café upgrades.</p>
            <div className="give-up-actions">
              <button className="modal-btn resume" onClick={cancelGiveUp}>
                Stay Focused
              </button>
              <button className="modal-btn quit" onClick={confirmGiveUp}>
                Abandon Café
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
