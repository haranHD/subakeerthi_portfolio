import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Mail } from 'lucide-react';
import { Background } from '../components/Background';
import { Credential } from '../types';
import './PageHeader.css';

interface CredentialsPageProps {
  credentials: Credential[];
}

export const CredentialsPage: React.FC<CredentialsPageProps> = ({ credentials }) => {
  return (
    <>
      <Helmet>
        <title>Academic & Professional Credentials | Subakeerthii MP</title>
        <meta
          name="description"
          content="Review verified credentials of Subakeerthii MP: LL.B. Candidate, Certified POSH Trainer, Certified POCSO Trainer, and Diploma in Child Psychology."
        />
      </Helmet>

      {/* Editorial Header */}
      <section className="page-editorial-header">
        <div className="container page-header-container">
          <span className="page-header-eyebrow">VERIFIED QUALIFICATIONS & ACCREDITATIONS</span>
          <h1 className="page-header-title">Academic Foundations & Certified Expertise</h1>
          <p className="page-header-lead">
            Documented accreditations across statutory frameworks, institutional compliance standards, and child developmental psychology.
          </p>
        </div>
      </section>

      {/* Main Credentials Display */}
      <Background credentials={credentials} />

      {/* Statutory Clarity Callout */}
      <div className="container" style={{ margin: '3rem auto 0', maxWidth: '850px' }}>
        <div
          style={{
            padding: '1.75rem',
            background: '#FAF8F3',
            border: '1px solid #D7C7A1',
            borderRadius: '10px',
            display: 'flex',
            gap: '1rem',
            alignItems: 'flex-start',
          }}
        >
          <ShieldCheck size={26} color="#145A43" style={{ flexShrink: 0, marginTop: '2px' }} />
          <div>
            <h4 style={{ color: '#145A43', marginBottom: '0.4rem', fontSize: '1.05rem', fontWeight: 700 }}>
              Statutory Accuracy & Professional Discretion
            </h4>
            <p style={{ fontSize: '0.88rem', lineHeight: 1.6, color: '#4A5852', margin: 0 }}>
              Subakeerthii MP delivers statutory awareness and education as an LL.B. candidate and certified trainer. Institutional privacy is strictly honored, and all documentation is verified for educational and compliance accreditation.
            </p>
          </div>
        </div>
      </div>

      {/* Action Strip */}
      <div className="page-cta-strip">
        <div className="container page-cta-inner">
          <h2 className="page-cta-title">Collaborate with Subakeerthii MP</h2>
          <p className="page-cta-text">
            Engage certified expertise for your Internal Committee compliance, faculty child safeguarding, or community workshops.
          </p>
          <div className="page-cta-actions">
            <Link to="/contact" className="btn btn--primary" style={{ background: '#D7C7A1', color: '#0D3F2F' }}>
              <Mail size={16} />
              <span>Request Institutional Engagement</span>
            </Link>
            <Link to="/programmes" className="btn btn--secondary" style={{ borderColor: '#D7C7A1', color: '#FFFDFC' }}>
              <span>View Training Modules</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};
