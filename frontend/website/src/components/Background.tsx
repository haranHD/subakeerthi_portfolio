import React from 'react';
import { GraduationCap, Award, Calendar, Building, ArrowRight, ShieldCheck, FileText } from 'lucide-react';
import { Credential } from '../types';
import './Background.css';

interface BackgroundProps {
  credentials: Credential[];
}

export const Background: React.FC<BackgroundProps> = ({ credentials }) => {
  const educationData = credentials.filter((c) => c.credentialType === 'EDUCATION');
  const trainingCredentialsData = credentials.filter((c) => c.credentialType === 'ACCREDITATION');

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
          <div className="bg-col">
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
                <div key={item.id || index} className="timeline-item">
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
                    <div className="timeline-institution">
                      <Building size={14} />
                      <span>{item.institution}</span>
                    </div>

                    <p className="timeline-description">
                      {item.details}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Training Credentials */}
          <div className="bg-col">
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
                <div key={cred.id || index} className="credential-card">
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
                <a href="#contact" className="btn btn--secondary btn--sm">
                  <span>Contact for Professional Profile</span>
                  <ArrowRight size={15} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
