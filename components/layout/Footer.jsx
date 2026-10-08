import Link from 'next/link';

const LINKS = [
  { label: 'HOME', href: '/' },
  { label: 'TRY IT NOW', href: '/try' },
  { label: 'CONTACT', href: '/contact' },
];

const CONTACT_EMAIL = 'pranjalruiacs@gmail.com';

export default function Footer() {
  return (
    <footer className=" bg-[#050f2e] px-4 py-8">
      <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
        {/* Left: logo + social icons */}
        <div className="flex flex-col items-start gap-4">
          <span className="text-sm font-black leading-tight tracking-wider text-white">
            SKILL
            <br />
            MATCH
          </span>
          <div className="flex items-center gap-3 text-white">
            <WhatsAppIcon />
            <InstagramIcon />
            <LinkedInIcon />
            <XIcon />
          </div>
        </div>

        {/* Right: links + email */}
        <div className="flex flex-col gap-5 sm:items-end">
          <nav className="flex items-center gap-5 font-serif text-sm uppercase tracking-wide text-white/70">
            {LINKS.map((l) => (
              <Link key={l.label} href={l.href} className="transition-colors hover:text-white">
                {l.label}
              </Link>
            ))}
          </nav>
          <p className="font-serif text-[11px] text-white/60">
            Reach out:{' '}
            <a href={`mailto:${CONTACT_EMAIL}`} className="ml-2 underline hover:text-white">
              {CONTACT_EMAIL}
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}

/* ---------- Social icons (simple outline icons, no extra package) ---------- */

const iconProps = {
  width: 16,
  height: 16,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
};

function WhatsAppIcon() {
  return (
    <svg {...iconProps} aria-label="WhatsApp">
      <path d="M3 21l1.6-4.7A8.5 8.5 0 1 1 8 19.4L3 21z" />
      <path d="M9 9.5c0 3 2.5 5.5 5.5 5.5l1.2-1.3-2-1-.8.7a3.5 3.5 0 0 1-1.8-1.8l.7-.8-1-2L9 9.5z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg {...iconProps} aria-label="Instagram">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg {...iconProps} aria-label="LinkedIn">
      <rect x="3" y="3" width="18" height="18" rx="3" />
      <path d="M8 10.5V16M8 7.5v.01M12 16v-5.5M12 13c0-1.7 1-2.5 2.3-2.5S16.5 11.300 16.500 13V16" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg {...iconProps} aria-label="X">
      <path d="M4 4l16 16M20 4L4 20" />
    </svg>
  );
}