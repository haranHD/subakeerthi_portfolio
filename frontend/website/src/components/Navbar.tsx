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
            <li><a href="#about" className="nav-link">About</a></li>
            <li><a href="#areas" className="nav-link">Expertise</a></li>
            <li><a href="#audience" className="nav-link">Audiences</a></li>
            <li><a href="#training" className="nav-link">Programmes</a></li>
            <li><a href="#approach" className="nav-link">Approach</a></li>
            <li><a href="#background" className="nav-link">Credentials</a></li>
            <li><a href="#faq" className="nav-link">FAQ</a></li>
            <li><a href="#contact" className="nav-link">Contact</a></li>
          </ul>
        </nav>

        {/* Spacer to push actions to right on desktop */}
        <div style={{ flex: '0 0 1rem' }} aria-hidden="true" className="desktop-spacer" />

        {/* Header Actions */}
        <div className="header-actions">
          <a href="#contact" className="btn btn--primary btn--sm header-cta-desktop">
            <span>Book a Session</span>
            <ArrowUpRight size={16} aria-hidden="true" />
          </a>

          {/* Mobile Icon-Only CTA */}
          <a
            href="#contact"
            className="header-cta-mobile"
            title="Book a Session"
            aria-label="Book a Session"
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
            <li><a href="#about" className="mobile-nav-link" onClick={closeMenu}><span>01 — About</span></a></li>
            <li><a href="#areas" className="mobile-nav-link" onClick={closeMenu}><span>02 — Areas of Work</span></a></li>
            <li><a href="#audience" className="mobile-nav-link" onClick={closeMenu}><span>03 — Who She Supports</span></a></li>
            <li><a href="#training" className="mobile-nav-link" onClick={closeMenu}><span>04 — Programmes</span></a></li>
            <li><a href="#approach" className="mobile-nav-link" onClick={closeMenu}><span>05 — Approach</span></a></li>
            <li><a href="#background" className="mobile-nav-link" onClick={closeMenu}><span>06 — Credentials</span></a></li>
            <li><a href="#faq" className="mobile-nav-link" onClick={closeMenu}><span>07 — FAQ</span></a></li>
            <li><a href="#contact" className="mobile-nav-link" onClick={closeMenu}><span>08 — Contact</span></a></li>
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
