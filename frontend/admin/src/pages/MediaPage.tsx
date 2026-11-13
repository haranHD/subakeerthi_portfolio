import React, { useEffect, useState } from 'react';
import { adminApi } from '../services/adminApi';
import { MediaAsset } from '../types/admin';
import {
  Upload,
  Trash2,
  Copy,
  Check,
  Loader2,
  Image as ImageIcon,
  AlertCircle,
  Edit3,
  X,
  MapPin,
  Calendar,
  FileText,
  Sparkles,
} from 'lucide-react';
import { getMediaUrl } from '../utils/media';
import { PageLoader } from '../components/PageLoader';
import { optimizeImageFile } from '../utils/imageOptimizer';

export const MediaPage: React.FC = () => {
  const [media, setMedia] = useState<MediaAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState<string | null>(null);

  // Upload Form State
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [assetType, setAssetType] = useState('SESSION');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('Erode, Tamil Nadu');
  const [eventDate, setEventDate] = useState('2026');
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);

  // Edit Existing Asset Modal State
  const [editingAsset, setEditingAsset] = useState<MediaAsset | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editAssetType, setEditAssetType] = useState('SESSION');
  const [editDescription, setEditDescription] = useState('');
  const [editLocation, setEditLocation] = useState('');
  const [editEventDate, setEditEventDate] = useState('');
  const [savingEdit, setSavingEdit] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);

  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    loadMedia();
  }, []);

  const loadMedia = async () => {
    try {
      setPageError(null);
      const data = await adminApi.getMedia();
      setMedia(data);
    } catch (err: any) {
      console.error(err);
      const msg =
        err.code === 'ECONNABORTED' || err.message?.includes('timeout')
          ? 'Connecting to server timed out. The backend instance may be waking up.'
          : err?.response?.data?.message || err?.message || 'Failed to load media assets';
      setPageError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadFile(file);
    setUploadError(null);

    // Auto-prefill title if currently empty
    if (!title) {
      const cleanName = file.name
        .replace(/\.[^/.]+$/, '')
        .replace(/[-_]+/g, ' ')
        .trim();
      if (cleanName && !/^\d+$/.test(cleanName) && !cleanName.startsWith('file_')) {
        setTitle(
          cleanName
            .split(' ')
            .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
            .join(' ')
        );
      }
    }

    // Generate local preview
    if (file.type.startsWith('image/')) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    } else {
      setPreviewUrl(null);
    }
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadFile) {
      setUploadError('Please choose an image or document to upload.');
      return;
    }

    setUploading(true);
    setUploadProgress(0);
    setUploadError(null);
    setUploadSuccess(null);

    try {
      const optimizedFile = await optimizeImageFile(uploadFile);
      await adminApi.uploadMedia(
        optimizedFile,
        {
          assetType,
          title: title.trim(),
          description: description.trim(),
          location: location.trim(),
          eventDate: eventDate.trim(),
        },
        (percent) => {
          setUploadProgress(percent);
        }
      );

      setUploadSuccess(`Successfully uploaded and saved "${title || uploadFile.name}"!`);
      // Reset form
      setUploadFile(null);
      setPreviewUrl(null);
      setTitle('');
      setDescription('');
      setLocation('Erode, Tamil Nadu');
      setEventDate('2026');

      await loadMedia();
    } catch (err: any) {
      console.error(err);
      const msg =
        err.code === 'ECONNABORTED' || err.message?.includes('timeout')
          ? 'Upload timed out. The server took too long to process. The instance may be waking up, please try once more.'
          : err?.response?.data?.message || err?.message || 'Failed to upload image. Please try again.';
      setUploadError(msg);
    } finally {
      setUploading(false);
      setUploadProgress(null);
    }
  };

  const openEditModal = (item: MediaAsset) => {
    setEditingAsset(item);
    setEditTitle(item.title || item.originalName || '');
    setEditAssetType(item.assetType || 'SESSION');
    setEditDescription(item.description || '');
    setEditLocation(item.location || 'Erode, Tamil Nadu');
    setEditEventDate(item.eventDate || '2026');
    setEditError(null);
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAsset) return;

    setSavingEdit(true);
    setEditError(null);

    try {
      await adminApi.updateMedia(editingAsset.id, {
        title: editTitle.trim(),
        assetType: editAssetType,
        description: editDescription.trim(),
        location: editLocation.trim(),
        eventDate: editEventDate.trim(),
      });

      setUploadSuccess(`Updated details for "${editTitle || 'Asset'}" successfully!`);
      setEditingAsset(null);
      await loadMedia();
    } catch (err: any) {
      console.error(err);
      setEditError(err?.response?.data?.message || err?.message || 'Failed to save changes.');
    } finally {
      setSavingEdit(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Permanently delete "${name}" from media library?`)) return;
    try {
      await adminApi.deleteMedia(id);
      await loadMedia();
    } catch (err: any) {
      console.error(err);
      alert(err?.response?.data?.message || 'Failed to delete asset');
    }
  };

  const copyUrl = (url: string, id: string) => {
    const fullUrl = getMediaUrl(url);
    navigator.clipboard.writeText(fullUrl);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getAssetBadgeLabel = (type: string) => {
    switch (type) {
      case 'SESSION':
        return 'Awareness Session';
      case 'PORTRAIT':
        return 'Client Portrait';
      case 'BANNER':
        return 'Website Banner';
      case 'CERTIFICATE':
        return 'Certificate Document';
      default:
        return 'Field Documentation';
    }
  };

  return (
    <>
      <header className="admin-header">
        <h1 className="page-title">Gallery & Media Content Management</h1>
      </header>

      <div className="admin-body">
        {loading || pageError ? (
          <PageLoader
            title="Media Library"
            message="Retrieving uploaded assets from server..."
            error={pageError}
            onRetry={() => {
              setLoading(true);
              loadMedia();
            }}
          />
        ) : (
          <>
            {uploadError && (
              <div
                style={{
                  padding: '0.85rem 1.25rem',
                  marginBottom: '1.25rem',
                  background: '#FEE2E2',
                  border: '1px solid #FCA5A5',
                  borderRadius: 8,
                  color: '#991B1B',
                  fontSize: '0.88rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                }}
              >
                <AlertCircle size={18} style={{ flexShrink: 0 }} />
                <span>{uploadError}</span>
              </div>
            )}

            {uploadSuccess && (
              <div
                style={{
                  padding: '0.85rem 1.25rem',
                  marginBottom: '1.25rem',
                  background: '#E8F5E9',
                  border: '1px solid #A5D6A7',
                  borderRadius: 8,
                  color: '#1B5E20',
                  fontSize: '0.88rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                }}
              >
                <Check size={18} style={{ flexShrink: 0 }} />
                <span>{uploadSuccess}</span>
              </div>
            )}

            {/* Dynamic Upload Card with Topic & Content Entry Fields */}
            <div className="data-card" style={{ padding: '1.75rem', marginBottom: '2.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
                <div
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: 8,
                    background: 'rgba(20, 90, 67, 0.1)',
                    color: '#145A43',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Upload size={20} />
                </div>
                <div>
                  <h2 className="card-title" style={{ margin: 0 }}>
                    Upload New Gallery Photo & Session Content
                  </h2>
                  <p style={{ margin: 0, fontSize: '0.82rem', color: '#666' }}>
                    Upload training posters, event photographs, or certificates with custom topics, descriptions, and location tags.
                  </p>
                </div>
              </div>

              <form onSubmit={handleUploadSubmit}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
                  {/* Topic / Image Name */}
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label" style={{ fontWeight: 600 }}>
                      Session Topic / Image Name *
                    </label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. Awareness Program on Harassment — Bhavani Session"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      disabled={uploading}
                      required
                    />
                    <span style={{ fontSize: '0.74rem', color: '#777', marginTop: '0.25rem', display: 'block' }}>
                      This topic is displayed prominently on the public gallery card.
                    </span>
                  </div>

                  {/* Category */}
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label" style={{ fontWeight: 600 }}>
                      Asset Category *
                    </label>
                    <select
                      value={assetType}
                      onChange={(e) => setAssetType(e.target.value)}
                      className="form-select"
                      disabled={uploading}
                    >
                      <option value="SESSION">Awareness Session / Field Workshop</option>
                      <option value="PORTRAIT">Client Profile Portrait</option>
                      <option value="BANNER">Website & Credentials Banner</option>
                      <option value="CERTIFICATE">Certificate Document</option>
                      <option value="OTHER">Field Documentation</option>
                    </select>
                  </div>

                  {/* Location */}
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label" style={{ fontWeight: 600 }}>
                      Event Location
                    </label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. Erode, Tamil Nadu"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      disabled={uploading}
                    />
                  </div>

                  {/* Year / Date */}
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label" style={{ fontWeight: 600 }}>
                      Session Year / Date
                    </label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. 2026 or 15.11.2026"
                      value={eventDate}
                      onChange={(e) => setEventDate(e.target.value)}
                      disabled={uploading}
                    />
                  </div>
                </div>

                {/* Description / Content Details */}
                <div className="form-group" style={{ marginTop: '1.25rem', marginBottom: '1.25rem' }}>
                  <label className="form-label" style={{ fontWeight: 600 }}>
                    Session Content / Description Details
                  </label>
                  <textarea
                    className="form-textarea"
                    rows={3}
                    placeholder="Provide details about the session, attendees, key safety topics discussed, and institutional impact..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    disabled={uploading}
                  />
                  <span style={{ fontSize: '0.74rem', color: '#777', marginTop: '0.25rem', display: 'block' }}>
                    Shown when visitors click on the gallery card to read more.
                  </span>
                </div>

                {/* File Picker & Preview Area */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1.5rem',
                    flexWrap: 'wrap',
                    padding: '1.25rem',
                    background: '#FAF8F5',
                    border: '1px dashed #D1C7B7',
                    borderRadius: 10,
                    marginBottom: '1.5rem',
                  }}
                >
                  {previewUrl ? (
                    <div
                      style={{
                        width: 90,
                        height: 90,
                        borderRadius: 8,
                        overflow: 'hidden',
                        background: '#FFF',
                        border: '1px solid #E2D9C5',
                        flexShrink: 0,
                      }}
                    >
                      <img
                        src={previewUrl}
                        alt="Preview"
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    </div>
                  ) : (
                    <div
                      style={{
                        width: 90,
                        height: 90,
                        borderRadius: 8,
                        background: '#ECE6DA',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#8A7E6B',
                        flexShrink: 0,
                      }}
                    >
                      <ImageIcon size={32} />
                    </div>
                  )}

                  <div style={{ flex: 1, minWidth: 200 }}>
                    <label
                      className="btn-secondary"
                      style={{
                        cursor: uploading ? 'not-allowed' : 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        marginBottom: '0.35rem',
                      }}
                    >
                      <Upload size={16} /> Choose Image File
                      <input
                        type="file"
                        accept="image/*,.pdf"
                        onChange={handleFileSelect}
                        disabled={uploading}
                        style={{ display: 'none' }}
                      />
                    </label>
                    <p style={{ margin: 0, fontSize: '0.8rem', color: uploadFile ? '#145A43' : '#666', fontWeight: uploadFile ? 600 : 400 }}>
                      {uploadFile ? `Selected: ${uploadFile.name} (${(uploadFile.size / 1024).toFixed(0)} KB)` : 'PNG, JPG, WebP, SVG, PDF up to 10MB'}
                    </p>
                  </div>

                  <button
                    type="submit"
                    className="btn-primary"
                    disabled={uploading || !uploadFile}
                    style={{
                      opacity: uploading || !uploadFile ? 0.6 : 1,
                      cursor: uploading || !uploadFile ? 'not-allowed' : 'pointer',
                      padding: '0.75rem 1.75rem',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                    }}
                  >
                    {uploading ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        <span>{uploadProgress !== null ? `Uploading ${uploadProgress}%...` : 'Saving Asset...'}</span>
                      </>
                    ) : (
                      <>
                        <Sparkles size={16} /> Save to Gallery
                      </>
                    )}
                  </button>
                </div>

                {/* Progress Bar when uploading */}
                {uploading && (
                  <div
                    style={{
                      padding: '1rem',
                      background: '#F8FBF9',
                      border: '1px solid #C2E0D4',
                      borderRadius: 8,
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        marginBottom: '0.5rem',
                        fontSize: '0.84rem',
                        fontWeight: 600,
                        color: 'var(--admin-burgundy)',
                      }}
                    >
                      <span>Uploading and saving photo to database...</span>
                      <span>{uploadProgress !== null ? `${uploadProgress}%` : 'Processing...'}</span>
                    </div>
                    <div
                      style={{
                        width: '100%',
                        height: 8,
                        backgroundColor: '#E0EAE5',
                        borderRadius: 4,
                        overflow: 'hidden',
                      }}
                    >
                      <div
                        style={{
                          height: '100%',
                          width: `${Math.max(uploadProgress ?? 10, 5)}%`,
                          backgroundColor: 'var(--admin-burgundy)',
                          transition: 'width 0.2s ease',
                        }}
                      />
                    </div>
                  </div>
                )}
              </form>
            </div>

            {/* Media Gallery Grid */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              <h2 className="card-title" style={{ margin: 0 }}>
                Uploaded Media Library ({media.length})
              </h2>
              <span style={{ fontSize: '0.8rem', color: '#666' }}>
                Click "Edit Details" on any card to update topic, description, or category anytime.
              </span>
            </div>

            <div
              className="media-grid"
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: '1.5rem',
              }}
            >
              {media.map((item) => {
                const displayName = item.title || item.originalName;
                const badgeLabel = getAssetBadgeLabel(item.assetType);

                return (
                  <div
                    key={item.id}
                    className="data-card"
                    style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column', border: '1px solid #E8DFD0' }}
                  >
                    <div
                      style={{
                        height: 180,
                        backgroundColor: '#0E241B',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        overflow: 'hidden',
                        position: 'relative',
                      }}
                    >
                      {item.mimeType.startsWith('image/') ? (
                        <img
                          src={getMediaUrl(item.storageUrl)}
                          alt={displayName}
                          style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top center' }}
                          onError={(e) => {
                            const img = e.currentTarget;
                            if (!img.dataset.retried) {
                              img.dataset.retried = 'true';
                              img.src = item.storageUrl;
                            }
                          }}
                        />
                      ) : (
                        <div
                          style={{
                            padding: '1rem',
                            textAlign: 'center',
                            fontSize: '0.85rem',
                            color: '#FFF',
                          }}
                        >
                          📄 {displayName}
                        </div>
                      )}
                      <span
                        style={{
                          position: 'absolute',
                          top: '0.65rem',
                          left: '0.65rem',
                          background: 'rgba(20, 90, 67, 0.9)',
                          color: '#FFF',
                          fontSize: '0.68rem',
                          fontWeight: 700,
                          padding: '0.2rem 0.5rem',
                          borderRadius: 4,
                          textTransform: 'uppercase',
                        }}
                      >
                        {badgeLabel}
                      </span>
                    </div>

                    <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          marginBottom: '0.5rem',
                        }}
                      >
                        <span style={{ fontSize: '0.74rem', color: '#8C7335', fontWeight: 600 }}>
                          {item.eventDate || new Date(item.createdAt).getFullYear().toString()}
                        </span>
                        <span style={{ fontSize: '0.72rem', color: '#888' }}>
                          {(item.size / 1024).toFixed(0)} KB
                        </span>
                      </div>

                      <h3
                        title={displayName}
                        style={{
                          fontSize: '0.95rem',
                          fontWeight: 700,
                          color: '#145A43',
                          lineHeight: 1.35,
                          marginBottom: '0.5rem',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                        }}
                      >
                        {displayName}
                      </h3>

                      {item.location && (
                        <p style={{ margin: 0, fontSize: '0.76rem', color: '#66756F', display: 'flex', alignItems: 'center', gap: '0.3rem', marginBottom: '0.5rem' }}>
                          <MapPin size={12} /> {item.location}
                        </p>
                      )}

                      {item.description && (
                        <p
                          style={{
                            fontSize: '0.8rem',
                            color: '#555',
                            lineHeight: 1.45,
                            margin: 0,
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            marginBottom: '0.75rem',
                          }}
                        >
                          {item.description}
                        </p>
                      )}

                      <div
                        style={{
                          display: 'flex',
                          gap: '0.4rem',
                          marginTop: 'auto',
                          paddingTop: '0.85rem',
                          borderTop: '1px solid #F0EAE1',
                        }}
                      >
                        <button
                          onClick={() => openEditModal(item)}
                          className="btn-secondary"
                          style={{ flex: 1, padding: '0.45rem', fontSize: '0.76rem', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem' }}
                          title="Edit Topic & Content"
                        >
                          <Edit3 size={13} /> Edit Content
                        </button>

                        <button
                          onClick={() => copyUrl(item.storageUrl, item.id)}
                          className="btn-secondary"
                          style={{ padding: '0.45rem 0.65rem', fontSize: '0.76rem' }}
                          title="Copy Public URL"
                        >
                          {copiedId === item.id ? (
                            <Check size={14} style={{ color: '#2E7D32' }} />
                          ) : (
                            <Copy size={14} />
                          )}
                        </button>

                        <button
                          onClick={() => handleDelete(item.id, displayName)}
                          className="action-btn"
                          style={{ color: '#C62828', padding: '0.45rem' }}
                          title="Delete Asset"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}

              {media.length === 0 && (
                <div
                  style={{
                    gridColumn: '1 / -1',
                    textAlign: 'center',
                    padding: '3.5rem 1rem',
                    color: '#999',
                    background: '#FFF',
                    borderRadius: 12,
                    border: '1px dashed #D1C7B7',
                  }}
                >
                  <ImageIcon size={48} style={{ opacity: 0.3, marginBottom: '0.75rem' }} />
                  <p style={{ fontSize: '0.96rem', fontWeight: 600, color: '#444' }}>No gallery media uploaded yet.</p>
                  <p style={{ fontSize: '0.82rem', color: '#777', marginTop: '0.25rem' }}>
                    Use the form above to upload training session posters, field photographs, or credentials.
                  </p>
                </div>
              )}
            </div>

            {/* Modal: Edit Existing Media Details */}
            {editingAsset && (
              <div
                style={{
                  position: 'fixed',
                  inset: 0,
                  backgroundColor: 'rgba(10, 25, 18, 0.75)',
                  backdropFilter: 'blur(4px)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 1000,
                  padding: '1.5rem',
                }}
                onClick={() => !savingEdit && setEditingAsset(null)}
              >
                <div
                  style={{
                    background: '#FFF',
                    borderRadius: 14,
                    maxWidth: 580,
                    width: '100%',
                    maxHeight: '90vh',
                    overflowY: 'auto',
                    padding: '2rem',
                    boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
                    position: 'relative',
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={() => !savingEdit && setEditingAsset(null)}
                    style={{
                      position: 'absolute',
                      top: '1.25rem',
                      right: '1.25rem',
                      background: '#F0EAE1',
                      border: 'none',
                      borderRadius: '50%',
                      width: 32,
                      height: 32,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                    }}
                  >
                    <X size={16} />
                  </button>

                  <h2 style={{ fontSize: '1.25rem', color: '#145A43', marginBottom: '0.35rem', fontWeight: 700 }}>
                    Edit Gallery Content & Topic
                  </h2>
                  <p style={{ fontSize: '0.82rem', color: '#666', marginBottom: '1.5rem' }}>
                    Changes saved here will immediately update the public gallery cards and modal lightbox.
                  </p>

                  {editError && (
                    <div
                      style={{
                        padding: '0.75rem',
                        background: '#FEE2E2',
                        border: '1px solid #FCA5A5',
                        borderRadius: 6,
                        color: '#991B1B',
                        fontSize: '0.82rem',
                        marginBottom: '1rem',
                      }}
                    >
                      {editError}
                    </div>
                  )}

                  <form onSubmit={handleSaveEdit}>
                    <div className="form-group">
                      <label className="form-label" style={{ fontWeight: 600 }}>
                        Session Topic / Image Name *
                      </label>
                      <input
                        type="text"
                        className="form-input"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        required
                        disabled={savingEdit}
                      />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                      <div className="form-group">
                        <label className="form-label" style={{ fontWeight: 600 }}>
                          Category
                        </label>
                        <select
                          className="form-select"
                          value={editAssetType}
                          onChange={(e) => setEditAssetType(e.target.value)}
                          disabled={savingEdit}
                        >
                          <option value="SESSION">Awareness Session / Field Workshop</option>
                          <option value="PORTRAIT">Client Profile Portrait</option>
                          <option value="BANNER">Website & Credentials Banner</option>
                          <option value="CERTIFICATE">Certificate Document</option>
                          <option value="OTHER">Field Documentation</option>
                        </select>
                      </div>

                      <div className="form-group">
                        <label className="form-label" style={{ fontWeight: 600 }}>
                          Year / Date
                        </label>
                        <input
                          type="text"
                          className="form-input"
                          value={editEventDate}
                          onChange={(e) => setEditEventDate(e.target.value)}
                          disabled={savingEdit}
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="form-label" style={{ fontWeight: 600 }}>
                        Location
                      </label>
                      <input
                        type="text"
                        className="form-input"
                        value={editLocation}
                        onChange={(e) => setEditLocation(e.target.value)}
                        disabled={savingEdit}
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label" style={{ fontWeight: 600 }}>
                        Session Description & Details
                      </label>
                      <textarea
                        className="form-textarea"
                        rows={4}
                        value={editDescription}
                        onChange={(e) => setEditDescription(e.target.value)}
                        disabled={savingEdit}
                      />
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                      <button
                        type="button"
                        className="btn-secondary"
                        onClick={() => setEditingAsset(null)}
                        disabled={savingEdit}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="btn-primary"
                        disabled={savingEdit}
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
                      >
                        {savingEdit && <Loader2 size={16} className="animate-spin" />}
                        Save Changes
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
};
