import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { SEO } from '../components/SEO';
import {
  Heart,
  ShieldCheck,
  BookOpen,
  Users,
  MapPin,
  Calendar,
  ArrowRight,
  ExternalLink,
  X,
  Sparkles,
  Image as ImageIcon,
} from 'lucide-react';
import { api } from '../services/api';
import { getMediaUrl } from '../utils/media';
import './PageHeader.css';
import './GalleryPage.css';

interface GalleryItem {
  id: string;
  title: string;
  category: 'POCSO' | 'LEGAL_LITERACY' | 'YOUTH' | 'POSH' | 'COMMUNITY';
  categoryLabel: string;
  date: string;
  location: string;
  description: string;
  impactMetrics?: string;
  imageUrl?: string;
  tags: string[];
}

const defaultSocialServiceItems: GalleryItem[] = [
  {
    id: 'pocso-school-camp',
    title: 'Government School Child Body Safety & POCSO Awareness Drive',
    category: 'POCSO',
    categoryLabel: 'Child Safety & POCSO',
    date: '2026',
    location: 'Erode District, Tamil Nadu',
    description:
      'Conducted age-calibrated personal body safety sessions for young school students, demystifying safe versus unsafe touch using the non-fear-based "No-Go-Tell" methodology. Sensitized faculty on institutional duty of care, early warning indicators, and mandatory reporting protocols under the POCSO Act 2012.',
    impactMetrics: '450+ Students & 35 Teachers Sensitized',
    tags: ['POCSO Act 2012', 'Child Safeguarding', 'Body Safety', 'Bilingual Tamil/English'],
  },
  {
    id: 'legal-literacy-community',
    title: 'Grassroots Community Legal Literacy & Women’s Statutory Rights Camp',
    category: 'LEGAL_LITERACY',
    categoryLabel: 'Community Legal Literacy',
    date: '2026',
    location: 'Western Tamil Nadu',
    description:
      'Bilingual community legal literacy session delivering accessible, practical knowledge on fundamental constitutional protections, domestic violence statutory remedies, maintenance rights, and navigating free legal aid services (NALSA/TNSLSA) in everyday life.',
    impactMetrics: '200+ Community Members Reached',
    tags: ['Civic Education', 'Women Statutory Rights', 'Legal Aid Access', 'Rural Outreach'],
  },
  {
    id: 'parental-child-safety',
    title: 'Parental Guidance & Digital Child Protection Workshop',
    category: 'COMMUNITY',
    categoryLabel: 'Child Safety & POCSO',
    date: '2026',
    location: 'Erode, Tamil Nadu',
    description:
      'Interactive guidance session for parents and educators on modern cyber boundaries, digital grooming dangers, online safety regulations, and establishing empathetic dialogue with children to identify distress early.',
    impactMetrics: '180+ Families Guided',
    tags: ['Digital Safety', 'Cyber Laws', 'Parental Communication', 'Child Psychology'],
  },
  {
    id: 'college-youth-rights',
    title: 'Collegiate Statutory Awareness & Anti-Harassment Orientation',
    category: 'YOUTH',
    categoryLabel: 'Youth & School Outreach',
    date: '2026',
    location: 'Tamil Nadu',
    description:
      'Dynamic youth engagement addressing harassment prevention in higher education spaces, digital safety under IT Act statutes, consent principles, and complaint escalation pathways under statutory frameworks.',
    impactMetrics: '600+ College Youths Addressed',
    tags: ['Youth Rights', 'Campus Safety', 'IT Act Basics', 'Statutory Redressal'],
  },
  {
    id: 'posh-ic-training',
    title: 'Workplace Dignity & Internal Committee Capacity Building',
    category: 'POSH',
    categoryLabel: 'Institutional POSH Engagements',
    date: '2026',
    location: 'Tamil Nadu',
    description:
      'Intensive orientation for management and Internal Committee members on compliant enquiry procedures, gender neutrality, prevention of retaliatory actions, and fostering psychologically safe professional environments under POSH Act 2013.',
    impactMetrics: 'Key IC Members & Department Heads Trained',
    tags: ['POSH Act 2013', 'IC Capacity', 'Workplace Dignity', 'Enquiry Compliance'],
  },
  {
    id: 'child-counselling-empathy',
    title: 'Child-Centred Emotional Coping & Safe Environment Dialogue',
    category: 'COMMUNITY',
    categoryLabel: 'Child Safety & POCSO',
    date: '2026',
    location: 'Erode District, Tamil Nadu',
    description:
      'Targeted developmental psychology session applying child psychology principles to create nurturing, open communication channels between children, caregivers, and community educators.',
    impactMetrics: 'Specialized Educator Group Facilitated',
    tags: ['Child Psychology', 'Emotional Support', 'Caregiver Training', 'Trauma Awareness'],
  },
];

export const GalleryPage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('ALL');
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);
  const [uploadedMedia, setUploadedMedia] = useState<any[]>([]);

  useEffect(() => {
    async function loadUploadedMedia() {
      try {
        const media = await api.getMedia();
        if (Array.isArray(media) && media.length > 0) {
          setUploadedMedia(media.filter((m) => m.mimeType?.startsWith('image/')));
        }
      } catch (err) {
        console.warn('Using curated gallery data:', err);
      }
    }
    loadUploadedMedia();
  }, []);

  const categories = [
    { key: 'ALL', label: 'All Initiatives' },
    { key: 'POCSO', label: 'Child Safety & POCSO' },
    { key: 'LEGAL_LITERACY', label: 'Community Legal Literacy' },
    { key: 'YOUTH', label: 'Youth & School Outreach' },
    { key: 'POSH', label: 'Institutional POSH' },
  ];

  const filteredItems =
    activeCategory === 'ALL'
      ? defaultSocialServiceItems
      : defaultSocialServiceItems.filter((item) => item.category === activeCategory);

  return (
    <>
      <SEO
        title="Social Service & Community Awareness Gallery | Subakeerthii MP"
        description="Explore field initiatives, school POCSO child safety campaigns, community legal literacy camps, and institutional awareness programs led by Subakeerthii MP across Tamil Nadu."
        keywords="subakeerthii mp gallery, social service, community awareness program, child safety workshop photos, pocso training photos, school outreach tamil nadu, legal awareness camps"
        canonicalPath="/gallery"
      />

      {/* Editorial Header */}
      <section className="page-editorial-header">
        <div className="container page-header-container">
          <span className="page-header-eyebrow">FIELD INITIATIVES · AWARENESS · SOCIAL IMPACT</span>
          <h1 className="page-header-title">Social Service & Community Engagements</h1>
          <p className="page-header-lead">
            A visual and documentary record of grassroots child protection drives, community legal literacy camps, educational institutional workshops, and child safety initiatives led by Subakeerthii MP across Erode and Tamil Nadu.
          </p>
        </div>
      </section>

      {/* Main Gallery Section */}
      <section className="section gallery-section">
        <div className="container">
          {/* Category Filter Pills */}
          <div className="gallery-filter-bar">
            {categories.map((cat) => (
              <button
                key={cat.key}
                type="button"
                onClick={() => setActiveCategory(cat.key)}
                className={`gallery-filter-btn ${activeCategory === cat.key ? 'gallery-filter-btn--active' : ''}`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Initiatives Card Grid */}
          <div className="gallery-grid">
            {filteredItems.map((item) => (
              <article
                key={item.id}
                className="gallery-card"
                onClick={() => setSelectedItem(item)}
              >
                <div className="gallery-card-badge-row">
                  <span className="gallery-category-pill">{item.categoryLabel}</span>
                  <span className="gallery-year-tag">{item.date}</span>
                </div>

                <h3 className="gallery-card-title">{item.title}</h3>

                <p className="gallery-card-description">{item.description}</p>

                {item.impactMetrics && (
                  <div className="gallery-card-impact">
                    <Sparkles size={14} className="impact-icon" />
                    <span>{item.impactMetrics}</span>
                  </div>
                )}

                <div className="gallery-card-meta">
                  <div className="gallery-location">
                    <MapPin size={14} />
                    <span>{item.location}</span>
                  </div>
                  <span className="gallery-view-link">
                    View Details <ArrowRight size={14} />
                  </span>
                </div>

                <div className="gallery-tags-row">
                  {item.tags.map((tag, idx) => (
                    <span key={idx} className="gallery-tag">
                      {tag}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>

          {/* Uploaded Media Showcase (If available from Admin Panel) */}
          {uploadedMedia.length > 0 && (
            <div className="uploaded-media-section" style={{ marginTop: '4rem' }}>
              <div className="section-header-compact">
                <span className="eyebrow">OFFICIAL ASSETS & ARCHIVES</span>
                <h2 className="section-title" style={{ fontSize: '1.75rem' }}>
                  Field Photo Documentation
                </h2>
                <p style={{ color: '#666', fontSize: '0.92rem', maxWidth: 640 }}>
                  Photographs and visual archives recorded from training halls, community venues, and official awareness sessions.
                </p>
              </div>

              <div className="media-photo-grid">
                {uploadedMedia.map((media) => (
                  <div
                    key={media.id}
                    className="media-photo-card"
                    onClick={() =>
                      setSelectedItem({
                        id: media.id,
                        title: media.originalName.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '),
                        category: 'COMMUNITY',
                        categoryLabel: media.assetType || 'Documentation',
                        date: new Date(media.createdAt).getFullYear().toString(),
                        location: 'Tamil Nadu, India',
                        description: `Official photographic asset documented from sessions and awareness programmes led by Subakeerthii MP.`,
                        imageUrl: getMediaUrl(media.storageUrl),
                        tags: [media.assetType, 'Field Work', 'Documentation'],
                      })
                    }
                  >
                    <div className="media-photo-thumb">
                      <img
                        src={getMediaUrl(media.storageUrl)}
                        alt={media.originalName}
                        loading="lazy"
                      />
                    </div>
                    <div className="media-photo-info">
                      <span className="photo-type-badge">{media.assetType}</span>
                      <p className="photo-title">{media.originalName}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Lightbox / Initiative Detail Modal */}
      {selectedItem && (
        <div
          className="gallery-modal-backdrop"
          onClick={() => setSelectedItem(null)}
          role="dialog"
          aria-modal="true"
        >
          <div className="gallery-modal-card" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="gallery-modal-close"
              onClick={() => setSelectedItem(null)}
              aria-label="Close details"
            >
              <X size={20} />
            </button>

            {selectedItem.imageUrl && (
              <div className="gallery-modal-image-wrap">
                <img src={selectedItem.imageUrl} alt={selectedItem.title} />
              </div>
            )}

            <div className="gallery-modal-body">
              <div className="gallery-modal-badge-row">
                <span className="gallery-category-pill">{selectedItem.categoryLabel}</span>
                <span className="gallery-location">
                  <MapPin size={14} /> {selectedItem.location}
                </span>
                <span className="gallery-year-tag">{selectedItem.date}</span>
              </div>

              <h2 className="gallery-modal-title">{selectedItem.title}</h2>

              <p className="gallery-modal-description">{selectedItem.description}</p>

              {selectedItem.impactMetrics && (
                <div className="gallery-modal-impact">
                  <Sparkles size={16} />
                  <span>{selectedItem.impactMetrics}</span>
                </div>
              )}

              <div className="gallery-modal-tags">
                {selectedItem.tags.map((tag, idx) => (
                  <span key={idx} className="gallery-tag">
                    {tag}
                  </span>
                ))}
              </div>

              <div className="gallery-modal-actions">
                <Link
                  to="/contact"
                  className="btn btn--primary"
                  onClick={() => setSelectedItem(null)}
                >
                  <span>Request a Session for Your Institution</span>
                  <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Social Service Engagement CTA Banner */}
      <section className="page-cta-strip">
        <div className="container page-cta-inner">
          <h2 className="page-cta-title">Collaborate on a Community or School Initiative</h2>
          <p className="page-cta-text">
            Subakeerthii MP is actively available for community legal awareness camps, school child-protection drives, and NGO youth empowerment sessions across Tamil Nadu.
          </p>
          <div className="page-cta-actions">
            <Link to="/contact" className="btn btn--primary" style={{ background: '#D7C7A1', color: '#0D3F2F' }}>
              <Heart size={16} />
              <span>Initiate a Community Collaboration</span>
            </Link>
            <Link to="/about" className="btn btn--secondary" style={{ borderColor: '#D7C7A1', color: '#FFFDFC' }}>
              <span>Read About Her Mission</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};
