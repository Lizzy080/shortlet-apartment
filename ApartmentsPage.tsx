import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { apartments, formatPrice } from '../data/apartments';
import { APARTMENT_TYPES, LOCATIONS } from '../data/config';

const ALL_TYPES = ['All', ...APARTMENT_TYPES];

export default function ApartmentsPage() {
  const [params, setParams] = useSearchParams();
  const [activeType, setActiveType] = useState(params.get('type') || 'All');
  const [activeLocation, setActiveLocation] = useState(params.get('location') || '');

  useEffect(() => {
    const t = params.get('type');
    const l = params.get('location');
    if (t) setActiveType(t);
    if (l) setActiveLocation(l);
  }, [params]);

  const filtered = apartments.filter((a) => {
    const typeMatch = activeType === 'All' || a.type === activeType;
    const locMatch = !activeLocation || a.location === activeLocation;
    return typeMatch && locMatch;
  });

  return (
    <div className="min-h-screen bg-[#F8FAFD] pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-[#111827] mb-2">Our Apartments</h1>
          <p className="text-[#667085]">Explore our collection of thoughtfully furnished shortlet apartments across Lagos.</p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          {/* Type tabs */}
          <div className="flex overflow-x-auto gap-2 pb-1">
            {ALL_TYPES.map((t) => (
              <button
                key={t}
                onClick={() => setActiveType(t)}
                className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                  activeType === t
                    ? 'bg-[#174FC7] text-white'
                    : 'bg-white text-[#374151] border border-[#E4EAF2] hover:border-[#174FC7] hover:text-[#174FC7]'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Location filter */}
          <select
            value={activeLocation}
            onChange={(e) => setActiveLocation(e.target.value)}
            className="px-4 py-2 rounded-xl border border-[#E4EAF2] bg-white text-sm text-[#374151] outline-none focus:border-[#174FC7] transition-colors sm:ml-auto"
          >
            <option value="">All Locations</option>
            {LOCATIONS.map((l) => <option key={l} value={l}>{l}</option>)}
          </select>
        </div>

        {/* Grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map((apt) => (
              <AptCard key={apt.id} apt={apt} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="w-16 h-16 rounded-2xl bg-[#EEF4FF] flex items-center justify-center mx-auto mb-4">
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none"><circle cx="14" cy="14" r="11" stroke="#174FC7" strokeWidth="1.5" /><path d="M14 10v5M14 17v1" stroke="#174FC7" strokeWidth="1.5" strokeLinecap="round" /></svg>
            </div>
            <h3 className="font-semibold text-[#111827] mb-2">No apartments match</h3>
            <p className="text-sm text-[#667085] mb-5">Try a different type or location.</p>
            <button
              onClick={() => { setActiveType('All'); setActiveLocation(''); }}
              className="px-5 py-2.5 bg-[#174FC7] text-white font-semibold rounded-xl text-sm hover:bg-[#0B2F70] transition-colors"
            >
              View All Apartments
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function AptCard({ apt }: { apt: typeof apartments[number] }) {
  return (
    <Link
      to={`/apartments/${apt.id}`}
      className="group block bg-white rounded-2xl overflow-hidden border border-[#E4EAF2] hover:shadow-lg hover:border-[#C7D7F5] transition-all"
    >
      <div className="h-52 overflow-hidden bg-[#EEF4FF] relative">
        <img
          src={apt.images.hero}
          alt={apt.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute top-3 left-3">
          <span className="text-xs font-semibold px-2.5 py-1 bg-white/90 rounded-full text-[#174FC7]">{apt.type}</span>
        </div>
      </div>
      <div className="p-5">
        <h3 className="font-bold text-[#111827] mb-1">{apt.name}</h3>
        <p className="text-xs text-[#667085] flex items-center gap-1 mb-2">
          <svg width="11" height="11" viewBox="0 0 11 11" fill="none"><path d="M5.5 1C3.567 1 2 2.567 2 4.5c0 2.9 3.5 5.5 3.5 5.5S9 7.4 9 4.5C9 2.567 7.433 1 5.5 1z" stroke="#667085" strokeWidth="1.2" /><circle cx="5.5" cy="4.5" r="1.2" stroke="#667085" strokeWidth="1.2" /></svg>
          {apt.location}
        </p>
        <p className="text-xs text-[#667085] mb-4 line-clamp-2">{apt.description}</p>
        <div className="flex items-center justify-between">
          <div>
            <span className="font-bold text-[#111827]">{formatPrice(apt.pricePerNight)}</span>
            <span className="text-xs text-[#667085]"> / night</span>
          </div>
          <span className="text-xs font-medium text-[#667085]">Up to {apt.capacity} guests</span>
        </div>
      </div>
    </Link>
  );
}
