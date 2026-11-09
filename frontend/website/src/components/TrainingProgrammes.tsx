import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CalendarCheck, ArrowRight, Check, ChevronDown } from 'lucide-react';
import { Programme } from '../types';
import { triggerEnquiry } from '../utils/enquiryEvents';
import './TrainingProgrammes.css';

interface TrainingProgrammesProps {
  programmes: Programme[];
}

export const TrainingProgrammes: React.FC<TrainingProgrammesProps> = ({ programmes }) => {
  const navigate = useNavigate();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [visibleCards, setVisibleCards] = useState<Set<string>>(new Set());

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = (entry.target as HTMLElement).dataset.id;
            if (id) setVisibleCards((prev) => new Set([...prev, id]));
          }
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
    );
    const cards = containerRef.current?.querySelectorAll('.programme-card');
    cards?.forEach((c) => observer.observe(c));
    return () => observer.disconnect();
  }, [programmes]);

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

        <div className="programmes-grid" ref={containerRef}>
          {programmes.map((prog, index) => {
            const isExpanded = expandedId === prog.id;
            const isVisible = visibleCards.has(prog.id);
            return (
              <div
                key={prog.id}
                data-id={prog.id}
                className={`programme-card ${isExpanded ? 'programme-card--expanded' : ''} ${isVisible ? 'programme-card--visible' : ''}`}
                style={{ transitionDelay: `${(index % 3) * 70}ms` }}
              >
                <button
                  type="button"
                  className="programme-top programme-top--clickable"
                  onClick={() => setExpandedId(isExpanded ? null : prog.id)}
                  aria-expanded={isExpanded}
                >
                  <div className="programme-top-left">
                    <span className="programme-category-pill">{prog.category}</span>
                    <h3 className="programme-title">{prog.title}</h3>
                  </div>
                  <span className={`programme-chevron ${isExpanded ? 'programme-chevron--open' : ''}`}>
                    <ChevronDown size={18} />
                  </span>
                </button>

                {/* Collapsible body */}
                <div className={`programme-collapse ${isExpanded ? 'programme-collapse--open' : ''}`}>
                  <div className="programme-body-inner">
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
                      <button
                        type="button"
                        className="btn btn--primary btn--sm btn--full"
                        onClick={() =>
                          triggerEnquiry(
                            {
                              category: prog.intendedAudience.toLowerCase().includes('school') ||
                                prog.intendedAudience.toLowerCase().includes('student')
                                ? 'School / Educational Institution'
                                : prog.intendedAudience.toLowerCase().includes('parent')
                                  ? 'Parent or Caregiver Group'
                                  : prog.intendedAudience.toLowerCase().includes('employee') ||
                                    prog.intendedAudience.toLowerCase().includes('corporate') ||
                                    prog.intendedAudience.toLowerCase().includes('hr')
                                    ? 'Workplace / Corporate Organisation'
                                    : 'Other Collaboration',
                              areaOfInterest: prog.title.substring(0, 60),
                              requirements: `I would like to enquire about the "${prog.title}" programme for my institution.`,
                            },
                            navigate
                          )
                        }
                      >
                        <span>Enquire About This Programme</span>
                        <ArrowRight size={15} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Customization Callout Banner */}
        <div className="customisation-note-card">
          <div className="note-card-icon">
            <CalendarCheck size={26} />
          </div>
          <div className="note-card-text">
            <h4>Tailored Institutional Delivery</h4>
            <p>
              Programme modules, durations, and formats are individually adapted to align with your institution's specific timeline, audience maturity, and compliance focus. Contact Subakeerthii MP to explore a bespoke session outline.
            </p>
          </div>
          <div className="note-card-action">
            <button
              type="button"
              className="btn btn--secondary btn--sm"
              onClick={() =>
                triggerEnquiry(
                  {
                    category: 'Other Collaboration',
                    areaOfInterest: 'Custom Programme Consultation',
                    requirements: 'I need a custom-tailored programme for my institution. Please reach out to discuss options.',
                  },
                  navigate
                )
              }
            >
              Custom Consultation
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
