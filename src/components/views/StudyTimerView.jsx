import React, { useState, useEffect, useRef } from 'react';

export default function StudyTimerView() {
    const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 mins
    const [isActive, setIsActive] = useState(false);
    const [mode, setMode] = useState('pomodoro'); // pomodoro, shortBreak, longBreak

    const [customHours, setCustomHours] = useState(1);
    const [customMins, setCustomMins] = useState(0);
    const [customSecs, setCustomSecs] = useState(0);

    const [isRinging, setIsRinging] = useState(false);
    const audioIntervalRef = useRef(null);
    const audioCtxRef = useRef(null);

    const playAlarm = () => {
        try {
            if (!audioCtxRef.current) {
                audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
            }
            const audioCtx = audioCtxRef.current;

            const playChime = () => {
                for (let i = 0; i < 3; i++) {
                    const oscillator = audioCtx.createOscillator();
                    const gainNode = audioCtx.createGain();

                    oscillator.type = 'sine';
                    oscillator.frequency.setValueAtTime(800, audioCtx.currentTime + i * 0.4); // 800Hz beep

                    gainNode.gain.setValueAtTime(0.5, audioCtx.currentTime + i * 0.4);
                    gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + i * 0.4 + 0.2); // fade out quickly

                    oscillator.connect(gainNode);
                    gainNode.connect(audioCtx.destination);

                    oscillator.start(audioCtx.currentTime + i * 0.4);
                    oscillator.stop(audioCtx.currentTime + i * 0.4 + 0.2);
                }
            };

            // Play immediately, then loop
            playChime();
            audioIntervalRef.current = setInterval(playChime, 3000);
            setIsRinging(true);
        } catch (e) {
            console.error("Audio playback failed", e);
        }
    };

    const stopAlarm = () => {
        if (audioIntervalRef.current) {
            clearInterval(audioIntervalRef.current);
            audioIntervalRef.current = null;
        }
        setIsRinging(false);
        // Reset timer based on current mode
        if (mode === 'pomodoro') setTimeLeft(25 * 60);
        else if (mode === 'shortBreak') setTimeLeft(5 * 60);
        else if (mode === 'longBreak') setTimeLeft(15 * 60);
        else setTimeLeft((customHours * 3600) + (customMins * 60) + customSecs);
    };

    useEffect(() => {
        let interval = null;
        if (isActive && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft(time => time - 1);
            }, 1000);
        } else if (isActive && timeLeft === 0) {
            setIsActive(false);
            playAlarm();
        }
        return () => clearInterval(interval);
    }, [isActive, timeLeft]);

    const toggleTimer = () => setIsActive(!isActive);

    const setTimerMode = (newMode, seconds) => {
        setMode(newMode);
        setIsActive(false);
        setTimeLeft(seconds);
    };

    const formatTime = (totalSeconds) => {
        const h = Math.floor(totalSeconds / 3600);
        const m = Math.floor((totalSeconds % 3600) / 60);
        const s = totalSeconds % 60;

        if (h > 0) {
            return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
        }
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    return (
        <div className="view-container timer-container" style={{ padding: '32px', maxWidth: 600, margin: '0 auto', textAlign: 'center' }}>
            <div className="panel-header" style={{ marginBottom: 40, justifyContent: 'center' }}>
                <h2>Study Timer</h2>
            </div>

            <div className="timer-card" style={{ background: 'rgba(20,20,35,0.8)', padding: 48, borderRadius: 32, border: '1px solid rgba(139, 92, 246, 0.2)', boxShadow: '0 20px 40px rgba(0,0,0,0.4)' }}>

                <div className="timer-btn-group" style={{ display: 'flex', justifyContent: 'center', gap: 16, marginBottom: 48, flexWrap: 'wrap' }}>
                    <button
                        className={`btn ${mode === 'pomodoro' ? 'btn-primary' : 'btn-ghost'}`}
                        onClick={() => setTimerMode('pomodoro', 25 * 60)}
                        style={{ borderRadius: 999, padding: '8px 24px' }}
                    >Pomodoro</button>
                    <button
                        className={`btn ${mode === 'shortBreak' ? 'btn-primary' : 'btn-ghost'}`}
                        onClick={() => setTimerMode('shortBreak', 5 * 60)}
                        style={{ borderRadius: 999, padding: '8px 24px' }}
                    >Short Break</button>
                    <button
                        className={`btn ${mode === 'longBreak' ? 'btn-primary' : 'btn-ghost'}`}
                        onClick={() => setTimerMode('longBreak', 15 * 60)}
                        style={{ borderRadius: 999, padding: '8px 24px' }}
                    >Long Break</button>
                    <button
                        className={`btn ${mode === 'custom' ? 'btn-primary' : 'btn-ghost'}`}
                        onClick={() => setTimerMode('custom', (customHours * 3600) + (customMins * 60) + customSecs)}
                        style={{ borderRadius: 999, padding: '8px 24px' }}
                    >Custom</button>
                </div>

                {mode === 'custom' && !isActive && !isRinging && (
                    <div style={{ marginBottom: 40, display: 'flex', flexDirection: 'column', alignItems: 'center', background: 'rgba(0,0,0,0.2)', padding: 24, borderRadius: 24, border: '1px solid rgba(255,255,255,0.05)' }}>
                        <span style={{ color: 'var(--text-muted)', marginBottom: 16, fontSize: 13, textTransform: 'uppercase', letterSpacing: 1.5 }}>Set Custom Time</span>

                        <div className="custom-time-inputs" style={{ display: 'flex', gap: 16, alignItems: 'flex-end', justifyContent: 'center', flexWrap: 'wrap' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                                <input
                                    type="number" min="0" max="99" value={customHours}
                                    onChange={(e) => {
                                        const val = parseInt(e.target.value) || 0;
                                        setCustomHours(val);
                                        setTimeLeft((val * 3600) + (customMins * 60) + customSecs);
                                    }}
                                    style={{ background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid rgba(139, 92, 246, 0.4)', borderRadius: 12, padding: '12px 0', width: 70, textAlign: 'center', fontSize: 24, fontWeight: 700, outline: 'none', transition: 'all 0.2s ease' }}
                                />
                                <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>HRS</span>
                            </div>

                            <span style={{ fontSize: 24, fontWeight: 700, color: 'var(--text-muted)', paddingBottom: 28 }}>:</span>

                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                                <input
                                    type="number" min="0" max="59" value={customMins}
                                    onChange={(e) => {
                                        const val = parseInt(e.target.value) || 0;
                                        setCustomMins(val);
                                        setTimeLeft((customHours * 3600) + (val * 60) + customSecs);
                                    }}
                                    style={{ background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid rgba(139, 92, 246, 0.4)', borderRadius: 12, padding: '12px 0', width: 70, textAlign: 'center', fontSize: 24, fontWeight: 700, outline: 'none', transition: 'all 0.2s ease' }}
                                />
                                <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>MIN</span>
                            </div>

                            <span style={{ fontSize: 24, fontWeight: 700, color: 'var(--text-muted)', paddingBottom: 28 }}>:</span>

                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                                <input
                                    type="number" min="0" max="59" value={customSecs}
                                    onChange={(e) => {
                                        const val = parseInt(e.target.value) || 0;
                                        setCustomSecs(val);
                                        setTimeLeft((customHours * 3600) + (customMins * 60) + val);
                                    }}
                                    style={{ background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid rgba(139, 92, 246, 0.4)', borderRadius: 12, padding: '12px 0', width: 70, textAlign: 'center', fontSize: 24, fontWeight: 700, outline: 'none', transition: 'all 0.2s ease' }}
                                />
                                <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>SEC</span>
                            </div>
                        </div>
                    </div>
                )}

                <div className="timer-display" style={{
                    fontSize: 120,
                    fontWeight: 900,
                    lineHeight: 1,
                    color: timeLeft === 0 ? '#10b981' : '#fff',
                    textShadow: timeLeft === 0 ? '0 0 40px rgba(16, 185, 129, 0.6)' : '0 0 30px rgba(139, 92, 246, 0.4)',
                    margin: mode === 'custom' && !isActive ? '0 0 48px 0' : '0 0 48px 0',
                    fontVariantNumeric: 'tabular-nums',
                    transition: 'all 0.3s ease'
                }}>
                    {formatTime(timeLeft)}
                </div>

                <div className="timer-action-controls" style={{ display: 'flex', justifyContent: 'center', gap: 24, flexWrap: 'wrap' }}>
                    {isRinging ? (
                        <button
                            onClick={stopAlarm}
                            className="btn btn-primary btn-glow"
                            style={{
                                background: '#10b981',
                                border: 'none',
                                padding: '16px 48px',
                                borderRadius: 999,
                                fontSize: 20,
                                fontWeight: 800,
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                                textTransform: 'uppercase',
                                color: '#fff',
                                letterSpacing: 2,
                                boxShadow: '0 0 30px rgba(16, 185, 129, 0.4)'
                            }}>
                            Stop Alarm
                        </button>
                    ) : (
                        <button
                            onClick={toggleTimer}
                            style={{
                                background: isActive ? 'rgba(244, 63, 94, 0.2)' : 'var(--accent-gradient)',
                                color: isActive ? '#f43f5e' : '#fff',
                                border: isActive ? '1px solid #f43f5e' : 'none',
                                padding: '16px 48px',
                                borderRadius: 999,
                                fontSize: 20,
                                fontWeight: 800,
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                                textTransform: 'uppercase',
                                letterSpacing: 2,
                                boxShadow: isActive ? 'none' : '0 10px 20px rgba(139, 92, 246, 0.3)'
                            }}>
                            {isActive ? 'Pause' : 'Start Focus'}
                        </button>
                    )}
                </div>

            </div>
        </div>
    );
}
