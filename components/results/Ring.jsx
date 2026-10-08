export default function ProgressRing({
  segments,
  size = 200,
  strokeWidth = 24,
  indeterminate = false,
  children,
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const total = segments.reduce((sum, s) => sum + s.value, 0) || 1;
  let offsetAccum = 0;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        className={indeterminate ? 'animate-spin [animation-duration:2.4s]' : ''}
        style={{ transform: 'rotate(-90deg)' }}
      >
        {segments.map((seg, i) => {
          if (seg.value <= 0) return null;
          const fraction = seg.value / total;
          const dash = fraction * circumference;
          const gap = circumference - dash;
          const rotation = (offsetAccum / total) * 360;
          offsetAccum += seg.value;
          return (
            <circle
              key={i}
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke={seg.color}
              strokeWidth={strokeWidth}
              strokeDasharray={`${dash} ${gap}`}
              style={{
                transform: `rotate(${rotation}deg)`,
                transformOrigin: '50% 50%',
                transition: 'stroke-dasharray 0.6s ease',
              }}
            />
          );
        })}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
        {children}
      </div>
    </div>
  );
}
