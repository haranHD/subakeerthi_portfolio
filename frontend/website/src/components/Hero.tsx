import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, ShieldCheck, BookOpen, HeartHandshake, Languages, Award, Scale, FileText, Heart } from 'lucide-react';
import { Profile } from '../types';
import { triggerEnquiry } from '../utils/enquiryEvents';
import { ASSETS } from '../config/assets';
import { getMediaUrl } from '../utils/media';
import './Hero.css';

interface HeroProps {
  profile?: Profile | null;
}

export const Hero: React.FC<HeroProps> = ({ profile }) => {
  const navigate = useNavigate();
  const headline = 'Building Safer Schools, Workplaces & Communities.';
  const description =
    'Combining legal scholarship, child psychology, and scientific understanding to deliver practical, prevention-first awareness and training for safer institutions and communities.';

  const targetPortraitUrl = profile?.portraitUrl ? getMediaUrl(profile.portraitUrl) : ASSETS.portrait.src;
  const [activeSrc, setActiveSrc] = React.useState<string>(targetPortraitUrl);
  const [imageLoaded, setImageLoaded] = React.useState<boolean>(true);

  React.useEffect(() => {
    if (!targetPortraitUrl || targetPortraitUrl === activeSrc) return;

    // Smoothly preload new image before switching to prevent glitching/flashing
    const img = new Image();
    img.src = targetPortraitUrl;
    img.onload = () => {
      setActiveSrc(targetPortraitUrl);
      setImageLoaded(true);
    };
    img.onerror = () => {
      setActiveSrc(ASSETS.portrait.src);
      setImageLoaded(true);
    };
  }, [targetPortraitUrl]);

  const handleConsultation = (e: React.MouseEvent) => {
    e.preventDefault();
    triggerEnquiry(
      {
        category: 'School / Educational Institution',
        areaOfInterest: 'POCSO School Awareness',
        requirements: 'I would like to schedule a professional consultation regarding institutional awareness training.',
      },
      navigate
    );
  };

  return (
    <section id="home" className="hero-section">
      {/* Decorative ambient radial lighting */}
      <div className="hero-ambient-glow" aria-hidden="true" />
      <div className="hero-decorative-line hero-decorative-line--top" aria-hidden="true" />

      <div className="container hero-container">
        {/* Left Column: Editorial Content (approx 52%) */}
        <motion.div
          className="hero-content"
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.div
            className="hero-eyebrow"
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.45, delay: 0.08 }}
          >
            <span className="eyebrow-dot"></span>
            <span>BILINGUAL STATUTORY EDUCATION · ERODE, TAMIL NADU</span>
          </motion.div>

          <motion.h1
            className="hero-headline"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.16, ease: [0.16, 1, 0.3, 1] }}
          >
            {headline}
          </motion.h1>

          <motion.p
            className="hero-description"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.24 }}
          >
            {description}
          </motion.p>

          <motion.div
            className="hero-cta-group"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.32 }}
          >
            <Link to="/programmes" className="btn btn--primary hero-btn-main">
              <span>Explore Training Programmes</span>
              <ArrowRight size={18} className="btn-icon-animated" />
            </Link>
            <Link to="/contact" className="btn btn--secondary hero-btn-sub">
              <span>Schedule a Consultation</span>
            </Link>
          </motion.div>

          {/* Under CTAs: Refined Service Tags */}
          <motion.div
            className="hero-services-pills"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.4 }}
          >
            <Link
              to="/programmes"
              className="service-pill"
            >
              <span className="service-pill-icon"><ShieldCheck size={15} /></span>
              <span className="service-pill-text">POSH Awareness</span>
            </Link>
            <Link
              to="/programmes"
              className="service-pill"
            >
              <span className="service-pill-icon"><BookOpen size={15} /></span>
              <span className="service-pill-text">POCSO Awareness</span>
            </Link>
            <Link
              to="/programmes"
              className="service-pill"
            >
              <span className="service-pill-icon"><HeartHandshake size={15} /></span>
              <span className="service-pill-text">Child Safety & Support</span>
            </Link>
          </motion.div>
        </motion.div>

        {/* Right Column: Premium Editorial Portrait Composition (approx 48%) */}
        <motion.div
          className="hero-visual"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.75, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="portrait-editorial-canvas">
            {/* Subtle architectural arch backdrop shape */}
            <div className="portrait-arch-backdrop" aria-hidden="true" />

            {/* Subtle sand-colored background decorative accent */}
            <div className="portrait-accent-ring" aria-hidden="true" />

            {/* Outer editorial frame with refined double-border detailing */}
            <div className="portrait-editorial-frame">
              <div className="portrait-editorial-inner">
                <img
                  src={activeSrc}
                  alt={ASSETS.portrait.alt}
                  className="portrait-editorial-image"
                  loading="eager"
                  style={{
                    opacity: imageLoaded ? 1 : 0.85,
                    transition: 'opacity 0.35s ease-in-out, transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
                  }}
                  onError={(e) => {
                    const img = e.currentTarget;
                    if (img.src !== ASSETS.portrait.src && !img.src.endsWith(ASSETS.portrait.src)) {
                      img.src = ASSETS.portrait.src;
                    }
                  }}
                />

                {/* Subtle depth lighting overlay */}
                <div className="portrait-depth-gradient" aria-hidden="true" />

                {/* Discreet Credential Label at bottom of portrait */}
                <div className="portrait-discreet-label">
                  <span className="portrait-label-name">SUBAKEERTHII MP</span>
                  <span className="portrait-label-title">Legal Scholar · Certified POSH & POCSO Trainer</span>
                </div>
              </div>
            </div>

            {/* Floating Bilingual Delivery Badge */}
            <motion.div
              className="portrait-floating-badge"
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
            >
              <Languages size={15} className="floating-badge-icon" />
              <span>Tamil & English Delivery</span>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Full-Width Horizontal Credentials Strip Immediately Below Hero */}
      <div className="hero-credentials-strip">
        <div className="container">
          <div className="hero-strip-grid">
            <div className="hero-strip-item">
              <div className="hero-strip-num-box">
                <Scale size={18} className="hero-strip-icon" />
              </div>
              <div className="hero-strip-text">
                <span className="hero-strip-tag">01 · LEGAL SCHOLARSHIP</span>
                <strong className="hero-strip-title">LL.B. — Pursuing</strong>
              </div>
            </div>

            <div className="hero-strip-divider" aria-hidden="true" />

            <div className="hero-strip-item">
              <div className="hero-strip-num-box">
                <ShieldCheck size={18} className="hero-strip-icon" />
              </div>
              <div className="hero-strip-text">
                <span className="hero-strip-tag">02 · WORKPLACE COMPLIANCE</span>
                <strong className="hero-strip-title">Certified POSH Trainer</strong>
                <span className="hero-strip-desc">Harassment Prevention & IC Familiarisation</span>
              </div>
            </div>

            <div className="hero-strip-divider" aria-hidden="true" />

            <div className="hero-strip-item">
              <div className="hero-strip-num-box">
                <Award size={18} className="hero-strip-icon" />
              </div>
              <div className="hero-strip-text">
                <span className="hero-strip-tag">03 · CHILD PROTECTION</span>
                <strong className="hero-strip-title">Certified POCSO Trainer</strong>
                <span className="hero-strip-desc">School Safeguarding & Mandatory SOPs</span>
              </div>
            </div>

            <div className="hero-strip-divider" aria-hidden="true" />

            <div className="hero-strip-item">
              <div className="hero-strip-num-box">
                <Heart size={18} className="hero-strip-icon" />
              </div>
              <div className="hero-strip-text">
                <span className="hero-strip-tag">04 · DEVELOPMENTAL CARE</span>
                <strong className="hero-strip-title">Diploma in Child Psychology</strong>
                <span className="hero-strip-desc">Child-Centred Dialogue & Empathy</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
