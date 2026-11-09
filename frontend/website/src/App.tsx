import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ScrollToTop } from './components/ScrollToTop';
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { ProgrammesPage } from './pages/ProgrammesPage';
import { CredentialsPage } from './pages/CredentialsPage';
import { ContactPage } from './pages/ContactPage';
import { api } from './services/api';
import { Profile, Service, Programme, Credential, AudienceGroup } from './types';

// Fallback initial data ensuring zero broken states
const defaultServices: Service[] = [
  {
    id: 'posh',
    title: 'POSH Awareness & Training',
    slug: 'posh',
    tag: 'Workplace Dignity',
    category: 'Workplace Compliance',
    description: 'Workplace awareness on the prevention and prohibition of sexual harassment under Indian statutory standards. Focuses on fostering respectful professional environments, clear prevention practices, Internal Committee (IC) familiarisation, and responsible, ethical reporting mechanisms.',
    audience: 'Corporate teams, HR leaders, IC members, and management',
    icon: 'Building2',
    displayOrder: 1,
    isPublished: true,
  },
  {
    id: 'pocso',
    title: 'POCSO Awareness & Training',
    slug: 'pocso',
    tag: 'Child Protection Framework',
    category: 'Child Safeguarding',
    description: 'Comprehensive child-protection education under the Protection of Children from Sexual Offences (POCSO) framework. Delivers crucial statutory awareness, prevention protocols, institutional safeguards, and age-appropriate safety education for school ecosystems.',
    audience: 'School management, teachers, administrative staff, and transport teams',
    icon: 'ShieldCheck',
    displayOrder: 2,
    isPublished: true,
  },
  {
    id: 'child-safety',
    title: 'Child Safety & Protection',
    slug: 'child-safety',
    tag: 'Safe Environments',
    category: 'Child Safeguarding',
    description: 'Institutional and community initiatives to build safe physical and psychological environments for young learners. Covers identifying warning indicators, institutional safety audits, preventative boundaries, and trauma-informed supportive interventions.',
    audience: 'Educational institutions, parent associations, and childcare caregivers',
    icon: 'HeartHandshake',
    displayOrder: 3,
    isPublished: true,
  },
  {
    id: 'legal-awareness',
    title: 'Legal Awareness & Basic Legal Education',
    slug: 'legal-awareness',
    tag: 'Civic Literacy',
    category: 'Legal Literacy',
    description: "Accessible, non-intimidating legal literacy programmes introducing fundamental legal principles, constitutional guarantees, children's rights, and statutory compliance. Tailored specifically for non-lawyers and students to cultivate responsible civic awareness.",
    audience: 'Students, young adults, community leaders, and citizen groups',
    icon: 'Scale',
    displayOrder: 4,
    isPublished: true,
  },
  {
    id: 'gender-sensitisation',
    title: 'Gender Sensitisation',
    slug: 'gender-sensitisation',
    tag: 'Respect & Dignity',
    category: 'Institutional Culture',
    description: 'Reflective and interactive programmes designed to dismantle workplace and academic biases, promote mutual respect, encourage inclusive behaviour, and cultivate environments where all genders feel secure, valued, and empowered.',
    audience: 'College students, corporate workplaces, and community groups',
    icon: 'Users2',
    displayOrder: 5,
    isPublished: true,
  },
  {
    id: 'counselling-support',
    title: 'Child-Centred Counselling Support',
    slug: 'counselling-support',
    tag: 'Developmental Care',
    category: 'Psychological Support',
    description: 'Supportive counselling informed by child psychology principles to assist children experiencing emotional, academic, or social distress. Offers compassionate listening, parent guidance, and developmental support without claiming medical or clinical psychiatry treatment.',
    audience: 'Children, adolescents, parents, and school pastoral mentors',
    icon: 'HeartPulse',
    displayOrder: 6,
    isPublished: true,
  },
];

const defaultAudiences: AudienceGroup[] = [
  {
    id: 'schools',
    icon: 'School',
    title: 'Schools & Educational Institutions',
    badge: 'Institutions',
    description: 'Empowering school leadership, teachers, non-teaching staff, security personnel, and transport operators with statutory POCSO awareness, safe child interactions, anti-bullying protocols, and institutional grievance response readiness.',
    actionText: 'Enquire for School Sessions',
    displayOrder: 1,
    isPublished: true,
  },
  {
    id: 'parents',
    icon: 'Heart',
    title: 'Parents & Caregivers',
    badge: 'Families & Guardians',
    description: 'Guiding parents on recognizing subtle behavioral changes, initiating comfortable body-safety conversations, fostering trust-based home dialogues, and navigating digital safety concerns with confidence.',
    actionText: 'Enquire for Parent Workshops',
    displayOrder: 2,
    isPublished: true,
  },
  {
    id: 'children',
    icon: 'Sparkles',
    title: 'Children & Young People',
    badge: 'Students & Youth',
    description: 'Conducting age-appropriate, compassionate sessions focused on understanding personal boundaries, identifying safe vs. unsafe touch, building assertive communication, and identifying trusted adults to seek help from.',
    actionText: 'Enquire for Student Workshops',
    displayOrder: 3,
    isPublished: true,
  },
  {
    id: 'workplaces',
    icon: 'Briefcase',
    title: 'Workplaces & Organisations',
    badge: 'Corporate & NGOs',
    description: 'Equipping management teams, HR professionals, and employees with clear POSH compliance knowledge, fostering a culture of psychological safety, zero tolerance for harassment, and responsible reporting pathways.',
    actionText: 'Enquire for Corporate Training',
    displayOrder: 4,
    isPublished: true,
  },
];

const defaultProgrammes: Programme[] = [
  {
    id: 'posh-workplace',
    category: 'Workplace Safety',
    title: 'POSH Awareness for Workplaces & Corporate Teams',
    slug: 'posh-workplace',
    intendedAudience: 'Employees, Managers, HR Professionals & Internal Committees (IC)',
    purpose: 'To ensure statutory compliance under the POSH Act 2013 and cultivate a zero-tolerance workplace environment rooted in dignity and equity.',
    description: 'Comprehensive modules covering what constitutes sexual harassment, subtle versus overt behaviours, the duties of the employer, the role and constitution of the Internal Committee, enquiry processes, and non-retaliation protections.',
    highlights: ['Statutory duties under POSH Act', 'IC conciliation & enquiry basics', 'Preventive cultural guidelines'],
    displayOrder: 1,
    isPublished: true,
  },
  {
    id: 'pocso-school',
    category: 'Institutional Safeguarding',
    title: 'POCSO & Child-Safety Awareness for Schools',
    slug: 'pocso-school',
    intendedAudience: 'School Management, Teaching Faculty, Non-Teaching Staff & Support Teams',
    purpose: 'To institutionalise statutory child-protection protocols and mandatory reporting obligations in educational facilities.',
    description: 'Detailed orientation on POCSO legislation, duty of mandatory reporting, safe physical spaces on school campuses, staff code of conduct, recognizing distress cues in students, and establishing standard operating procedures for crisis response.',
    highlights: ['Mandatory reporting legal mandates', 'Child safeguarding protocols', 'School staff code of conduct'],
    displayOrder: 2,
    isPublished: true,
  },
  {
    id: 'parent-caregiver',
    category: 'Family Education',
    title: 'Parent & Caregiver Child Protection Awareness',
    slug: 'parent-caregiver',
    intendedAudience: 'Parents, Guardians, Grandparents & Community Caregivers',
    purpose: 'To bridge communication gaps and equip families with age-appropriate boundary vocabulary and protective awareness.',
    description: 'Interactive workshops helping caregivers discuss safe and unsafe touch without fear, recognize behavioral indicators of exploitation or cyberbullying, maintain open dialogue with children, and navigate protective reporting without stigma.',
    highlights: ['Open parent-child dialogue', 'Digital safety & online risks', 'Recognizing trauma & distress signs'],
    displayOrder: 3,
    isPublished: true,
  },
  {
    id: 'gender-sensitisation-prog',
    category: 'Cultural Inclusivity',
    title: 'Gender Sensitisation & Dignity in Institutions',
    slug: 'gender-sensitisation-prog',
    intendedAudience: 'Higher Education Students, Corporate Workforces & Community Groups',
    purpose: 'To address subconscious bias, foster mutual respect across genders, and build inclusive organisational cultures.',
    description: 'Reflective dialogues addressing gender stereotypes, workplace and academic banter, mutual boundary respect, microaggressions, and cultivating empathetic, non-discriminatory day-to-day interactions.',
    highlights: ['Stereotype dismantling', 'Constructive communication', 'Inclusive institutional climate'],
    displayOrder: 4,
    isPublished: true,
  },
  {
    id: 'legal-intro',
    category: 'Civic Literacy',
    title: 'Introductory Legal Awareness & Basic Rights',
    slug: 'legal-intro',
    intendedAudience: 'Secondary Students, College Youth & Non-Governmental Organisations',
    purpose: 'To demystify fundamental rights, basic criminal and civil remedies, and constitutional protections in everyday life.',
    description: 'Accessible civic sessions breaking down key legal principles into plain language, covering cyber safety laws, youth rights, police interaction procedures, and accessible legal aid mechanisms in India.',
    highlights: ['Constitutional protections', 'Cyber safety & digital law basics', 'How to access legal assistance'],
    displayOrder: 5,
    isPublished: true,
  },
  {
    id: 'student-safety-prog',
    category: 'Child Empowerment',
    title: 'Child Safety, Personal Boundaries & Support',
    slug: 'student-safety-prog',
    intendedAudience: 'Primary & Middle School Children (Age-Calibrated Groups)',
    purpose: 'To empower children with boundary awareness, personal body safety concepts, and trusted help-seeking skills.',
    description: 'Sensitive, non-fear-based interactive sessions focusing on "My Body, My Boundaries", the "No-Go-Tell" principle, distinguishing between safe and unsafe secrets, and identifying trusted family and school support figures.',
    highlights: ['Safe vs. unsafe boundaries', 'Voice empowerment & speaking up', 'Identifying trusted support networks'],
    displayOrder: 6,
    isPublished: true,
  },
];

const defaultCredentials: Credential[] = [
  {
    id: 'llb',
    credentialType: 'EDUCATION',
    institution: '',
    qualification: 'Bachelor of Laws (LL.B.)',
    period: '2026 – 2029',
    status: 'Currently Pursuing',
    details: 'Comprehensive legal education focusing on constitutional jurisprudence, civil & criminal law, human rights, child protection statutes, and institutional compliance frameworks.',
    displayOrder: 1,
    isPublished: true,
  },
  {
    id: 'psychology',
    credentialType: 'EDUCATION',
    institution: '',
    qualification: 'Diploma in Child Psychology',
    period: '2026',
    status: 'Listed Credential',
    details: 'Specialised study in developmental child psychology, emotional coping mechanisms, behavioral assessment, trauma awareness, and communication methodologies for young minds.',
    displayOrder: 2,
    isPublished: true,
  },
  {
    id: 'biotech',
    credentialType: 'EDUCATION',
    institution: '',
    qualification: 'Bachelor of Science in Biotechnology',
    period: '2020 – 2023',
    status: 'Completed',
    details: 'Scientific foundations establishing rigorous analytical enquiry, evidence assessment, methodical problem solving, and disciplined presentation skills.',
    displayOrder: 3,
    isPublished: true,
  },
  {
    id: 'pocso-cred',
    credentialType: 'ACCREDITATION',
    institution: 'AK Law Associates',
    qualification: 'Certified POCSO Trainer',
    period: '2026',
    status: 'Certified Trainer',
    details: 'Certified expertise in child safeguarding frameworks, statutory compliance for educational institutions, institutional response systems, and mandatory reporting guidelines.',
    issuingBody: 'AK Law Associates',
    statutoryDomain: 'Protection of Children from Sexual Offences (POCSO Act)',
    displayOrder: 4,
    isPublished: true,
  },
  {
    id: 'posh-cred',
    credentialType: 'ACCREDITATION',
    institution: 'Harsha Counselling Academy',
    qualification: 'Certified POSH Trainer',
    period: '2026',
    status: 'Certified Trainer',
    details: 'Certified expertise in workplace anti-harassment training, Internal Committee (IC) familiarisation, policy interpretation, gender sensitivity, and compliant enquiry proceedings.',
    issuingBody: 'Harsha Counselling Academy',
    statutoryDomain: 'Prevention of Sexual Harassment at Workplace (POSH Act 2013)',
    displayOrder: 5,
    isPublished: true,
  },
];

export const App: React.FC = () => {
  const [profile, setProfile] = useState<Profile | null>(() => {
    try {
      const cached = localStorage.getItem('subakeerthii_profile_cache');
      return cached ? JSON.parse(cached) : null;
    } catch {
      return null;
    }
  });
  const [services, setServices] = useState<Service[]>(defaultServices);
  const [programmes, setProgrammes] = useState<Programme[]>(defaultProgrammes);
  const [credentials, setCredentials] = useState<Credential[]>(defaultCredentials);
  const [audiences, setAudiences] = useState<AudienceGroup[]>(defaultAudiences);

  useEffect(() => {
    async function loadContent() {
      try {
        const [profData, servData, progData, credData, audData] = await Promise.all([
          api.getProfile(),
          api.getServices(),
          api.getProgrammes(),
          api.getCredentials(),
          api.getAudiences(),
        ]);

        if (profData) {
          setProfile(profData);
          try {
            localStorage.setItem('subakeerthii_profile_cache', JSON.stringify(profData));
          } catch (e) {
            console.warn('Failed to cache profile in localStorage', e);
          }
        }
        if (servData.length > 0) setServices(servData);
        if (progData.length > 0) setProgrammes(progData);
        if (credData.length > 0) setCredentials(credData);
        if (audData.length > 0) setAudiences(audData);
      } catch (err) {
        console.warn('Using resilient client fallback content:', err);
      }
    }
    loadContent();
  }, []);

  return (
    <BrowserRouter>
      <ScrollToTop />
      <div className="portfolio-app">
        <Navbar />
        <main id="main-content">
          <Routes>
            <Route
              path="/"
              element={<HomePage profile={profile} services={services} audiences={audiences} />}
            />
            <Route path="/about" element={<AboutPage profile={profile} />} />
            <Route
              path="/programmes"
              element={<ProgrammesPage programmes={programmes} audiences={audiences} />}
            />
            <Route
              path="/credentials"
              element={<CredentialsPage credentials={credentials} />}
            />
            <Route path="/contact" element={<ContactPage />} />
            {/* Fallback route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <Footer profile={profile} />
      </div>
    </BrowserRouter>
  );
};

export default App;
