import React from 'react';
import { 
  Building2, 
  ShieldCheck, 
  HeartHandshake, 
  Scale, 
  Users2, 
  HeartPulse, 
  ArrowRight,
  LucideIcon
} from 'lucide-react';
import { Service } from '../types';
import './AreasOfWork.css';

const iconMap: Record<string, LucideIcon> = {
  Building2,
  ShieldCheck,
  HeartHandshake,
  Scale,
  Users2,
  HeartPulse,
};

interface AreasOfWorkProps {
  services: Service[];
}

export const AreasOfWork: React.FC<AreasOfWorkProps> = ({ services }) => {
  return (
    <section id="areas" className="section section--beige areas-section">
      <div className="container">
        <div className="section-header-center">
          <div className="eyebrow">Professional Focus & Capabilities</div>
          <h2 className="section-title">Areas of Professional Work</h2>
          <p className="section-subtitle">
            Distinct training modules, awareness workshops, and supportive guidance designed to cultivate safe, respectful, and legally compliant ecosystems.
          </p>
        </div>

        <div className="areas-grid">
          {services.map((area) => {
            const Icon = iconMap[area.icon] || ShieldCheck;
            return (
              <div key={area.id} className="area-card">
                <div className="area-card-header">
                  <div className="area-icon-container">
                    <Icon size={24} className="area-icon" />
                  </div>
                  <span className="area-tag">{area.tag}</span>
                </div>

                <h3 className="area-card-title">{area.title}</h3>
                
                <p className="area-card-description">
                  {area.description}
                </p>

                <div className="area-card-audience">
                  <strong>Audience Focus:</strong> {area.audience}
                </div>

                <div className="area-card-footer">
                  <a href="#contact" className="area-link">
                    <span>Enquire for session</span>
                    <ArrowRight size={15} />
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
