import React, { useState, useEffect } from 'react';
import { Menu, X, ArrowUpRight, Phone, Mail } from 'lucide-react';
import './Navbar.css';

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const closeMenu = () => setIsOpen(false);

  return (
    <header className={`site-header ${scrolled ? 'site-header--scrolled' : ''}`}>
      <div className="container header-container">
        {/* Brand / Logo */}
        <a href="#home" className="header-brand" onClick={closeMenu} aria-label="Subakeerthii MP Home">
          <div className="brand-monogram" aria-hidden="true">
            <span>SMP</span>
          </div>
          <div className="brand-text">
            <span className="brand-name">SUBAKEERTHII MP</span>
            <span className="brand-subtitle">LEGAL AWARENESS · SAFETY · EMPOWERMENT</span>
          </div>
        </a>

        {/* Desktop Navigation */}
        <nav className="desktop-nav" aria-label="Main Navigation">
          <ul className="nav-list">
            <li><a href="#home" className="nav-link">Home</a></li>
            <li><a href="#about" className="nav-link">About</a></li>
            <li><a href="#areas" className="nav-link">Areas of Work</a></li>
            <li><a href="#training" className="nav-link">Programmes</a></li>
            <li><a href="#approach" className="nav-link">Approach</a></li>
            <li><a href="#background" className="nav-link">Credentials</a></li>
            <li><a href="#contact" className="nav-link">Contact</a></li>
          </ul>
        </nav>

        {/* Spacer to push actions to right on desktop */}
        <div style={{ flex: '0 0 1rem' }} aria-hidden="true" className="desktop-spacer" />

        {/* Header Actions */}
        <div className="header-actions">
          <a href="#contact" className="btn btn--primary btn--sm header-cta-desktop">
            <span>Invite for a Session</span>
            <ArrowUpRight size={16} aria-hidden="true" />
          </a>

          {/* Mobile Icon-Only CTA */}
          <a
            href="#contact"
            className="header-cta-mobile"
            title="Invite for a Session"
            aria-label="Invite for a Session"
          >
            <ArrowUpRight size={18} />
          </a>

          {/* Mobile Menu Toggle Button */}
          <button
            type="button"
            className="mobile-toggle"
            aria-label={isOpen ? "Close main menu" : "Open main menu"}
            aria-expanded={isOpen}
            aria-controls="mobile-nav"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      <div
        id="mobile-nav"
        className={`mobile-drawer ${isOpen ? 'mobile-drawer--open' : ''}`}
        aria-hidden={!isOpen}
      >
        <div className="mobile-drawer-inner">
          <ul className="mobile-nav-list">
            <li><a href="#home" className="mobile-nav-link" onClick={closeMenu}><span>Home</span><span className="nav-index">01</span></a></li>
            <li><a href="#about" className="mobile-nav-link" onClick={closeMenu}><span>About</span><span className="nav-index">02</span></a></li>
            <li><a href="#areas" className="mobile-nav-link" onClick={closeMenu}><span>Areas of Work</span><span className="nav-index">03</span></a></li>
            <li><a href="#audience" className="mobile-nav-link" onClick={closeMenu}><span>Who She Supports</span><span className="nav-index">04</span></a></li>
            <li><a href="#training" className="mobile-nav-link" onClick={closeMenu}><span>Training Programmes</span><span className="nav-index">05</span></a></li>
            <li><a href="#approach" className="mobile-nav-link" onClick={closeMenu}><span>Professional Approach</span><span className="nav-index">06</span></a></li>
            <li><a href="#background" className="mobile-nav-link" onClick={closeMenu}><span>Credentials & Education</span><span className="nav-index">07</span></a></li>
            <li><a href="#contact" className="mobile-nav-link" onClick={closeMenu}><span>Contact & Enquiries</span><span className="nav-index">08</span></a></li>
          </ul>

          <div className="mobile-drawer-footer">
            <a href="#contact" className="btn btn--primary btn--full" onClick={closeMenu}>
              Invite for a Session
            </a>
            <div className="mobile-quick-contact">
              <a href="tel:+917789937789" className="quick-contact-item">
                <Phone size={15} /> 7789937789
              </a>
              <a href="mailto:llbsubakeerthii@gmail.com" className="quick-contact-item">
                <Mail size={15} /> llbsubakeerthii@gmail.com
              </a>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
