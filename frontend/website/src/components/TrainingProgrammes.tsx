import React from 'react';
import { CalendarCheck, ArrowRight, Check } from 'lucide-react';
import { Programme } from '../types';
import './TrainingProgrammes.css';

interface TrainingProgrammesProps {
  programmes: Programme[];
}

export const TrainingProgrammes: React.FC<TrainingProgrammesProps> = ({ programmes }) => {
  return (
    <section id="training" className="section section--beige training-section">
      <div className="container">
        <div className="section-header-center">
          <div className="eyebrow">Programmes & Workshops</div>
          <h2 className="section-title">Awareness That Leads to Action</h2>
          <p className="section-subtitle">
            Structured awareness sessions designed to build institutional resilience, legal literacy, and empathetic human connections across varied settings.
          </p>
        </div>

        <div className="programmes-grid">
          {programmes.map((prog) => (
            <div key={prog.id} className="programme-card">
              <div className="programme-top">
                <span className="programme-category-pill">{prog.category}</span>
                <h3 className="programme-title">{prog.title}</h3>
              </div>

              <div className="programme-meta-block">
                <div className="meta-row">
                  <span className="meta-label">Intended Audience:</span>
                  <span className="meta-val">{prog.intendedAudience}</span>
                </div>
                <div className="meta-row">
                  <span className="meta-label">Purpose:</span>
                  <span className="meta-val">{prog.purpose}</span>
                </div>
              </div>

              <p className="programme-description">
                {prog.description}
              </p>

              <div className="programme-highlights">
                <span className="highlights-title">Key Themes Addressed:</span>
                <ul className="highlights-list">
                  {prog.highlights.map((item, idx) => (
                    <li key={idx} className="highlight-item">
                      <Check size={14} className="highlight-check" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="programme-footer">
                <a href="#contact" className="btn btn--primary btn--sm btn--full">
                  <span>Enquire About This Programme</span>
                  <ArrowRight size={15} />
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Customization Callout Banner */}
        <div className="customisation-note-card">
          <div className="note-card-icon">
            <CalendarCheck size={26} />
          </div>
          <div className="note-card-text">
            <h4>Tailored Institutional Delivery</h4>
            <p>
              Programme modules, durations, and formats are individually adapted to align with your institution’s specific timeline, audience maturity, and compliance focus. Contact Subakeerthii MP to explore a bespoke session outline.
            </p>
          </div>
          <div className="note-card-action">
            <a href="#contact" className="btn btn--secondary btn--sm">
              Custom Consultation
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
