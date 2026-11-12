import React, { useEffect, useRef, useState } from 'react';
import { Shield, Sparkles, Heart } from 'lucide-react';
import { Profile } from '../types';
import './About.css';

interface AboutProps {
  profile?: Profile | null;
}

export const About: React.FC<AboutProps> = ({ profile }) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  const bioParagraphs = profile?.biography
    ? profile.biography.split(/\n+/).map((p) => p.trim()).filter(Boolean)
    : [];

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
      desc: 'Demystifying statutory safeguards into accessible, actionable understanding for non-legal audiences.',
    },
    {
      icon: Sparkles,
      title: 'Prevention First',
      desc: 'Cultivating institutional empathy, clear boundaries, and compliant practices before grievances occur.',
    },
    {
      icon: Heart,
      title: 'Child Protection',
      desc: 'Safeguarding child welfare through developmentally calibrated education and trauma-informed sensitivity.',
    },
  ];

  const pillars = [
    {
      num: '01',
      title: 'Statutory Precision',
      desc: 'Rigorous application of the POSH Act 2013 and POCSO Act 2012, translating formal statutory mandates into compliant institutional procedures.',
    },
    {
      num: '02',
      title: 'Empathetic Communication',
      desc: 'Developmentally calibrated dialogues and child psychology insights that encourage shame-free, respectful, and non-retaliatory reporting.',
    },
    {
      num: '03',
      title: 'Institutional Prevention',
      desc: 'Fostering proactive organisational resilience across workplaces, schools, and families to preempt safety breaches before they emerge.',
    },
  ];

  return (
    <section id="about" className="section section--white about-section" ref={sectionRef}>
      <div className="container">
        <div className="about-grid">
          {/* Left Column: Editorial Content */}
          <div className={`about-content about-animate ${visible ? 'about-animate--in' : ''}`}>
            <div className="eyebrow">PROFESSIONAL BACKGROUND & VISION</div>
            <h2 className="section-title">
              Law, Psychology & Prevention — Working Together.
            </h2>

            {bioParagraphs.length > 0 ? (
              <>
                <p className="about-lead">{bioParagraphs[0]}</p>
                {bioParagraphs.slice(1).map((para, idx) => (
                  <p key={idx} className="about-text">
                    {para}
                  </p>
                ))}
              </>
            ) : (
              <>
                <p className="about-lead">
                  Combining a foundational education in science with ongoing legal scholarship and specialised training, Subakeerthii MP works to create safer environments for educational institutions, workplaces, and families.
                </p>

                <p className="about-text">
                  Her professional orientation brings together statutory awareness, child protection standards, and child-centred counselling insights. With active preparation as an LL.B. scholar and certified credentials in POSH and POCSO training, her approach prioritises proactive prevention over reactive dispute management.
                </p>

                <p className="about-text">
                  Whether conducting sensitisation sessions for corporate leadership, guiding school educators on statutory child protection obligations, or assisting parents in fostering open communication, her sessions are structured with empathy, factual clarity, and respect for every individual's dignity.
                </p>
              </>
            )}

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

          {/* Right Column: Three-Pillar Composition */}
          <div className={`about-panel-container about-animate about-animate--delay ${visible ? 'about-animate--in' : ''}`}>
            <div className="editorial-panel">
              <div className="panel-header">
                <span className="panel-badge">Core Pillars</span>
                <h3 className="panel-title">Institutional Pillars</h3>
              </div>

              <div className="pillars-list">
                {pillars.map((pillar, i) => (
                  <div
                    key={pillar.num}
                    className={`pillar-item pillar-item--animated ${visible ? 'pillar-item--visible' : ''}`}
                    style={{ transitionDelay: `${250 + i * 90}ms` }}
                  >
                    <div className="pillar-num">{pillar.num}</div>
                    <div className="pillar-body">
                      <h4>{pillar.title}</h4>
                      <p>{pillar.desc}</p>
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
