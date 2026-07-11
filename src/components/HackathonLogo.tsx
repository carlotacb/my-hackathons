import { useState } from 'react';

interface HackathonLogoProps {
  src?: string;
  name: string;
}

export default function HackathonLogo({ src, name }: HackathonLogoProps) {
  const [failed, setFailed] = useState(false);
  const showImage = Boolean(src) && !failed;

  return (
    <div className="card-logo">
      {showImage ? (
        <img src={src} alt="" loading="lazy" onError={() => setFailed(true)} />
      ) : (
        <svg viewBox="0 0 40 40" aria-hidden="true" role="img" aria-label={`${name} logo placeholder`}>
          <path
            d="M14 14l-6 6 6 6M26 14l6 6-6 6M22.5 11l-5 18"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </svg>
      )}
    </div>
  );
}
