'use client';

export default function ProjectLabel() {
  return (
    <div
      style={{
        position: 'fixed',
        top: 'clamp(18px, 3.5vw, 32px)',
        left: 'clamp(18px, 3.5vw, 40px)',
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        gap: '2px',
        pointerEvents: 'none',
      }}
    >
      <span
        style={{
          fontSize: '11px',
          fontWeight: 500,
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          color: 'var(--text-primary)',
          opacity: 0.95,
        }}
      >
        AURA
      </span>
      <span
        style={{
          fontSize: '10px',
          fontWeight: 400,
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          color: 'var(--text-secondary)',
        }}
      >
        X1
      </span>
    </div>
  );
}
