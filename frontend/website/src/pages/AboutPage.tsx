import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Award } from 'lucide-react';
import { About } from '../components/sections/About';
import { Approach } from '../components/sections/Approach';
import { SEO } from '../components/common/SEO';
import { Profile } from '../types';
import '../styles/PageHeader.css';

interface AboutPageProps {
  profile?: Profile | null;
}

export const AboutPage: React.FC<AboutPageProps> = ({ profile }) => {
  return (
    <>
      <SEO
        title="About Subakeerthii MP | Legal Scholarship, Child Psychology & Certified POSH/POCSO Trainer"
        description="Learn about Subakeerthii MP's background combining legal scholarship, certified POSH & POCSO training, and scientific child psychology. Delivering prevention-first awareness programs in Tamil Nadu."
        keywords="about subakeerthii mp, legal scholar, child psychology, child counsellor, child counselling, certified posh trainer, certified pocso trainer, awareness program, prevention first education, erode, tamil nadu"
        canonicalPath="/about"
      />

      {/* Editorial Header */}
      <section className="page-editorial-header">
        <div className="container page-header-container">
          <span className="page-header-eyebrow">PROFESSIONAL BACKGROUND & VISION</span>
          <h1 className="page-header-title">Law, Psychology & Prevention — Working Together.</h1>
          <p className="page-header-lead">
            Subakeerthii MP bridges academic legal enquiry, child welfare psychology, and analytical science to create non-retaliatory, prevention-first awareness for institutions and communities.
          </p>
        </div>
      </section>

      {/* Main Philosophy & Background */}
      <About profile={profile} />

      {/* Practical Methodology & Bilingual Delivery Framework */}
      <Approach />

      {/* Next Step Navigation */}
      <div className="page-cta-strip">
        <div className="container page-cta-inner">
          <h2 className="page-cta-title">Explore Verified Qualifications & Accreditations</h2>
          <p className="page-cta-text">
            Review certified trainer credentials, legal coursework domains, and child psychology diplomas.
          </p>
          <div className="page-cta-actions">
            <Link to="/credentials" className="btn btn--primary" style={{ background: '#D7C7A1', color: '#0D3F2F' }}>
              <Award size={16} />
              <span>View Credentials & Accreditations</span>
            </Link>
            <Link to="/contact" className="btn btn--secondary" style={{ borderColor: '#D7C7A1', color: '#FFFDFC' }}>
              <span>Invite for a Session</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};
