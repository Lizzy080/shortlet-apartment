import { Link } from 'react-router-dom';
import { BRAND } from '../data/config';

const reasons = [
  { title: 'Comfortable spaces', desc: 'Every apartment is furnished to make your stay feel easy and personal.' },
  { title: 'Convenient locations', desc: 'We operate in Lagos neighbourhoods that keep you close to where you need to be.' },
  { title: 'Straightforward booking', desc: 'Browse, choose and request — no unnecessary steps or hidden surprises.' },
  { title: 'Responsive support', desc: 'When you need us, we\'re available. One message is all it takes.' },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFD] pt-20">
      {/* Hero */}
      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div>
              <span className="text-xs font-semibold uppercase tracking-widest text-[#174FC7] mb-4 block">About {BRAND.name}</span>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#111827] leading-tight mb-6">
                Your stay should feel easy from the moment you arrive.
              </h1>
              <div className="space-y-4 text-[#374151] leading-relaxed">
                <p>
                  {BRAND.name} provides thoughtfully furnished shortlet apartments across Lagos. Our spaces are designed for people who want more than just a bed to sleep in — guests who want to feel comfortable, settled and at home, even if they're only staying for a few nights.
                </p>
                <p>
                  We work in neighbourhoods that make sense: places where you can reach your meetings, enjoy the city and find what you need without wasting time in Lagos traffic. Whether you're here for business, leisure or a longer stint between homes, we have a space that suits you.
                </p>
                <p>
                  Booking is direct. There are no unnecessary intermediaries, no complicated platforms and no confusion about who to contact when you need something. You deal with us directly — on WhatsApp, by phone or through this website.
                </p>
              </div>
            </div>
            <div className="h-72 sm:h-96 rounded-2xl overflow-hidden bg-[#EEF4FF]">
              <img
                src="https://images.unsplash.com/photo-1758957701419-2c6e266f7988?w=900&h=700&fit=crop&auto=format"
                alt="Comfortable furnished apartment"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Why guests choose us */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#111827] mb-3">Why guests choose us</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {reasons.map(({ title, desc }) => (
              <div key={title} className="p-6 rounded-2xl border border-[#E4EAF2] hover:border-[#C7D7F5] hover:shadow-sm transition-all">
                <div className="w-10 h-10 rounded-xl bg-[#EEF4FF] flex items-center justify-center mb-4">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M4 10L8 14L16 6" stroke="#174FC7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <h3 className="font-semibold text-[#111827] mb-2">{title}</h3>
                <p className="text-sm text-[#667085] leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#EEF4FF] rounded-2xl p-8 sm:p-12 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <h2 className="text-2xl font-bold text-[#0B2F70] mb-2">Ready to find your space?</h2>
              <p className="text-[#667085]">Browse our apartments and book directly with us.</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
              <Link
                to="/apartments"
                className="px-6 py-3 bg-[#174FC7] text-white font-semibold rounded-xl hover:bg-[#0B2F70] transition-colors text-sm text-center"
              >
                Browse Apartments
              </Link>
              <Link
                to="/contact"
                className="px-6 py-3 bg-white text-[#374151] border border-[#E4EAF2] font-semibold rounded-xl hover:border-[#174FC7] hover:text-[#174FC7] transition-colors text-sm text-center"
              >
                Get in Touch
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
