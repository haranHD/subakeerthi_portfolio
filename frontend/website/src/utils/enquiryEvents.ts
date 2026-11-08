export interface EnquiryPrefill {
  category?: string;
  areaOfInterest?: string;
  requirements?: string;
  source?: string;
}

export function triggerEnquiry(prefill: EnquiryPrefill) {
  // Dispatch custom event for Contact component to catch
  window.dispatchEvent(
    new CustomEvent<EnquiryPrefill>('subakeerthii:prefill-enquiry', {
      detail: prefill,
    })
  );

  // Smoothly scroll to the contact section
  const contactSection = document.getElementById('contact');
  if (contactSection) {
    contactSection.scrollIntoView({ behavior: 'smooth' });
    
    // Focus on requirements input after scroll finishes
    setTimeout(() => {
      const requirementsInput = document.getElementById('requirements');
      if (requirementsInput) {
        requirementsInput.focus();
      }
    }, 700);
  }
}
