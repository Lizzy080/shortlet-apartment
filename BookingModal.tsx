import { useState, useEffect } from 'react';
import { Apartment, formatPrice } from '../data/apartments';
import { BRAND } from '../data/config';

interface Props {
  apartment: Apartment;
  checkIn: string;
  checkOut: string;
  guests: number;
  onClose: () => void;
}

interface FormData {
  fullName: string;
  whatsapp: string;
  email: string;
  arrivalHour: string;
  arrivalMinute: string;
  arrivalAmPm: string;
  specialRequests: string;
  agreed: boolean;
}

interface Errors {
  fullName?: string;
  whatsapp?: string;
  email?: string;
  agreed?: string;
}

function nightsBetween(a: string, b: string): number {
  if (!a || !b) return 0;
  return Math.max(0, Math.round((new Date(b).getTime() - new Date(a).getTime()) / 86400000));
}

function formatDate(d: string) {
  if (!d) return '';
  return new Date(d + 'T12:00:00').toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
}

export default function BookingModal({ apartment, checkIn, checkOut, guests, onClose }: Props) {
  const [form, setForm] = useState<FormData>({
    fullName: '', whatsapp: '', email: '',
    arrivalHour: '', arrivalMinute: '00', arrivalAmPm: 'AM',
    specialRequests: '', agreed: false,
  });
  const [errors, setErrors] = useState<Errors>({});
  const [submitted, setSubmitted] = useState(false);
  const nights = nightsBetween(checkIn, checkOut);
  const total = nights * apartment.pricePerNight;

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const validate = (): boolean => {
    const e: Errors = {};
    if (!form.fullName.trim()) e.fullName = 'Please enter your full name.';
    if (!form.whatsapp.trim()) e.whatsapp = 'Please enter your WhatsApp number.';
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = 'Please enter a valid email address.';
    if (!form.agreed) e.agreed = 'Please agree to the booking terms.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) setSubmitted(true);
  };

  const whatsappMessage = encodeURIComponent(
    `Hello, I would like to make a booking request.\n\n` +
    `Apartment: ${apartment.name}\n` +
    `Location: ${apartment.location}, Lagos\n` +
    `Check-in: ${formatDate(checkIn)}\n` +
    `Check-out: ${formatDate(checkOut)}\n` +
    `Nights: ${nights}\n` +
    `Guests: ${guests}\n` +
    `Estimated total: ${formatPrice(total)}\n` +
    `Name: ${form.fullName}\n` +
    `WhatsApp: ${form.whatsapp}\n` +
    `Email: ${form.email}\n` +
    (form.arrivalHour ? `Estimated arrival: ${form.arrivalHour}:${form.arrivalMinute} ${form.arrivalAmPm}\n` : '') +
    (form.specialRequests ? `Special request: ${form.specialRequests}\n` : '')
  );

  const calendarUrl = (() => {
    if (!checkIn || !checkOut) return '#';
    const start = checkIn.replace(/-/g, '');
    const end = checkOut.replace(/-/g, '');
    const details = encodeURIComponent(
      `Booking Request — ${apartment.name}\nLocation: ${apartment.location}, Lagos\nGuests: ${guests}\nName: ${form.fullName}\nWhatsApp: ${form.whatsapp}\nEmail: ${form.email}\nNote: This is a booking REQUEST, not a confirmed reservation.`
    );
    const title = encodeURIComponent(`Booking Request — ${apartment.name}`);
    const loc = encodeURIComponent(`${apartment.location}, Lagos`);
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${start}/${end}&details=${details}&location=${loc}`;
  })();

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white w-full sm:max-w-xl sm:rounded-2xl rounded-t-2xl max-h-[92vh] overflow-y-auto shadow-2xl">
        {!submitted ? (
          <>
            <div className="sticky top-0 bg-white z-10 px-6 pt-6 pb-4 border-b border-[#E4EAF2]">
              <button onClick={onClose} className="absolute right-5 top-5 p-1.5 rounded-lg hover:bg-[#F3F4F6] transition-colors" aria-label="Close">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M2 2L16 16M16 2L2 16" stroke="#374151" strokeWidth="2" strokeLinecap="round" /></svg>
              </button>
              <h2 className="font-bold text-xl text-[#111827]">Request your stay</h2>
              <p className="text-sm text-[#667085] mt-1">Tell us a little about your stay and we'll help confirm your booking.</p>
            </div>

            <form onSubmit={handleSubmit} className="px-6 py-5 space-y-6">
              {/* Stay Summary */}
              <section>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-[#667085] mb-3">Your Stay</h3>
                <div className="bg-[#F8FAFD] rounded-xl p-4 space-y-2 text-sm">
                  <Row label="Apartment" value={apartment.name} />
                  <Row label="Location" value={`${apartment.location}, Lagos`} />
                  {checkIn && <Row label="Check-in" value={formatDate(checkIn)} />}
                  {checkOut && <Row label="Check-out" value={formatDate(checkOut)} />}
                  {nights > 0 && <Row label="Nights" value={`${nights} night${nights !== 1 ? 's' : ''}`} />}
                  <Row label="Guests" value={`${guests} guest${guests !== 1 ? 's' : ''}`} />
                  {total > 0 && <Row label="Estimated total" value={formatPrice(total)} highlight />}
                </div>
              </section>

              {/* Your details */}
              <section>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-[#667085] mb-3">Your Details</h3>
                <div className="space-y-3">
                  <Field label="Full Name" required error={errors.fullName}>
                    <input
                      type="text"
                      value={form.fullName}
                      onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                      placeholder="Your full name"
                      className={inputCls(!!errors.fullName)}
                    />
                  </Field>
                  <Field label="WhatsApp Number" required error={errors.whatsapp}>
                    <input
                      type="tel"
                      value={form.whatsapp}
                      onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
                      placeholder="+234 ..."
                      className={inputCls(!!errors.whatsapp)}
                    />
                  </Field>
                  <Field label="Email Address" required error={errors.email}>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="you@email.com"
                      className={inputCls(!!errors.email)}
                    />
                  </Field>
                </div>
              </section>

              {/* Additional info */}
              <section>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-[#667085] mb-3">Additional Information</h3>
                <div className="space-y-3">
                  <Field label="Estimated Arrival Time">
                    <div className="flex gap-2">
                      <select
                        value={form.arrivalHour}
                        onChange={(e) => setForm({ ...form, arrivalHour: e.target.value })}
                        className={inputCls(false) + ' flex-1'}
                      >
                        <option value="">Hour</option>
                        {[...Array(12)].map((_, i) => {
                          const h = String(i + 1).padStart(2, '0');
                          return <option key={h} value={h}>{h}</option>;
                        })}
                      </select>
                      <select
                        value={form.arrivalMinute}
                        onChange={(e) => setForm({ ...form, arrivalMinute: e.target.value })}
                        className={inputCls(false) + ' w-20'}
                        disabled={!form.arrivalHour}
                      >
                        {['00', '15', '30', '45'].map((m) => (
                          <option key={m} value={m}>{m}</option>
                        ))}
                      </select>
                      <select
                        value={form.arrivalAmPm}
                        onChange={(e) => setForm({ ...form, arrivalAmPm: e.target.value })}
                        className={inputCls(false) + ' w-20'}
                        disabled={!form.arrivalHour}
                      >
                        <option value="AM">AM</option>
                        <option value="PM">PM</option>
                      </select>
                    </div>
                  </Field>
                  <Field label="Special Requests">
                    <textarea
                      value={form.specialRequests}
                      onChange={(e) => setForm({ ...form, specialRequests: e.target.value })}
                      placeholder="Anything we should know?"
                      rows={3}
                      className={inputCls(false) + ' resize-none'}
                    />
                  </Field>
                </div>
              </section>

              {/* Agreement */}
              <div>
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.agreed}
                    onChange={(e) => setForm({ ...form, agreed: e.target.checked })}
                    className="mt-0.5 w-4 h-4 accent-[#174FC7] flex-shrink-0"
                  />
                  <span className="text-sm text-[#374151]">I agree to the booking terms and house rules.</span>
                </label>
                {errors.agreed && <p className="mt-1 text-xs text-red-500">{errors.agreed}</p>}
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-[#174FC7] text-white font-semibold rounded-xl hover:bg-[#0B2F70] transition-colors text-sm"
              >
                Send Booking Request
              </button>
            </form>
          </>
        ) : (
          <div className="px-6 py-8">
            <button onClick={onClose} className="absolute right-5 top-5 p-1.5 rounded-lg hover:bg-[#F3F4F6] transition-colors" aria-label="Close">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M2 2L16 16M16 2L2 16" stroke="#374151" strokeWidth="2" strokeLinecap="round" /></svg>
            </button>

            <div className="flex flex-col items-center text-center mb-6">
              <div className="w-14 h-14 rounded-full bg-[#ECFDF5] flex items-center justify-center mb-4">
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                  <path d="M5 14L11 20L23 8" stroke="#16834B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <h2 className="font-bold text-xl text-[#111827] mb-2">Booking request received.</h2>
              <p className="text-sm text-[#667085] max-w-sm">
                We've received your request. Continue to WhatsApp so we can confirm availability and next steps with you.
              </p>
            </div>

            {/* Summary */}
            <div className="bg-[#F8FAFD] rounded-xl p-4 space-y-2 text-sm mb-6">
              <Row label="Apartment" value={apartment.name} />
              <Row label="Location" value={`${apartment.location}, Lagos`} />
              {checkIn && <Row label="Check-in" value={formatDate(checkIn)} />}
              {checkOut && <Row label="Check-out" value={formatDate(checkOut)} />}
              <Row label="Guests" value={`${guests}`} />
              <Row label="Guest name" value={form.fullName} />
            </div>

            <div className="space-y-3">
              <a
                href={`https://wa.me/${BRAND.whatsappNumber}?text=${whatsappMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-3.5 bg-[#25D366] text-white font-semibold rounded-xl hover:bg-[#1ebe5c] transition-colors text-sm"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                Continue to WhatsApp
              </a>
              <a
                href={calendarUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-3.5 bg-white border border-[#E4EAF2] text-[#374151] font-semibold rounded-xl hover:bg-[#F8FAFD] transition-colors text-sm"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" />
                  <path d="M16 2v4M8 2v4M3 10h18" />
                </svg>
                Add to Google Calendar
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Row({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex justify-between items-start gap-4">
      <span className="text-[#667085] flex-shrink-0">{label}</span>
      <span className={`font-medium text-right ${highlight ? 'text-[#174FC7]' : 'text-[#111827]'}`}>{value}</span>
    </div>
  );
}

function Field({ label, required, error, children }: { label: string; required?: boolean; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium text-[#374151] mb-1.5">
        {label}{required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}

function inputCls(error: boolean): string {
  return `w-full px-3.5 py-2.5 rounded-xl border text-sm text-[#111827] bg-white outline-none transition-colors focus:ring-2 focus:ring-[#174FC7]/20 ${
    error ? 'border-red-400 focus:border-red-400' : 'border-[#E4EAF2] focus:border-[#174FC7]'
  }`;
}
