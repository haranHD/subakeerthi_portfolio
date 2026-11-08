import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ShieldCheck, HeartHandshake, BookOpen, CheckCircle2, Award, Sparkles, Languages } from 'lucide-react';
import { Profile } from '../types';
import { triggerEnquiry } from '../utils/enquiryEvents';
import './Hero.css';

interface HeroProps {
  profile?: Profile | null;
}

export const Hero: React.FC<HeroProps> = ({ profile }) => {
  const headline = 'Building Safer Schools, Workplaces & Communities.';
  const description =
    profile?.biography ||
    'Promoting awareness, prevention, protection and responsible reporting through POSH and POCSO awareness programmes, legal education, and child-centred counselling support.';

  const handleHeroCTA = (e: React.MouseEvent) => {
    e.preventDefault();
    triggerEnquiry({
      category: 'School / Educational Institution',
      areaOfInterest: 'POCSO School Awareness',
      requirements: 'I am interested in scheduling a comprehensive awareness session for our institution.',
    });
  };

  return (
    <section id="home" className="hero-section">
      {/* Decorative ambient background blur */}
      <div className="hero-ambient-glow" aria-hidden="true" />

      <div className="container hero-container">
        {/* Left Column: Content */}
        <motion.div
          className="hero-content"
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.div
            className="hero-eyebrow"
            initial={{ opacity: 0, x: -15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <span className="eyebrow-dot"></span>
            <span>LEGAL AWARENESS · CHILD SAFETY · WORKPLACE AWARENESS</span>
          </motion.div>

          <motion.h1
            className="hero-headline"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
          >
            {headline}
          </motion.h1>

          <motion.p
            className="hero-description"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.26 }}
          >
            {description}
          </motion.p>

          <motion.div
            className="hero-cta-group"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.34 }}
          >
            <a href="#contact" onClick={handleHeroCTA} className="btn btn--primary hero-btn-main">
              <span>Invite for a Training Session</span>
              <ArrowRight size={18} className="btn-icon-animated" />
            </a>
            <a href="#areas" className="btn btn--secondary hero-btn-sub">
              <span>Explore My Work</span>
            </a>
          </motion.div>

          {/* Service Pills with interactive hover */}
          <motion.div
            className="hero-services-pills"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.42 }}
          >
            <a
              href="#areas"
              className="service-pill"
              onClick={(e) => {
                e.preventDefault();
                triggerEnquiry({
                  category: 'Workplace / Corporate Organisation',
                  areaOfInterest: 'POSH Workplace Training',
                  requirements: 'Inquiring about POSH workplace training and Internal Committee compliance.',
                });
              }}
            >
              <span className="service-pill-icon"><ShieldCheck size={16} /></span>
              <span className="service-pill-text">POSH Awareness</span>
            </a>
            <a
              href="#areas"
              className="service-pill"
              onClick={(e) => {
                e.preventDefault();
                triggerEnquiry({
                  category: 'School / Educational Institution',
                  areaOfInterest: 'POCSO School Awareness',
                  requirements: 'Inquiring about POCSO awareness for school faculty and staff.',
                });
              }}
            >
              <span className="service-pill-icon"><BookOpen size={16} /></span>
              <span className="service-pill-text">POCSO Awareness</span>
            </a>
            <a
              href="#areas"
              className="service-pill"
              onClick={(e) => {
                e.preventDefault();
                triggerEnquiry({
                  category: 'Parent or Caregiver Group',
                  areaOfInterest: 'Child Safety & Boundaries',
                  requirements: 'Inquiring about child safety sessions and developmental guidance.',
                });
              }}
            >
              <span className="service-pill-icon"><HeartHandshake size={16} /></span>
              <span className="service-pill-text">Child Safety & Support</span>
            </a>
          </motion.div>
        </motion.div>

        {/* Right Column: Editorial Portrait / Monogram Frame */}
        <motion.div
          className="hero-visual"
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.75, delay: 0.22, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="portrait-frame-wrapper">
            <div className="portrait-backdrop-accent" aria-hidden="true"></div>
            <div className="portrait-frame">
              <div className="portrait-inner">
                <div className="monogram-badge">
                  <div className="portrait-image-wrapper">
                    <img
                      src={profile?.portraitUrl || '/subakeerthii-portrait.png'}
                      alt="Subakeerthii MP — Legal Scholar, Certified POSH & POCSO Trainer, Child Counsellor"
                      className="portrait-avatar-img"
                      loading="eager"
                    />
                    <div className="portrait-image-overlay" />
                  </div>
                  <div className="monogram-credentials">
                    <span className="monogram-title">SUBAKEERTHII MP</span>
                    <span className="monogram-focus">Legal Scholar · POSH & POCSO Trainer · Child Counsellor</span>
                    <span className="monogram-loc">Erode, Tamil Nadu, India</span>
                  </div>
                </div>

                <div className="portrait-features-list">
                  <div className="feature-item">
                    <CheckCircle2 size={16} className="feature-icon" />
                    <span>LL.B. Candidate</span>
                  </div>
                  <div className="feature-item">
                    <CheckCircle2 size={16} className="feature-icon" />
                    <span>Certified POSH & POCSO Trainer</span>
                  </div>
                  <div className="feature-item">
                    <CheckCircle2 size={16} className="feature-icon" />
                    <span>Diploma in Child Psychology</span>
                  </div>
                </div>

                <div className="portrait-seal">
                  <Award size={18} />
                  <span>Evidence-Based · Audience-Centred Training</span>
                </div>
              </div>
            </div>

            {/* Subtle Floating Interactive Tag */}
            <motion.div
              className="floating-editorial-tag"
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
            >
              <Languages size={15} className="floating-tag-icon" />
              <span>Bilingual Delivery (Tamil & English)</span>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Interactive Key Impact Bar */}
      <div className="container hero-metrics-container">
        <motion.div
          className="hero-metrics-bar"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.5 }}
        >
          <div className="metric-item">
            <span className="metric-badge">100%</span>
            <div className="metric-text">
              <strong>Statutory Frameworks</strong>
              <span>POSH Act 2013 & POCSO Act 2012 Compliance</span>
            </div>
          </div>
          <div className="metric-divider" />
          <div className="metric-item">
            <span className="metric-badge">Bilingual</span>
            <div className="metric-text">
              <strong>Tamil & English Delivery</strong>
              <span>Tailored for corporate, academic & community groups</span>
            </div>
          </div>
          <div className="metric-divider" />
          <div className="metric-item">
            <span className="metric-badge">3-in-1</span>
            <div className="metric-text">
              <strong>Interdisciplinary Synergy</strong>
              <span>Legal Scholarship + Child Psychology + Analytical Science</span>
            </div>
          </div>
          <div className="metric-divider" />
          <div className="metric-item">
            <span className="metric-badge">Prevention</span>
            <div className="metric-text">
              <strong>Proactive Institutional Culture</strong>
              <span>Empathy, non-retaliation & responsible reporting</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
