// Stand-in illustrations for the image slots in the design. Swap any of these
// for real art by giving the matching field in app-data.json an image path.

export function HomeArt({ src }) {
  if (src) return <img className="home-illo photo" src={src} alt="" style={{ objectFit: "contain" }} />;
  return (
    <svg className="home-illo art" viewBox="0 0 360 180" aria-hidden="true">
      <ellipse cx="180" cy="162" rx="120" ry="12" fill="#f0f0f3" />
      {/* map card */}
      <rect x="62" y="34" width="150" height="116" rx="14" fill="#e7eae6" />
      <path d="M62 82 C 110 70 140 110 212 96" stroke="#c2d9ea" strokeWidth="10" fill="none" />
      <path d="M100 34 L 120 150 M62 126 L 212 116" stroke="#fff" strokeWidth="7" fill="none" />
      {/* pin */}
      <path d="M150 40c-15 0-26 11-26 25 0 19 26 43 26 43s26-24 26-43c0-14-11-25-26-25z" fill="#ff7a08" />
      <circle cx="150" cy="65" r="9" fill="#fff" />
      {/* bag */}
      <path d="M216 72h76l-8 82h-60z" fill="#ff9a3c" />
      <path d="M216 72h76l-4 14h-68z" fill="#e8690a" />
      <path d="M236 72v-10a18 18 0 0 1 36 0v10" stroke="#16161a" strokeWidth="4" fill="none" strokeLinecap="round" />
      <circle cx="254" cy="114" r="15" fill="#fff" opacity=".9" />
      <path d="m247 114 5 5 9-10" stroke="#07b15f" strokeWidth="3.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function ThankYouArt() {
  return (
    <svg className="ty-illo art" viewBox="0 0 400 170" aria-hidden="true">
      <ellipse cx="200" cy="156" rx="130" ry="10" fill="#e6d1a8" />
      {/* receipt */}
      <path d="M150 18h100v132l-10-7-10 7-10-7-10 7-10-7-10 7-10-7-10 7-10-7z" fill="#fff" />
      <rect x="166" y="40" width="54" height="7" rx="3.5" fill="#16161a" />
      <rect x="166" y="60" width="68" height="5" rx="2.5" fill="#d6d6dd" />
      <rect x="166" y="74" width="60" height="5" rx="2.5" fill="#d6d6dd" />
      <rect x="166" y="88" width="64" height="5" rx="2.5" fill="#d6d6dd" />
      <rect x="166" y="108" width="68" height="8" rx="4" fill="#ff7a08" />
      {/* coins */}
      <ellipse cx="292" cy="140" rx="26" ry="9" fill="#d99a1e" />
      <rect x="266" y="118" width="52" height="22" fill="#f2b736" />
      <ellipse cx="292" cy="118" rx="26" ry="9" fill="#f8cf62" />
      <text x="292" y="123" textAnchor="middle" fontSize="13" fontWeight="800" fill="#b37a0a" fontFamily="DM Sans, sans-serif">₡</text>
      {/* check badge */}
      <circle cx="118" cy="62" r="24" fill="#07b15f" />
      <path d="m106 62 8 8 16-17" stroke="#fff" strokeWidth="5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function HelpArt() {
  return (
    <svg className="help-illo art" viewBox="0 0 150 130" aria-hidden="true">
      <rect x="18" y="20" width="80" height="54" rx="16" fill="#ff7a08" />
      <path d="M36 74 30 92l22-18z" fill="#ff7a08" />
      <circle cx="40" cy="47" r="5" fill="#fff" /><circle cx="58" cy="47" r="5" fill="#fff" /><circle cx="76" cy="47" r="5" fill="#fff" />
      <rect x="70" y="62" width="66" height="44" rx="14" fill="#fff" />
      <path d="M118 106l8 14-20-14z" fill="#fff" />
      <rect x="82" y="78" width="40" height="5" rx="2.5" fill="#f2c9a6" />
      <rect x="82" y="88" width="28" height="5" rx="2.5" fill="#f2c9a6" />
    </svg>
  );
}

export function Avatar({ profile, size }) {
  if (profile.avatar) return <img className="photo" src={profile.avatar} alt="" />;
  const initials = ((profile.firstName || "")[0] || "") + ((profile.lastName || "")[0] || "");
  return <div className="avatar-initials" style={{ fontSize: size * 0.36 }}>{initials.toUpperCase()}</div>;
}
