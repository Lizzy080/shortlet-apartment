import { useState, useEffect, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { apartments, formatPrice, isDateUnavailable } from '../data/apartments';
import { APARTMENT_TYPES, LOCATIONS } from '../data/config';
import MiniCalendar from '../components/MiniCalendar';

const ALL_TYPES = ['All', ...APARTMENT_TYPES];

function formatDateDisplay(d: string) {
  if (!d) return '';
  return new Date(d + 'T12:00:00').toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

function nightsBetween(a: string, b: string) {
  if (!a || !b) return 0;
  return Math.max(0, Math.round((new Date(b).getTime() - new Date(a).getTime()) / 86400000));
}

function isApartmentAvailableForRange(apt: typeof apartments[number], checkIn: string, checkOut: string): boolean {
  if (!checkIn || !checkOut) return true;
  const start = new Date(checkIn);
  const end = new Date(checkOut);
  let d = new Date(start);
  while (d < end) {
    const ymd = d.toISOString().split('T')[0];
    if (isDateUnavailable(apt, ymd)) return false;
    d.setDate(d.getDate() + 1);
  }
  return true;
}

export default function AvailabilityPage() {
  const [params] = useSearchParams();
  const [type, setType] = useState(params.get('type') || 'All');
  const [location, setLocation] = useState(params.get('location') || '');
  const [checkIn, setCheckIn] = useState(params.get('checkIn') || '');
  const [checkOut, setCheckOut] = useState(params.get('checkOut') || '');
  const [guests, setGuests] = useState(Number(params.get('guests')) || 2);
  const [calOpen, setCalOpen] = useState<'in' | 'out' | null>(null);
  const [searched, setSearched] = useState(false);
  const calRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (calRef.current && !calRef.current.contains(e.target as Node)) setCalOpen(null);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const nights = nightsBetween(checkIn, checkOut);

  const results = searched
    ? apartments.filter((a) => {
        const typeMatch = type === 'All' || a.type === type;
        const locMatch = !location || a.location === location;
        const capMatch = a.capacity >= guests;
        const availMatch = isApartmentAvailableForRange(a, checkIn, checkOut);
        return typeMatch && locMatch && capMatch && availMatch;
      })
    : [];

  return (
    <div className="min-h-screen bg-[#F8FAFD] pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-[#111827] mb-2">Find an apartment for your dates.</h1>
          <p className="text-[#667085]">Search across our available spaces in Lagos.</p>
        </div>

        {/* Search panel */}
        <div className="bg-white rounded-2xl border border-[#E4EAF2] p-5 sm:p-6 mb-10 shadow-sm" ref={calRef}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
            {/* Type */}
            <div>
              <label className="block text-xs font-semibold text-[#667085] mb-1.5">APARTMENT TYPE</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className={inputCls}
              >
                {ALL_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>

            {/* Location */}
            <div>
              <label className="block text-xs font-semibold text-[#667085] mb-1.5">LOCATION</label>
              <select value={location} onChange={(e) => setLocation(e.target.value)} className={inputCls}>
                <option value="">Any Location</option>
                {LOCATIONS.map((l) => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>

            {/* Check-in */}
            <div className="relative">
              <label className="block text-xs font-semibold text-[#667085] mb-1.5">CHECK-IN</label>
              <button
                onClick={() => setCalOpen(calOpen === 'in' ? null : 'in')}
                className={`${inputCls} text-left ${checkIn ? 'text-[#111827]' : 'text-[#9CA3AF]'}`}
              >
                {checkIn ? formatDateDisplay(checkIn) : 'Add date'}
              </button>
              {calOpen === 'in' && (
                <div className="absolute top-full left-0 mt-2 z-30">
                  <MiniCalendar
                    value={checkIn}
                    onChange={(d) => { setCheckIn(d); if (checkOut && d >= checkOut) setCheckOut(''); setCalOpen('out'); }}
                    onClose={() => setCalOpen(null)}
                  />
                </div>
              )}
            </div>

            {/* Check-out */}
            <div className="relative">
              <label className="block text-xs font-semibold text-[#667085] mb-1.5">CHECK-OUT</label>
              <button
                onClick={() => setCalOpen(calOpen === 'out' ? null : 'out')}
                className={`${inputCls} text-left ${checkOut ? 'text-[#111827]' : 'text-[#9CA3AF]'}`}
              >
                {checkOut ? formatDateDisplay(checkOut) : 'Add date'}
              </button>
              {calOpen === 'out' && (
                <div className="absolute top-full left-0 mt-2 z-30">
                  <MiniCalendar
                    value={checkOut}
                    onChange={(d) => { setCheckOut(d); setCalOpen(null); }}
                    minDate={checkIn || undefined}
                    onClose={() => setCalOpen(null)}
                  />
                </div>
              )}
            </div>

            {/* Guests */}
            <div>
              <label className="block text-xs font-semibold text-[#667085] mb-1.5">GUESTS</label>
              <input
                type="number"
                min={1}
                max={10}
                value={guests}
                onChange={(e) => setGuests(Math.max(1, Number(e.target.value)))}
                className={inputCls}
              />
            </div>

            {/* Search */}
            <div className="flex items-end">
              <button
                onClick={() => setSearched(true)}
                className="w-full py-2.5 bg-[#174FC7] text-white font-semibold rounded-xl hover:bg-[#0B2F70] transition-colors text-sm"
              >
                Search
              </button>
            </div>
          </div>

          {nights > 0 && (
            <p className="mt-3 text-xs text-[#667085]">{nights} night{nights !== 1 ? 's' : ''} selected</p>
          )}
        </div>

        {/* Results */}
        {!searched ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 rounded-2xl bg-[#EEF4FF] flex items-center justify-center mx-auto mb-4">
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none"><circle cx="13" cy="13" r="9" stroke="#174FC7" strokeWidth="1.5" /><path d="M20 20L24 24" stroke="#174FC7" strokeWidth="1.5" strokeLinecap="round" /></svg>
            </div>
            <p className="text-[#667085]">Choose your filters and search to find available apartments.</p>
          </div>
        ) : results.length > 0 ? (
          <div>
            <p className="text-sm text-[#667085] mb-6">{results.length} apartment{results.length !== 1 ? 's' : ''} available</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {results.map((apt) => (
                <AvailabilityCard key={apt.id} apt={apt} checkIn={checkIn} checkOut={checkOut} guests={guests} nights={nights} />
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-16 h-16 rounded-2xl bg-[#FEF2F2] flex items-center justify-center mx-auto mb-4">
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none"><circle cx="14" cy="14" r="11" stroke="#EF4444" strokeWidth="1.5" /><path d="M9 9l10 10M19 9L9 19" stroke="#EF4444" strokeWidth="1.5" strokeLinecap="round" /></svg>
            </div>
            <h3 className="font-semibold text-[#111827] mb-2">No apartments match those dates.</h3>
            <p className="text-sm text-[#667085] mb-5">Try another date or explore another apartment type.</p>
            <Link
              to="/apartments"
              className="inline-flex px-5 py-2.5 bg-[#174FC7] text-white font-semibold rounded-xl text-sm hover:bg-[#0B2F70] transition-colors"
            >
              View All Apartments
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

function AvailabilityCard({ apt, checkIn, checkOut, guests, nights }: {
  apt: typeof apartments[number]; checkIn: string; checkOut: string; guests: number; nights: number;
}) {
  const total = nights > 0 ? nights * apt.pricePerNight : null;
  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-[#E4EAF2] hover:shadow-md transition-all">
      <div className="h-48 overflow-hidden bg-[#EEF4FF] relative">
        <img src={apt.images.hero} alt={apt.name} className="w-full h-full object-cover" loading="lazy" />
        <div className="absolute top-3 left-3">
          <span className="text-xs font-semibold px-2.5 py-1 bg-white/90 rounded-full text-[#174FC7]">{apt.type}</span>
        </div>
        <div className="absolute top-3 right-3">
          <span className="text-xs font-semibold px-2.5 py-1 bg-[#ECFDF5] text-[#16834B] rounded-full flex items-center gap-1">
            <svg width="8" height="8" viewBox="0 0 8 8" fill="currentColor"><circle cx="4" cy="4" r="4" /></svg>
            Available
          </span>
        </div>
      </div>
      <div className="p-5">
        <h3 className="font-bold text-[#111827] mb-1">{apt.name}</h3>
        <p className="text-xs text-[#667085] mb-3">{apt.location}, Lagos · Up to {apt.capacity} guests</p>
        <div className="flex items-end justify-between mb-4">
          <div>
            <span className="font-bold text-[#111827]">{formatPrice(apt.pricePerNight)}</span>
            <span className="text-xs text-[#667085]"> / night</span>
            {total && <p className="text-xs text-[#174FC7] font-medium mt-0.5">Est. {formatPrice(total)} total</p>}
          </div>
        </div>
        <Link
          to={`/apartments/${apt.id}${checkIn ? `?checkIn=${checkIn}&checkOut=${checkOut}&guests=${guests}` : ''}`}
          className="block w-full py-2.5 text-center bg-[#174FC7] text-white font-semibold rounded-xl hover:bg-[#0B2F70] transition-colors text-sm"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}

const inputCls = 'w-full px-3.5 py-2.5 rounded-xl border border-[#E4EAF2] bg-white text-sm text-[#111827] outline-none focus:border-[#174FC7] focus:ring-2 focus:ring-[#174FC7]/20 transition-colors';
