import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { apartments, formatPrice } from '../data/apartments';
import { LOCATIONS, APARTMENT_TYPES } from '../data/config';
import MiniCalendar from '../components/MiniCalendar';
import FeedbackModal from '../components/FeedbackModal';

const heroSlides = [
  { img: 'https://images.unsplash.com/photo-1757924461488-ef9ad0670978?w=1600&h=900&fit=crop&auto=format', alt: 'Modern apartment living room' },
  { img: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=1600&h=900&fit=crop&auto=format', alt: 'Elegant apartment bedroom' },
  { img: 'https://images.unsplash.com/photo-1725257928373-dc6d2ac7b145?w=1600&h=900&fit=crop&auto=format', alt: 'Modern kitchen and dining area' },
  { img: 'https://images.unsplash.com/photo-1776363116182-51694a04a1d5?w=1600&h=900&fit=crop&auto=format', alt: 'Apartment balcony with city view' },
  { img: 'https://images.unsplash.com/photo-1758957701419-2c6e266f7988?w=1600&h=900&fit=crop&auto=format', alt: 'Spacious furnished living room' },
];

const testimonials = [
  { quote: 'The apartment was exactly what we needed. Everything was clean, comfortable and the location made getting around Lagos so easy.', name: 'Amaka O.', role: 'Sample guest' },
  { quote: 'The booking process was straightforward and communication was quick. I especially loved how peaceful the apartment felt.', name: 'Daniel A.', role: 'Sample guest' },
  { quote: 'Genuinely felt like home. The kitchen had everything, the Wi-Fi was reliable and the neighbourhood was perfect for what I needed.', name: 'Fatima K.', role: 'Sample guest' },
];

const AmenityIcons: Record<string, React.ReactNode> = {
  'Wi-Fi': <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M1 6C4 3 14 3 17 6M4 9C6 7 12 7 14 9M7 12h.4M9 12a.9.9 0 110 1.8A.9.9 0 019 12z" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" /></svg>,
  '24/7 Power': <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M9 2v5.5M6.5 4A5.5 5.5 0 109 2.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" /></svg>,
  'Air Conditioning': <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><rect x="2" y="5" width="14" height="5" rx="2" stroke="currentColor" strokeWidth="1.3" /><path d="M6 10v3M9 10v3M12 10v3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" /></svg>,
  'Smart TV': <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><rect x="2" y="3" width="14" height="9" rx="2" stroke="currentColor" strokeWidth="1.3" /><path d="M6.5 14l-.5 1.5M11.5 14l.5 1.5M6 15.5h6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" /></svg>,
  'Fully Equipped Kitchen': <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><rect x="2" y="2" width="14" height="14" rx="2" stroke="currentColor" strokeWidth="1.3" /><path d="M2 7h14" stroke="currentColor" strokeWidth="1.3" /><circle cx="6" cy="4.5" r=".9" fill="currentColor" /><circle cx="9" cy="4.5" r=".9" fill="currentColor" /></svg>,
  'Kitchenette': <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><rect x="2" y="2" width="14" height="14" rx="2" stroke="currentColor" strokeWidth="1.3" /><path d="M2 7h14" stroke="currentColor" strokeWidth="1.3" /><circle cx="6" cy="4.5" r=".9" fill="currentColor" /></svg>,
  'Parking': <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><rect x="2" y="2" width="14" height="14" rx="2" stroke="currentColor" strokeWidth="1.3" /><path d="M7 13V5h3.5a3 3 0 010 6H7" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" /></svg>,
  'Security': <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M9 1.5L15 4v5c0 3.5-3 6-6 7-3-1-6-3.5-6-7V4l6-2.5z" stroke="currentColor" strokeWidth="1.3" /></svg>,
  'Washing Machine': <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><rect x="2" y="2" width="14" height="14" rx="2" stroke="currentColor" strokeWidth="1.3" /><circle cx="9" cy="10" r="3.5" stroke="currentColor" strokeWidth="1.2" /><path d="M4 5h2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" /></svg>,
};

function formatDateDisplay(d: string) {
  if (!d) return '';
  return new Date(d + 'T12:00:00').toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}
function nightsBetween(a: string, b: string) {
  if (!a || !b) return 0;
  return Math.max(0, Math.round((new Date(b).getTime() - new Date(a).getTime()) / 86400000));
}

const INITIAL_VISIBLE = 3;

export default function HomePage() {
  const [slide, setSlide] = useState(0);
  const [location, setLocation] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(2);
  const [aptType, setAptType] = useState('');
  const [calendarOpen, setCalendarOpen] = useState<'in' | 'out' | null>(null);
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [locationOpen, setLocationOpen] = useState(false);
  const [guestsOpen, setGuestsOpen] = useState(false);
  // Track which type sections are expanded
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const navigate = useNavigate();
  const widgetRef = useRef<HTMLDivElement>(null);
  const nights = nightsBetween(checkIn, checkOut);

  // Auto-advance hero slides
  useEffect(() => {
    const t = setInterval(() => setSlide((s) => (s + 1) % heroSlides.length), 6000);
    return () => clearInterval(t);
  }, []);

  // Close popovers on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (widgetRef.current && !widgetRef.current.contains(e.target as Node)) {
        setCalendarOpen(null);
        setLocationOpen(false);
        setGuestsOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSearch = (resolvedCheckOut?: string) => {
    const out = resolvedCheckOut ?? checkOut;
    const params = new URLSearchParams();
    if (location) params.set('location', location);
    if (checkIn) params.set('checkIn', checkIn);
    if (out) params.set('checkOut', out);
    if (aptType) params.set('type', aptType);
    params.set('guests', String(guests));
    navigate(`/availability?${params}`);
  };

  const byType = APARTMENT_TYPES.map((type) => ({
    type,
    apts: apartments.filter((a) => a.type === type),
  })).filter((g) => g.apts.length > 0);

  return (
    <div>
      {/* ── HERO ─────────────────────────────────────────────── */}
      <section className="relative h-screen min-h-[700px] flex flex-col">
        {/* Background slides */}
        {heroSlides.map((s, i) => (
          <div
            key={i}
            className={`absolute inset-0 transition-opacity duration-1000 ${i === slide ? 'opacity-100' : 'opacity-0'}`}
            aria-hidden={i !== slide}
          >
            <img
              src={s.img}
              alt={s.alt}
              className={`w-full h-full object-cover ${i === slide ? 'animate-zoom-slow' : ''}`}
              loading={i === 0 ? 'eager' : 'lazy'}
            />
          </div>
        ))}
        {/* Dark overlay — solid, consistent, no glassmorphism */}
        <div className="absolute inset-0 bg-black/55" />

        {/* ── Hero content ── */}
        <div className="relative z-10 flex flex-col flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-24">
          {/* Center-aligned headline */}
          <div className="flex-1 flex flex-col items-center justify-center text-center pb-6">
            <span className="text-xs font-semibold uppercase tracking-widest text-white/65 mb-4">
              Shortlet Apartments in Lagos
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight max-w-3xl mb-5">
              Stay somewhere you'll love coming back to.
            </h1>
            <p className="text-white/75 text-base sm:text-lg max-w-xl mb-8 leading-relaxed">
              Beautifully furnished apartments in convenient Lagos locations, designed for comfortable stays and easy booking.
            </p>
            <div className="flex items-center gap-3 justify-center">
              <button
                onClick={() => { const el = document.getElementById('apartments'); el?.scrollIntoView({ behavior: 'smooth' }); }}
                className="px-6 py-3 border-2 border-white text-white font-semibold rounded-xl hover:bg-white/10 transition-colors text-sm"
              >
                Explore Apartments
              </button>
              <button
                onClick={() => navigate('/apartments')}
                className="px-6 py-3 bg-[#174FC7] text-white font-semibold rounded-xl hover:bg-[#0B2F70] transition-colors text-sm"
              >
                Book Now
              </button>
            </div>
          </div>
        </div>

        {/* ── Search widget — left-aligned, stroke style, no glass ── */}
        <div className="relative z-10 pb-0 -mb-14" ref={widgetRef}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="lg:max-w-[640px]">
              <div className="bg-white border-2 border-[#174FC7] rounded-2xl p-4 shadow-xl">
                <p className="text-xs font-bold uppercase tracking-widest text-[#174FC7] mb-3">Search Availability</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {/* Check-in */}
                  <div className="relative">
                    <label className="block text-[10px] font-semibold uppercase tracking-wider text-[#667085] mb-1">Check-in</label>
                    <button
                      className="w-full flex items-center gap-1.5 border border-[#E4EAF2] rounded-lg px-2.5 py-2 text-xs text-left hover:border-[#174FC7] transition-colors bg-white"
                      onClick={() => { setCalendarOpen(calendarOpen === 'in' ? null : 'in'); setLocationOpen(false); setGuestsOpen(false); }}
                    >
                      <svg width="13" height="13" viewBox="0 0 13 13" fill="none" className="text-[#174FC7] flex-shrink-0"><rect x="1" y="2" width="11" height="10" rx="2" stroke="currentColor" strokeWidth="1.2"/><path d="M1 5h11M4.5 1v2M8.5 1v2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>
                      <span className={checkIn ? 'text-[#111827] font-medium' : 'text-[#9CA3AF]'}>
                        {checkIn ? formatDateDisplay(checkIn) : 'Add date'}
                      </span>
                    </button>
                    {calendarOpen === 'in' && (
                      <div className="absolute top-full left-0 mt-1 z-40">
                        <MiniCalendar value={checkIn} onChange={(d) => { setCheckIn(d); if (checkOut && d >= checkOut) setCheckOut(''); setCalendarOpen('out'); }} onClose={() => setCalendarOpen(null)} />
                      </div>
                    )}
                  </div>

                  {/* Check-out */}
                  <div className="relative">
                    <label className="block text-[10px] font-semibold uppercase tracking-wider text-[#667085] mb-1">Check-out</label>
                    <button
                      className="w-full flex items-center gap-1.5 border border-[#E4EAF2] rounded-lg px-2.5 py-2 text-xs text-left hover:border-[#174FC7] transition-colors bg-white"
                      onClick={() => { setCalendarOpen(calendarOpen === 'out' ? null : 'out'); setLocationOpen(false); setGuestsOpen(false); }}
                    >
                      <svg width="13" height="13" viewBox="0 0 13 13" fill="none" className="text-[#174FC7] flex-shrink-0"><rect x="1" y="2" width="11" height="10" rx="2" stroke="currentColor" strokeWidth="1.2"/><path d="M1 5h11M4.5 1v2M8.5 1v2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>
                      <span className={checkOut ? 'text-[#111827] font-medium' : 'text-[#9CA3AF]'}>
                        {checkOut ? formatDateDisplay(checkOut) : 'Add date'}
                      </span>
                    </button>
                    {calendarOpen === 'out' && (
                      <div className="absolute top-full left-0 mt-1 z-40">
                        <MiniCalendar value={checkOut} onChange={(d) => { setCheckOut(d); setCalendarOpen(null); handleSearch(d); }} minDate={checkIn || undefined} onClose={() => setCalendarOpen(null)} />
                      </div>
                    )}
                  </div>

                  {/* Guests */}
                  <div className="relative" ref={null}>
                    <label className="block text-[10px] font-semibold uppercase tracking-wider text-[#667085] mb-1">Guests</label>
                    <button
                      className="w-full flex items-center justify-between border border-[#E4EAF2] rounded-lg px-2.5 py-2 text-xs hover:border-[#174FC7] transition-colors bg-white"
                      onClick={() => { setGuestsOpen(!guestsOpen); setCalendarOpen(null); setLocationOpen(false); }}
                    >
                      <span className="text-[#111827] font-medium">{guests} Guest{guests !== 1 ? 's' : ''}</span>
                      <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M2 3.5l3 3 3-3" stroke="#667085" strokeWidth="1.2" strokeLinecap="round" /></svg>
                    </button>
                    {guestsOpen && (
                      <div className="absolute top-full left-0 mt-1 bg-white rounded-xl shadow-lg border border-[#E4EAF2] p-3 z-40 w-36">
                        <div className="flex items-center gap-3 justify-center">
                          <button onClick={() => setGuests(Math.max(1, guests - 1))} className="w-7 h-7 rounded-full border border-[#E4EAF2] flex items-center justify-center hover:border-[#174FC7] text-[#374151] text-sm">−</button>
                          <span className="text-sm font-semibold w-5 text-center">{guests}</span>
                          <button onClick={() => setGuests(Math.min(10, guests + 1))} className="w-7 h-7 rounded-full border border-[#E4EAF2] flex items-center justify-center hover:border-[#174FC7] text-[#374151] text-sm">+</button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── APARTMENT TYPE SECTIONS ─────────────────────────── */}
      <div id="apartments" className="pt-24 sm:pt-28">
        {byType.map(({ type, apts }, groupIdx) => {
          const isExpanded = expanded[type] || false;
          const visible = isExpanded ? apts : apts.slice(0, INITIAL_VISIBLE);
          const hasMore = apts.length > INITIAL_VISIBLE;

          return (
            <section key={type} className={`py-14 ${groupIdx % 2 === 0 ? 'bg-white' : 'bg-[#F8FAFD]'}`}>
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-end justify-between mb-8">
                  <div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-[#111827]">{type} Apartments</h2>
                    <p className="text-[#667085] mt-1 text-sm">
                      {type === 'Studio' && 'Smart, comfortable spaces for solo stays and couples.'}
                      {type === '1 Bedroom' && 'Private and comfortable — ideal for a relaxed stay.'}
                      {type === '2 Bedroom' && 'More room for families, friends and longer stays.'}
                      {type === '3 Bedroom' && 'Spacious accommodation for groups who want to stay together.'}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {visible.map((apt) => (
                    <ApartmentCard key={apt.id} apt={apt} />
                  ))}
                </div>

                {hasMore && (
                  <div className="mt-6 flex justify-start">
                    <button
                      onClick={() => setExpanded((prev) => ({ ...prev, [type]: !isExpanded }))}
                      className="text-sm text-[#174FC7] font-semibold hover:underline inline-flex items-center gap-1.5 transition-colors"
                    >
                      {isExpanded ? 'Show less' : 'View more'}
                      <svg
                        width="13" height="13" viewBox="0 0 13 13" fill="none"
                        className={`transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                      >
                        <path d="M2.5 4.5L6.5 8.5L10.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>
            </section>
          );
        })}
      </div>

      {/* ── BRAND EDITORIAL ─────────────────────────────────── */}
      <section className="py-16 bg-[#0B2F70]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-5 leading-tight">More than a place to sleep.</h2>
              <p className="text-white/70 text-lg leading-relaxed mb-8">
                Your stay should feel easy from the moment you book. Our apartments are thoughtfully furnished to give you the privacy, comfort and convenience you need to settle in and enjoy Lagos.
              </p>
              <Link to="/apartments" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-[#0B2F70] font-semibold rounded-xl hover:bg-[#EEF4FF] transition-colors text-sm">
                Discover Our Apartments
              </Link>
            </div>
            <div className="h-72 lg:h-96 overflow-hidden">
              <img src="https://images.unsplash.com/photo-1564078516393-cf04bd966897?w=900&h=700&fit=crop&auto=format" alt="Beautifully furnished apartment" className="w-full h-full object-cover" loading="lazy" />
            </div>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ─────────────────────────────────────── */}
      <section className="py-16 bg-[#F8FAFD]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-[#111827] mb-2">What guests say.</h2>
          <p className="text-[#667085] text-sm mb-10">Sample testimonials — fictional for this portfolio project.</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {testimonials.map(({ quote, name, role }, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 border border-[#E4EAF2]">
                <div className="flex gap-0.5 mb-4">{[...Array(5)].map((_, s) => <span key={s} className="text-amber-400 text-sm">★</span>)}</div>
                <p className="text-[#374151] text-sm leading-relaxed mb-5">"{quote}"</p>
                <div>
                  <p className="font-semibold text-sm text-[#111827]">{name}</p>
                  <p className="text-xs text-[#667085]">{role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEEDBACK ─────────────────────────────────────────── */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#EEF4FF] rounded-2xl p-8 sm:p-12 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <h2 className="text-2xl font-bold text-[#0B2F70] mb-2">Stayed with us?</h2>
              <p className="text-[#667085]">We'd love to hear about your experience.</p>
            </div>
            <button onClick={() => setFeedbackOpen(true)} className="px-6 py-3 bg-[#174FC7] text-white font-semibold rounded-xl hover:bg-[#0B2F70] transition-colors text-sm flex-shrink-0">
              Leave Feedback
            </button>
          </div>
        </div>
      </section>

      {feedbackOpen && <FeedbackModal onClose={() => setFeedbackOpen(false)} />}

      {/* Mobile sticky CTA */}
      <div className="fixed bottom-0 left-0 right-0 md:hidden z-40 bg-white border-t border-[#E4EAF2] px-4 py-3">
        <button onClick={() => navigate('/apartments')} className="w-full py-3.5 bg-[#174FC7] text-white font-semibold rounded-xl text-sm">
          Book Now
        </button>
      </div>
    </div>
  );
}

// ── APARTMENT CARD ────────────────────────────────────────
function ApartmentCard({ apt }: { apt: typeof apartments[number] }) {
  const shownAmenities = apt.amenities.filter((a) => AmenityIcons[a]).slice(0, 5);

  return (
    <div className="bg-white overflow-hidden border border-[#E4EAF2] hover:shadow-lg hover:border-[#C7D7F5] transition-all group">
      <div className="h-56 overflow-hidden bg-[#EEF4FF]">
        <img
          src={apt.images.hero}
          alt={apt.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
      </div>
      <div className="p-5">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="font-bold text-[#174FC7] text-lg leading-tight">{apt.name}</h3>
          <span className="text-xs text-[#667085] whitespace-nowrap mt-1">{apt.capacity} SLEEPS</span>
        </div>
        <p className="text-xs font-semibold uppercase tracking-wider text-[#667085] mb-3">{apt.location}</p>
        <div className="flex items-center gap-2.5 text-[#667085] mb-4">
          {shownAmenities.map((a) => (
            <span key={a} title={a}>{AmenityIcons[a]}</span>
          ))}
        </div>
        <p className="font-bold text-[#111827] text-lg mb-4">
          {formatPrice(apt.pricePerNight)}<span className="text-sm font-normal text-[#667085]"> / night</span>
        </p>
        <Link
          to={`/apartments/${apt.id}`}
          className="block w-full py-3 text-center bg-[#174FC7] text-white font-bold text-sm hover:bg-[#0B2F70] transition-colors tracking-wide uppercase"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}
