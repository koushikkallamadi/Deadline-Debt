import React, { useState } from 'react';

export default function SettingsView() {
    const [theme, setTheme] = useState('dark');
    const [notifications, setNotifications] = useState(true);

    return (
        <div className="view-container" style={{ padding: '32px', maxWidth: 800, margin: '0 auto' }}>
            <div className="panel-header" style={{ marginBottom: 40 }}>
                <h2>Settings</h2>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.02)', padding: 32, borderRadius: 24, border: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', gap: 32 }}>

                {/* Appearance Section */}
                <section>
                    <h3 style={{ fontSize: 18, color: '#fff', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span>🎨</span> Appearance
                    </h3>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                        <div>
                            <div style={{ fontWeight: 600, color: '#fff' }}>Theme Mode</div>
                            <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 4 }}>Toggle between light and dark modes (Currently locked to Dark)</div>
                        </div>

                        <select
                            className="custom-select"
                            style={{ width: 140 }}
                            value={theme}
                            onChange={(e) => setTheme(e.target.value)}
                        >
                            <option value="dark">Dark Theme</option>
                            <option value="light" disabled>Light Theme</option>
                        </select>
                    </div>
                </section>

                {/* Preferences Section */}
                <section>
                    <h3 style={{ fontSize: 18, color: '#fff', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span>🔔</span> Preferences
                    </h3>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                        <div>
                            <div style={{ fontWeight: 600, color: '#fff' }}>Email Notifications</div>
                            <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 4 }}>Receive reminders for overdue tasks</div>
                        </div>

                        <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', background: notifications ? 'var(--accent-gradient)' : 'rgba(255,255,255,0.1)', padding: '4px', borderRadius: 999, width: 48, transition: 'all 0.3s ease' }}>
                            <input
                                type="checkbox"
                                checked={notifications}
                                onChange={() => setNotifications(!notifications)}
                                style={{ display: 'none' }}
                            />
                            <div style={{ width: 20, height: 20, background: '#fff', borderRadius: '50%', transform: notifications ? 'translateX(20px)' : 'translateX(0)', transition: 'transform 0.3s ease', boxShadow: '0 2px 5px rgba(0,0,0,0.2)' }} />
                        </label>
                    </div>
                </section>

            </div>
        </div>
    );
}
