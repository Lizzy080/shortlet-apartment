export const BRAND = {
  name: 'StayHaven',
  tagline: 'Comfortable stays. Thoughtfully chosen spaces.',
  whatsappNumber: '2348101523074',
  email: 'hello@stayhaven.com.ng',
  phone: '+234 800 000 0000',
  city: 'Lagos, Nigeria',
};

export const LOCATIONS = [
  'Lekki Phase 1',
  'Victoria Island',
  'Ikoyi',
  'Oniru',
  'Ikeja GRA',
] as const;

export type Location = typeof LOCATIONS[number];

export const APARTMENT_TYPES = ['Studio', '1 Bedroom', '2 Bedroom', '3 Bedroom'] as const;
export type ApartmentType = typeof APARTMENT_TYPES[number];
