import React, { useEffect, useRef, useState } from 'react';
import { Compass, MessageSquare, ShieldAlert, Award } from 'lucide-react';
import './Approach.css';

const principles = [
  {
    number: '01',
    icon: Compass,
    title: 'PREVENTIVE FIRST',
    headline: 'Proactive culture over reactive management',
    description: 'Building a culture of awareness, mutual respect, and safeguards before issues arise. Sessions focus on early boundary recognition, institutional transparency, and preventing harassment or distress before grievances emerge.'
  },
  {
    number: '02',
    icon: ShieldAlert,
    title: 'STATUTORY RIGOUR',
    headline: 'Faithful and actionable legal interpretation',
    description: 'Accurate and responsible interpretation of the POSH Act 2013 and POCSO Act 2012. Legal frameworks are demystified into clear Standard Operating Procedures (SOPs) and compliance checklists for institutional leadership.'
  },
  {
    number: '03',
    icon: Award,
    title: 'EMPATHETIC DELIVERY',
    headline: 'Dignified and shame-free dialogues',
    description: 'Encouraging shame-free, respectful, and non-retaliatory communication. Sensitive topics around boundaries, child safety, and workplace conduct are approached with trauma-informed sensitivity, confidentiality, and deep human empathy.'
  },
  {
    number: '04',
    icon: MessageSquare,
    title: 'AUDIENCE-CENTRED',
    headline: 'Bilingual accessibility tailored to context',
    description: 'Accessible delivery in Tamil or professional English, calibrated to participant needs. From factory floor workers and non-teaching school staff to corporate C-suites and child groups, sessions resonate directly with their lived realities.'
  }
];

export const Approach: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [visibleCards, setVisibleCards] = useState<Set<string>>(new Set());

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = (entry.target as HTMLElement).dataset.num;
            if (id) setVisibleCards((prev) => new Set([...prev, id]));
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );
    const cards = containerRef.current?.querySelectorAll('.approach-card');
    cards?.forEach((c) => observer.observe(c));
    return () => observer.disconnect();
  }, []);

  return (
    <section id="approach" className="section section--white approach-section">
      <div className="container">
        <div className="section-header-center">
          <div className="eyebrow">Guiding Methodologies</div>
          <h2 className="section-title">Clear. Responsible. Audience-Centred.</h2>
          <p className="section-subtitle">
            Four foundational tenets guide every training module, consultative dialogue, and community awareness programme.
          </p>
        </div>

        <div className="approach-grid" ref={containerRef}>
          {principles.map((principle, index) => {
            const Icon = principle.icon;
            const isVisible = visibleCards.has(principle.number);
            return (
              <div
                key={principle.number}
                data-num={principle.number}
                className={`approach-card ${isVisible ? 'approach-card--visible' : ''}`}
                style={{ transitionDelay: `${(index % 2) * 90}ms` }}
              >
                <div className="approach-card-header">
                  <span className="approach-number">{principle.number}</span>
                  <div className="approach-icon-circle">
                    <Icon size={22} />
                  </div>
                </div>

                <div className="approach-body">
                  <h3 className="approach-title">{principle.title}</h3>
                  <h4 className="approach-headline">{principle.headline}</h4>
                  <p className="approach-description">{principle.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
