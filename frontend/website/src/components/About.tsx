import React, { useEffect, useRef, useState } from 'react';
import { Shield, Sparkles, Heart, FileCheck2 } from 'lucide-react';
import { Profile } from '../types';
import './About.css';

interface AboutProps {
  profile?: Profile | null;
}

export const About: React.FC<AboutProps> = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.unobserve(el); } },
      { threshold: 0.08, rootMargin: '0px 0px -60px 0px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const principles = [
    {
      icon: Shield,
      title: 'Practical Awareness',
      desc: 'Demystifying legal safeguards into clear, actionable understanding for non-legal audiences.',
    },
    {
      icon: Sparkles,
      title: 'Prevention First',
      desc: 'Fostering institutional empathy and compliance before grievances or safety breaches occur.',
    },
    {
      icon: Heart,
      title: 'Child Protection',
      desc: 'Safeguarding child welfare through age-appropriate education and trauma-informed sensitivity.',
    },
    {
      icon: FileCheck2,
      title: 'Responsible Reporting',
      desc: 'Educating communities on ethical disclosure and legally prescribed reporting pathways.',
    },
  ];

  return (
    <section id="about" className="section section--white about-section" ref={sectionRef}>
      <div className="container">
        <div className="about-grid">
          {/* Left Column: Editorial Content */}
          <div className={`about-content about-animate ${visible ? 'about-animate--in' : ''}`}>
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
              {principles.map((p, i) => {
                const Icon = p.icon;
                return (
                  <div
                    key={p.title}
                    className={`principle-card principle-card--animated ${visible ? 'principle-card--visible' : ''}`}
                    style={{ transitionDelay: `${200 + i * 80}ms` }}
                  >
                    <div className="principle-icon-wrapper">
                      <Icon size={20} className="principle-icon" />
                    </div>
                    <div>
                      <h4 className="principle-title">{p.title}</h4>
                      <p className="principle-desc">{p.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Key Pillars Panel */}
          <div className={`about-panel-container about-animate about-animate--delay ${visible ? 'about-animate--in' : ''}`}>
            <div className="editorial-panel">
              <div className="panel-header">
                <span className="panel-badge">Interdisciplinary Foundations</span>
                <h3 className="panel-title">Multi-Disciplinary Synergy</h3>
              </div>

              <div className="pillars-list">
                {[
                  {
                    num: '01',
                    title: 'Legal Scholarship (LL.B.)',
                    text: 'Rigorous study of Indian jurisprudence, statutory child-protection frameworks, and workplace anti-harassment mandates.',
                  },
                  {
                    num: '02',
                    title: 'Scientific & Analytical Foundation',
                    text: 'Bachelor of Science in Biotechnology, instilling structured enquiry, systematic methodology, and evidence-guided communication.',
                  },
                  {
                    num: '03',
                    title: 'Child Psychology Expertise',
                    text: 'Diploma in Child Psychology providing developmental insights, trauma-informed communication, and age-calibrated guidance techniques.',
                  },
                  {
                    num: '04',
                    title: 'Certified Training Accreditations',
                    text: 'Certified by established bodies in both POSH (workplace harassment) and POCSO (child protection) training, ensuring institutional-grade programme delivery.',
                  },
                ].map((pillar, i) => (
                  <div
                    key={pillar.num}
                    className={`pillar-item pillar-item--animated ${visible ? 'pillar-item--visible' : ''}`}
                    style={{ transitionDelay: `${250 + i * 90}ms` }}
                  >
                    <div className="pillar-num">{pillar.num}</div>
                    <div className="pillar-body">
                      <h4>{pillar.title}</h4>
                      <p>{pillar.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
