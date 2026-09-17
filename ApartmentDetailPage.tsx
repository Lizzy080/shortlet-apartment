import { useState, useEffect, useRef } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { getApartmentById, formatPrice, isDateUnavailable } from '../data/apartments';
import MiniCalendar from '../components/MiniCalendar';
import BookingModal from '../components/BookingModal';

function formatDateDisplay(d: string) {
  if (!d) return '';
  return new Date(d + 'T12:00:00').toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
}
function nightsBetween(a: string, b: string) {
  if (!a || !b) return 0;
  return Math.max(0, Math.round((new Date(b).getTime() - new Date(a).getTime()) / 86400000));
}

const amenityIconMap: Record<string, React.ReactNode> = {
  'Wi-Fi': <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M2 7C5.5 3.5 14.5 3.5 18 7M5 10C7.2 7.8 12.8 7.8 15 10M8 13h.5M10 13a1 1 0 110 2 1 1 0 010-2z" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /></svg>,
  '24/7 Power': <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M10 2v7M7 4.5A7 7 0 1010 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /></svg>,
  'Air Conditioning': <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><rect x="3" y="6" width="14" height="6" rx="2" stroke="currentColor" strokeWidth="1.4" /><path d="M7 12v3M10 12v3M13 12v3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /></svg>,
  'Smart TV': <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><rect x="2" y="4" width="16" height="10" rx="2" stroke="currentColor" strokeWidth="1.4" /><path d="M7 15l-1 2M13 15l1 2M7 17h6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /></svg>,
  'Fully Equipped Kitchen': <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><rect x="3" y="3" width="14" height="14" rx="2" stroke="currentColor" strokeWidth="1.4" /><path d="M3 8h14" stroke="currentColor" strokeWidth="1.4" /><circle cx="7" cy="5.5" r="1" fill="currentColor" /><circle cx="10" cy="5.5" r="1" fill="currentColor" /></svg>,
  'Kitchenette': <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><rect x="3" y="3" width="14" height="14" rx="2" stroke="currentColor" strokeWidth="1.4" /><path d="M3 8h14" stroke="currentColor" strokeWidth="1.4" /><circle cx="7" cy="5.5" r="1" fill="currentColor" /></svg>,
  'Refrigerator': <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><rect x="5" y="2" width="10" height="16" rx="2" stroke="currentColor" strokeWidth="1.4" /><path d="M5 9h10" stroke="currentColor" strokeWidth="1.4" /><path d="M8 6v1M8 12v3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /></svg>,
  'Microwave': <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><rect x="2" y="5" width="16" height="10" rx="2" stroke="currentColor" strokeWidth="1.4" /><rect x="4" y="7" width="9" height="6" rx="1" stroke="currentColor" strokeWidth="1.2" /><circle cx="16" cy="10" r="1" fill="currentColor" /></svg>,
  'Washing Machine': <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><rect x="3" y="3" width="14" height="14" rx="2" stroke="currentColor" strokeWidth="1.4" /><circle cx="10" cy="12" r="4" stroke="currentColor" strokeWidth="1.2" /><path d="M5 6h2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" /></svg>,
  'Hot Water': <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M7 16c0-3 6-3 6-6a3 3 0 00-6 0c0 3 6 3 6 6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /></svg>,
  'Parking': <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><rect x="3" y="3" width="14" height="14" rx="2" stroke="currentColor" strokeWidth="1.4" /><path d="M8 14V6h3a3 3 0 010 6H8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /></svg>,
  'Security': <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M10 2l7 3v5c0 4-3.5 7-7 8-3.5-1-7-4-7-8V5l7-3z" stroke="currentColor" strokeWidth="1.4" /></svg>,
  'Workspace': <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><rect x="2" y="4" width="16" height="10" rx="2" stroke="currentColor" strokeWidth="1.4" /><path d="M6 18h8M10 14v4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /></svg>,
  'Dining Area': <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M5 3v14M15 3v5a2 2 0 01-2 2v7M3 10h4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /></svg>,
};

export default function ApartmentDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();

  const apt = getApartmentById(id || '');
  const [activeImg, setActiveImg] = useState(0);
  const [checkIn, setCheckIn] = useState(searchParams.get('checkIn') || '');
  const [checkOut, setCheckOut] = useState(searchParams.get('checkOut') || '');
  const [guests, setGuests] = useState(Number(searchParams.get('guests')) || 1);
  const [calOpen, setCalOpen] = useState<'in' | 'out' | null>(null);
  const [bookingOpen, setBookingOpen] = useState(false);
  const calRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (calRef.current && !calRef.current.contains(e.target as Node)) setCalOpen(null);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  if (!apt) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-[#111827] mb-3">Apartment not found</h2>
          <Link to="/apartments" className="text-sm text-[#174FC7] underline">Browse all apartments</Link>
        </div>
      </div>
    );
  }

  const nights = nightsBetween(checkIn, checkOut);
  const total = nights * apt.pricePerNight;

  const rangeAvailable = (() => {
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
  })();

  return (
    <div className="min-h-screen bg-[#F8FAFD] pt-16">
      {/* Image gallery — neutral background, no corner radius */}
      <div className="bg-[#F8FAFD] pt-2 pb-4 border-b border-[#E4EAF2]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          {/* Main image — no border radius */}
          <div className="w-full h-72 sm:h-96 lg:h-[480px] overflow-hidden bg-[#EEF4FF] mb-3">
            <img
              src={apt.images.gallery[activeImg]}
              alt={`${apt.name} - image ${activeImg + 1}`}
              className="w-full h-full object-cover transition-opacity duration-300"
            />
          </div>
          {/* Horizontal thumbnail strip */}
          <div className="flex gap-2 overflow-x-auto pb-1">
            {apt.images.gallery.map((img, i) => (
              <button
                key={i}
                onClick={() => setActiveImg(i)}
                className={`flex-shrink-0 w-20 h-14 sm:w-24 sm:h-16 overflow-hidden transition-all ${
                  activeImg === i ? 'ring-2 ring-[#174FC7] opacity-100' : 'opacity-50 hover:opacity-80'
                }`}
              >
                <img src={img} alt="" className="w-full h-full object-cover" loading="lazy" />
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Left: apartment info */}
          <div className="lg:col-span-2">
            {/* Breadcrumb */}
            <nav className="text-xs text-[#667085] mb-4">
              <Link to="/" className="hover:text-[#174FC7]">Home</Link>
              <span className="mx-2">›</span>
              <Link to="/apartments" className="hover:text-[#174FC7]">Apartments</Link>
              <span className="mx-2">›</span>
              <span className="text-[#111827]">{apt.name}</span>
            </nav>

            <div className="mb-6">
              <span className="text-xs font-semibold px-2.5 py-1 bg-[#EEF4FF] rounded-full text-[#174FC7] mb-3 inline-block">{apt.type}</span>
              <h1 className="text-3xl font-bold text-[#111827] mb-2">{apt.name}</h1>
              <p className="text-[#667085] flex items-center gap-1.5">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 1C4.8 1 3 2.8 3 5c0 3.5 4 7 4 7s4-3.5 4-7c0-2.2-1.8-4-4-4z" stroke="#667085" strokeWidth="1.2" /><circle cx="7" cy="5" r="1.5" stroke="#667085" strokeWidth="1.2" /></svg>
                {apt.location}, Lagos
              </p>
            </div>

            {/* Description */}
            <section className="mb-8 pb-8 border-b border-[#E4EAF2]">
              <h2 className="text-xl font-bold text-[#111827] mb-3">About this apartment</h2>
              <p className="text-[#374151] leading-relaxed">{apt.longDescription}</p>
            </section>

            {/* Amenities */}
            <section className="mb-8 pb-8 border-b border-[#E4EAF2]">
              <h2 className="text-xl font-bold text-[#111827] mb-5">Amenities</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {apt.amenities.map((a) => (
                  <div key={a} className="flex items-center gap-3 p-3 bg-white rounded-xl border border-[#E4EAF2]">
                    <span className="text-[#174FC7] flex-shrink-0">{amenityIconMap[a] || <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="4" stroke="currentColor" strokeWidth="1.4" /></svg>}</span>
                    <span className="text-sm text-[#374151]">{a}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Spaces */}
            <section className="mb-8 pb-8 border-b border-[#E4EAF2]">
              <h2 className="text-xl font-bold text-[#111827] mb-4">Space details</h2>
              <div className="flex flex-wrap gap-2">
                {apt.spaces.map((s) => (
                  <span key={s} className="px-3 py-1.5 bg-[#EEF4FF] text-[#174FC7] text-sm font-medium rounded-full">{s}</span>
                ))}
              </div>
            </section>

            {/* Location — simple inline, no separate card */}
            <p className="text-sm text-[#667085] flex items-center gap-1.5">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 1C4.8 1 3 2.8 3 5c0 3.5 4 7 4 7s4-3.5 4-7c0-2.2-1.8-4-4-4z" stroke="#667085" strokeWidth="1.2" /><circle cx="7" cy="5" r="1.5" stroke="#667085" strokeWidth="1.2" /></svg>
              {apt.location}, Lagos
            </p>
          </div>

          {/* Right: booking card */}
          <div className="lg:col-span-1" ref={calRef}>
            <div className="sticky top-20">
              <div className="bg-white rounded-2xl border border-[#E4EAF2] shadow-md p-6">
                <div className="mb-5">
                  <span className="text-2xl font-bold text-[#111827]">{formatPrice(apt.pricePerNight)}</span>
                  <span className="text-[#667085] text-sm"> / night</span>
                </div>

                <div className="mb-1">
                  <p className="text-xs font-semibold text-[#667085] uppercase mb-3">Your Stay</p>

                  {/* Date grid */}
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    <div className="relative">
                      <label className="block text-xs font-medium text-[#667085] mb-1">Check-in</label>
                      <button
                        onClick={() => setCalOpen(calOpen === 'in' ? null : 'in')}
                        className="w-full text-left px-3 py-2.5 border border-[#E4EAF2] rounded-xl text-sm text-[#111827] hover:border-[#174FC7] transition-colors"
                      >
                        {checkIn ? formatDateDisplay(checkIn) : <span className="text-[#9CA3AF]">Select date</span>}
                      </button>
                      {calOpen === 'in' && (
                        <div className="absolute top-full left-0 mt-1 z-30 -translate-x-1/4">
                          <MiniCalendar
                            value={checkIn}
                            onChange={(d) => { setCheckIn(d); if (checkOut && d >= checkOut) setCheckOut(''); setCalOpen('out'); }}
                            disabledDates={apt.unavailableDates}
                            onClose={() => setCalOpen(null)}
                          />
                        </div>
                      )}
                    </div>
                    <div className="relative">
                      <label className="block text-xs font-medium text-[#667085] mb-1">Check-out</label>
                      <button
                        onClick={() => setCalOpen(calOpen === 'out' ? null : 'out')}
                        className="w-full text-left px-3 py-2.5 border border-[#E4EAF2] rounded-xl text-sm text-[#111827] hover:border-[#174FC7] transition-colors"
                      >
                        {checkOut ? formatDateDisplay(checkOut) : <span className="text-[#9CA3AF]">Select date</span>}
                      </button>
                      {calOpen === 'out' && (
                        <div className="absolute top-full left-0 mt-1 z-30 -translate-x-1/4">
                          <MiniCalendar
                            value={checkOut}
                            onChange={(d) => { setCheckOut(d); setCalOpen(null); }}
                            minDate={checkIn || undefined}
                            disabledDates={apt.unavailableDates}
                            onClose={() => setCalOpen(null)}
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Guests */}
                  <div className="mb-4">
                    <label className="block text-xs font-medium text-[#667085] mb-1">Guests</label>
                    <div className="flex items-center justify-between px-3 py-2.5 border border-[#E4EAF2] rounded-xl">
                      <button onClick={() => setGuests(Math.max(1, guests - 1))} className="w-7 h-7 rounded-full border border-[#E4EAF2] flex items-center justify-center text-[#374151] hover:border-[#174FC7] transition-colors">−</button>
                      <span className="text-sm font-medium">{guests} guest{guests !== 1 ? 's' : ''}</span>
                      <button onClick={() => setGuests(Math.min(apt.capacity, guests + 1))} className="w-7 h-7 rounded-full border border-[#E4EAF2] flex items-center justify-center text-[#374151] hover:border-[#174FC7] transition-colors">+</button>
                    </div>
                  </div>

                  {/* Nights + total */}
                  {nights > 0 && (
                    <div className="space-y-2 py-3 border-t border-[#E4EAF2] mb-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-[#667085]">{formatPrice(apt.pricePerNight)} × {nights} night{nights !== 1 ? 's' : ''}</span>
                        <span className="font-medium text-[#111827]">{formatPrice(total)}</span>
                      </div>
                    </div>
                  )}

                  {/* Availability status */}
                  {checkIn && checkOut && (
                    <div className={`px-3 py-2.5 rounded-xl text-sm font-medium mb-4 flex items-center gap-2 ${rangeAvailable ? 'bg-[#ECFDF5] text-[#16834B]' : 'bg-[#FEF2F2] text-[#EF4444]'}`}>
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor"><circle cx="7" cy="7" r="7" opacity="0.2" /><circle cx="7" cy="7" r="3.5" /></svg>
                      {rangeAvailable ? 'Available for your selected dates' : 'Unavailable for these dates'}
                    </div>
                  )}
                </div>

                <button
                  onClick={() => setBookingOpen(true)}
                  disabled={!rangeAvailable && checkIn !== '' && checkOut !== ''}
                  className="w-full py-3.5 bg-[#174FC7] text-white font-semibold rounded-xl hover:bg-[#0B2F70] transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Book Now
                </button>

                <p className="text-xs text-[#667085] text-center mt-3">
                  No charge now — you'll confirm via WhatsApp
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile sticky bar */}
      <div className="fixed bottom-0 left-0 right-0 lg:hidden z-40 bg-white border-t border-[#E4EAF2] px-4 py-3 flex items-center justify-between gap-4">
        <div>
          <span className="font-bold text-[#111827]">{formatPrice(apt.pricePerNight)}</span>
          <span className="text-xs text-[#667085]">/night</span>
          {nights > 0 && <p className="text-xs text-[#667085]">{nights} nights · {formatPrice(total)}</p>}
        </div>
        <button
          onClick={() => setBookingOpen(true)}
          disabled={!rangeAvailable && checkIn !== '' && checkOut !== ''}
          className="px-5 py-3 bg-[#174FC7] text-white font-semibold rounded-xl hover:bg-[#0B2F70] transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Book Now
        </button>
      </div>

      {bookingOpen && (
        <BookingModal
          apartment={apt}
          checkIn={checkIn}
          checkOut={checkOut}
          guests={guests}
          onClose={() => setBookingOpen(false)}
        />
      )}
    </div>
  );
}

