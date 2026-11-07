import React from 'react';
import { School, Heart, Sparkles, Briefcase, ArrowUpRight, LucideIcon } from 'lucide-react';
import { AudienceGroup } from '../types';
import './WhoSheSupports.css';

const iconMap: Record<string, LucideIcon> = {
  School,
  Heart,
  Sparkles,
  Briefcase,
};

interface WhoSheSupportsProps {
  audiences: AudienceGroup[];
}

export const WhoSheSupports: React.FC<WhoSheSupportsProps> = ({ audiences }) => {
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

        <div className="audience-grid">
          {audiences.map((aud) => {
            const Icon = iconMap[aud.icon] || School;
            return (
              <div key={aud.id} className="audience-card">
                <div className="audience-card-top">
                  <div className="audience-icon-box">
                    <Icon size={26} className="audience-icon" />
                  </div>
                  <span className="audience-badge">{aud.badge}</span>
                </div>

                <h3 className="audience-title">{aud.title}</h3>
                
                <p className="audience-desc">
                  {aud.description}
                </p>

                <div className="audience-action">
                  <a href="#contact" className="btn btn--rose btn--sm btn--full audience-cta-btn">
                    <span>{aud.actionText}</span>
                    <ArrowUpRight size={15} />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
