import Link from 'next/link';

// Same links on every page. "hide" = hidden on small phones so the bar fits.
const LINKS = [
  { label: 'HOME', href: '/' },
  { label: 'HOW IT WORKS', href: '/#how-it-works', hide: true },
  { label: 'WHY US ?', href: '/#why-skill-match', hide: true },
  { label: 'TRY IT NOW!', href: '/try' },
  { label: 'CONTACT', href: '/contact' },
];

export default function Navbar() {
  return (
    <div className="mx-auto w-full px-4 pt-6 z-20">
      <div className="flex items-center justify-between gap-4 rounded-full bg-[#F4F5F0] px-6 py-3">
        <Link
          href="/"
          className="shrink-0 text-sm font-black leading-tight tracking-wider text-[#0A1930]"
        >
          SKILL
          <br />
          MATCH
        </Link>

        <nav className="flex flex-1 items-center justify-center gap-4 font-serif text-[10px] font-bold uppercase tracking-wide text-[#0A1930] sm:gap-8 sm:text-[11px] md:gap-12">
          {LINKS.map((l) => (
            <Link
              key={l.label}
              href={l.href}
              className={`whitespace-nowrap transition-opacity hover:opacity-70 ${
                l.hide ? 'hidden sm:inline' : ''
              }`}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        {/* Spacer so the links stay centred under the logo */}
        <span className="hidden w-[52px] shrink-0 sm:block" aria-hidden="true" />
      </div>
    </div>
  );
}