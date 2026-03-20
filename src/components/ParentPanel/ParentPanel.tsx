import styles from './ParentPanel.module.css';

interface Props {
  soundEnabled:      boolean;
  motionEnabled:     boolean;
  isFullscreen:      boolean;
  onToggleSound:     () => void;
  onToggleMotion:    () => void;
  onToggleFullscreen:() => void;
  onClear:           () => void;
  onClose:           () => void;
}

export const ParentPanel = ({
  soundEnabled,
  motionEnabled,
  isFullscreen,
  onToggleSound,
  onToggleMotion,
  onToggleFullscreen,
  onClear,
  onClose,
}: Props) => (
  // The overlay blocks pointer events reaching the canvas
  <div
    className={styles.overlay}
    onClick={(e) => e.stopPropagation()}
    onTouchStart={(e) => e.stopPropagation()}
    role="dialog"
    aria-modal="true"
    aria-label="Horror Fingers Settings"
  >
    <div className={styles.panel}>
      <h2 className={styles.title}>☠ CRYPT SETTINGS ☠</h2>

      <button
        className={`${styles.btn} ${soundEnabled ? styles.active : ''}`}
        onClick={onToggleSound}
      >
        {soundEnabled ? '🔊  SOUND: ON' : '🔇  SOUND: OFF'}
      </button>

      <button
        className={`${styles.btn} ${motionEnabled ? styles.active : ''}`}
        onClick={onToggleMotion}
      >
        {motionEnabled ? '💀  MOTION: ON' : '⚰  MOTION: OFF'}
      </button>

      <button className={styles.btn} onClick={onToggleFullscreen}>
        {isFullscreen ? '🗗  EXIT FULLSCREEN' : '🗖  FULLSCREEN'}
      </button>

      <button className={styles.btn} onClick={onClear}>
        🧹  CLEAR MONSTERS
      </button>

      <button className={`${styles.btn} ${styles.closeBtn}`} onClick={onClose}>
        ✕  CLOSE CRYPT
      </button>
    </div>
  </div>
);
