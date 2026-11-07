import React from 'react';
import { Shield, Sparkles, Heart, FileCheck2 } from 'lucide-react';
import { Profile } from '../types';
import './About.css';

interface AboutProps {
  profile?: Profile | null;
}

export const About: React.FC<AboutProps> = () => {
  return (
    <section id="about" className="section section--white about-section">
      <div className="container">
        <div className="about-grid">
          {/* Left Column: Editorial Content */}
          <div className="about-content">
            <div className="eyebrow">Professional Background & Vision</div>
            <h2 className="section-title">
              A Purpose Rooted in Awareness and Protection
            </h2>
            
            <p className="about-lead">
              Combining a foundational education in science with ongoing legal scholarship and specialised training, Subakeerthii MP works to create safer environments for educational institutions, workplaces, and families.
            </p>

            <p className="about-text">
              Her professional orientation brings together legal awareness, child protection standards, and child-centred counselling insights. With active preparation as an LL.B. scholar and certified credentials in POSH and POCSO training, her approach prioritises proactive prevention over reactive dispute management.
            </p>

            <p className="about-text">
              Whether conducting sensitisation sessions for corporate teams, guiding school educators on statutory child protection obligations, or assisting parents in fostering open communication, her sessions are structured with empathy, factual clarity, and respect for every individual's dignity.
            </p>

            {/* Core Values Matrix */}
            <div className="about-principles-grid">
              <div className="principle-card">
                <div className="principle-icon-wrapper">
                  <Shield size={20} className="principle-icon" />
                </div>
                <div>
                  <h4 className="principle-title">Practical Awareness</h4>
                  <p className="principle-desc">Demystifying legal safeguards into clear, actionable understanding for non-legal audiences.</p>
                </div>
              </div>

              <div className="principle-card">
                <div className="principle-icon-wrapper">
                  <Sparkles size={20} className="principle-icon" />
                </div>
                <div>
                  <h4 className="principle-title">Prevention First</h4>
                  <p className="principle-desc">Fostering institutional empathy and compliance before grievances or safety breaches occur.</p>
                </div>
              </div>

              <div className="principle-card">
                <div className="principle-icon-wrapper">
                  <Heart size={20} className="principle-icon" />
                </div>
                <div>
                  <h4 className="principle-title">Child Protection</h4>
                  <p className="principle-desc">Safeguarding child welfare through age-appropriate education and trauma-informed sensitivity.</p>
                </div>
              </div>

              <div className="principle-card">
                <div className="principle-icon-wrapper">
                  <FileCheck2 size={20} className="principle-icon" />
                </div>
                <div>
                  <h4 className="principle-title">Responsible Reporting</h4>
                  <p className="principle-desc">Educating communities on ethical disclosure and legally prescribed reporting pathways.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Key Pillars Panel */}
          <div className="about-panel-container">
            <div className="editorial-panel">
              <div className="panel-header">
                <span className="panel-badge">Interdisciplinary Foundations</span>
                <h3 className="panel-title">Multi-Disciplinary Synergy</h3>
              </div>

              <div className="pillars-list">
                <div className="pillar-item">
                  <div className="pillar-num">01</div>
                  <div className="pillar-body">
                    <h4>Legal Scholarship (LL.B.)</h4>
                    <p>Rigorous study of Indian jurisprudence, statutory child-protection frameworks, and workplace anti-harassment mandates.</p>
                  </div>
                </div>

                <div className="pillar-item">
                  <div className="pillar-num">02</div>
                  <div className="pillar-body">
                    <h4>Scientific & Analytical Foundation</h4>
                    <p>Bachelor of Science in Biotechnology, instilling structured enquiry, systematic methodology, and evidence-guided communication.</p>
                  </div>
                </div>

                <div className="pillar-item">
                  <div className="pillar-num">03</div>
                  <div className="pillar-body">
                    <h4>Child Psychology & Counselling</h4>
                    <p>Formal diploma training in child psychology, enabling empathetic engagement with young minds, parents, and educators.</p>
                  </div>
                </div>

                <div className="pillar-item">
                  <div className="pillar-num">04</div>
                  <div className="pillar-body">
                    <h4>Certified Institutional Training</h4>
                    <p>Certified trainer credentials in POSH (Harsha Counselling Academy) and POCSO (AK Law Associates).</p>
                  </div>
                </div>
              </div>

              <div className="panel-footer">
                <a href="#training" className="btn btn--secondary btn--sm btn--full">
                  Explore Training Programmes
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Client Official Competency & Credentials Banner */}
        <div className="client-banner-showcase">
          <div className="client-banner-frame">
            <img 
              src="/client-banner.png" 
              alt="Subakeerthii MP Core Competencies: Law, POCSO, POSH, Biotechnology, Child Psychology" 
              className="client-banner-img"
              loading="lazy"
            />
          </div>
          <div className="client-banner-caption">
            <span className="caption-badge">Core Competency Matrix</span>
            <p>Law · POCSO Child Safeguarding · POSH Workplace Compliance · Biotechnology · Child Psychology</p>
          </div>
        </div>
      </div>
    </section>
  );
};
