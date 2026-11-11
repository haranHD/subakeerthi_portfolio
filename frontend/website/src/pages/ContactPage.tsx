import React from 'react';
import { Contact } from '../components/Contact';
import { FAQ } from '../components/FAQ';
import { SEO } from '../components/SEO';
import './PageHeader.css';

export const ContactPage: React.FC = () => {
  return (
    <>
      <SEO
        title="Contact & Schedule a Session | POSH & POCSO Trainer, Child Counsellor"
        description="Invite Subakeerthii MP to conduct certified POSH Act 2013 training, POCSO Act 2012 school safety workshops, or child counselling consultations. Available in English & Tamil across Erode, Tamil Nadu, and pan-India online."
        keywords="contact posh trainer, hire pocso trainer, schedule awareness program, child counselling consultation, legal scholar lawyer trainer, erode, coimbatore, salem, tamil nadu"
        canonicalPath="/contact"
      />

      {/* Editorial Header */}
      <section className="page-editorial-header">
        <div className="container page-header-container">
          <span className="page-header-eyebrow">INSTITUTIONAL ENQUIRIES & WORKSHOPS</span>
          <h1 className="page-header-title">Invite Subakeerthii MP for a Session</h1>
          <p className="page-header-lead">
            Whether preparing for statutory POSH Internal Committee compliance, hosting POCSO school workshops, or seeking child-centred counselling support, submit your requirements below.
          </p>
        </div>
      </section>

      {/* Interactive Booking & Enquiry Form */}
      <Contact />

      {/* Frequently Asked Questions */}
      <FAQ />
    </>
  );
};
