/**
 * Centralized Asset Configuration
 * Preserves authentic client assets and manages editorial photography references.
 */

export interface EditorialAsset {
  src: string;
  alt: string;
  caption?: string;
  category: 'portrait' | 'credentials' | 'editorial' | 'environment';
}

export const ASSETS = {
  // Client Approved Photography
  portrait: {
    src: '/subakeerthii-portrait.png',
    alt: 'Subakeerthii MP — Legal Scholar, Certified POSH & POCSO Trainer, Child Counsellor',
    caption: 'Academic Legal Scholar & Certified Trainer based in Erode, Tamil Nadu',
    category: 'portrait' as const,
  },
  
  // Official Credentials & Accreditations Banner
  clientBanner: {
    src: '/client-banner.png',
    alt: 'Subakeerthii MP Credentials Banner — Law, Psychology, and Child Protection',
    caption: 'Verified Academic Foundations and Professional Trainer Accreditations',
    category: 'credentials' as const,
  },

  // Favicon / Icon
  favicon: {
    src: '/favicon.svg',
    alt: 'SK Monogram Crest',
    category: 'editorial' as const,
  },
};
