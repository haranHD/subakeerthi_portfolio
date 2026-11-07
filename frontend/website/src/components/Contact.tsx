import React, { useState } from 'react';
import { Phone, Mail, MapPin, Send, AlertCircle, CheckCircle2, ShieldAlert, Loader2 } from 'lucide-react';
import { api } from '../services/api';
import './Contact.css';

interface FormState {
  fullName: string;
  organisation: string;
  email: string;
  phone: string;
  category: string;
  areaOfInterest: string;
  requirements: string;
}

export const Contact: React.FC = () => {
  const [formData, setFormData] = useState<FormState>({
    fullName: '',
    organisation: '',
    email: '',
    phone: '',
    category: '',
    areaOfInterest: '',
    requirements: '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

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
      const response = await api.submitEnquiry(formData);
      if (response.success) {
        setSubmitSuccess(
          'Thank you. Your training enquiry has been delivered and stored securely. Subakeerthii MP will review your request and get in touch shortly.'
        );
        setFormData({
          fullName: '',
          organisation: '',
          email: '',
          phone: '',
          category: '',
          areaOfInterest: '',
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
              <a href="tel:+917789937789" className="contact-channel-card">
                <div className="channel-icon-box">
                  <Phone size={20} />
                </div>
                <div className="channel-info">
                  <span className="channel-label">Telephone Contact</span>
                  <span className="channel-value">+91 7789937789</span>
                  <span className="channel-action">Click to call directly</span>
                </div>
              </a>

              <a href="mailto:llbsubakeerthii@gmail.com" className="contact-channel-card">
                <div className="channel-icon-box">
                  <Mail size={20} />
                </div>
                <div className="channel-info">
                  <span className="channel-label">Email Enquiries</span>
                  <span className="channel-value">llbsubakeerthii@gmail.com</span>
                  <span className="channel-action">Click to open email client</span>
                </div>
              </a>

              <div className="contact-channel-card contact-channel-card--static">
                <div className="channel-icon-box">
                  <MapPin size={20} />
                </div>
                <div className="channel-info">
                  <span className="channel-label">Location / Base</span>
                  <span className="channel-value">Erode, Tamil Nadu, India</span>
                  <span className="channel-action">Available for regional & on-site sessions</span>
                </div>
              </div>
            </div>

            {/* Crucial Ethical Boundary Notice */}
            <div className="ethical-notice-card">
              <ShieldAlert size={20} className="notice-icon" />
              <div>
                <h5>Safety & Ethical Protocol</h5>
                <p>
                  Please do not submit confidential case records, sensitive disclosures, or specific allegations of child abuse through web forms. For active child protection emergencies, immediately notify local authorities or contact <strong>Childline (1098)</strong>.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Enquiry Form */}
          <div className="contact-form-side">
            <div className="form-card">
              <div className="form-header">
                <h3>Discuss a Training Session</h3>
                <p>Provide preliminary details regarding your institution or event to tailor the session format.</p>
              </div>

              {submitSuccess && (
                <div className="demo-notice-alert" style={{ borderColor: 'var(--color-burgundy)', backgroundColor: 'var(--color-rose-light)' }}>
                  <CheckCircle2 size={20} className="demo-alert-icon" style={{ color: 'var(--color-burgundy)' }} />
                  <div>
                    <strong>Enquiry Received Successfully:</strong>
                    <p>{submitSuccess}</p>
                  </div>
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
                    placeholder="e.g. Greenwood Matriculation School / Apex Tech Pvt Ltd"
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
                  <label htmlFor="requirements" className="form-label">
                    Programme Requirements & Notes <span className="req">*</span>
                  </label>
                  <textarea
                    id="requirements"
                    name="requirements"
                    rows={4}
                    value={formData.requirements}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    placeholder="Briefly describe your intended audience size, preferred format (in-person in Erode / Tamil Nadu or online), and focal topics..."
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
                      <span>Submit Training Enquiry</span>
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
