import React, { useState, useEffect } from 'react';
import { 
  X, 
  Smartphone, 
  Monitor, 
  Moon, 
  Sun, 
  Sliders, 
  Bell, 
  Camera, 
  Flashlight, 
  Music, 
  MessageSquare, 
  Globe, 
  Settings, 
  Folder, 
  Terminal, 
  Wifi, 
  BatteryMedium,
  Apple,
  AppWindow
} from 'lucide-react';

export const DeviceSimulatorModal = ({
  wallpaper,
  onClose,
  onOpenStudio
}) => {
  if (!wallpaper) return null;

  // Simulator State
  const isInitiallyPortrait = wallpaper.orientation === 'portrait';
  const [deviceType, setDeviceType] = useState(isInitiallyPortrait ? 'mobile' : 'desktop');
  
  // Mobile specific states
  const [mobileScreenMode, setMobileScreenMode] = useState('lockscreen'); // 'lockscreen' | 'homescreen'
  
  // Desktop specific states
  const [desktopOS, setDesktopOS] = useState('macos'); // 'macos' | 'win11'
  const [showDesktopIcons, setShowDesktopIcons] = useState(true);

  // Common preview adjustments
  const [previewBlur, setPreviewBlur] = useState(0); // 0 to 20px
  const [previewDim, setPreviewDim] = useState(0); // 0 to 50%

  // Real-time Clock for simulator
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatHoursMinutes = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
  };

  const formatFullDate = (date) => {
    return date.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' });
  };

  const imgSource = wallpaper.src.large2x || wallpaper.src.large || wallpaper.src.original;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content" 
        style={{ maxWidth: '960px', padding: 0, overflow: 'hidden' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Toolbar */}
        <div 
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between', 
            padding: '16px 24px', 
            borderBottom: '1px solid var(--border-subtle)',
            background: 'rgba(9, 10, 16, 0.9)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h3 style={{ fontSize: '1.15rem', color: '#ffffff', margin: 0 }}>
              Live Device Simulator
            </h3>
            <span className="glass-pill" style={{ fontSize: '0.75rem' }}>
              {wallpaper.title}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {/* Device Switcher */}
            <div className="orientation-toggle-group">
              <button
                className={`orientation-tab ${deviceType === 'mobile' ? 'active' : ''}`}
                onClick={() => setDeviceType('mobile')}
              >
                <Smartphone size={14} />
                <span>iPhone 16</span>
              </button>
              <button
                className={`orientation-tab ${deviceType === 'desktop' ? 'active' : ''}`}
                onClick={() => setDeviceType('desktop')}
              >
                <Monitor size={14} />
                <span>4K Display</span>
              </button>
            </div>

            <button className="modal-close-btn" style={{ position: 'static' }} onClick={onClose}>
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Simulator Workspace */}
        <div className="simulator-container">
          {/* Sub Controls Toolbar */}
          <div className="simulator-toolbar">
            {deviceType === 'mobile' ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Screen Mode:</span>
                <div className="orientation-toggle-group">
                  <button
                    className={`orientation-tab ${mobileScreenMode === 'lockscreen' ? 'active' : ''}`}
                    onClick={() => setMobileScreenMode('lockscreen')}
                  >
                    Lock Screen
                  </button>
                  <button
                    className={`orientation-tab ${mobileScreenMode === 'homescreen' ? 'active' : ''}`}
                    onClick={() => setMobileScreenMode('homescreen')}
                  >
                    Home Screen Apps
                  </button>
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Desktop OS:</span>
                <div className="orientation-toggle-group">
                  <button
                    className={`orientation-tab ${desktopOS === 'macos' ? 'active' : ''}`}
                    onClick={() => setDesktopOS('macos')}
                  >
                    macOS Glass
                  </button>
                  <button
                    className={`orientation-tab ${desktopOS === 'win11' ? 'active' : ''}`}
                    onClick={() => setDesktopOS('win11')}
                  >
                    Windows 11
                  </button>
                </div>
                <button
                  className="btn-secondary"
                  onClick={() => setShowDesktopIcons(!showDesktopIcons)}
                  style={{ padding: '4px 10px', fontSize: '0.78rem' }}
                >
                  {showDesktopIcons ? 'Hide Desktop Icons' : 'Show Desktop Icons'}
                </button>
              </div>
            )}

            {/* Live Backdrop Blur & Dimming Sliders */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Blur:</span>
                <input
                  type="range"
                  min="0"
                  max="16"
                  value={previewBlur}
                  onChange={(e) => setPreviewBlur(Number(e.target.value))}
                  className="custom-range"
                  style={{ width: '80px' }}
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Dim:</span>
                <input
                  type="range"
                  min="0"
                  max="50"
                  value={previewDim}
                  onChange={(e) => setPreviewDim(Number(e.target.value))}
                  className="custom-range"
                  style={{ width: '80px' }}
                />
              </div>
            </div>
          </div>

          {/* ================= DEVICE DISPLAY ================= */}
          {deviceType === 'mobile' ? (
            /* PHONE MOCKUP */
            <div className="phone-mockup-chassis">
              <div className="phone-screen">
                {/* Dynamic Island */}
                <div className="dynamic-island">
                  <div className="island-camera" />
                  <div className="island-sensor" />
                </div>

                {/* Wallpaper Image */}
                <img
                  src={imgSource}
                  alt={wallpaper.title}
                  className="phone-wallpaper-bg"
                  style={{
                    filter: `blur(${previewBlur}px) brightness(${100 - previewDim}%)`,
                    transform: previewBlur > 0 ? 'scale(1.08)' : 'scale(1)'
                  }}
                />

                {/* Mobile UI Overlay */}
                {mobileScreenMode === 'lockscreen' ? (
                  <div className="lockscreen-overlay">
                    {/* Top Time */}
                    <div className="lock-time-box">
                      <div className="lock-date">{formatFullDate(currentTime)}</div>
                      <div className="lock-time">{formatHoursMinutes(currentTime)}</div>
                      <div className="lock-widgets-row">
                        <div className="lock-widget-pill">
                          <Sun size={12} color="#f59e0b" />
                          <span>72° Sunny</span>
                        </div>
                        <div className="lock-widget-pill">
                          <BatteryMedium size={12} color="#10b981" />
                          <span>98%</span>
                        </div>
                      </div>
                    </div>

                    {/* Notification Banner */}
                    <div className="lock-notification">
                      <div className="notif-header">
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Bell size={11} color="var(--primary)" />
                          <strong>Lumina Wallpapers</strong>
                        </span>
                        <span>Just now</span>
                      </div>
                      <div className="notif-title">Wallpaper Preview Active</div>
                      <div className="notif-body">Looking gorgeous on your Super Retina screen!</div>
                    </div>

                    {/* Bottom Flashlight & Camera & Home Bar */}
                    <div>
                      <div className="lock-bottom-row">
                        <div className="lock-quick-btn">
                          <Flashlight size={18} />
                        </div>
                        <div className="lock-quick-btn">
                          <Camera size={18} />
                        </div>
                      </div>
                      <div className="home-indicator-bar" />
                    </div>
                  </div>
                ) : (
                  /* Homescreen App Grid */
                  <div className="homescreen-overlay">
                    <div className="homescreen-grid">
                      <div className="app-icon-item">
                        <div className="app-icon-box" style={{ background: '#22c55e' }}>
                          <MessageSquare size={24} />
                        </div>
                        <span className="app-icon-label">Messages</span>
                      </div>
                      <div className="app-icon-item">
                        <div className="app-icon-box" style={{ background: '#3b82f6' }}>
                          <Globe size={24} />
                        </div>
                        <span className="app-icon-label">Safari</span>
                      </div>
                      <div className="app-icon-item">
                        <div className="app-icon-box" style={{ background: '#ec4899' }}>
                          <Music size={24} />
                        </div>
                        <span className="app-icon-label">Music</span>
                      </div>
                      <div className="app-icon-item">
                        <div className="app-icon-box" style={{ background: '#8b5cf6' }}>
                          <Camera size={24} />
                        </div>
                        <span className="app-icon-label">Photos</span>
                      </div>
                      <div className="app-icon-item">
                        <div className="app-icon-box" style={{ background: '#64748b' }}>
                          <Settings size={24} />
                        </div>
                        <span className="app-icon-label">Settings</span>
                      </div>
                      <div className="app-icon-item">
                        <div className="app-icon-box" style={{ background: '#06b6d4' }}>
                          <AppWindow size={24} />
                        </div>
                        <span className="app-icon-label">App Store</span>
                      </div>
                      <div className="app-icon-item">
                        <div className="app-icon-box" style={{ background: '#eab308' }}>
                          <Folder size={24} />
                        </div>
                        <span className="app-icon-label">Files</span>
                      </div>
                      <div className="app-icon-item">
                        <div className="app-icon-box" style={{ background: '#18181b' }}>
                          <Terminal size={24} />
                        </div>
                        <span className="app-icon-label">Terminal</span>
                      </div>
                    </div>

                    {/* Bottom Dock */}
                    <div>
                      <div className="phone-dock">
                        <div className="app-icon-box" style={{ width: '42px', height: '42px', background: '#22c55e' }}>
                          <MessageSquare size={20} />
                        </div>
                        <div className="app-icon-box" style={{ width: '42px', height: '42px', background: '#3b82f6' }}>
                          <Globe size={20} />
                        </div>
                        <div className="app-icon-box" style={{ width: '42px', height: '42px', background: '#ec4899' }}>
                          <Music size={20} />
                        </div>
                        <div className="app-icon-box" style={{ width: '42px', height: '42px', background: '#8b5cf6' }}>
                          <Camera size={20} />
                        </div>
                      </div>
                      <div className="home-indicator-bar" />
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* DESKTOP MONITOR MOCKUP */
            <div className="desktop-mockup-wrapper">
              <div className="desktop-monitor-frame">
                <div className="desktop-screen">
                  {/* Wallpaper */}
                  <img
                    src={imgSource}
                    alt={wallpaper.title}
                    style={{
                      position: 'absolute',
                      inset: 0,
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      filter: `blur(${previewBlur}px) brightness(${100 - previewDim}%)`,
                      transform: previewBlur > 0 ? 'scale(1.04)' : 'scale(1)'
                    }}
                  />

                  {/* macOS Mode */}
                  {desktopOS === 'macos' ? (
                    <>
                      {/* Top Bar */}
                      <div className="macos-menubar">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                          <Apple size={13} fill="#fff" />
                          <strong style={{ fontWeight: 700 }}>Finder</strong>
                          <span>File</span>
                          <span>Edit</span>
                          <span>View</span>
                          <span>Go</span>
                          <span>Window</span>
                          <span>Help</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <BatteryMedium size={13} />
                          <Wifi size={13} />
                          <span>{formatHoursMinutes(currentTime)}</span>
                        </div>
                      </div>

                      {/* Desktop Icons */}
                      {showDesktopIcons && (
                        <div style={{ position: 'absolute', top: '40px', right: '20px', display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center' }}>
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
                            <div style={{ width: '38px', height: '38px', borderRadius: '8px', background: 'rgba(59, 130, 246, 0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                              <Folder size={20} />
                            </div>
                            <span style={{ fontSize: '0.68rem', color: '#fff', textShadow: '0 1px 4px #000' }}>Projects</span>
                          </div>
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
                            <div style={{ width: '38px', height: '38px', borderRadius: '8px', background: 'rgba(24, 24, 27, 0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                              <Terminal size={20} />
                            </div>
                            <span style={{ fontSize: '0.68rem', color: '#fff', textShadow: '0 1px 4px #000' }}>Code</span>
                          </div>
                        </div>
                      )}

                      {/* Bottom Floating Dock */}
                      <div className="macos-dock">
                        <div className="dock-icon" style={{ background: '#3b82f6' }}>
                          <Globe size={18} />
                        </div>
                        <div className="dock-icon" style={{ background: '#22c55e' }}>
                          <MessageSquare size={18} />
                        </div>
                        <div className="dock-icon" style={{ background: '#ec4899' }}>
                          <Music size={18} />
                        </div>
                        <div className="dock-icon" style={{ background: '#8b5cf6' }}>
                          <Camera size={18} />
                        </div>
                        <div className="dock-icon" style={{ background: '#18181b' }}>
                          <Terminal size={18} />
                        </div>
                        <div className="dock-icon" style={{ background: '#64748b' }}>
                          <Settings size={18} />
                        </div>
                      </div>
                    </>
                  ) : (
                    /* Windows 11 Mode */
                    <>
                      {/* Desktop Icons */}
                      {showDesktopIcons && (
                        <div style={{ position: 'absolute', top: '20px', left: '20px', display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center' }}>
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
                            <div style={{ width: '36px', height: '36px', borderRadius: '6px', background: 'rgba(59, 130, 246, 0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                              <Folder size={18} />
                            </div>
                            <span style={{ fontSize: '0.68rem', color: '#fff', textShadow: '0 1px 4px #000' }}>This PC</span>
                          </div>
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
                            <div style={{ width: '36px', height: '36px', borderRadius: '6px', background: 'rgba(6, 182, 212, 0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                              <Globe size={18} />
                            </div>
                            <span style={{ fontSize: '0.68rem', color: '#fff', textShadow: '0 1px 4px #000' }}>Browser</span>
                          </div>
                        </div>
                      )}

                      {/* Windows 11 Centered Taskbar */}
                      <div className="win11-taskbar">
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                          ⛅ 72° F
                        </div>

                        <div className="win11-center-icons">
                          <div className="win-icon" style={{ background: '#0078d4' }}>
                            <AppWindow size={16} />
                          </div>
                          <div className="win-icon" style={{ background: '#2563eb' }}>
                            <Globe size={16} />
                          </div>
                          <div className="win-icon" style={{ background: '#e11d48' }}>
                            <Folder size={16} />
                          </div>
                          <div className="win-icon" style={{ background: '#10b981' }}>
                            <Terminal size={16} />
                          </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.72rem', color: '#ffffff' }}>
                          <Wifi size={13} />
                          <BatteryMedium size={13} />
                          <span>{formatHoursMinutes(currentTime)}</span>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Monitor Stand Base */}
              <div className="desktop-monitor-stand" />
              <div className="desktop-monitor-base" />
            </div>
          )}

          {/* Bottom Action Footer */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginTop: '24px' }}>
            <button
              className="btn-secondary"
              onClick={() => {
                onClose();
                onOpenStudio(wallpaper);
              }}
            >
              <Sliders size={16} />
              <span>Fine-Tune in Wallpaper Studio</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
