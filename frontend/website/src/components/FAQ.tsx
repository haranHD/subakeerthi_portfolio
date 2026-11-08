import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, HelpCircle, Sparkles, MessageCircle, ArrowRight, ShieldAlert } from 'lucide-react';
import { triggerEnquiry } from '../utils/enquiryEvents';
import './FAQ.css';

interface FAQItem {
  id: string;
  category: 'posh' | 'pocso' | 'counselling' | 'bilingual';
  question: string;
  answer: string;
  highlight?: string;
  actionPrefill?: {
    category: string;
    areaOfInterest: string;
    requirements: string;
  };
}

const faqsData: FAQItem[] = [
  {
    id: 'bilingual',
    category: 'bilingual',
    question: 'Are training sessions and workshops conducted in Tamil as well as English?',
    answer: 'Yes, absolutely. Sessions are fluently delivered in both Tamil and English (or a bilingual blend) depending on participant preferences. For factory floors, non-teaching school staff, and community groups, presentations and role-plays are conducted in accessible everyday Tamil. For corporate leadership and IC committees, sessions can be bilingual or English-led.',
    highlight: 'Bilingual Delivery in Tamil & English across Tamil Nadu and online.',
  },
  {
    id: 'posh-ic-scope',
    category: 'posh',
    question: 'What does the POSH training cover for newly formed Internal Committees (IC)?',
    answer: 'IC training focuses on the statutory duties under the POSH Act 2013: understanding the definition and spectrum of workplace sexual harassment, principles of natural justice, handling confidential complaints, conducting impartial inquiries within statutory 90-day timelines, conciliation protocols, drafting detailed inquiry reports, and recommending appropriate employer actions.',
    highlight: 'Practical inquiry walkthroughs & report drafting templates.',
    actionPrefill: {
      category: 'Workplace / Corporate Organisation',
      areaOfInterest: 'POSH Workplace Training',
      requirements: 'We are looking to conduct a POSH Internal Committee (IC) capacity-building workshop for our team.',
    },
  },
  {
    id: 'pocso-mandatory-reporting',
    category: 'pocso',
    question: 'How does school POCSO training address mandatory reporting obligations?',
    answer: 'Section 19 of the POCSO Act 2012 establishes mandatory reporting of child abuse for any person, with specific legal responsibilities for school staff and institutions. The training breaks down these obligations into clear institutional Standard Operating Procedures (SOPs): how to document disclosures, whom to inform, how to coordinate with the Special Juvenile Police Unit (SJPU) and Childline (1098), and how to protect student privacy without panic or stigma.',
    highlight: 'Standard Operating Procedures (SOPs) & legal compliance steps.',
    actionPrefill: {
      category: 'School / Educational Institution',
      areaOfInterest: 'POCSO School Awareness',
      requirements: 'We would like to organise a POCSO compliance and child safeguarding session for our school faculty and staff.',
    },
  },
  {
    id: 'child-counselling-scope',
    category: 'counselling',
    question: 'What is the scope of child counselling and parental guidance support?',
    answer: 'Child counselling sessions provide empathetic, developmentally grounded guidance for children and adolescents navigating emotional distress, school anxieties, peer conflicts, and boundary confusion. Parents are actively engaged with constructive communication strategies. Please note that this is non-clinical, developmental support; clinical psychiatric diagnosis or medication is outside this scope.',
    highlight: 'Developmental guidance & parent-child dialogue without clinical stigma.',
    actionPrefill: {
      category: 'Parent or Caregiver Group',
      areaOfInterest: 'Child Counselling Consultation',
      requirements: 'We are seeking guidance regarding child-centred counselling and parental communication support.',
    },
  },
  {
    id: 'customisation-size',
    category: 'bilingual',
    question: 'Can session duration and curriculum be tailored to our institutional schedule?',
    answer: 'Yes. All modules are customized to align with your organization’s schedule and audience profile. Formats range from focused 90-minute awareness talks and interactive half-day seminars to intensive full-day certification workshops. In-person delivery is available throughout Erode, Coimbatore, Salem, Tirupur, Chennai, and the broader Tamil Nadu region, as well as live virtual delivery pan-India.',
    highlight: 'Flexible formats from 90-minute modules to full-day workshops.',
  },
  {
    id: 'advocate-clarification',
    category: 'posh',
    question: 'Does Subakeerthii MP provide individual courtroom representation?',
    answer: 'Subakeerthii MP is a dedicated Legal Scholar currently pursuing her Bachelor of Laws (LL.B.) and is certified in POSH and POCSO training. In accordance with professional standards and statutory rules, she does not offer courtroom representation or practice as a licensed advocate. Her work focuses on preventive legal education, compliance awareness, training workshops, and child counselling guidance.',
    highlight: 'Dedicated to education, preventative compliance, and community awareness.',
  },
];

type CategoryFilter = 'all' | 'posh' | 'pocso' | 'counselling' | 'bilingual';

export const FAQ: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>('all');
  const [openId, setOpenId] = useState<string | null>('bilingual');
  const [searchQuery, setSearchQuery] = useState('');

  const toggleItem = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  const filteredFaqs = faqsData.filter((item) => {
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
    const matchesSearch =
      searchQuery.trim() === '' ||
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.highlight && item.highlight.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <section id="faq" className="section section--white faq-section">
      <div className="container">
        <div className="section-header-center">
          <div className="eyebrow">
            <HelpCircle size={14} />
            <span>Frequently Addressed Queries</span>
          </div>
          <h2 className="section-title">Common Questions & Practical Details</h2>
          <p className="section-subtitle">
            Clear, transparent answers about training methodologies, institutional compliance frameworks, and session formats.
          </p>
        </div>

        {/* Search & Category Filter Controls */}
        <div className="faq-controls">
          <div className="faq-filter-pills" role="tablist" aria-label="FAQ Categories">
            <button
              type="button"
              className={`faq-pill ${activeCategory === 'all' ? 'faq-pill--active' : ''}`}
              onClick={() => setActiveCategory('all')}
              role="tab"
              aria-selected={activeCategory === 'all'}
            >
              All Questions ({faqsData.length})
            </button>
            <button
              type="button"
              className={`faq-pill ${activeCategory === 'posh' ? 'faq-pill--active' : ''}`}
              onClick={() => setActiveCategory('posh')}
              role="tab"
              aria-selected={activeCategory === 'posh'}
            >
              POSH
            </button>
            <button
              type="button"
              className={`faq-pill ${activeCategory === 'pocso' ? 'faq-pill--active' : ''}`}
              onClick={() => setActiveCategory('pocso')}
              role="tab"
              aria-selected={activeCategory === 'pocso'}
            >
              POCSO
            </button>
            <button
              type="button"
              className={`faq-pill ${activeCategory === 'counselling' ? 'faq-pill--active' : ''}`}
              onClick={() => setActiveCategory('counselling')}
              role="tab"
              aria-selected={activeCategory === 'counselling'}
            >
              Counselling
            </button>
            <button
              type="button"
              className={`faq-pill ${activeCategory === 'bilingual' ? 'faq-pill--active' : ''}`}
              onClick={() => setActiveCategory('bilingual')}
              role="tab"
              aria-selected={activeCategory === 'bilingual'}
            >
              Bilingual
            </button>
          </div>

          <div className="faq-search-wrapper">
            <input
              type="text"
              placeholder="Filter questions by keyword (e.g. Tamil, IC, reporting)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="faq-search-input"
              aria-label="Filter FAQ questions"
            />
          </div>
        </div>

        {/* Accordion List */}
        <div className="faq-accordion-container">
          <AnimatePresence mode="wait">
            {filteredFaqs.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="faq-empty-state"
              >
                <p>No questions matched your search criteria.</p>
                <button
                  type="button"
                  className="btn btn--secondary btn--sm"
                  onClick={() => {
                    setSearchQuery('');
                    setActiveCategory('all');
                  }}
                >
                  Clear Filters
                </button>
              </motion.div>
            ) : (
              <div className="faq-list">
                {filteredFaqs.map((faq, index) => {
                  const isOpen = openId === faq.id;
                  return (
                    <motion.div
                      key={faq.id}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.25, delay: index * 0.04 }}
                      className={`faq-item ${isOpen ? 'faq-item--open' : ''}`}
                    >
                      <button
                        type="button"
                        className="faq-question-btn"
                        onClick={() => toggleItem(faq.id)}
                        aria-expanded={isOpen}
                        aria-controls={`faq-answer-${faq.id}`}
                      >
                        <span className="faq-q-number">0{index + 1}</span>
                        <span className="faq-q-text">{faq.question}</span>
                        <span className={`faq-chevron ${isOpen ? 'faq-chevron--rotated' : ''}`}>
                          <ChevronDown size={18} />
                        </span>
                      </button>

                      <AnimatePresence initial={false}>
                        {isOpen && (
                          <motion.div
                            id={`faq-answer-${faq.id}`}
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                            className="faq-answer-collapse"
                          >
                            <div className="faq-answer-content">
                              <p className="faq-answer-text">{faq.answer}</p>
                              
                              {faq.highlight && (
                                <div className="faq-highlight-pill">
                                  <Sparkles size={14} className="highlight-icon" />
                                  <span>{faq.highlight}</span>
                                </div>
                              )}

                              {faq.actionPrefill && (
                                <div className="faq-action-row">
                                  <button
                                    type="button"
                                    className="faq-action-link"
                                    onClick={() => triggerEnquiry(faq.actionPrefill!)}
                                  >
                                    <span>Enquire for this specific session</span>
                                    <ArrowRight size={14} />
                                  </button>
                                </div>
                              )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </AnimatePresence>
        </div>

        {/* Emergency Guidance & Statutory Support Notice */}
        <div className="faq-emergency-notice">
          <div className="emergency-notice-icon">
            <ShieldAlert size={22} />
          </div>
          <div className="emergency-notice-text">
            <strong>Emergency Child Safeguarding & Statutory Notice:</strong>
            <p>
              Professional training programmes are designed for proactive institutional education and preventative compliance. If you are aware of an immediate child safety crisis or active abuse disclosure, please contact the national emergency toll-free helpline <strong>Childline at 1098</strong> or local police/Special Juvenile Police Unit (SJPU) immediately pursuant to Section 19 mandatory reporting under the POCSO Act 2012. Educational workshops do not substitute for statutory crisis intervention.
            </p>
          </div>
        </div>

        {/* Bottom Banner */}
        <div className="faq-support-banner">
          <div className="support-banner-inner">
            <div className="support-banner-icon">
              <MessageCircle size={28} />
            </div>
            <div className="support-banner-text">
              <h4>Have a specific query not covered here?</h4>
              <p>Subakeerthii MP is happy to discuss your institution's specific training scope and compliance requirements.</p>
            </div>
            <div className="support-banner-action">
              <button
                type="button"
                className="btn btn--primary btn--sm"
                onClick={() =>
                  triggerEnquiry({
                    category: 'Other Collaboration',
                    areaOfInterest: 'Custom Programme Consultation',
                    requirements: 'I have a specific query regarding training formats and institutional collaboration.',
                  })
                }
              >
                <span>Submit a Direct Query</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
