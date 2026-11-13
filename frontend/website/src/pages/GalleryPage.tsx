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
  X,
  Sparkles,
  Building2,
  Maximize2,
  Camera,
  Image as ImageIcon,
} from 'lucide-react';
import { api } from '../services/api';
import { getMediaUrl } from '../utils/media';
import '../styles/PageHeader.css';
import './GalleryPage.css';

interface GalleryItem {
  id: string;
  title: string;
  category: string;
  categoryLabel: string;
  date: string;
  location: string;
  description: string;
  impactMetrics?: string;
  imageUrl?: string;
  tags: string[];
}

const defaultFallbackMedia = [
  {
    id: 'portrait-office',
    originalName: 'Professional Portrait in Modern Office',
    assetType: 'PORTRAIT',
    storageUrl: '/uploads/Professional_Portrait_in_a_Modern_Office-1794229532510-346112045.png',
    createdAt: '2026-01-01',
    description:
      'Executive portrait of Subakeerthii MP in professional chambers — Legal Scholar, Certified POSH & POCSO Trainer, and Child Counsellor.',
    location: 'Erode, Tamil Nadu',
    eventDate: '2026',
  },
  {
    id: 'portrait-official',
    originalName: 'Subakeerthii MP — Professional Profile Portrait',
    assetType: 'PORTRAIT',
    storageUrl: '/subakeerthii-portrait.png',
    createdAt: '2026-01-01',
    description:
      'Official academic and institutional portrait representing legal scholarship, child psychology foundations, and statutory training accreditations.',
    location: 'Erode, Tamil Nadu',
    eventDate: '2026',
  },
  {
    id: 'banner-credentials',
    originalName: 'Verified Accreditations & Statutory Domains',
    assetType: 'BANNER',
    storageUrl: '/client-banner.png',
    createdAt: '2026-01-01',
    description:
      'Verified credential portfolio documenting LL.B. legal education, Certified POSH Trainer accreditation, Certified POCSO Trainer accreditation, and Diploma in Child Psychology.',
    location: 'Tamil Nadu, India',
    eventDate: '2026',
  },
];

function formatMediaTitle(rawName: string, assetType: string, customTitle?: string | null): string {
  if (customTitle && customTitle.trim()) {
    return customTitle.trim();
  }
  if (!rawName) return 'Official Photographic Documentation';
  let clean = rawName.replace(/\.[^/.]+$/, '');
  clean = clean.replace(/^file_([0-9a-f]+_)?/i, '');
  clean = clean.replace(/[-_]\d{10,}([-_]\d+)?/g, '');
  clean = clean.replace(/[-_]+/g, ' ').trim();

  if (!clean || /^[0-9a-fA-F]{10,}$/.test(clean) || /^\d+$/.test(clean) || clean.toLowerCase() === 'image') {
    if (assetType?.toUpperCase() === 'PORTRAIT') return 'Subakeerthii MP — Professional Portrait';
    if (assetType?.toUpperCase() === 'BANNER') return 'Official Credentials & Accreditations';
    if (assetType?.toUpperCase() === 'SESSION') return 'Harassment & Safety Awareness Programme';
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
    case 'SESSION':
      return 'Awareness Session';
    case 'PORTRAIT':
      return 'Official Portrait';
    case 'BANNER':
      return 'Institutional Banner';
    case 'CERTIFICATE':
      return 'Accreditation';
    default:
      return 'Field Documentation';
  }
}

function getAssetTags(assetType: string): string[] {
  switch (assetType?.toUpperCase()) {
    case 'SESSION':
      return ['Awareness Session', 'Harassment Prevention', 'Child Protection', 'Tamil Nadu'];
    case 'PORTRAIT':
      return ['Official Portrait', 'Legal Scholar', 'POSH & POCSO Trainer', 'Child Counsellor'];
    case 'BANNER':
      return ['Accreditations', 'Academic Credentials', 'Child Psychology', 'Statutory Compliance'];
    case 'CERTIFICATE':
      return ['Verified Credential', 'Statutory Accreditation', 'Trainer Certification'];
    default:
      return ['Awareness Program', 'Institutional Safety', 'Field Work', 'Erode, Tamil Nadu'];
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
    { key: 'ALL', label: 'All Photos & Archives' },
    { key: 'SESSION', label: 'Awareness Sessions & Workshops' },
    { key: 'PORTRAIT', label: 'Official Portraits' },
    { key: 'BANNER', label: 'Credentials & Banners' },
    { key: 'CERTIFICATE', label: 'Certificates & Documents' },
    { key: 'OTHER', label: 'Field Documentation' },
  ];

  const filteredMedia =
    activeCategory === 'ALL'
      ? uploadedMedia
      : uploadedMedia.filter((m) => (m.assetType || 'OTHER') === activeCategory);

  return (
    <>
      <SEO
        title="Official Photo Gallery & Field Documentation | Subakeerthii MP"
        description="Explore photographic archives, school POCSO awareness posters, institutional training session photos, and official portraits of Subakeerthii MP across Tamil Nadu."
        keywords="subakeerthii mp gallery, awareness program photos, posh training photos, pocso school posters, erode, tamil nadu"
        canonicalPath="/gallery"
      />

      {/* Editorial Header */}
      <section className="page-editorial-header">
        <div className="container page-header-container">
          <span className="page-header-eyebrow">OFFICIAL ASSETS · SESSIONS · FIELD ARCHIVES</span>
          <h1 className="page-header-title">Photo Documentation & Session Archives</h1>
          <p className="page-header-lead">
            Authentic photographic records, awareness program announcements, institutional training sessions, and official portraits documented by Subakeerthii MP across Erode and Tamil Nadu.
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

          {/* Dynamic Media Photo Grid */}
          <div className="media-photo-grid">
            {filteredMedia.map((media) => {
              const title = formatMediaTitle(media.originalName, media.assetType, media.title);
              const badge = formatAssetBadge(media.assetType);
              const tags = getAssetTags(media.assetType);
              const year =
                media.eventDate ||
                (media.createdAt ? new Date(media.createdAt).getFullYear().toString() : '2026');
              const location = media.location || 'Erode, Tamil Nadu';
              const description =
                media.description ||
                `Official visual documentation of Subakeerthii MP — Legal Scholar, Certified POSH & POCSO Trainer, and Child Counsellor. Documented for institutional, educational, and community records.`;

              return (
                <div
                  key={media.id}
                  className="media-photo-card"
                  onClick={() =>
                    setSelectedItem({
                      id: media.id,
                      title,
                      category: media.assetType || 'PHOTO',
                      categoryLabel: badge,
                      date: year,
                      location,
                      description,
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
                    {media.description && (
                      <p
                        style={{
                          fontSize: '0.82rem',
                          color: '#55665F',
                          lineHeight: 1.45,
                          margin: 0,
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                        }}
                      >
                        {media.description}
                      </p>
                    )}
                    <div className="photo-meta-row">
                      <span className="photo-location">
                        <MapPin size={13} /> {location}
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

          {filteredMedia.length === 0 && (
            <div
              style={{
                textAlign: 'center',
                padding: '4rem 1rem',
                background: '#FFFFFF',
                borderRadius: 14,
                border: '1px dashed #D1C7B7',
                color: '#777',
              }}
            >
              <ImageIcon size={44} style={{ opacity: 0.35, marginBottom: '0.75rem' }} />
              <p style={{ fontSize: '1rem', fontWeight: 600, color: '#333' }}>
                No records found in this category.
              </p>
              <p style={{ fontSize: '0.85rem', color: '#666', marginTop: '0.25rem' }}>
                Upload new posters or photographs under this category from the Admin Panel.
              </p>
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

      {/* Engagement CTA Banner */}
      <section className="page-cta-strip">
        <div className="container page-cta-inner">
          <h2 className="page-cta-title">Collaborate on a Community or School Initiative</h2>
          <p className="page-cta-text">
            Subakeerthii MP is actively available for community legal awareness camps, school child-protection drives, and workplace compliance sessions across Tamil Nadu.
          </p>
          <div className="page-cta-actions">
            <Link to="/contact" className="btn btn--primary" style={{ background: '#D7C7A1', color: '#0D3F2F' }}>
              <Heart size={16} />
              <span>Initiate a Collaboration</span>
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
