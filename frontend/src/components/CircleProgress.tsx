import React, { useMemo } from 'react';

export default function CircleProgress({ countdownSeconds, answerTime }: { countdownSeconds: number, answerTime: number }) {
  const radius = 30;
  const strokeWidth = 10;
  const circumference = 2 * Math.PI * radius;
  const progress = useMemo(() => (countdownSeconds / answerTime) * circumference, [countdownSeconds, answerTime]); 

  const strokeDashOffset = useMemo(() => {
    return circumference - progress;
  }, [progress, circumference]);

  return (
    <div className="relative" style={{ width: '40px', height: '40px'}}>
      <svg width="100%" height="100%" viewBox="0 0 100 100" style={{ position: 'absolute', top: 0, left: 0 }}>
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          stroke=""
        />
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          stroke="#5cb85c"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashOffset}
          strokeLinecap="round"
          transform="rotate(-90 50 50)"
          style={{ transition: 'stroke-dashoffset 1s linear' }} // Apply transition
        />
      </svg>
    </div>
  );
}
