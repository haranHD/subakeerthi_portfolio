import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // 1. Initial Admin User
  const adminEmail = process.env.ADMIN_DEFAULT_EMAIL || 'admin@subakeerthii.com';
  const adminPassword = process.env.ADMIN_DEFAULT_PASSWORD || 'ChangeMe123!';
  const passwordHash = await bcrypt.hash(adminPassword, 12);

  const admin = await prisma.adminUser.upsert({
    where: { email: adminEmail },
    update: { passwordHash },
    create: {
      email: adminEmail,
      passwordHash,
      role: 'SUPER_ADMIN',
      isActive: true,
    },
  });
  console.log(`✅ Admin account provisioned: ${admin.email}`);

  // 2. Profile
  const existingProfile = await prisma.profile.findFirst();
  const profileData = {
    fullName: 'Subakeerthii MP',
    headline: 'Legal Scholar · Certified POSH & POCSO Trainer · Child Counsellor',
    biography:
      'Combining a foundational education in science with ongoing legal scholarship and specialised training, Subakeerthii MP works to create safer environments for educational institutions, workplaces, and families. Her professional approach brings together legal awareness, child protection standards, and child-centred counselling insights to foster proactive prevention and compliance.',
    location: 'Erode, Tamil Nadu, India',
    phone: '+91 7789937789',
    email: 'llbsubakeerthii@gmail.com',
    portraitUrl: '/subakeerthii-portrait.png',
    heroPills: ['POSH Awareness', 'POCSO Awareness', 'Child Safety & Support'],
    values: [
      {
        title: 'Practical Awareness',
        description: 'Demystifying legal safeguards into clear, actionable understanding for non-legal audiences.',
      },
      {
        title: 'Prevention First',
        description: 'Fostering institutional empathy and compliance before grievances or safety breaches occur.',
      },
      {
        title: 'Child Protection',
        description: 'Safeguarding child welfare through age-appropriate education and trauma-informed sensitivity.',
      },
      {
        title: 'Responsible Reporting',
        description: 'Educating communities on ethical disclosure and legally prescribed reporting pathways.',
      },
    ],
  };

  if (existingProfile) {
    await prisma.profile.update({
      where: { id: existingProfile.id },
      data: profileData,
    });
  } else {
    await prisma.profile.create({ data: profileData });
  }
  console.log('✅ Profile seeded');

  // 3. Services (6 cards)
  const services = [
    {
      title: 'POSH Awareness & Training',
      slug: 'posh-awareness-training',
      tag: 'Workplace Dignity',
      category: 'Workplace Compliance',
      description:
        'Workplace awareness on the prevention and prohibition of sexual harassment under Indian statutory standards. Focuses on fostering respectful professional environments, clear prevention practices, Internal Committee (IC) familiarisation, and responsible, ethical reporting mechanisms.',
      audience: 'Corporate teams, HR leaders, IC members, and management',
      icon: 'Building2',
      displayOrder: 1,
      isPublished: true,
    },
    {
      title: 'POCSO Awareness & Training',
      slug: 'pocso-awareness-training',
      tag: 'Child Protection Framework',
      category: 'Child Safeguarding',
      description:
        'Comprehensive child-protection education under the Protection of Children from Sexual Offences (POCSO) framework. Delivers crucial statutory awareness, prevention protocols, institutional safeguards, and age-appropriate safety education for school ecosystems.',
      audience: 'School management, teachers, administrative staff, and transport teams',
      icon: 'ShieldCheck',
      displayOrder: 2,
      isPublished: true,
    },
    {
      title: 'Child Safety & Protection',
      slug: 'child-safety-protection',
      tag: 'Safe Environments',
      category: 'Child Safeguarding',
      description:
        'Institutional and community initiatives to build safe physical and psychological environments for young learners. Covers identifying warning indicators, institutional safety audits, preventative boundaries, and trauma-informed supportive interventions.',
      audience: 'Educational institutions, parent associations, and childcare caregivers',
      icon: 'HeartHandshake',
      displayOrder: 3,
      isPublished: true,
    },
    {
      title: 'Legal Awareness & Basic Legal Education',
      slug: 'legal-awareness-basic-education',
      tag: 'Civic Literacy',
      category: 'Legal Literacy',
      description:
        "Accessible, non-intimidating legal literacy programmes introducing fundamental legal principles, constitutional guarantees, children's rights, and statutory compliance. Tailored specifically for non-lawyers and students to cultivate responsible civic awareness.",
      audience: 'Students, young adults, community leaders, and citizen groups',
      icon: 'Scale',
      displayOrder: 4,
      isPublished: true,
    },
    {
      title: 'Gender Sensitisation',
      slug: 'gender-sensitisation',
      tag: 'Respect & Dignity',
      category: 'Institutional Culture',
      description:
        'Reflective and interactive programmes designed to dismantle workplace and academic biases, promote mutual respect, encourage inclusive behaviour, and cultivate environments where all genders feel secure, valued, and empowered.',
      audience: 'College students, corporate workplaces, and community groups',
      icon: 'Users2',
      displayOrder: 5,
      isPublished: true,
    },
    {
      title: 'Child-Centred Counselling Support',
      slug: 'child-centred-counselling-support',
      tag: 'Developmental Care',
      category: 'Psychological Support',
      description:
        'Supportive counselling informed by child psychology principles to assist children experiencing emotional, academic, or social distress. Offers compassionate listening, parent guidance, and developmental support without claiming medical or clinical psychiatry treatment.',
      audience: 'Children, adolescents, parents, and school pastoral mentors',
      icon: 'HeartPulse',
      displayOrder: 6,
      isPublished: true,
    },
  ];

  for (const s of services) {
    await prisma.service.upsert({
      where: { slug: s.slug },
      update: s,
      create: s,
    });
  }
  console.log(`✅ ${services.length} Services seeded`);

  // 4. Programmes (6 modules)
  const programmes = [
    {
      title: 'POSH Awareness for Workplaces & Corporate Teams',
      slug: 'posh-workplace',
      category: 'Workplace Safety',
      intendedAudience: 'Employees, Managers, HR Professionals & Internal Committees (IC)',
      purpose:
        'To ensure statutory compliance under the POSH Act 2013 and cultivate a zero-tolerance workplace environment rooted in dignity and equity.',
      description:
        'Comprehensive modules covering what constitutes sexual harassment, subtle versus overt behaviours, the duties of the employer, the role and constitution of the Internal Committee, enquiry processes, and non-retaliation protections.',
      highlights: [
        'Statutory duties under POSH Act',
        'IC conciliation & enquiry basics',
        'Preventive cultural guidelines',
      ],
      displayOrder: 1,
      isPublished: true,
    },
    {
      title: 'POCSO & Child-Safety Awareness for Schools',
      slug: 'pocso-school',
      category: 'Institutional Safeguarding',
      intendedAudience: 'School Management, Teaching Faculty, Non-Teaching Staff & Support Teams',
      purpose:
        'To institutionalise statutory child-protection protocols and mandatory reporting obligations in educational facilities.',
      description:
        'Detailed orientation on POCSO legislation, duty of mandatory reporting, safe physical spaces on school campuses, staff code of conduct, recognizing distress cues in students, and establishing standard operating procedures for crisis response.',
      highlights: [
        'Mandatory reporting legal mandates',
        'Child safeguarding protocols',
        'School staff code of conduct',
      ],
      displayOrder: 2,
      isPublished: true,
    },
    {
      title: 'Parent & Caregiver Child Protection Awareness',
      slug: 'parent-caregiver',
      category: 'Family Education',
      intendedAudience: 'Parents, Guardians, Grandparents & Community Caregivers',
      purpose:
        'To bridge communication gaps and equip families with age-appropriate boundary vocabulary and protective awareness.',
      description:
        'Interactive workshops helping caregivers discuss safe and unsafe touch without fear, recognize behavioral indicators of exploitation or cyberbullying, maintain open dialogue with children, and navigate protective reporting without stigma.',
      highlights: [
        'Open parent-child dialogue',
        'Digital safety & online risks',
        'Recognizing trauma & distress signs',
      ],
      displayOrder: 3,
      isPublished: true,
    },
    {
      title: 'Gender Sensitisation & Dignity in Institutions',
      slug: 'gender-sensitisation-prog',
      category: 'Cultural Inclusivity',
      intendedAudience: 'Higher Education Students, Corporate Workforces & Community Groups',
      purpose:
        'To address subconscious bias, foster mutual respect across genders, and build inclusive organisational cultures.',
      description:
        'Reflective dialogues addressing gender stereotypes, workplace and academic banter, mutual boundary respect, microaggressions, and cultivating empathetic, non-discriminatory day-to-day interactions.',
      highlights: [
        'Stereotype dismantling',
        'Constructive communication',
        'Inclusive institutional climate',
      ],
      displayOrder: 4,
      isPublished: true,
    },
    {
      title: 'Introductory Legal Awareness & Basic Rights',
      slug: 'legal-intro',
      category: 'Civic Literacy',
      intendedAudience: 'Secondary Students, College Youth & Non-Governmental Organisations',
      purpose:
        'To demystify fundamental rights, basic criminal and civil remedies, and constitutional protections in everyday life.',
      description:
        'Accessible civic sessions breaking down key legal principles into plain language, covering cyber safety laws, youth rights, police interaction procedures, and accessible legal aid mechanisms in India.',
      highlights: [
        'Constitutional protections',
        'Cyber safety & digital law basics',
        'How to access legal assistance',
      ],
      displayOrder: 5,
      isPublished: true,
    },
    {
      title: 'Child Safety, Personal Boundaries & Support',
      slug: 'student-safety-prog',
      category: 'Child Empowerment',
      intendedAudience: 'Primary & Middle School Children (Age-Calibrated Groups)',
      purpose:
        'To empower children with boundary awareness, personal body safety concepts, and trusted help-seeking skills.',
      description:
        'Sensitive, non-fear-based interactive sessions focusing on "My Body, My Boundaries", the "No-Go-Tell" principle, distinguishing between safe and unsafe secrets, and identifying trusted family and school support figures.',
      highlights: [
        'Safe vs. unsafe boundaries',
        'Voice empowerment & speaking up',
        'Identifying trusted support networks',
      ],
      displayOrder: 6,
      isPublished: true,
    },
  ];

  for (const p of programmes) {
    await prisma.programme.upsert({
      where: { slug: p.slug },
      update: p,
      create: p,
    });
  }
  console.log(`✅ ${programmes.length} Programmes seeded`);

  // 5. Credentials (5 authentic credentials)
  const credentials = [
    {
      credentialType: 'EDUCATION',
      institution: 'Vijayalakshmi Law College',
      qualification: 'Bachelor of Laws (LL.B.)',
      period: '2026 – 2029',
      status: 'Currently Pursuing',
      details:
        'Comprehensive legal education focusing on constitutional jurisprudence, civil & criminal law, human rights, child protection statutes, and institutional compliance frameworks.',
      displayOrder: 1,
      isPublished: true,
    },
    {
      credentialType: 'EDUCATION',
      institution: 'Harsha Mind Counselling',
      qualification: 'Diploma in Child Psychology',
      period: '2026',
      status: 'Listed Credential',
      details:
        'Specialised study in developmental child psychology, emotional coping mechanisms, behavioral assessment, trauma awareness, and communication methodologies for young minds.',
      displayOrder: 2,
      isPublished: true,
    },
    {
      credentialType: 'EDUCATION',
      institution: 'Bharathiyar University',
      qualification: 'Bachelor of Science in Biotechnology',
      period: '2020 – 2023',
      status: 'Completed',
      details:
        'Scientific foundations establishing rigorous analytical enquiry, evidence assessment, methodical problem solving, and disciplined presentation skills.',
      displayOrder: 3,
      isPublished: true,
    },
    {
      credentialType: 'ACCREDITATION',
      institution: 'AK Law Associates',
      qualification: 'Certified POCSO Trainer',
      period: '2026',
      status: 'Certified Trainer',
      details:
        'Certified expertise in child safeguarding frameworks, statutory compliance for educational institutions, institutional response systems, and mandatory reporting guidelines.',
      issuingBody: 'AK Law Associates',
      statutoryDomain: 'Protection of Children from Sexual Offences (POCSO Act)',
      displayOrder: 4,
      isPublished: true,
    },
    {
      credentialType: 'ACCREDITATION',
      institution: 'Harsha Counselling Academy',
      qualification: 'Certified POSH Trainer',
      period: '2026',
      status: 'Certified Trainer',
      details:
        'Certified expertise in workplace anti-harassment training, Internal Committee (IC) familiarisation, policy interpretation, gender sensitivity, and compliant enquiry proceedings.',
      issuingBody: 'Harsha Counselling Academy',
      statutoryDomain: 'Prevention of Sexual Harassment at Workplace (POSH Act 2013)',
      displayOrder: 5,
      isPublished: true,
    },
  ];

  await prisma.credential.deleteMany({});
  for (const c of credentials) {
    await prisma.credential.create({ data: c });
  }
  console.log(`✅ ${credentials.length} Credentials seeded`);

  // 6. Audience Groups (4 groups)
  const audiences = [
    {
      title: 'Schools & Educational Institutions',
      badge: 'Institutions',
      icon: 'School',
      description:
        'Empowering school leadership, teachers, non-teaching staff, security personnel, and transport operators with statutory POCSO awareness, safe child interactions, anti-bullying protocols, and institutional grievance response readiness.',
      actionText: 'Enquire for School Sessions',
      displayOrder: 1,
      isPublished: true,
    },
    {
      title: 'Parents & Caregivers',
      badge: 'Families & Guardians',
      icon: 'Heart',
      description:
        'Guiding parents on recognizing subtle behavioral changes, initiating comfortable body-safety conversations, fostering trust-based home dialogues, and navigating digital safety concerns with confidence.',
      actionText: 'Enquire for Parent Workshops',
      displayOrder: 2,
      isPublished: true,
    },
    {
      title: 'Children & Young People',
      badge: 'Students & Youth',
      icon: 'Sparkles',
      description:
        'Conducting age-appropriate, compassionate sessions focused on understanding personal boundaries, identifying safe vs. unsafe touch, building assertive communication, and identifying trusted adults to seek help from.',
      actionText: 'Enquire for Student Workshops',
      displayOrder: 3,
      isPublished: true,
    },
    {
      title: 'Workplaces & Organisations',
      badge: 'Corporate & NGOs',
      icon: 'Briefcase',
      description:
        'Equipping management teams, HR professionals, and employees with clear POSH compliance knowledge, fostering a culture of psychological safety, zero tolerance for harassment, and responsible reporting pathways.',
      actionText: 'Enquire for Corporate Training',
      displayOrder: 4,
      isPublished: true,
    },
  ];

  await prisma.audienceGroup.deleteMany({});
  for (const a of audiences) {
    await prisma.audienceGroup.create({ data: a });
  }
  console.log(`✅ ${audiences.length} Audience groups seeded`);

  // 7. Site Settings
  const settings = [
    { key: 'site_title', value: 'Subakeerthii MP | Legal Awareness, POSH & POCSO Trainer, Child Counsellor' },
    { key: 'site_tagline', value: 'LEGAL AWARENESS · SAFETY · EMPOWERMENT' },
    { key: 'contact_phone', value: '+91 7789937789' },
    { key: 'contact_email', value: 'llbsubakeerthii@gmail.com' },
    { key: 'contact_location', value: 'Erode, Tamil Nadu, India' },
    { key: 'child_helpline_notice', value: 'For child-related emergencies in India, contact Child Helpline 1098. For immediate danger, contact appropriate emergency services.' },
  ];

  for (const s of settings) {
    await prisma.siteSetting.upsert({
      where: { key: s.key },
      update: { value: s.value },
      create: s,
    });
  }
  console.log(`✅ ${settings.length} Site settings seeded`);

  console.log('🎉 Database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
