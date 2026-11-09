import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
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
import { triggerEnquiry } from '../utils/enquiryEvents';
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
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    const cards = containerRef.current?.querySelectorAll('.area-card');
    cards?.forEach((card) => observer.observe(card));

    return () => observer.disconnect();
  }, [services]);

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

        <div className="areas-grid" ref={containerRef}>
          {services.map((area, index) => {
            const Icon = iconMap[area.icon] || ShieldCheck;
            const isVisible = visibleCards.has(area.id);
            const numStr = String(index + 1).padStart(2, '0');
            return (
              <div
                key={area.id}
                data-id={area.id}
                className={`area-card ${isVisible ? 'area-card--visible' : ''}`}
                style={{ transitionDelay: `${(index % 3) * 70}ms` }}
              >
                <div className="area-card-top-bar">
                  <span className="area-card-number">{numStr}</span>
                  <span className="area-tag">{area.tag}</span>
                </div>

                <div className="area-card-header">
                  <div className="area-icon-container">
                    <Icon size={22} className="area-icon" />
                  </div>
                  <h3 className="area-card-title">{area.title}</h3>
                </div>

                <p className="area-card-description">
                  {area.description}
                </p>

                <div className="area-card-audience">
                  <strong>Audience:</strong> {area.audience}
                </div>

                <div className="area-card-footer">
                  <button
                    type="button"
                    className="area-link"
                    onClick={() =>
                      triggerEnquiry(
                        {
                          category:
                            area.category === 'Workplace Compliance'
                              ? 'Workplace / Corporate Organisation'
                              : area.category === 'Child Safeguarding'
                                ? 'School / Educational Institution'
                                : 'Other Collaboration',
                          areaOfInterest: area.title,
                          requirements: `I am interested in a session on "${area.title}" for our institution.`,
                        },
                        navigate
                      )
                    }
                  >
                    <span>Enquire for this Area</span>
                    <ArrowRight size={15} />
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
