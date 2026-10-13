'use client';

import React, { useState } from 'react';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  MessageSquare,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate inquiry submission
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setName('');
      setPhone('');
      setEmail('');
      setSubject('');
      setMessage('');
    }, 800);
  };

  return (
    <div className="bg-[#faf6f2] min-h-screen py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-[#b45f77]">
            Get In Touch
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#201a1c]">
            We’d Love to Hear From You
          </h1>
          <p className="text-xs sm:text-sm text-[#6b5e62]">
            Have an inquiry about an order, delivery status, or custom jewelry styling? Reach out to
            our dedicated support team anytime.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Information & Channels */}
          <div className="space-y-6">
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#efe8e1] shadow-xs space-y-6">
              <h3 className="text-base font-bold text-[#201a1c] border-b border-[#efe8e1] pb-3">
                Customer Support
              </h3>

              <div className="space-y-4 text-xs">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-[#fdf5f7] text-[#b45f77] flex items-center justify-center shrink-0">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-[#201a1c] block">Phone / Hotline</span>
                    <a href="tel:+8801711223344" className="text-[#6b5e62] hover:text-[#b45f77]">
                      +880 1711-223344
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-[#fdf5f7] text-[#b45f77] flex items-center justify-center shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-[#201a1c] block">Email Support</span>
                    <a
                      href="mailto:support@ishara.com.bd"
                      className="text-[#6b5e62] hover:text-[#b45f77]"
                    >
                      support@ishara.com.bd
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-[#fdf5f7] text-[#b45f77] flex items-center justify-center shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-[#201a1c] block">Showroom & Studio</span>
                    <p className="text-[#6b5e62]">
                      Road 11, Banani / Gulshan, Dhaka 1213, Bangladesh
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-[#fdf5f7] text-[#b45f77] flex items-center justify-center shrink-0">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-[#201a1c] block">Business Hours</span>
                    <p className="text-[#6b5e62]">Saturday – Thursday: 10:00 AM – 9:00 PM</p>
                    <p className="text-[#8c7e83]">Friday: 3:00 PM – 9:00 PM</p>
                  </div>
                </div>
              </div>

              {/* WhatsApp Quick Link */}
              <div className="pt-2">
                <a
                  href="https://wa.me/8801711223344?text=Hello%20Ishara%20Team!%20I%20have%20an%20inquiry."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-all shadow-xs flex items-center justify-center gap-2"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Chat Directly on WhatsApp</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>

          {/* Contact Inquiry Form */}
          <div className="lg:col-span-2">
            <div className="bg-white p-6 sm:p-10 rounded-3xl border border-[#efe8e1] shadow-xs space-y-6">
              <div>
                <h2 className="text-xl font-bold text-[#201a1c]">Send Us a Message</h2>
                <p className="text-xs text-[#6b5e62] mt-0.5">
                  Fill in your details and message, and our customer executive will reply within a
                  few hours.
                </p>
              </div>

              {isSubmitted && (
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>
                    Thank you! Your message has been received. Our team will get back to you
                    shortly.
                  </span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#201a1c] uppercase tracking-wider mb-1.5">
                      Your Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Farhana Ahmed"
                      className="w-full px-4 py-2.5 bg-[#faf6f2] border border-[#efe8e1] rounded-xl text-xs text-[#201a1c] focus:outline-none focus:border-[#b45f77]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#201a1c] uppercase tracking-wider mb-1.5">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="017XXXXXXXX"
                      className="w-full px-4 py-2.5 bg-[#faf6f2] border border-[#efe8e1] rounded-xl text-xs text-[#201a1c] focus:outline-none focus:border-[#b45f77]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#201a1c] uppercase tracking-wider mb-1.5">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="w-full px-4 py-2.5 bg-[#faf6f2] border border-[#efe8e1] rounded-xl text-xs text-[#201a1c] focus:outline-none focus:border-[#b45f77]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#201a1c] uppercase tracking-wider mb-1.5">
                      Inquiry Subject *
                    </label>
                    <input
                      type="text"
                      required
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder="e.g. Order Tracking or Product Query"
                      className="w-full px-4 py-2.5 bg-[#faf6f2] border border-[#efe8e1] rounded-xl text-xs text-[#201a1c] focus:outline-none focus:border-[#b45f77]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#201a1c] uppercase tracking-wider mb-1.5">
                    Your Message *
                  </label>
                  <textarea
                    rows={5}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Describe how we can assist you..."
                    className="w-full px-4 py-2.5 bg-[#faf6f2] border border-[#efe8e1] rounded-xl text-xs text-[#201a1c] focus:outline-none focus:border-[#b45f77]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-8 py-3 bg-[#b45f77] hover:bg-[#9e4a62] disabled:opacity-50 text-white text-xs font-bold rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>{isSubmitting ? 'Sending Message...' : 'Send Message'}</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
