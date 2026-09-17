import { useState } from 'react';
import { BRAND } from '../data/config';

const reasons = ['Booking', 'Availability', 'Apartment information', 'General question', 'Other'];

interface Form {
  name: string;
  whatsapp: string;
  email: string;
  reason: string;
  message: string;
}

export default function ContactPage() {
  const [form, setForm] = useState<Form>({ name: '', whatsapp: '', email: '', reason: 'Booking', message: '' });
  const [errors, setErrors] = useState<Partial<Form>>({});
  const [submitted, setSubmitted] = useState(false);

  const validate = () => {
    const e: Partial<Form> = {};
    if (!form.name.trim()) e.name = 'Please enter your name.';
    if (!form.whatsapp.trim()) e.whatsapp = 'Please enter your WhatsApp number.';
    if (!form.message.trim()) e.message = 'Please enter a message.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFD] pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-[#111827] mb-2">How can we help?</h1>
          <p className="text-[#667085]">We're here when you need us. Send a message or reach us directly on WhatsApp.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
          {/* Form */}
          <div className="lg:col-span-3">
            {!submitted ? (
              <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-[#E4EAF2] p-6 sm:p-8 space-y-5">
                <Field label="Full Name" required error={errors.name}>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Your full name"
                    className={inputCls(!!errors.name)}
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
                <Field label="Email Address">
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="you@email.com"
                    className={inputCls(false)}
                  />
                </Field>
                <Field label="Reason for Enquiry">
                  <select
                    value={form.reason}
                    onChange={(e) => setForm({ ...form, reason: e.target.value })}
                    className={inputCls(false)}
                  >
                    {reasons.map((r) => <option key={r}>{r}</option>)}
                  </select>
                </Field>
                <Field label="Message" required error={errors.message}>
                  <textarea
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="Tell us how we can help..."
                    rows={5}
                    className={inputCls(!!errors.message) + ' resize-none'}
                  />
                </Field>
                <button
                  type="submit"
                  className="w-full py-3.5 bg-[#174FC7] text-white font-semibold rounded-xl hover:bg-[#0B2F70] transition-colors text-sm"
                >
                  Send Enquiry
                </button>
              </form>
            ) : (
              <div className="bg-white rounded-2xl border border-[#E4EAF2] p-10 flex flex-col items-center text-center">
                <div className="w-14 h-14 rounded-full bg-[#ECFDF5] flex items-center justify-center mb-4">
                  <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                    <path d="M5 14L11 20L23 8" stroke="#16834B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <h2 className="font-bold text-xl text-[#111827] mb-2">Message received</h2>
                <p className="text-sm text-[#667085] max-w-sm">
                  We'll get back to you as soon as we can — usually within a few hours on WhatsApp.
                </p>
              </div>
            )}
          </div>

          {/* Contact info */}
          <div className="lg:col-span-2 space-y-5">
            <div className="bg-white rounded-2xl border border-[#E4EAF2] p-6 space-y-4">
              <h3 className="font-semibold text-[#111827]">Reach us directly</h3>
              <ContactItem icon={<WhatsappIcon />} label="WhatsApp" value={BRAND.phone} href={`https://wa.me/${BRAND.whatsappNumber}`} />
              <ContactItem icon={<PhoneIcon />} label="Phone" value={BRAND.phone} href={`tel:${BRAND.phone}`} />
              <ContactItem icon={<EmailIcon />} label="Email" value={BRAND.email} href={`mailto:${BRAND.email}`} />
              <ContactItem icon={<LocationIcon />} label="Location" value={BRAND.city} />
            </div>

            <div className="bg-[#EEF4FF] rounded-2xl p-6">
              <p className="font-semibold text-[#0B2F70] mb-2">Prefer WhatsApp?</p>
              <p className="text-sm text-[#667085] mb-4">Most guests find it easiest to reach us directly on WhatsApp.</p>
              <a
                href={`https://wa.me/${BRAND.whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-3 bg-[#25D366] text-white font-semibold rounded-xl hover:bg-[#1ebe5c] transition-colors text-sm"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                Chat with us
              </a>
            </div>
          </div>
        </div>
      </div>
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

function ContactItem({ icon, label, value, href }: { icon: React.ReactNode; label: string; value: string; href?: string }) {
  const content = (
    <div className="flex items-start gap-3">
      <div className="w-9 h-9 rounded-xl bg-[#EEF4FF] flex items-center justify-center text-[#174FC7] flex-shrink-0">
        {icon}
      </div>
      <div>
        <p className="text-xs text-[#667085]">{label}</p>
        <p className="text-sm font-medium text-[#111827]">{value}</p>
      </div>
    </div>
  );
  if (href) return <a href={href} target={href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer" className="block hover:opacity-80 transition-opacity">{content}</a>;
  return <div>{content}</div>;
}

const WhatsappIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>;
const PhoneIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 8.81a19.79 19.79 0 01-3.07-8.68A2 2 0 012 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 7.91a16 16 0 006.72 6.72l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" /></svg>;
const EmailIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>;
const LocationIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" /></svg>;

function inputCls(error: boolean): string {
  return `w-full px-3.5 py-2.5 rounded-xl border text-sm text-[#111827] bg-white outline-none transition-colors focus:ring-2 focus:ring-[#174FC7]/20 ${
    error ? 'border-red-400 focus:border-red-400' : 'border-[#E4EAF2] focus:border-[#174FC7]'
  }`;
}
