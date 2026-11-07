import React from 'react';
import { ArrowRight, ShieldCheck, HeartHandshake, BookOpen, CheckCircle2, Award, Sparkles } from 'lucide-react';
import { Profile } from '../types';
import './Hero.css';

interface HeroProps {
  profile?: Profile | null;
}

export const Hero: React.FC<HeroProps> = ({ profile }) => {
  const headline = 'Building Safer Schools, Workplaces & Communities.';
  const description =
    profile?.biography ||
    'Promoting awareness, prevention, protection and responsible reporting through POSH and POCSO awareness programmes, legal education, and child-centred counselling support.';

  return (
    <section id="home" className="hero-section">
      <div className="container hero-container">
        {/* Left Column: Content */}
        <div className="hero-content">
          <div className="hero-eyebrow">
            <span className="eyebrow-dot"></span>
            LEGAL AWARENESS · CHILD SAFETY · WORKPLACE AWARENESS
          </div>

          <h1 className="hero-headline">{headline}</h1>

          <p className="hero-description">{description}</p>

          <div className="hero-cta-group">
            <a href="#contact" className="btn btn--primary hero-btn-main">
              <span>Invite for a Training Session</span>
              <ArrowRight size={18} />
            </a>
            <a href="#areas" className="btn btn--secondary hero-btn-sub">
              <span>Explore My Work</span>
            </a>
          </div>

          {/* Three Concise Service Labels */}
          <div className="hero-services-pills">
            <div className="service-pill">
              <span className="service-pill-icon"><ShieldCheck size={16} /></span>
              <span className="service-pill-text">POSH Awareness</span>
            </div>
            <div className="service-pill">
              <span className="service-pill-icon"><BookOpen size={16} /></span>
              <span className="service-pill-text">POCSO Awareness</span>
            </div>
            <div className="service-pill">
              <span className="service-pill-icon"><HeartHandshake size={16} /></span>
              <span className="service-pill-text">Child Safety & Support</span>
            </div>
          </div>
        </div>

        {/* Right Column: Editorial Portrait / Monogram Frame */}
        <div className="hero-visual">
          <div className="portrait-frame-wrapper">
            <div className="portrait-backdrop-accent"></div>
            <div className="portrait-frame">
              <div className="portrait-inner">
                <div className="monogram-badge">
                  <div className="portrait-image-wrapper">
                    <img
                      src={profile?.portraitUrl || '/subakeerthii-portrait.png'}
                      alt="Subakeerthii MP — Legal Scholar, Certified POSH & POCSO Trainer, Child Counsellor"
                      className="portrait-avatar-img"
                    />
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
                    <span>LL.B. Candidate (Vijayalakshmi Law College)</span>
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

            {/* Subtle Floating Editorial Tag */}
            <div className="editorial-floating-badge">
              <Sparkles size={16} className="floating-badge-icon" />
              <div>
                <strong>Dignity & Prevention</strong>
                <p>Institutional Safety Solutions</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
