import React, { useEffect, useRef, useState } from 'react';
import { GraduationCap, Award, Calendar, Building, ArrowRight, ShieldCheck, FileText } from 'lucide-react';
import { Credential } from '../types';
import { triggerEnquiry } from '../utils/enquiryEvents';
import './Background.css';

interface BackgroundProps {
  credentials: Credential[];
}

export const Background: React.FC<BackgroundProps> = ({ credentials }) => {
  const educationData = credentials.filter((c) => c.credentialType === 'EDUCATION');
  const trainingCredentialsData = credentials.filter((c) => c.credentialType === 'ACCREDITATION');

  const leftColRef = useRef<HTMLDivElement>(null);
  const rightColRef = useRef<HTMLDivElement>(null);
  const [leftVisible, setLeftVisible] = useState(false);
  const [rightVisible, setRightVisible] = useState(false);
  const [visibleTimeline, setVisibleTimeline] = useState<Set<number>>(new Set());
  const [visibleCreds, setVisibleCreds] = useState<Set<number>>(new Set());

  useEffect(() => {
    // Left column enter
    const leftObs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setLeftVisible(true); leftObs.disconnect(); } },
      { threshold: 0.08 }
    );
    if (leftColRef.current) leftObs.observe(leftColRef.current);

    // Right column enter (slight delay)
    const rightObs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setRightVisible(true); rightObs.disconnect(); } },
      { threshold: 0.08 }
    );
    if (rightColRef.current) rightObs.observe(rightColRef.current);

    // Individual timeline items
    const timelineItems = leftColRef.current?.querySelectorAll('.timeline-item');
    const timelineObs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = parseInt((entry.target as HTMLElement).dataset.idx || '0', 10);
            setVisibleTimeline((prev) => new Set([...prev, idx]));
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );
    timelineItems?.forEach((item) => timelineObs.observe(item));

    // Individual credential cards
    const credItems = rightColRef.current?.querySelectorAll('.credential-card');
    const credObs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = parseInt((entry.target as HTMLElement).dataset.idx || '0', 10);
            setVisibleCreds((prev) => new Set([...prev, idx]));
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );
    credItems?.forEach((item) => credObs.observe(item));

    return () => {
      leftObs.disconnect();
      rightObs.disconnect();
      timelineObs.disconnect();
      credObs.disconnect();
    };
  }, [credentials]);

  return (
    <section id="background" className="section section--beige background-section">
      <div className="container">
        <div className="section-header-center">
          <div className="eyebrow">Academic & Professional Journey</div>
          <h2 className="section-title">Education & Professional Credentials</h2>
          <p className="section-subtitle">
            A transparent and accurate record of academic scholarship, child psychology qualifications, and certified trainer accreditations.
          </p>
        </div>

        <div className="background-columns">
          {/* Left Column: Education Timeline */}
          <div
            className={`bg-col bg-col--animate ${leftVisible ? 'bg-col--visible' : ''}`}
            ref={leftColRef}
          >
            <div className="col-header">
              <div className="col-icon-box">
                <GraduationCap size={22} />
              </div>
              <div>
                <h3 className="col-title">Academic Education</h3>
                <span className="col-subtitle">Formal degrees & specialised diplomas</span>
              </div>
            </div>

            <div className="timeline-list">
              {educationData.map((item, index) => (
                <div
                  key={item.id || index}
                  data-idx={index}
                  className={`timeline-item timeline-item--animate ${visibleTimeline.has(index) ? 'timeline-item--visible' : ''}`}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <div className="timeline-marker">
                    <span className="marker-dot"></span>
                    {index < educationData.length - 1 && <span className="marker-line"></span>}
                  </div>

                  <div className="timeline-card">
                    <div className="timeline-top">
                      <span className="timeline-badge">{item.status}</span>
                      <span className="timeline-period">
                        <Calendar size={13} />
                        {item.period}
                      </span>
                    </div>

                    <h4 className="timeline-degree">{item.qualification}</h4>
                    {item.institution && item.institution.trim() !== '' && (
                      <div className="timeline-institution">
                        <Building size={14} />
                        <span>{item.institution}</span>
                      </div>
                    )}

                    <p className="timeline-description">
                      {item.details}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Training Credentials */}
          <div
            className={`bg-col bg-col--animate bg-col--delay ${rightVisible ? 'bg-col--visible' : ''}`}
            ref={rightColRef}
          >
            <div className="col-header">
              <div className="col-icon-box">
                <Award size={22} />
              </div>
              <div>
                <h3 className="col-title">Training Accreditations</h3>
                <span className="col-subtitle">Certified trainer credentials</span>
              </div>
            </div>

            <div className="credentials-list">
              {trainingCredentialsData.map((cred, index) => (
                <div
                  key={cred.id || index}
                  data-idx={index}
                  className={`credential-card credential-card--animate ${visibleCreds.has(index) ? 'credential-card--visible' : ''}`}
                  style={{ transitionDelay: `${100 + index * 110}ms` }}
                >
                  <div className="cred-card-top">
                    <div className="cred-badge">
                      <ShieldCheck size={14} />
                      <span>{cred.status || 'Certified Trainer'}</span>
                    </div>
                    <span className="cred-year">{cred.period}</span>
                  </div>

                  <h4 className="cred-title">{cred.qualification}</h4>

                  <div className="cred-issuer">
                    <span className="issuer-label">Accredited by:</span>
                    <strong>{cred.issuingBody || cred.institution}</strong>
                  </div>

                  {cred.statutoryDomain && (
                    <div className="cred-focus">
                      <span className="focus-label">Statutory Domain:</span>
                      <p>{cred.statutoryDomain}</p>
                    </div>
                  )}

                  <p className="cred-desc">
                    {cred.details}
                  </p>
                </div>
              ))}

              {/* Contact for Profile Notice */}
              <div className="profile-request-card">
                <div className="profile-req-header">
                  <FileText size={20} className="profile-req-icon" />
                  <h4>Institutional Due Diligence</h4>
                </div>
                <p>
                  For institutional verification or detailed syllabi for compliance training, educational bodies and corporate HR teams are welcome to request her complete profile details directly.
                </p>
                <button
                  type="button"
                  className="btn btn--secondary btn--sm"
                  onClick={() =>
                    triggerEnquiry({
                      category: 'Other Collaboration',
                      areaOfInterest: 'Custom Programme Consultation',
                      requirements: 'We are requesting complete professional profile details for institutional due diligence and verification.',
                    })
                  }
                >
                  <span>Contact for Professional Profile</span>
                  <ArrowRight size={15} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
