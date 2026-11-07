import React from 'react';
import { Compass, MessageSquare, ShieldAlert, Award } from 'lucide-react';
import './Approach.css';

const principles = [
  {
    number: '01',
    icon: Compass,
    title: 'Practical Awareness',
    headline: 'Actionable insight over theoretical jargon',
    description: 'Legal frameworks often feel distant or intimidating. Subakeerthii translates complex statutory mandates into accessible, scenario-based understandings with real-world case examples, enabling audiences to grasp both their civic duties and practical safety boundaries.'
  },
  {
    number: '02',
    icon: MessageSquare,
    title: 'Age-Appropriate Communication',
    headline: 'Calibrated vocabulary tailored for every developmental phase',
    description: 'Child-protection guidance must inspire confidence, not fear. Sessions for children use gentle, creative, and boundary-focused approaches, while modules for educators and parents emphasize vigilance, open communication, and protective responsibility.'
  },
  {
    number: '03',
    icon: Award,
    title: 'Respect, Dignity & Confidentiality',
    headline: 'A supportive, dignified, and trauma-informed space',
    description: 'Fostering environments where difficult topics can be discussed candidly and with dignity. Sensitive communications are handled with high discretion and ethical care, balancing individual privacy with statutory duty mandates.'
  },
  {
    number: '04',
    icon: ShieldAlert,
    title: 'Prevention & Responsible Reporting',
    headline: 'Proactive safeguards alongside clear reporting pathways',
    description: 'Prioritizing prevention by creating culture-first safeguards in workplaces and schools. When breaches occur, clear orientation is provided on prescribed reporting channels (such as IC mechanisms and Childline/POCSO reporting) without stigma or fear.'
  }
];

export const Approach: React.FC = () => {
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

        <div className="approach-grid">
          {principles.map((principle) => {
            const Icon = principle.icon;
            return (
              <div key={principle.number} className="approach-card">
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
