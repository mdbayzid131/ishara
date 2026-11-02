'use client';

import { useState, type FormEvent } from 'react';
import Link from 'next/link';
import { Headphones, Phone, Mail, Truck, ArrowUpRight, Send } from 'lucide-react';
import PageIntro from '@/components/layout/PageIntro';
import { useStore } from '@/context/StoreContext';

export default function ContactPage() {
  const { settings } = useStore();
  const [prepared, setPrepared] = useState('');
  const phone = settings.phone.replace(/\D/g, '').replace(/^0/, '880');
  function prepare(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const body = `Name: ${data.get('name')}\nPhone: ${data.get('phone')}\nReply email: ${data.get('email')}\n\n${data.get('message')}`;
    setPrepared(`mailto:${settings.supportEmail}?subject=${encodeURIComponent(String(data.get('subject')))}&body=${encodeURIComponent(body)}`);
  }
  return <div className="reference-page contact-reference"><PageIntro page="Contact us" eyebrow="GET IN TOUCH" title="A question?" accent="We’re here to help." description="Need a little help with a product, delivery or your order? Get in touch with the Ishara team." image="/images/editorial/beauty-campaign.webp" />
    <div className="contact-layout"><aside className="support-stack"><article className="reference-card support-card"><span className="support-icon"><Headphones size={24} /></span><div><h2>Customer support</h2><p>Product questions, order enquiries and a little help finding your next favourite.</p><span className="support-caption">Here for your everyday questions.</span></div></article><article className="reference-card support-card"><span className="support-icon"><Phone size={22} /></span><div><h2>Phone & WhatsApp</h2><a href={`tel:${settings.phone.replace(/[^+0-9]/g, '')}`}>{settings.phone}</a><p>Prefer a message? Start a chat with our team.</p><a className="support-inline-link" href={`https://wa.me/${phone}`} target="_blank" rel="noreferrer">Open WhatsApp <ArrowUpRight size={14} /></a></div></article><article className="reference-card support-card"><span className="support-icon"><Mail size={22} /></span><div><h2>Email us</h2><a href={`mailto:${settings.supportEmail}`}>{settings.supportEmail}</a><p>Please include your order number if you’re asking about a purchase.</p></div></article><article className="reference-card support-card"><span className="support-icon"><Truck size={22} /></span><div><h2>Following your order?</h2><p>Find the latest status with your order number and mobile number.</p><Link href="/track-order" className="support-inline-link">Track an order <ArrowUpRight size={14} /></Link></div></article></aside>
    <section className="reference-card contact-form-card"><span className="intro-label"><Mail size={12} />MESSAGE US</span><h2>Let’s start a conversation.</h2><p>Prepare your message below, then send it using your email app.</p><form onSubmit={prepare} onChange={() => setPrepared('')}><div className="contact-fields"><label>Full name <span>*</span><input name="name" autoComplete="name" required minLength={2} placeholder="Your full name" /></label><label>Phone number <input name="phone" autoComplete="tel" type="tel" placeholder="01711223344" /></label><label>Email address<input name="email" autoComplete="email" type="email" placeholder="you@example.com" /></label><label>Subject <span>*</span><select name="subject" required defaultValue=""><option value="" disabled>Select a topic</option><option>Product enquiry</option><option>Order & delivery</option><option>Returns & exchanges</option><option>Something else</option></select></label></div><label>Your message <span>*</span><textarea name="message" required minLength={5} rows={6} placeholder="How can we help? Include your order number if you have one." /></label><button className="studio-button" type="submit"><Send size={15} />Prepare email</button>{prepared && <div className="prepared-message" role="status"><p>Your message is ready. It has not been sent yet.</p><a href={prepared} className="support-inline-link">Open email app to send <ArrowUpRight size={15} /></a></div>}</form></section></div>
  </div>;
}
