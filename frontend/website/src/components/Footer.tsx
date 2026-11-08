import React from 'react';
import { Phone, Mail, MapPin, ArrowUp, ShieldCheck } from 'lucide-react';
import { Profile } from '../types';
import './Footer.css';

interface FooterProps {
  profile?: Profile | null;
}

export const Footer: React.FC<FooterProps> = ({ profile }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const phone = profile?.phone || '+91 7789937789';
  const email = profile?.email || 'llbsubakeerthii@gmail.com';
  const location = profile?.location || 'Erode, Tamil Nadu, India';

  return (
    <footer className="site-footer">
      <div className="container footer-container">
        {/* Top Grid */}
        <div className="footer-grid">
          {/* Col 1: Identity & Bio */}
          <div className="footer-col footer-col--identity">
            <div className="footer-brand">
              <div className="footer-monogram" aria-hidden="true">SK</div>
              <div className="footer-brand-text">
                <span className="footer-name">SUBAKEERTHII MP</span>
                <span className="footer-tagline">LEGAL AWARENESS · POSH & POCSO TRAINING · CHILD SAFETY</span>
              </div>
            </div>

            <p className="footer-summary">
              Promoting preventative awareness, child safety education, workplace harassment prevention, and child-centred counselling support across schools, corporates, and communities.
            </p>

            <div className="footer-location-badge">
              <MapPin size={15} />
              <span>{location}</span>
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="footer-col">
            <h4 className="footer-col-title">Quick Navigation</h4>
            <ul className="footer-links-list">
              <li><a href="#about">About</a></li>
              <li><a href="#areas">Areas of Work</a></li>
              <li><a href="#audience">Who She Supports</a></li>
              <li><a href="#training">Programmes</a></li>
              <li><a href="#approach">Approach</a></li>
              <li><a href="#background">Credentials</a></li>
              <li><a href="#faq">Frequently Asked Questions</a></li>
              <li><a href="#contact">Contact</a></li>
            </ul>
          </div>

          {/* Col 3: Direct Contact */}
          <div className="footer-col">
            <h4 className="footer-col-title">Direct Enquiries</h4>
            <ul className="footer-contact-list">
              <li>
                <span className="contact-type">Telephone</span>
                <a href={`tel:${phone.replace(/[^0-9+]/g, '')}`} className="footer-contact-link">
                  <Phone size={14} /> {phone}
                </a>
              </li>
              <li>
                <span className="contact-type">Email</span>
                <a href={`mailto:${email}`} className="footer-contact-link">
                  <Mail size={14} /> {email}
                </a>
              </li>
              <li>
                <span className="contact-type">Location</span>
                <span className="footer-contact-text">{location}</span>
              </li>
            </ul>

            <div className="footer-invite-btn-wrap">
              <a href="#contact" className="btn btn--rose btn--sm btn--full">
                Invite for a Session
              </a>
            </div>
          </div>
        </div>

        {/* Professional Disclaimer Banner */}
        <div className="footer-disclaimer-box">
          <div className="disclaimer-title-wrap">
            <ShieldCheck size={18} className="disclaimer-icon" />
            <strong>Professional & Statutory Disclaimer</strong>
          </div>
          <p className="disclaimer-text">
            Subakeerthii MP is an LL.B. candidate and certified trainer. She is not represented on this website as a practicing advocate or litigation lawyer. Information on this website is for awareness and educational purposes and does not constitute personalised legal advice.
          </p>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom-bar">
          <p className="footer-copyright">
            © {new Date().getFullYear()} Subakeerthii MP. All rights reserved. Designed for professional awareness and institutional safety.
          </p>
          <button 
            type="button" 
            onClick={scrollToTop} 
            className="back-to-top-btn"
            aria-label="Scroll back to top of page"
          >
            <span>Back to top</span>
            <ArrowUp size={15} />
          </button>
        </div>
      </div>
    </footer>
  );
};
