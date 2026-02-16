/**
 * Accessibility Modes Component
 * Provides WCAG AAA, ADHD, Dyslexic, Neuro, and ECO CODE modes
 * Shared across all Blue Ocean apps
 */

import React, { createContext, useContext, useState, useEffect } from 'react';

export type AccessibilityMode = 'default' | 'wcag-aaa' | 'adhd' | 'dyslexic' | 'neuro' | 'eco-code';

interface AccessibilitySettings {
  mode: AccessibilityMode;
  fontSize: number;
  lineHeight: number;
  letterSpacing: number;
  fontFamily: string;
  highContrast: boolean;
  reduceMotion: boolean;
  focusIndicators: boolean;
  simplifiedLayout: boolean;
  dyslexicFont: boolean;
  adhd_breaks: boolean;
  adhd_focus_mode: boolean;
  neuro_sensory_safe: boolean;
  eco_mode: boolean;
}

interface AccessibilityContextType {
  settings: AccessibilitySettings;
  setMode: (mode: AccessibilityMode) => void;
  updateSettings: (settings: Partial<AccessibilitySettings>) => void;
  resetToDefault: () => void;
}

const defaultSettings: AccessibilitySettings = {
  mode: 'default',
  fontSize: 16,
  lineHeight: 1.5,
  letterSpacing: 0,
  fontFamily: 'system-ui, -apple-system, sans-serif',
  highContrast: false,
  reduceMotion: false,
  focusIndicators: false,
  simplifiedLayout: false,
  dyslexicFont: false,
  adhd_breaks: false,
  adhd_focus_mode: false,
  neuro_sensory_safe: false,
  eco_mode: false,
};

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export const AccessibilityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<AccessibilitySettings>(defaultSettings);

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('accessibility-settings');
    if (saved) {
      try {
        setSettings(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to load accessibility settings', e);
      }
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('accessibility-settings', JSON.stringify(settings));
  }, [settings]);

  const setMode = (mode: AccessibilityMode) => {
    const modeSettings: Record<AccessibilityMode, Partial<AccessibilitySettings>> = {
      default: {
        mode: 'default',
        fontSize: 16,
        lineHeight: 1.5,
        letterSpacing: 0,
        fontFamily: 'system-ui, -apple-system, sans-serif',
        highContrast: false,
        reduceMotion: false,
        focusIndicators: false,
        simplifiedLayout: false,
        dyslexicFont: false,
        adhd_breaks: false,
        adhd_focus_mode: false,
        neuro_sensory_safe: false,
        eco_mode: false,
      },
      'wcag-aaa': {
        mode: 'wcag-aaa',
        fontSize: 18,
        lineHeight: 1.8,
        letterSpacing: 0.15,
        fontFamily: 'system-ui, -apple-system, sans-serif',
        highContrast: true,
        reduceMotion: true,
        focusIndicators: true,
        simplifiedLayout: false,
        dyslexicFont: false,
        adhd_breaks: false,
        adhd_focus_mode: false,
        neuro_sensory_safe: false,
        eco_mode: false,
      },
      adhd: {
        mode: 'adhd',
        fontSize: 17,
        lineHeight: 1.7,
        letterSpacing: 0.1,
        fontFamily: 'system-ui, -apple-system, sans-serif',
        highContrast: true,
        reduceMotion: true,
        focusIndicators: true,
        simplifiedLayout: true,
        dyslexicFont: false,
        adhd_breaks: true,
        adhd_focus_mode: true,
        neuro_sensory_safe: true,
        eco_mode: false,
      },
      dyslexic: {
        mode: 'dyslexic',
        fontSize: 18,
        lineHeight: 1.9,
        letterSpacing: 0.2,
        fontFamily: '"OpenDyslexic", "Atkinson Hyperlegible", sans-serif',
        highContrast: true,
        reduceMotion: true,
        focusIndicators: true,
        simplifiedLayout: false,
        dyslexicFont: true,
        adhd_breaks: false,
        adhd_focus_mode: false,
        neuro_sensory_safe: true,
        eco_mode: false,
      },
      neuro: {
        mode: 'neuro',
        fontSize: 17,
        lineHeight: 1.8,
        letterSpacing: 0.12,
        fontFamily: 'system-ui, -apple-system, sans-serif',
        highContrast: true,
        reduceMotion: true,
        focusIndicators: true,
        simplifiedLayout: true,
        dyslexicFont: false,
        adhd_breaks: true,
        adhd_focus_mode: false,
        neuro_sensory_safe: true,
        eco_mode: false,
      },
      'eco-code': {
        mode: 'eco-code',
        fontSize: 14,
        lineHeight: 1.4,
        letterSpacing: 0,
        fontFamily: 'system-ui, -apple-system, sans-serif',
        highContrast: false,
        reduceMotion: true,
        focusIndicators: false,
        simplifiedLayout: false,
        dyslexicFont: false,
        adhd_breaks: false,
        adhd_focus_mode: false,
        neuro_sensory_safe: false,
        eco_mode: true,
      },
    };

    setSettings({ ...defaultSettings, ...modeSettings[mode] });
  };

  const updateSettings = (newSettings: Partial<AccessibilitySettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const resetToDefault = () => {
    setSettings(defaultSettings);
  };

  return (
    <AccessibilityContext.Provider value={{ settings, setMode, updateSettings, resetToDefault }}>
      {children}
    </AccessibilityContext.Provider>
  );
};

export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility must be used within AccessibilityProvider');
  }
  return context;
};

/**
 * Accessibility Styles Hook
 * Returns CSS variables and styles based on current accessibility mode
 */
export const useAccessibilityStyles = () => {
  const { settings } = useAccessibility();

  const styles: React.CSSProperties = {
    fontSize: `${settings.fontSize}px`,
    lineHeight: settings.lineHeight,
    letterSpacing: `${settings.letterSpacing}em`,
    fontFamily: settings.fontFamily,
    color: settings.highContrast ? '#000' : 'inherit',
    backgroundColor: settings.highContrast ? '#fff' : 'inherit',
  };

  const cssVariables = {
    '--font-size': `${settings.fontSize}px`,
    '--line-height': settings.lineHeight,
    '--letter-spacing': `${settings.letterSpacing}em`,
    '--font-family': settings.fontFamily,
    '--focus-outline': settings.focusIndicators ? '3px solid #4A90E2' : 'none',
    '--motion': settings.reduceMotion ? 'none' : 'auto',
    '--high-contrast': settings.highContrast ? '1' : '0',
  } as React.CSSProperties;

  return { styles, cssVariables };
};

/**
 * Accessibility Controls Component
 * Dropdown menu for selecting accessibility modes
 */
export const AccessibilityControls: React.FC = () => {
  const { settings, setMode } = useAccessibility();

  return (
    <div className="accessibility-controls" role="region" aria-label="Accessibility Options">
      <label htmlFor="accessibility-mode">Accessibility Mode:</label>
      <select
        id="accessibility-mode"
        value={settings.mode}
        onChange={e => setMode(e.target.value as AccessibilityMode)}
        aria-label="Select accessibility mode"
      >
        <option value="default">Default</option>
        <option value="wcag-aaa">WCAG AAA (High Contrast & Large Text)</option>
        <option value="adhd">ADHD Mode (Focus & Simplified)</option>
        <option value="dyslexic">Dyslexic Mode (Special Font & Spacing)</option>
        <option value="neuro">Neuro Mode (Sensory Safe)</option>
        <option value="eco-code">ECO CODE (Low Power Mode)</option>
      </select>

      <style jsx>{`
        .accessibility-controls {
          padding: 1rem;
          background: #f5f5f5;
          border-radius: 8px;
          margin: 1rem 0;
        }

        .accessibility-controls label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 600;
        }

        .accessibility-controls select {
          width: 100%;
          padding: 0.75rem;
          font-size: 1rem;
          border: 2px solid #ccc;
          border-radius: 4px;
          cursor: pointer;
        }

        .accessibility-controls select:focus {
          outline: 3px solid #4A90E2;
          outline-offset: 2px;
        }
      `}</style>
    </div>
  );
};

/**
 * ADHD Focus Mode Component
 * Provides timed breaks and focus sessions
 */
export const ADHDFocusMode: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { settings } = useAccessibility();
  const [focusTime, setFocusTime] = useState(25); // Pomodoro timer
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (!settings.adhd_focus_mode || !isActive) return;

    const interval = setInterval(() => {
      setFocusTime(prev => {
        if (prev <= 1) {
          setIsActive(false);
          // Play subtle notification
          const audio = new AudioContext();
          const osc = audio.createOscillator();
          osc.frequency.value = 800;
          osc.connect(audio.destination);
          osc.start();
          osc.stop(audio.currentTime + 0.1);
          return 25;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive, settings.adhd_focus_mode]);

  if (!settings.adhd_focus_mode) return <>{children}</>;

  return (
    <div className="adhd-focus-mode">
      <div className="focus-timer">
        <p>Focus Time: {focusTime}m</p>
        <button onClick={() => setIsActive(!isActive)}>
          {isActive ? 'Pause' : 'Start'} Focus Session
        </button>
      </div>
      {children}
      <style jsx>{`
        .adhd-focus-mode {
          position: relative;
        }

        .focus-timer {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 1.5rem;
          border-radius: 8px;
          margin-bottom: 1.5rem;
          text-align: center;
        }

        .focus-timer p {
          margin: 0 0 1rem 0;
          font-size: 1.5rem;
          font-weight: bold;
        }

        .focus-timer button {
          background: white;
          color: #667eea;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 4px;
          font-weight: 600;
          cursor: pointer;
          transition: transform 0.2s;
        }

        .focus-timer button:hover {
          transform: scale(1.05);
        }

        .focus-timer button:focus {
          outline: 3px solid #4A90E2;
          outline-offset: 2px;
        }
      `}</style>
    </div>
  );
};

/**
 * Dyslexic-Friendly Text Component
 */
export const DyslexicText: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { settings } = useAccessibility();

  if (!settings.dyslexicFont) return <>{children}</>;

  return (
    <span style={{ fontFamily: '"OpenDyslexic", "Atkinson Hyperlegible", sans-serif' }}>
      {children}
    </span>
  );
};

/**
 * Sensory-Safe Container
 * Removes animations, reduces colors, increases contrast
 */
export const SensorySafeContainer: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { settings } = useAccessibility();

  if (!settings.neuro_sensory_safe) return <>{children}</>;

  return (
    <div className="sensory-safe">
      {children}
      <style jsx>{`
        .sensory-safe * {
          animation: none !important;
          transition: none !important;
        }

        .sensory-safe {
          background: #ffffff;
          color: #000000;
        }
      `}</style>
    </div>
  );
};

/**
 * ECO CODE Mode Wrapper
 * Reduces animations, disables heavy features, optimizes for low power
 */
export const EcoCodeWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { settings } = useAccessibility();

  if (!settings.eco_mode) return <>{children}</>;

  return (
    <div className="eco-code">
      {children}
      <style jsx>{`
        .eco-code {
          --color-scheme: light;
        }

        .eco-code * {
          animation: none !important;
          transition: none !important;
          box-shadow: none !important;
          filter: none !important;
        }

        .eco-code img {
          max-width: 100%;
          height: auto;
        }

        @media (prefers-color-scheme: dark) {
          .eco-code {
            background: #1a1a1a;
            color: #ffffff;
          }
        }
      `}</style>
    </div>
  );
};
