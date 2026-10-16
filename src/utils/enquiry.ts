import { companyInfo } from '../data/companyInfo';

/**
 * Contact links and pre-filled enquiry messages. The site has no backend, so
 * every enquiry is handed to the visitor's WhatsApp, email, or phone app.
 */

export interface EnquiryParams {
  vehicleName?: string;
  tourName?: string;
  offerName?: string;
  serviceType?: string;
  travelDate?: string;
  passengers?: string | number;
  pickup?: string;
  destination?: string;
  distanceKm?: number;
  estimatedFare?: number;
  customerName?: string;
  customerPhone?: string;
  customerEmail?: string;
  message?: string;
}

/**
 * Builds a structured enquiry message. `bold` wraps labels in WhatsApp's *bold* markup.
 */
export function buildEnquiryMessage(params: EnquiryParams, bold = true): string {
  const label = (text: string) => (bold ? `*${text}:*` : `${text}:`);
  const fields: [string, string | number | undefined][] = [
    ['Customer Name', params.customerName],
    ['Contact Number', params.customerPhone],
    ['Email', params.customerEmail],
    ['Service', params.serviceType],
    ['Vehicle Choice', params.vehicleName],
    ['Tour Package', params.tourName],
    ['Offer / Deal', params.offerName],
    ['Travel Date', params.travelDate],
    ['Passengers', params.passengers],
    ['Pickup Location', params.pickup],
    ['Destination', params.destination],
    ['Estimated Distance', params.distanceKm ? `${params.distanceKm} km` : undefined],
    ['Estimated Fare', params.estimatedFare ? `₹${params.estimatedFare.toLocaleString('en-IN')}` : undefined],
    ['Additional Requirements', params.message],
  ];

  const parts: string[] = [
    `Hello ${companyInfo.name},`,
    `I would like to enquire about your travel services.\n`,
    ...fields.filter(([, value]) => value).map(([name, value]) => `${label(name)} ${value}`),
    `\nPlease let me know the availability and quotation.`,
    `Thank you!`,
  ];

  return parts.join('\n');
}

/**
 * Builds a structured, professional WhatsApp message URI
 */
export function buildWhatsAppUrl(params: EnquiryParams): string {
  return `https://wa.me/${companyInfo.whatsapp}?text=${encodeURIComponent(buildEnquiryMessage(params))}`;
}

/**
 * Builds a mailto: link with the same enquiry details
 */
export function buildEmailUrl(params: EnquiryParams, subject = 'Travel Enquiry'): string {
  const query = `subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(buildEnquiryMessage(params, false))}`;
  return `mailto:${companyInfo.email}?${query}`;
}

/**
 * Quick general WhatsApp enquiry
 */
export function getGeneralWhatsAppUrl(): string {
  const text = encodeURIComponent(
    `Hello ${companyInfo.name},\n\nI would like to enquire about your car rental services and travel packages. Please share more details.\n\nThank you!`
  );
  return `https://wa.me/${companyInfo.whatsapp}?text=${text}`;
}

/**
 * Plain WhatsApp chat link with no pre-filled message
 */
export function getWhatsAppChatUrl(): string {
  return `https://wa.me/${companyInfo.whatsapp}`;
}

export function getPhoneUrl(): string {
  return `tel:${companyInfo.phone}`;
}

export function getEmailUrl(): string {
  return `mailto:${companyInfo.email}`;
}

/**
 * Google Maps directions to the office address
 */
export function getDirectionsUrl(): string {
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(companyInfo.address.full)}`;
}
