import React, { useState } from 'react';
import { companyInfo } from '../../data/companyInfo';
import { vehiclesData } from '../../data/vehicles';
import { services } from '../../data/services';
import type { EnquiryFormState } from '../../types';
import { Phone, MessageSquare, Mail, MapPin, Clock, Send, CheckCircle, Navigation } from 'lucide-react';
import {
  buildEmailUrl,
  buildWhatsAppUrl,
  getDirectionsUrl,
  getEmailUrl,
  getPhoneUrl,
  getWhatsAppChatUrl,
  type EnquiryParams
} from '../../utils/enquiry';
import { SectionHeader } from '../ui/SectionHeader';

const vehicleOptions = vehiclesData.map((v) =>
  `${v.fullName} (${v.seatingCapacity}-Seater)${v.isSignature5602 ? ' • 5602 Signature' : ''}`
);

const initialForm: EnquiryFormState = {
  name: '',
  phone: '',
  email: '',
  serviceType: services[0],
  vehicleType: vehicleOptions[0],
  travelDate: '',
  passengers: '2',
  pickupLocation: companyInfo.address.city,
  destination: '',
  message: ''
};

const inputClass =
  'w-full px-3.5 py-3 bg-white border border-slate-300 rounded-brand text-sm text-brand-navy placeholder:text-slate-400 focus:outline-none focus:border-brand-ocean focus:ring-2 focus:ring-brand-ocean/15 transition-colors';
const labelClass = 'block text-sm font-semibold text-slate-700 mb-1.5';

type SentVia = 'whatsapp' | 'email' | null;

const quickContacts = [
  { label: 'Call Now', value: companyInfo.phoneDisplay, href: getPhoneUrl(), icon: Phone, external: false },
  { label: 'WhatsApp', value: companyInfo.whatsappDisplay, href: getWhatsAppChatUrl(), icon: MessageSquare, external: true },
  { label: 'Send Email', value: companyInfo.email, href: getEmailUrl(), icon: Mail, external: false },
  { label: 'Get Directions', value: companyInfo.address.city, href: getDirectionsUrl(), icon: Navigation, external: true },
];

export const ContactSection: React.FC = () => {
  const [formData, setFormData] = useState<EnquiryFormState>(initialForm);
  const [sentVia, setSentVia] = useState<SentVia>(null);

  const update = (field: keyof EnquiryFormState) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setFormData((prev) => ({ ...prev, [field]: e.target.value }));

  const enquiry = (): EnquiryParams => ({
    customerName: formData.name,
    customerPhone: formData.phone,
    customerEmail: formData.email,
    serviceType: formData.serviceType,
    vehicleName: formData.vehicleType,
    travelDate: formData.travelDate,
    passengers: formData.passengers,
    pickup: formData.pickupLocation,
    destination: formData.destination,
    message: formData.message
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const submitter = (e.nativeEvent as SubmitEvent).submitter as HTMLButtonElement | null;
    const via: SentVia = submitter?.value === 'email' ? 'email' : 'whatsapp';

    if (via === 'email') {
      window.location.href = buildEmailUrl(enquiry(), `Travel Enquiry – ${formData.serviceType}`);
    } else {
      window.open(buildWhatsAppUrl(enquiry()), '_blank', 'noopener');
    }
    setSentVia(via);
  };

  return (
    <section id="contact" className="py-20 bg-white border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <SectionHeader
          eyebrow="Booking Desk"
          title="Contact Us"
          description="Planning an Odisha tour, outstation road trip, or airport pickup? Call us, message us on WhatsApp, or send your trip details with the form below."
          className="mb-12"
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">

          {/* Left: Contact Info */}
          <div className="lg:col-span-5 p-6 sm:p-8 bg-brand-navy text-white rounded-brand-lg shadow-card space-y-6">
            <div>
              <span className="text-xs font-semibold text-brand-gold uppercase tracking-wider block mb-1">
                {companyInfo.brandSignature}
              </span>
              <h3 className="text-2xl font-display font-bold text-white">
                {companyInfo.name}
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3">
              {quickContacts.map(({ label, value, href, icon: Icon, external }) => (
                <a
                  key={label}
                  href={href}
                  {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                  className="flex items-center gap-3.5 p-3.5 rounded-brand bg-white/5 hover:bg-white/10 border border-white/10 transition-colors group min-w-0"
                >
                  <div className="w-10 h-10 rounded-full bg-brand-gold/15 flex items-center justify-center text-brand-gold shrink-0">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-sm font-semibold text-white block group-hover:text-brand-gold transition-colors">
                      {label}
                    </span>
                    <span className="text-xs text-slate-400 block truncate">{value}</span>
                  </div>
                </a>
              ))}
            </div>

            {/* Operating Hours & Address */}
            <div className="pt-5 border-t border-white/10 text-sm space-y-4">
              <div className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-brand-gold shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-white">Business Hours</p>
                  <p className="text-slate-400">{companyInfo.businessHours}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-brand-gold shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-white">Office</p>
                  <address className="not-italic text-slate-400">{companyInfo.address.full}</address>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Booking & Enquiry Form */}
          <div className="lg:col-span-7 bg-brand-surface p-6 sm:p-8 rounded-brand-lg border border-slate-200 shadow-subtle">

            <h3 className="text-xl font-bold font-display text-brand-navy mb-1">
              Send a Booking Enquiry
            </h3>
            <p className="text-sm text-slate-600 mb-6">
              Fill in your trip details and choose WhatsApp or email. Your message opens pre-filled in that app, ready for you to send. Nothing is stored on this website.
            </p>

            {sentVia ? (
              <div className="p-6 bg-green-50 border border-green-200 rounded-brand text-center space-y-3" role="status">
                <CheckCircle className="w-10 h-10 text-green-600 mx-auto" />
                <h4 className="text-lg font-bold text-green-900">
                  Your enquiry is ready in {sentVia === 'email' ? 'your email app' : 'WhatsApp'}
                </h4>
                <p className="text-sm text-green-800 leading-relaxed max-w-md mx-auto">
                  Press <strong>Send</strong> there to deliver it to us. If nothing opened, call us at{' '}
                  <a href={getPhoneUrl()} className="font-semibold underline">{companyInfo.phoneDisplay}</a>.
                </p>
                <button
                  onClick={() => setSentVia(null)}
                  className="mt-2 px-5 py-2.5 bg-brand-navy text-white text-sm font-semibold rounded-brand hover:bg-brand-navy-light transition-colors"
                >
                  Back to Form
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="enq-name" className={labelClass}>Full Name *</label>
                    <input id="enq-name" type="text" required autoComplete="name" placeholder="Your name"
                      value={formData.name} onChange={update('name')} className={inputClass} />
                  </div>

                  <div>
                    <label htmlFor="enq-phone" className={labelClass}>Phone Number *</label>
                    <input id="enq-phone" type="tel" required autoComplete="tel" inputMode="tel" placeholder="10-digit mobile number"
                      value={formData.phone} onChange={update('phone')} className={inputClass} />
                  </div>
                </div>

                <div>
                  <label htmlFor="enq-email" className={labelClass}>Email <span className="font-normal text-slate-500">(optional)</span></label>
                  <input id="enq-email" type="email" autoComplete="email" placeholder="you@example.com"
                    value={formData.email} onChange={update('email')} className={inputClass} />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="enq-service" className={labelClass}>Service</label>
                    <select id="enq-service" value={formData.serviceType} onChange={update('serviceType')} className={inputClass}>
                      {services.map((service) => (
                        <option key={service} value={service}>{service}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="enq-vehicle" className={labelClass}>Preferred Vehicle</label>
                    <select id="enq-vehicle" value={formData.vehicleType} onChange={update('vehicleType')} className={inputClass}>
                      {vehicleOptions.map((option) => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="enq-date" className={labelClass}>Travel Date *</label>
                    <input id="enq-date" type="date" required
                      value={formData.travelDate} onChange={update('travelDate')} className={inputClass} />
                  </div>

                  <div>
                    <label htmlFor="enq-passengers" className={labelClass}>Passengers</label>
                    <input id="enq-passengers" type="number" min={1} max={50} inputMode="numeric"
                      value={formData.passengers} onChange={update('passengers')} className={inputClass} />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="enq-pickup" className={labelClass}>Pickup Location *</label>
                    <input id="enq-pickup" type="text" required placeholder="e.g. BBI Airport / Master Canteen"
                      value={formData.pickupLocation} onChange={update('pickupLocation')} className={inputClass} />
                  </div>

                  <div>
                    <label htmlFor="enq-destination" className={labelClass}>Travel Destination *</label>
                    <input id="enq-destination" type="text" required placeholder="e.g. Puri / Konark / Chilika"
                      value={formData.destination} onChange={update('destination')} className={inputClass} />
                  </div>
                </div>

                <div>
                  <label htmlFor="enq-message" className={labelClass}>Message <span className="font-normal text-slate-500">(optional)</span></label>
                  <textarea id="enq-message" rows={3}
                    placeholder="Flight timings, temple stops, return plans, luggage…"
                    value={formData.message} onChange={update('message')} className={inputClass} />
                </div>

                <div className="pt-2 flex flex-col sm:flex-row gap-3">
                  <button
                    type="submit"
                    value="whatsapp"
                    className="flex-1 inline-flex items-center justify-center gap-2 py-3.5 bg-brand-gold hover:bg-brand-gold-dark text-brand-navy font-semibold text-sm rounded-brand shadow-sm transition-colors"
                  >
                    <Send className="w-4 h-4" />
                    <span>Send via WhatsApp</span>
                  </button>
                  <button
                    type="submit"
                    value="email"
                    className="flex-1 inline-flex items-center justify-center gap-2 py-3.5 bg-brand-navy hover:bg-brand-navy-light text-white font-semibold text-sm rounded-brand transition-colors"
                  >
                    <Mail className="w-4 h-4 text-brand-gold" />
                    <span>Send via Email</span>
                  </button>
                </div>

              </form>
            )}

          </div>

        </div>

      </div>
    </section>
  );
};
