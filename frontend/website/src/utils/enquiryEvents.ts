export interface EnquiryPrefill {
  category?: string;
  areaOfInterest?: string;
  preferredLanguage?: string;
  requirements?: string;
  source?: string;
}

export const PREFILL_STORAGE_KEY = 'subakeerthii_prefill';

/**
 * Triggers an enquiry prefill action.
 * - If already on a page with the contact form (#contact), it prefills and scrolls into view.
 * - If on any other page (e.g. /programmes, /about, /gallery), it saves to sessionStorage
 *   and navigates to /contact so the user can immediately submit their request.
 */
export function triggerEnquiry(
  prefill: EnquiryPrefill,
  navigate?: (to: string) => void
) {
  // 1. Save prefill to sessionStorage for reliable cross-page delivery
  try {
    sessionStorage.setItem(PREFILL_STORAGE_KEY, JSON.stringify(prefill));
  } catch (err) {
    console.warn('Unable to save prefill to sessionStorage:', err);
  }

  // 2. Dispatch event in case Contact component is already active on the current page
  window.dispatchEvent(
    new CustomEvent<EnquiryPrefill>('subakeerthii:prefill-enquiry', {
      detail: prefill,
    })
  );

  // 3. Check if contact element is on the current page
  const contactSection = document.getElementById('contact');
  if (contactSection) {
    contactSection.scrollIntoView({ behavior: 'smooth' });

    setTimeout(() => {
      const requirementsInput = document.getElementById('requirements');
      if (requirementsInput) {
        requirementsInput.focus();
      }
    }, 600);
  } else {
    // Navigate to /contact
    if (navigate) {
      navigate('/contact');
    } else {
      window.location.href = '/contact';
    }
  }
}
