import React, { useState, useEffect } from 'react';
import { Phone, Mail, MapPin, Send, AlertCircle, CheckCircle2, ShieldAlert, Loader2, MessageCircle } from 'lucide-react';
import { api } from '../services/api';
import { EnquiryPrefill } from '../utils/enquiryEvents';
import { Profile } from '../types';
import './Contact.css';

interface ContactProps {
  profile?: Profile | null;
}

interface FormState {
  fullName: string;
  organisation: string;
  email: string;
  phone: string;
  category: string;
  areaOfInterest: string;
  preferredLanguage: string;
  requirements: string;
}

export const Contact: React.FC<ContactProps> = ({ profile }) => {
  const contactPhone = profile?.phone || '+91 7789937789';
  const contactEmail = profile?.email || 'llbsubakeerthii@gmail.com';
  const contactLocation = profile?.location || 'Erode, Tamil Nadu, India';
  const whatsappNumber = contactPhone.replace(/[^0-9]/g, '') || '917789937789';
  const [formData, setFormData] = useState<FormState>({
    fullName: '',
    organisation: '',
    email: '',
    phone: '',
    category: '',
    areaOfInterest: '',
    preferredLanguage: 'Bilingual (Tamil & English)',
    requirements: '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [whatsappUrl, setWhatsappUrl] = useState<string | null>(null);

  // Check for prefill from sessionStorage on mount (e.g. when navigated from /programmes)
  useEffect(() => {
    try {
      const stored = sessionStorage.getItem('subakeerthii_prefill');
      if (stored) {
        const prefill = JSON.parse(stored);
        sessionStorage.removeItem('subakeerthii_prefill');
        setFormData((prev) => ({
          ...prev,
          ...(prefill.category ? { category: prefill.category } : {}),
          ...(prefill.areaOfInterest ? { areaOfInterest: prefill.areaOfInterest } : {}),
          ...(prefill.preferredLanguage ? { preferredLanguage: prefill.preferredLanguage } : {}),
          ...(prefill.requirements ? { requirements: prefill.requirements } : {}),
        }));

        setTimeout(() => {
          const formCard = document.querySelector('.form-card') || document.getElementById('contact');
          if (formCard) {
            formCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
          const reqEl = document.getElementById('requirements');
          if (reqEl) {
            reqEl.focus();
          }
        }, 400);
      }
    } catch (e) {
      console.warn('Could not read prefill from sessionStorage:', e);
    }
  }, []);

  // Listen for enquiry prefill events from service pills / cards
  useEffect(() => {
    const handler = (event: Event) => {
      const prefill = (event as CustomEvent<EnquiryPrefill>).detail;
      setFormData((prev) => ({
        ...prev,
        ...(prefill.category ? { category: prefill.category } : {}),
        ...(prefill.areaOfInterest ? { areaOfInterest: prefill.areaOfInterest } : {}),
        ...(prefill.preferredLanguage ? { preferredLanguage: prefill.preferredLanguage } : {}),
        ...(prefill.requirements ? { requirements: prefill.requirements } : {}),
      }));
      setSubmitSuccess(null);
      setSubmitError(null);
    };
    window.addEventListener('subakeerthii:prefill-enquiry', handler);
    return () => window.removeEventListener('subakeerthii:prefill-enquiry', handler);
  }, []);

  // Track whether form has been prefilled from external click
  const hasPrefill = !!(formData.category || formData.areaOfInterest);

  const validate = () => {
    const errs: Partial<Record<keyof FormState, string>> = {};
    if (!formData.fullName.trim()) {
      errs.fullName = 'Please enter your full name.';
    }
    if (!formData.organisation.trim()) {
      errs.organisation = 'Please specify your organisation or institution.';
    }
    if (!formData.category) {
      errs.category = 'Please select an enquiry category.';
    }
    if (!formData.areaOfInterest) {
      errs.areaOfInterest = 'Please choose your primary area of interest.';
    }
    if (!formData.requirements.trim()) {
      errs.requirements = 'Please provide details about your session or enquiry.';
    } else if (formData.requirements.trim().length < 15) {
      errs.requirements = 'Please provide at least 15 characters describing your requirements.';
    }
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errs.email = 'Please provide a valid email address.';
    }
    return errs;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormState]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
    if (submitSuccess) setSubmitSuccess(null);
    if (submitError) setSubmitError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);
    setSubmitSuccess(null);
    setSubmitError(null);

    try {
      const submittedData = { ...formData };
      const response = await api.submitEnquiry(submittedData);
      if (response.success) {
        // Construct structured WhatsApp message template with user's notes and details
        const waMessage =
          `*New Consultation Enquiry — Subakeerthii MP*\n\n` +
          `*Name:* ${submittedData.fullName}\n` +
          `*Organisation / Institution:* ${submittedData.organisation}\n` +
          `*Contact Phone:* ${submittedData.phone || 'Not provided'}\n` +
          `*Official Email:* ${submittedData.email || 'Not provided'}\n` +
          `*Engagement Category:* ${submittedData.category}\n` +
          `*Area of Interest:* ${submittedData.areaOfInterest}\n` +
          `*Preferred Language:* ${submittedData.preferredLanguage}\n\n` +
          `*Requirements & Notes:*\n${submittedData.requirements}\n\n` +
          `— Submitted via official web portfolio`;

        const waLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(waMessage)}`;
        setWhatsappUrl(waLink);

        // Automatically launch WhatsApp directly so user does not have to go separately
        try {
          const waTab = window.open(waLink, '_blank');
          if (!waTab || waTab.closed || typeof waTab.closed === 'undefined') {
            window.location.href = waLink;
          }
        } catch {
          window.location.href = waLink;
        }

        setSubmitSuccess(
          'Your enquiry has been securely logged in our system and automatically directed to Subakeerthii MP on WhatsApp.'
        );
        setFormData({
          fullName: '',
          organisation: '',
          email: '',
          phone: '',
          category: '',
          areaOfInterest: '',
          preferredLanguage: 'Bilingual (Tamil & English)',
          requirements: '',
        });
      } else {
        setSubmitError(response.message || 'Submission failed. Please try again.');
      }
    } catch (err: any) {
      console.error('Enquiry submission error:', err);
      const serverMessage = err.response?.data?.message || err.message;
      setSubmitError(
        serverMessage ||
        'Unable to deliver your enquiry at this moment. Please call or email Subakeerthii MP directly.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="section section--white contact-section">
      <div className="container">
        <div className="contact-grid">
          {/* Left Column: Direct Info & Editorial Notice */}
          <div className="contact-info-side">
            <div className="eyebrow">Initiate a Collaboration</div>
            <h2 className="section-title">Let's Work Towards Safer Environments.</h2>
            <p className="contact-intro">
              For school awareness programmes, workplace training enquiries, or professional collaboration, get in touch to discuss your requirements.
            </p>

            <div className="contact-details-list">
              <a href={`tel:${contactPhone.replace(/[^0-9+]/g, '')}`} className="contact-channel-card">
                <div className="channel-icon-box">
                  <Phone size={20} />
                </div>
                <div className="channel-info">
                  <span className="channel-label">Telephone Contact</span>
                  <span className="channel-value">{contactPhone}</span>
                  <span className="channel-action">Click to call directly</span>
                </div>
              </a>

              <a href={`mailto:${contactEmail}`} className="contact-channel-card">
                <div className="channel-icon-box">
                  <Mail size={20} />
                </div>
                <div className="channel-info">
                  <span className="channel-label">Email Enquiries</span>
                  <span className="channel-value">{contactEmail}</span>
                  <span className="channel-action">Click to open email client</span>
                </div>
              </a>

              <div className="contact-channel-card contact-channel-card--static">
                <div className="channel-icon-box">
                  <MapPin size={20} />
                </div>
                <div className="channel-info">
                  <span className="channel-label">Location / Base</span>
                  <span className="channel-value">{contactLocation}</span>
                  <span className="channel-action">Available for regional & on-site sessions</span>
                </div>
              </div>
            </div>

            {/* Crucial Ethical Boundary & Due Diligence Notice */}
            <div className="ethical-notice-card">
              <ShieldAlert size={20} className="notice-icon" />
              <div>
                <h5>Safety & Ethical Protocol</h5>
                <p>
                  Subakeerthii MP delivers prevention-first statutory awareness and educational programmes. For active emergency child protection matters, contact local authorities or <strong>Childline (1098)</strong>.
                </p>
                <p style={{ marginTop: '0.45rem', fontSize: '0.8rem', opacity: 0.9 }}>
                  Please do not submit confidential case records or sensitive legal disclosures through web forms.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Enquiry Form */}
          <div className="contact-form-side">
            <div className={`form-card ${hasPrefill ? 'form-card--prefilled' : ''}`}>
              <div className="form-header">
                <h3>Initiate an Advisory Consultation</h3>
                <p>Provide preliminary details regarding your institution, corporate organization, or community initiative to tailor the engagement.</p>
              </div>

              {/* Prefill notice banner */}
              {hasPrefill && !submitSuccess && (
                <div className="form-prefill-banner">
                  <CheckCircle2 size={15} />
                  <span>Form pre-filled based on your selection — review and submit below.</span>
                </div>
              )}

              {submitSuccess && (
                <div
                  className="demo-notice-alert"
                  style={{
                    borderColor: '#25D366',
                    backgroundColor: '#F0FDF4',
                    padding: '1.25rem',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    gap: '0.75rem',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                    <CheckCircle2 size={22} className="demo-alert-icon" style={{ color: '#15803D' }} />
                    <strong style={{ color: '#166534', fontSize: '0.98rem' }}>
                      Enquiry Logged & WhatsApp Initiated
                    </strong>
                  </div>
                  <p style={{ color: '#374151', fontSize: '0.86rem', lineHeight: 1.5, margin: 0 }}>
                    {submitSuccess}
                  </p>
                  {whatsappUrl && (
                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        backgroundColor: '#25D366',
                        color: '#FFFFFF',
                        fontWeight: 600,
                        fontSize: '0.86rem',
                        padding: '0.65rem 1.2rem',
                        borderRadius: 6,
                        textDecoration: 'none',
                        boxShadow: '0 2px 8px rgba(37, 211, 102, 0.35)',
                        marginTop: '0.35rem',
                      }}
                    >
                      <MessageCircle size={17} />
                      <span>Click to Re-open WhatsApp if not launched</span>
                    </a>
                  )}
                </div>
              )}

              {submitError && (
                <div className="demo-notice-alert" style={{ borderColor: '#d32f2f', backgroundColor: '#ffebee' }}>
                  <AlertCircle size={20} className="demo-alert-icon" style={{ color: '#d32f2f' }} />
                  <div>
                    <strong>Submission Notice:</strong>
                    <p>{submitError}</p>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} noValidate className="enquiry-form">
                <div className="form-group">
                  <label htmlFor="fullName" className="form-label">
                    Full Name <span className="req">*</span>
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="e.g. Dr. Ramesh Kumar / Ms. Ananya"
                    disabled={isSubmitting}
                    className={`form-input ${errors.fullName ? 'form-input--error' : ''}`}
                  />
                  {errors.fullName && <span className="field-error">{errors.fullName}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="organisation" className="form-label">
                    Organisation or Institution <span className="req">*</span>
                  </label>
                  <input
                    type="text"
                    id="organisation"
                    name="organisation"
                    value={formData.organisation}
                    onChange={handleChange}
                    placeholder="e.g. Educational Trust / Apex Tech Pvt Ltd"
                    disabled={isSubmitting}
                    className={`form-input ${errors.organisation ? 'form-input--error' : ''}`}
                  />
                  {errors.organisation && <span className="field-error">{errors.organisation}</span>}
                </div>

                <div className="form-row-2">
                  <div className="form-group">
                    <label htmlFor="email" className="form-label">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="e.g. contact@institution.org"
                      disabled={isSubmitting}
                      className={`form-input ${errors.email ? 'form-input--error' : ''}`}
                    />
                    {errors.email && <span className="field-error">{errors.email}</span>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="phone" className="form-label">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="e.g. +91 9876543210"
                      disabled={isSubmitting}
                      className={`form-input ${errors.phone ? 'form-input--error' : ''}`}
                    />
                    {errors.phone && <span className="field-error">{errors.phone}</span>}
                  </div>
                </div>

                <div className="form-row-2">
                  <div className="form-group">
                    <label htmlFor="category" className="form-label">
                      Enquiry Category <span className="req">*</span>
                    </label>
                    <select
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      disabled={isSubmitting}
                      className={`form-select ${errors.category ? 'form-input--error' : ''}`}
                    >
                      <option value="">Select category...</option>
                      <option value="School / Educational Institution">School / Educational Institution</option>
                      <option value="Parent or Caregiver Group">Parent or Caregiver Group</option>
                      <option value="Workplace / Corporate Organisation">Workplace / Corporate Organisation</option>
                      <option value="NGO / Community Group">NGO / Community Group</option>
                      <option value="Other Collaboration">Other Collaboration</option>
                    </select>
                    {errors.category && <span className="field-error">{errors.category}</span>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="areaOfInterest" className="form-label">
                      Area of Interest <span className="req">*</span>
                    </label>
                    <select
                      id="areaOfInterest"
                      name="areaOfInterest"
                      value={formData.areaOfInterest}
                      onChange={handleChange}
                      disabled={isSubmitting}
                      className={`form-select ${errors.areaOfInterest ? 'form-input--error' : ''}`}
                    >
                      <option value="">Select area...</option>
                      <option value="POSH Workplace Training">POSH Workplace Training</option>
                      <option value="POCSO School Awareness">POCSO School Awareness</option>
                      <option value="Child Safety & Boundaries">Child Safety & Boundaries</option>
                      <option value="Parent Guidance Workshop">Parent Guidance Workshop</option>
                      <option value="Gender Sensitisation">Gender Sensitisation</option>
                      <option value="Basic Legal Education">Basic Legal Education</option>
                      <option value="Child Counselling Consultation">Child Counselling Consultation</option>
                      <option value="Custom Programme Consultation">Custom Programme Consultation</option>
                    </select>
                    {errors.areaOfInterest && <span className="field-error">{errors.areaOfInterest}</span>}
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="preferredLanguage" className="form-label">
                    Preferred Language for Session
                  </label>
                  <select
                    id="preferredLanguage"
                    name="preferredLanguage"
                    value={formData.preferredLanguage}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    className="form-select"
                  >
                    <option value="Bilingual (Tamil & English)">Bilingual (Tamil & English) — Recommended</option>
                    <option value="Tamil">Tamil (தமிழ்)</option>
                    <option value="English">English</option>
                  </select>
                </div>

                <div className="form-group">
                  <div className="form-label-row">
                    <label htmlFor="requirements" className="form-label">
                      Consultation Scope & Notes <span className="req">*</span>
                    </label>
                    <span className={`char-counter ${formData.requirements.length >= 950 ? 'char-counter--limit' : ''}`}>
                      {formData.requirements.length} / 1000 characters
                    </span>
                  </div>
                  <textarea
                    id="requirements"
                    name="requirements"
                    rows={4}
                    maxLength={1000}
                    value={formData.requirements}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    placeholder="Describe your requirements, focus areas, audience size, and any specific notes for Subakeerthii MP..."
                    className={`form-textarea ${errors.requirements ? 'form-input--error' : ''}`}
                  ></textarea>
                  {errors.requirements && <span className="field-error">{errors.requirements}</span>}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn btn--primary btn--full submit-btn"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      <span>Submitting Enquiry...</span>
                    </>
                  ) : (
                    <>
                      <span>Submit Enquiry</span>
                      <Send size={16} />
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};