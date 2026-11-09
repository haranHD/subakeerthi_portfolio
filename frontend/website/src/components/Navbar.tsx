import React, { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
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
        <Link to="/" className="header-brand" onClick={closeMenu} aria-label="Subakeerthii MP Home">
          <div className="brand-monogram" aria-hidden="true">
            <span>SK</span>
          </div>
          <div className="brand-text">
            <span className="brand-name">SUBAKEERTHII MP</span>
            <span className="brand-subtitle">LEGAL AWARENESS · SAFETY · EMPOWERMENT</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="desktop-nav" aria-label="Main Navigation">
          <ul className="nav-list">
            <li>
              <NavLink to="/" end className={({ isActive }) => `nav-link ${isActive ? 'nav-link--active' : ''}`}>
                Home
              </NavLink>
            </li>
            <li>
              <NavLink to="/about" className={({ isActive }) => `nav-link ${isActive ? 'nav-link--active' : ''}`}>
                About
              </NavLink>
            </li>
            <li>
              <NavLink to="/programmes" className={({ isActive }) => `nav-link ${isActive ? 'nav-link--active' : ''}`}>
                Programmes
              </NavLink>
            </li>
            <li>
              <NavLink to="/credentials" className={({ isActive }) => `nav-link ${isActive ? 'nav-link--active' : ''}`}>
                Credentials
              </NavLink>
            </li>
            <li>
              <NavLink to="/gallery" className={({ isActive }) => `nav-link ${isActive ? 'nav-link--active' : ''}`}>
                Gallery
              </NavLink>
            </li>
            <li>
              <NavLink to="/contact" className={({ isActive }) => `nav-link ${isActive ? 'nav-link--active' : ''}`}>
                Contact & FAQ
              </NavLink>
            </li>
          </ul>
        </nav>

        {/* Spacer to push actions to right on desktop */}
        <div style={{ flex: '0 0 1rem' }} aria-hidden="true" className="desktop-spacer" />

        {/* Header Actions */}
        <div className="header-actions">
          <Link to="/contact" className="btn btn--primary btn--sm header-cta-desktop">
            <span>Book a Session</span>
            <ArrowUpRight size={16} aria-hidden="true" />
          </Link>

          {/* Mobile Icon-Only CTA */}
          <Link
            to="/contact"
            className="header-cta-mobile"
            title="Book a Session"
            aria-label="Book a Session"
            onClick={closeMenu}
          >
            <ArrowUpRight size={18} />
          </Link>

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
            <li>
              <NavLink to="/" end className="mobile-nav-link" onClick={closeMenu}>
                <span>01 — Home</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/about" className="mobile-nav-link" onClick={closeMenu}>
                <span>02 — About & Philosophy</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/programmes" className="mobile-nav-link" onClick={closeMenu}>
                <span>03 — Training Programmes</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/credentials" className="mobile-nav-link" onClick={closeMenu}>
                <span>04 — Credentials & Background</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/gallery" className="mobile-nav-link" onClick={closeMenu}>
                <span>05 — Social Service Gallery</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/contact" className="mobile-nav-link" onClick={closeMenu}>
                <span>06 — Contact & FAQ</span>
              </NavLink>
            </li>
          </ul>

          <div className="mobile-drawer-footer">
            <Link to="/contact" className="btn btn--primary btn--full" onClick={closeMenu}>
              Invite for a Session
            </Link>
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
