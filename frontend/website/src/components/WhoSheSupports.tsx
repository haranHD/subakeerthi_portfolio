import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { School, Heart, Sparkles, Briefcase, ArrowUpRight, LucideIcon } from 'lucide-react';
import { AudienceGroup } from '../types';
import { triggerEnquiry } from '../utils/enquiryEvents';
import './WhoSheSupports.css';

const iconMap: Record<string, LucideIcon> = {
  School,
  Heart,
  Sparkles,
  Briefcase,
};

const audienceCategoryMap: Record<string, string> = {
  schools: 'School / Educational Institution',
  parents: 'Parent or Caregiver Group',
  children: 'School / Educational Institution',
  workplaces: 'Workplace / Corporate Organisation',
};

interface WhoSheSupportsProps {
  audiences: AudienceGroup[];
}

export const WhoSheSupports: React.FC<WhoSheSupportsProps> = ({ audiences }) => {
  const navigate = useNavigate();
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
      { threshold: 0.12, rootMargin: '0px 0px -50px 0px' }
    );
    const cards = containerRef.current?.querySelectorAll('.audience-card');
    cards?.forEach((card) => observer.observe(card));
    return () => observer.disconnect();
  }, [audiences]);

  return (
    <section id="audience" className="section section--white audience-section">
      <div className="container">
        <div className="section-header-center">
          <div className="eyebrow">Target Beneficiaries & Partnerships</div>
          <h2 className="section-title">Who She Supports</h2>
          <p className="section-subtitle">
            Every session is customised to address the unique dynamics, legal accountabilities, and developmental needs of each community stakeholder.
          </p>
        </div>

        <div className="audience-grid" ref={containerRef}>
          {audiences.map((aud, index) => {
            const Icon = iconMap[aud.icon] || School;
            const isVisible = visibleCards.has(aud.id);
            const category = audienceCategoryMap[aud.id] || 'Other Collaboration';
            const numStr = String(index + 1).padStart(2, '0');
            return (
              <div
                key={aud.id}
                data-id={aud.id}
                className={`audience-card ${isVisible ? 'audience-card--visible' : ''}`}
                style={{ transitionDelay: `${(index % 4) * 80}ms` }}
              >
                <div className="audience-card-top">
                  <span className="audience-index">{numStr}</span>
                  <div className="audience-icon-box">
                    <Icon size={22} className="audience-icon" />
                  </div>
                </div>

                <div className="audience-badge-wrap">
                  <span className="audience-badge">{aud.badge}</span>
                </div>

                <h3 className="audience-title">{aud.title}</h3>
                
                <p className="audience-desc">
                  {aud.description}
                </p>

                <div className="audience-action">
                  <button
                    type="button"
                    className="btn btn--rose btn--sm btn--full audience-cta-btn"
                    onClick={() =>
                      triggerEnquiry(
                        {
                          category,
                          areaOfInterest: aud.actionText.replace('Enquire for ', ''),
                          requirements: `Interested in: ${aud.title} — ${aud.actionText}`,
                        },
                        navigate
                      )
                    }
                  >
                    <span>{aud.actionText}</span>
                    <ArrowUpRight size={15} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
