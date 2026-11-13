import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { SEO } from '../components/common/SEO';
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
  Building2,
  Maximize2,
  Camera,
} from 'lucide-react';
import { api } from '../services/api';
import { getMediaUrl } from '../utils/media';
import '../styles/PageHeader.css';
import './GalleryPage.css';

interface GalleryItem {
  id: string;
  title: string;
  category: 'POCSO' | 'LEGAL_LITERACY' | 'YOUTH' | 'POSH' | 'COMMUNITY' | 'PHOTO';
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

const defaultFallbackMedia = [
  {
    id: 'portrait-office',
    originalName: 'Professional Portrait in Modern Office',
    assetType: 'PORTRAIT',
    storageUrl: '/uploads/Professional_Portrait_in_a_Modern_Office-1794229532510-346112045.png',
    createdAt: '2026-01-01',
    description:
      'Executive portrait of Subakeerthii MP in professional chambers — Legal Scholar, Certified POSH & POCSO Trainer, and Child Counsellor.',
  },
  {
    id: 'portrait-official',
    originalName: 'Subakeerthii MP — Professional Profile Portrait',
    assetType: 'PORTRAIT',
    storageUrl: '/subakeerthii-portrait.png',
    createdAt: '2026-01-01',
    description:
      'Official academic and institutional portrait representing legal scholarship, child psychology foundations, and statutory training accreditations.',
  },
  {
    id: 'banner-credentials',
    originalName: 'Verified Accreditations & Statutory Domains',
    assetType: 'BANNER',
    storageUrl: '/client-banner.png',
    createdAt: '2026-01-01',
    description:
      'Verified credential portfolio documenting LL.B. legal education, Certified POSH Trainer accreditation, Certified POCSO Trainer accreditation, and Diploma in Child Psychology.',
  },
];

function formatMediaTitle(rawName: string, assetType: string): string {
  if (!rawName) return 'Official Photographic Documentation';
  let clean = rawName.replace(/\.[^/.]+$/, '');
  // Strip trailing hash/timestamp strings like -1794229532510-346112045
  clean = clean.replace(/[-_]\d{10,}([-_]\d+)?/g, '');
  clean = clean.replace(/[-_]+/g, ' ').trim();

  if (!clean || /^\d+$/.test(clean) || clean.toLowerCase() === 'image') {
    if (assetType?.toUpperCase() === 'PORTRAIT') return 'Subakeerthii MP — Professional Portrait';
    if (assetType?.toUpperCase() === 'BANNER') return 'Official Credentials & Accreditations';
    return 'Statutory Awareness Programme Documentation';
  }

  return clean
    .split(' ')
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ');
}

function formatAssetBadge(assetType: string): string {
  switch (assetType?.toUpperCase()) {
    case 'PORTRAIT':
      return 'Official Portrait';
    case 'BANNER':
      return 'Institutional Banner';
    case 'CERTIFICATE':
      return 'Accreditation';
    case 'SESSION':
    case 'EVENT':
      return 'Field Session';
    default:
      return 'Field Documentation';
  }
}

function getAssetTags(assetType: string): string[] {
  switch (assetType?.toUpperCase()) {
    case 'PORTRAIT':
      return ['Official Portrait', 'Legal Scholar', 'POSH & POCSO Trainer', 'Child Counsellor'];
    case 'BANNER':
      return ['Accreditations', 'Academic Credentials', 'Child Psychology', 'Statutory Compliance'];
    default:
      return ['Awareness Program', 'Institutional Safety', 'Field Work', 'Erode, Tamil Nadu'];
  }
}

function getCategoryIcon(category: string) {
  switch (category) {
    case 'POCSO':
      return <ShieldCheck size={18} />;
    case 'LEGAL_LITERACY':
      return <BookOpen size={18} />;
    case 'YOUTH':
      return <Users size={18} />;
    case 'POSH':
      return <Building2 size={18} />;
    case 'COMMUNITY':
      return <Heart size={18} />;
    default:
      return <Camera size={18} />;
  }
}

export const GalleryPage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('ALL');
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);
  const [uploadedMedia, setUploadedMedia] = useState<any[]>(defaultFallbackMedia);

  useEffect(() => {
    async function loadUploadedMedia() {
      try {
        const media = await api.getMedia();
        if (Array.isArray(media) && media.length > 0) {
          const imageAssets = media.filter(
            (m) =>
              m.mimeType?.startsWith('image/') ||
              m.storageUrl?.match(/\.(png|jpe?g|webp|svg)$/i) ||
              m.storageUrl?.startsWith('data:image/')
          );
          if (imageAssets.length > 0) {
            setUploadedMedia(imageAssets);
          }
        }
      } catch (err) {
        console.warn('Using curated gallery data:', err);
      }
    }
    loadUploadedMedia();
  }, []);

  const categories = [
    { key: 'ALL', label: 'All Records & Archives' },
    { key: 'PHOTOS', label: 'Field Photo Archives' },
    { key: 'POCSO', label: 'Child Safety & POCSO' },
    { key: 'LEGAL_LITERACY', label: 'Community Legal Literacy' },
    { key: 'YOUTH', label: 'Youth & School Outreach' },
    { key: 'POSH', label: 'Institutional POSH' },
  ];

  const filteredItems =
    activeCategory === 'ALL'
      ? defaultSocialServiceItems
      : activeCategory === 'PHOTOS'
        ? []
        : defaultSocialServiceItems.filter((item) => item.category === activeCategory);

  const showPhotos = activeCategory === 'ALL' || activeCategory === 'PHOTOS';

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

          {/* 1. Official Photo Documentation Showcase */}
          {showPhotos && uploadedMedia.length > 0 && (
            <div className="uploaded-media-section">
              <div className="gallery-section-heading">
                <div className="heading-accent-line" />
                <div>
                  <span className="gallery-eyebrow-small">OFFICIAL ASSETS & ARCHIVES</span>
                  <h2 className="gallery-sub-heading">Field Photo Documentation & Archives</h2>
                  <p className="gallery-sub-lead">
                    High-resolution photographic records and portraits documented from official training sessions, awareness programmes, and professional leadership.
                  </p>
                </div>
              </div>

              <div className="media-photo-grid">
                {uploadedMedia.map((media) => {
                  const title = formatMediaTitle(media.originalName, media.assetType);
                  const badge = formatAssetBadge(media.assetType);
                  const tags = getAssetTags(media.assetType);
                  const year = media.createdAt
                    ? new Date(media.createdAt).getFullYear().toString()
                    : '2026';

                  return (
                    <div
                      key={media.id}
                      className="media-photo-card"
                      onClick={() =>
                        setSelectedItem({
                          id: media.id,
                          title,
                          category: 'PHOTO',
                          categoryLabel: badge,
                          date: year,
                          location: 'Erode, Tamil Nadu',
                          description:
                            media.description ||
                            `Official visual archive of Subakeerthii MP — Legal Scholar, Certified POSH & POCSO Trainer, and Child Counsellor. Documented for institutional, educational, and community records.`,
                          imageUrl: getMediaUrl(media.storageUrl),
                          tags,
                        })
                      }
                    >
                      <div className="media-photo-thumb">
                        <img
                          src={getMediaUrl(media.storageUrl)}
                          alt={title}
                          loading="lazy"
                        />
                        <div className="media-photo-overlay">
                          <span className="media-photo-zoom-btn">
                            <Maximize2 size={15} />
                            <span>View Full Image</span>
                          </span>
                        </div>
                      </div>
                      <div className="media-photo-info">
                        <div className="media-photo-header-row">
                          <span className="photo-type-badge">{badge}</span>
                          <span className="photo-date-tag">{year}</span>
                        </div>
                        <h4 className="photo-title">{title}</h4>
                        <div className="photo-meta-row">
                          <span className="photo-location">
                            <MapPin size={13} /> Erode, Tamil Nadu
                          </span>
                          <span className="photo-expand-hint">
                            View Details <ArrowRight size={13} />
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* 2. Structured Field & Community Initiatives */}
          {filteredItems.length > 0 && (
            <div className="initiatives-section" style={{ marginTop: showPhotos ? '4rem' : '1rem' }}>
              <div className="gallery-section-heading">
                <div className="heading-accent-line" />
                <div>
                  <span className="gallery-eyebrow-small">STATUTORY & EDUCATIONAL WORKSHOPS</span>
                  <h2 className="gallery-sub-heading">Grassroots Initiatives & Community Engagements</h2>
                  <p className="gallery-sub-lead">
                    Structured field interventions, school child safety programmes, and accessible civic literacy drives.
                  </p>
                </div>
              </div>

              <div className="gallery-grid">
                {filteredItems.map((item) => (
                  <article
                    key={item.id}
                    className="gallery-card"
                    onClick={() => setSelectedItem(item)}
                  >
                    <div className="gallery-card-badge-row">
                      <div className="gallery-category-badge-wrap">
                        <span className="gallery-card-category-icon">
                          {getCategoryIcon(item.category)}
                        </span>
                        <span className="gallery-category-pill">{item.categoryLabel}</span>
                      </div>
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

            {selectedItem.imageUrl ? (
              <div className="gallery-modal-image-wrap">
                <div
                  className="gallery-modal-backdrop-blur"
                  style={{ backgroundImage: `url(${selectedItem.imageUrl})` }}
                  aria-hidden="true"
                />
                <img
                  className="gallery-modal-main-img"
                  src={selectedItem.imageUrl}
                  alt={selectedItem.title}
                />
              </div>
            ) : (
              <div className="gallery-modal-editorial-banner">
                <div className="editorial-banner-icon-box">
                  {getCategoryIcon(selectedItem.category)}
                </div>
                <div>
                  <span className="editorial-banner-pill">{selectedItem.categoryLabel}</span>
                  <span className="editorial-banner-year">{selectedItem.date}</span>
                </div>
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
