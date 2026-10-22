import { Link } from 'react-router-dom'

/**
 * Shared layout: hero band + content area.
 * tone: emerald (public/home) | rose (patient) | blue (doctor/admin)
 */
export default function PageShell({
  eyebrow,
  title,
  subtitle,
  actions,
  children,
  contentClassName = '',
  heroSize = 'default',
  contentMax = 'max-w-6xl',
  tone = 'emerald',
}) {
  const heroPad =
    heroSize === 'compact' ? 'py-14 md:py-16' : 'py-20 md:py-24'

  const toneMap = {
    emerald: {
      hero: 'bg-[#047857]',
      eyebrow: 'text-emerald-100/85',
      subtitle: 'text-emerald-50/75',
    },
    rose: {
      hero: 'bg-[#BE123C]',
      eyebrow: 'text-rose-100/90',
      subtitle: 'text-rose-50/80',
    },
    blue: {
      hero: 'bg-[#1D4ED8]',
      eyebrow: 'text-blue-100/90',
      subtitle: 'text-blue-50/80',
    },
  }
  const palette = toneMap[tone] || toneMap.emerald
  const themeClass = `theme-${tone}`

  return (
    <div className={`animate-in fade-in duration-700 min-h-screen bg-[#FBFCFD] ${themeClass}`}>
      <section
        className={`${palette.hero} text-white ${heroPad} px-6 relative overflow-hidden`}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.28),_rgba(255,255,255,0.02)_40%,_transparent_60%)] pointer-events-none" />
        <div className="absolute inset-0 bg-[linear-gradient(120deg,_rgba(255,255,255,0.15),_transparent_36%,_transparent_72%,_rgba(255,255,255,0.12))] pointer-events-none" />
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-[min(500px,90vw)] h-[min(500px,90vw)] bg-white/10 rounded-full blur-3xl pointer-events-none hero-orb-float" />
        <div className="absolute bottom-0 left-0 translate-y-1/3 -translate-x-1/4 w-72 h-72 bg-white/[0.08] rounded-full blur-2xl pointer-events-none hero-orb-float-delayed" />

        <div
          className={`${contentMax} mx-auto relative z-10 flex flex-col md:flex-row md:items-end md:justify-between gap-8`}
        >
          <div className="max-w-3xl">
            {eyebrow && (
              <span className={`text-[10px] font-black ${palette.eyebrow} uppercase tracking-[0.4em] mb-3 block`}>
                {eyebrow}
              </span>
            )}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight leading-[1.12]">
              {title}
            </h1>
            {subtitle && (
              <p className={`${palette.subtitle} text-base md:text-lg mt-4 max-w-2xl font-medium leading-relaxed`}>
                {subtitle}
              </p>
            )}
          </div>
          {actions && (
            <div className="flex flex-wrap gap-3 shrink-0 md:pb-0.5">{actions}</div>
          )}
        </div>
        <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-b from-transparent to-[#FBFCFD] pointer-events-none" />
      </section>

      <div className={`${contentMax} mx-auto px-6 py-10 md:py-12 ${contentClassName}`}>
        <div className="relative">
          <div className="absolute -top-3 -right-2 w-24 h-24 rounded-full bg-[var(--accent-ghost)] blur-2xl pointer-events-none" />
          {children}
        </div>
      </div>
    </div>
  )
}

export function PageBackLink({ to, children }) {
  return (
    <Link
      to={to}
      className="inline-flex items-center gap-2 text-slate-400 themed-back-link font-bold text-[10px] uppercase tracking-[0.2em] mb-8 transition-colors group"
    >
      <svg
        className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2.5}
          d="M15 19l-7-7 7-7"
        />
      </svg>
      {children}
    </Link>
  )
}
