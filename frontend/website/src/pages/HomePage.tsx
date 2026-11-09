import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, BookOpen, HeartHandshake, CheckCircle2 } from 'lucide-react';
import { Hero } from '../components/Hero';
import { Profile, Service, AudienceGroup } from '../types';
import './PageHeader.css';

interface HomePageProps {
  profile?: Profile | null;
  services: Service[];
  audiences: AudienceGroup[];
}

export const HomePage: React.FC<HomePageProps> = ({ profile, services, audiences }) => {
  return (
    <>
      <Helmet>
        <title>Subakeerthii MP | Legal Scholar, Certified POSH & POCSO Trainer, Child Counsellor</title>
        <meta
          name="description"
          content="Subakeerthii MP combines legal scholarship, child psychology, and scientific understanding to deliver practical statutory education in POSH Act 2013, POCSO Act 2012, and Child Safeguarding."
        />
      </Helmet>

      {/* Hero Section with 4:5 Portrait, Editorial Typography & Full-Width Credentials Strip */}
      <Hero profile={profile} />

      {/* Three Pillars Summary Section */}
      <section className="section" style={{ background: '#FAF8F3', paddingTop: '4rem', paddingBottom: '4rem' }}>
        <div className="container">
          <div className="section-header" style={{ marginBottom: '3rem' }}>
            <span className="section-eyebrow">CORE STATUTORY SPECIALISATIONS</span>
            <h2 className="section-title">Prevention, Compliance & Child Protection</h2>
            <p className="section-subtitle">
              Delivering clear, empathetic, and actionable awareness across statutory frameworks and institutional safeguards.
            </p>
          </div>

          <div className="grid grid--3">
            {services.slice(0, 3).map((service, index) => {
              const icons = [<ShieldCheck size={28} />, <BookOpen size={28} />, <HeartHandshake size={28} />];
              return (
                <div
                  key={service.id || index}
                  className="data-card"
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    padding: '2rem',
                    background: '#FFFDFC',
                    borderRadius: '12px',
                    border: '1px solid #E8DFD0',
                    boxShadow: '0 4px 16px rgba(20, 90, 67, 0.04)',
                  }}
                >
                  <div
                    style={{
                      width: '52px',
                      height: '52px',
                      borderRadius: '10px',
                      background: 'rgba(20, 90, 67, 0.08)',
                      color: '#145A43',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: '1.25rem',
                    }}
                  >
                    {icons[index % icons.length]}
                  </div>

                  <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.35rem', color: '#145A43', marginBottom: '0.75rem' }}>
                    {service.title}
                  </h3>

                  <p style={{ fontSize: '0.925rem', lineHeight: 1.6, color: '#4A5852', marginBottom: '1.5rem', flex: 1 }}>
                    {service.description}
                  </p>

                  <Link
                    to="/programmes"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      fontWeight: 600,
                      fontSize: '0.85rem',
                      color: '#145A43',
                      textDecoration: 'none',
                    }}
                  >
                    <span>View Curriculum & Details</span>
                    <ArrowRight size={15} />
                  </Link>
                </div>
              );
            })}
          </div>

          <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
            <Link to="/programmes" className="btn btn--primary">
              <span>Explore All Training Modules</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Target Audiences Quick Highlight */}
      <section className="section" style={{ background: '#FFFDFC', padding: '4rem 0' }}>
        <div className="container">
          <div className="section-header" style={{ marginBottom: '2.5rem' }}>
            <span className="section-eyebrow">INSTITUTIONAL PARTNERS</span>
            <h2 className="section-title">Who Subakeerthii Supports</h2>
            <p className="section-subtitle">
              Customised bilingual workshop formats structured specifically for corporate, academic, and community groups.
            </p>
          </div>

          <div className="grid grid--4">
            {audiences.map((aud) => (
              <div
                key={aud.id}
                style={{
                  padding: '1.5rem',
                  background: '#FAF8F3',
                  borderRadius: '10px',
                  border: '1px solid #E8DFD0',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                  <CheckCircle2 size={18} color="#2F8F6F" />
                  <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#145A43' }}>
                    {aud.title}
                  </h4>
                </div>
                <p style={{ fontSize: '0.85rem', lineHeight: 1.55, color: '#4A5852', margin: 0 }}>
                  {aud.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Editorial Call to Action Banner */}
      <div className="page-cta-strip">
        <div className="container page-cta-inner">
          <h2 className="page-cta-title">Empower Your Institution with Practical Awareness</h2>
          <p className="page-cta-text">
            Bilingual sessions in English & Tamil designed to build respectful, compliant, and child-safe environments.
          </p>
          <div className="page-cta-actions">
            <Link to="/contact" className="btn btn--primary" style={{ background: '#D7C7A1', color: '#0D3F2F' }}>
              <span>Schedule a Consultation</span>
              <ArrowRight size={16} />
            </Link>
            <Link to="/programmes" className="btn btn--secondary" style={{ borderColor: '#D7C7A1', color: '#FFFDFC' }}>
              <span>Browse Programmes</span>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};
