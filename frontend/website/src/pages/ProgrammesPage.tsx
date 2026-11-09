import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { ArrowRight, Calendar } from 'lucide-react';
import { TrainingProgrammes } from '../components/TrainingProgrammes';
import { WhoSheSupports } from '../components/WhoSheSupports';
import { Programme, AudienceGroup } from '../types';
import './PageHeader.css';

interface ProgrammesPageProps {
  programmes: Programme[];
  audiences: AudienceGroup[];
}

export const ProgrammesPage: React.FC<ProgrammesPageProps> = ({ programmes, audiences }) => {
  return (
    <>
      <Helmet>
        <title>Training Programmes & Workshops | POSH Act 2013 & POCSO Act 2012</title>
        <meta
          name="description"
          content="Explore certified training programmes by Subakeerthii MP in POSH Act 2013 compliance, POCSO Act 2012 school safeguarding, and child psychology support."
        />
      </Helmet>

      {/* Editorial Header */}
      <section className="page-editorial-header">
        <div className="container page-header-container">
          <span className="page-header-eyebrow">STATUTORY EDUCATION & WORKSHOPS</span>
          <h1 className="page-header-title">Structured Programmes for Safer Institutions</h1>
          <p className="page-header-lead">
            Every programme is tailored with case-law foundations, interactive scenario analysis, and statutory compliance frameworks, delivered bilingually in English and Tamil.
          </p>
        </div>
      </section>

      {/* Full Programme Modules (POSH, POCSO, Child Protection, IC Capacity) */}
      <TrainingProgrammes programmes={programmes} />

      {/* Target Audience Groups */}
      <WhoSheSupports audiences={audiences} />

      {/* Consultation Banner */}
      <div className="page-cta-strip">
        <div className="container page-cta-inner">
          <h2 className="page-cta-title">Schedule a Workshop for Your Organisation</h2>
          <p className="page-cta-text">
            Available for half-day orientations, full-day intensive trainings, and ongoing institutional advisory sessions.
          </p>
          <div className="page-cta-actions">
            <Link to="/contact" className="btn btn--primary" style={{ background: '#D7C7A1', color: '#0D3F2F' }}>
              <Calendar size={16} />
              <span>Book a Session</span>
            </Link>
            <Link to="/about" className="btn btn--secondary" style={{ borderColor: '#D7C7A1', color: '#FFFDFC' }}>
              <span>Learn About Her Approach</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};
