import styles from './BloodDrips.module.css';

interface SplatDot {
  id: string;
  dx: number;
  size: number;
  sx: number;
  sy: number;
}

interface DripData {
  id: number;
  left: number;
  dur: number;
  delay: number;
  width: number;
  len: number;
  splats: SplatDot[];
}

// Pre-compute once at module load — deterministic, never changes
const DRIPS: DripData[] = Array.from({ length: 16 }, (_, i) => {
  const seed = i + 1;
  const len  = 28 + (seed % 7) * 9;
  const splatCount = 2 + (seed % 2);

  const splats: SplatDot[] = Array.from({ length: splatCount }, (__, j) => ({
    id:   `${i}-${j}`,
    dx:   (j % 2 === 0 ? 1 : -1) * (4 + j * 3),
    size: 3 + (j % 3) * 2,
    sx:   (j % 2 === 0 ? 1 : -1) * (8 + j * 5),
    sy:   4 + j * 3,
  }));

  return {
    id:    i,
    left:  2 + i * 6.2 + (seed % 3) * 0.8,
    dur:   2.2 + (seed % 5) * 0.45,
    delay: (seed % 6) * 0.75,
    width: 4 + (seed % 3) * 2.5,
    len,
    splats,
  };
});

export const BloodDrips = () => (
  <div className={styles.container} aria-hidden="true">
    {DRIPS.map((d) => (
      <div key={d.id} className={styles.group} style={{ left: `${d.left}%` }}>
        <div
          className={styles.drip}
          style={{
            width:             d.width,
            '--drip-len':      `${d.len}px`,
            animationDuration: `${d.dur}s`,
            animationDelay:    `${d.delay}s`,
          } as React.CSSProperties}
        />
        {d.splats.map((s) => (
          <div
            key={s.id}
            className={styles.splatDot}
            style={{
              width:             s.size,
              height:            s.size,
              top:               d.len,
              left:              d.width / 2 + s.dx,
              '--sx':            `${s.sx}px`,
              '--sy':            `${s.sy}px`,
              animationDuration: `${d.dur * 0.35}s`,
              animationDelay:    `${d.delay + d.dur * 0.78}s`,
            } as React.CSSProperties}
          />
        ))}
      </div>
    ))}
  </div>
);
