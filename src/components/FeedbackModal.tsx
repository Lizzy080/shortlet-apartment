import { useState, useEffect } from 'react';
import { apartments } from '../data/apartments';

interface Props {
  onClose: () => void;
}

export default function FeedbackModal({ onClose }: Props) {
  const [form, setForm] = useState({ name: '', apartment: '', rating: 0, feedback: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = 'Please enter your name.';
    if (!form.rating) e.rating = 'Please select a rating.';
    if (!form.feedback.trim()) e.feedback = 'Please share your feedback.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white w-full sm:max-w-md sm:rounded-2xl rounded-t-2xl shadow-2xl">
        {!submitted ? (
          <>
            <div className="px-6 pt-6 pb-4 border-b border-[#E4EAF2]">
              <button onClick={onClose} className="absolute right-5 top-5 p-1.5 rounded-lg hover:bg-[#F3F4F6] transition-colors" aria-label="Close">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M2 2L16 16M16 2L2 16" stroke="#374151" strokeWidth="2" strokeLinecap="round" /></svg>
              </button>
              <h2 className="font-bold text-xl text-[#111827]">Share your feedback</h2>
              <p className="text-sm text-[#667085] mt-1">We'd love to hear about your experience.</p>
            </div>

            <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#374151] mb-1.5">Your Name <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Your name"
                  className={inputCls(!!errors.name)}
                />
                {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-[#374151] mb-1.5">Apartment Stayed</label>
                <select
                  value={form.apartment}
                  onChange={(e) => setForm({ ...form, apartment: e.target.value })}
                  className={inputCls(false)}
                >
                  <option value="">Select apartment</option>
                  {apartments.map((a) => (
                    <option key={a.id} value={a.name}>{a.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#374151] mb-2">Rating <span className="text-red-500">*</span></label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setForm({ ...form, rating: n })}
                      className="text-2xl transition-transform hover:scale-110 focus:outline-none"
                      aria-label={`${n} star${n !== 1 ? 's' : ''}`}
                    >
                      {n <= form.rating ? '★' : '☆'}
                    </button>
                  ))}
                </div>
                {errors.rating && <p className="mt-1 text-xs text-red-500">{errors.rating}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-[#374151] mb-1.5">Your Feedback <span className="text-red-500">*</span></label>
                <textarea
                  value={form.feedback}
                  onChange={(e) => setForm({ ...form, feedback: e.target.value })}
                  placeholder="Tell us about your stay..."
                  rows={4}
                  className={inputCls(!!errors.feedback) + ' resize-none'}
                />
                {errors.feedback && <p className="mt-1 text-xs text-red-500">{errors.feedback}</p>}
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-[#174FC7] text-white font-semibold rounded-xl hover:bg-[#0B2F70] transition-colors text-sm"
              >
                Send Feedback
              </button>
            </form>
          </>
        ) : (
          <div className="px-6 py-10 flex flex-col items-center text-center">
            <div className="w-14 h-14 rounded-full bg-[#ECFDF5] flex items-center justify-center mb-4">
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                <path d="M5 14L11 20L23 8" stroke="#16834B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h2 className="font-bold text-xl text-[#111827] mb-2">Thank you!</h2>
            <p className="text-sm text-[#667085] mb-6">Your feedback means a lot to us. We'll use it to keep improving our spaces and service.</p>
            <button onClick={onClose} className="px-6 py-2.5 bg-[#174FC7] text-white font-semibold rounded-xl hover:bg-[#0B2F70] transition-colors text-sm">
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function inputCls(error: boolean) {
  return `w-full px-3.5 py-2.5 rounded-xl border text-sm text-[#111827] bg-white outline-none transition-colors focus:ring-2 focus:ring-[#174FC7]/20 ${
    error ? 'border-red-400 focus:border-red-400' : 'border-[#E4EAF2] focus:border-[#174FC7]'
  }`;
}
