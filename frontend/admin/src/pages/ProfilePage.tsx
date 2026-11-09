import React, { useEffect, useState } from 'react';
import { adminApi } from '../services/adminApi';
import { Profile, MediaAsset } from '../types/admin';
import { Save, CheckCircle, Loader2, Upload, Image as ImageIcon, User, AlertCircle } from 'lucide-react';
import { getMediaUrl } from '../utils/media';
import { PageLoader } from '../components/PageLoader';

export const ProfilePage: React.FC = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [mediaAssets, setMediaAssets] = useState<MediaAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [uploadingPortrait, setUploadingPortrait] = useState(false);
  const [previewError, setPreviewError] = useState(false);

  useEffect(() => {
    loadProfileAndMedia();
  }, []);

  const loadProfileAndMedia = async () => {
    try {
      setLoading(true);
      setError(null);
      const [profData, mediaData] = await Promise.all([
        adminApi.getProfile(),
        adminApi.getMedia().catch(() => []),
      ]);
      setProfile(profData);
      setMediaAssets(mediaData.filter((m) => m.mimeType.startsWith('image/')));
    } catch (err: any) {
      console.error(err);
      const msg =
        err.code === 'ECONNABORTED' || err.message?.includes('timeout')
          ? 'Connecting to backend timed out. Render may still be waking up.'
          : err?.response?.data?.message || err?.message || 'Failed to load profile';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (profile) {
      setProfile({ ...profile, [name]: value });
      if (name === 'portraitUrl') {
        setPreviewError(false);
      }
    }
  };

  const handleSelectMedia = (storageUrl: string) => {
    if (profile) {
      setProfile({ ...profile, portraitUrl: storageUrl });
      setPreviewError(false);
    }
  };

  const handleDirectPortraitUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingPortrait(true);
    try {
      const asset = await adminApi.uploadMedia(file, 'PORTRAIT');
      if (profile) {
        setProfile({ ...profile, portraitUrl: asset.storageUrl });
        setPreviewError(false);
      }
      setMediaAssets((prev) => [asset, ...prev]);
    } catch (err: any) {
      console.error(err);
      alert(err?.response?.data?.message || 'Failed to upload portrait image. Please try again.');
    } finally {
      setUploadingPortrait(false);
      e.target.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    setSaving(true);
    setSuccess(false);

    try {
      const updated = await adminApi.updateProfile(profile);
      setProfile(updated);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const resolvedPreviewUrl = profile?.portraitUrl ? getMediaUrl(profile.portraitUrl) : '';

  return (
    <>
      <header className="admin-header">
        <h1 className="page-title">Client Profile Management</h1>
        {success && (
          <span
            style={{
              color: '#2E7D32',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              fontSize: '0.86rem',
              fontWeight: 600,
            }}
          >
            <CheckCircle size={16} /> Saved successfully!
          </span>
        )}
      </header>

      <div className="admin-body">
        {loading || error ? (
          <PageLoader
            title="Client Profile"
            message="Loading biographical data, contact details, and credentials..."
            error={error}
            onRetry={loadProfileAndMedia}
          />
        ) : (
          <div className="data-card" style={{ maxWidth: 860 }}>
            <div className="card-header">
              <h2 className="card-title">Personal & Professional Identity</h2>
            </div>

            <form onSubmit={handleSubmit} style={{ padding: '1.5rem' }}>
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input
                    type="text"
                    name="fullName"
                    value={profile?.fullName || ''}
                    onChange={handleChange}
                    required
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Contact Phone</label>
                  <input
                    type="text"
                    name="phone"
                    value={profile?.phone || ''}
                    onChange={handleChange}
                    required
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Official Email</label>
                  <input
                    type="email"
                    name="email"
                    value={profile?.email || ''}
                    onChange={handleChange}
                    required
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Location / Base</label>
                  <input
                    type="text"
                    name="location"
                    value={profile?.location || ''}
                    onChange={handleChange}
                    required
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                <label className="form-label">Professional Headline</label>
                <input
                  type="text"
                  name="headline"
                  value={profile?.headline || ''}
                  onChange={handleChange}
                  required
                  className="form-input"
                />
                <span style={{ fontSize: '0.72rem', color: '#666', marginTop: 4 }}>
                  * Restriction rule: Never state Advocate or Practicing Lawyer. Use Legal Scholar, POSH/POCSO Trainer, Child Counsellor.
                </span>
              </div>

              {/* Dedicated Official Portrait Manager & Stable Preview */}
              <div
                className="data-card"
                style={{
                  padding: '1.25rem',
                  marginBottom: '1.5rem',
                  backgroundColor: '#FAF7F4',
                  border: '1px solid var(--admin-border)',
                }}
              >
                <label className="form-label" style={{ fontWeight: 700, color: 'var(--admin-burgundy)' }}>
                  Hero Section Portrait Photo
                </label>
                <p style={{ fontSize: '0.78rem', color: '#666', marginBottom: '1rem' }}>
                  This official portrait is displayed on the main website homepage inside the editorial arch frame.
                </p>

                <div
                  style={{
                    display: 'flex',
                    gap: '1.5rem',
                    alignItems: 'flex-start',
                    flexWrap: 'wrap',
                  }}
                >
                  {/* Visual Portrait Preview (Matching the site's arch aesthetic) */}
                  <div
                    style={{
                      width: 140,
                      aspectRatio: '4 / 5',
                      borderRadius: '70px 70px 8px 8px',
                      overflow: 'hidden',
                      border: '2px solid var(--admin-burgundy)',
                      backgroundColor: '#FFFFFF',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                      flexShrink: 0,
                      position: 'relative',
                    }}
                  >
                    {resolvedPreviewUrl && !previewError ? (
                      <img
                        src={resolvedPreviewUrl}
                        alt="Client Portrait Preview"
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          display: 'block',
                          transition: 'opacity 0.2s ease',
                        }}
                        onError={() => setPreviewError(true)}
                      />
                    ) : (
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          padding: '0.75rem',
                          textAlign: 'center',
                          color: '#888',
                        }}
                      >
                        <User size={36} style={{ opacity: 0.35, marginBottom: '0.5rem' }} />
                        <span style={{ fontSize: '0.7rem' }}>
                          {previewError ? 'Invalid image path' : 'Default photo used'}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Actions & Quick Selection */}
                  <div style={{ flex: 1, minWidth: 260 }}>
                    <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                      <label
                        className="btn-primary"
                        style={{
                          cursor: uploadingPortrait ? 'not-allowed' : 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          fontSize: '0.84rem',
                          padding: '0.6rem 1.1rem',
                        }}
                      >
                        {uploadingPortrait ? (
                          <>
                            <Loader2 size={15} className="animate-spin" /> Uploading...
                          </>
                        ) : (
                          <>
                            <Upload size={15} /> Upload & Set New Photo
                          </>
                        )}
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleDirectPortraitUpload}
                          disabled={uploadingPortrait}
                          style={{ display: 'none' }}
                        />
                      </label>
                    </div>

                    <div className="form-group" style={{ marginBottom: '1rem' }}>
                      <label className="form-label" style={{ fontSize: '0.78rem' }}>
                        Image Path / URL (Auto-set on upload or pick below)
                      </label>
                      <input
                        type="text"
                        name="portraitUrl"
                        value={profile?.portraitUrl || ''}
                        onChange={handleChange}
                        placeholder="/uploads/... or https://..."
                        className="form-input"
                        style={{ fontSize: '0.82rem' }}
                      />
                    </div>

                    {/* Quick Pick from Uploaded Media Gallery */}
                    {mediaAssets.length > 0 && (
                      <div>
                        <span style={{ fontSize: '0.76rem', fontWeight: 600, color: '#555', display: 'block', marginBottom: '0.4rem' }}>
                          Or pick from Media Library:
                        </span>
                        <div
                          style={{
                            display: 'flex',
                            gap: '0.5rem',
                            overflowX: 'auto',
                            paddingBottom: '0.5rem',
                          }}
                        >
                          {mediaAssets.slice(0, 8).map((asset) => {
                            const isSelected = profile?.portraitUrl === asset.storageUrl;
                            return (
                              <button
                                key={asset.id}
                                type="button"
                                onClick={() => handleSelectMedia(asset.storageUrl)}
                                style={{
                                  border: isSelected ? '2px solid var(--admin-burgundy)' : '1px solid #ccc',
                                  borderRadius: 6,
                                  overflow: 'hidden',
                                  width: 44,
                                  height: 44,
                                  padding: 0,
                                  cursor: 'pointer',
                                  backgroundColor: '#FFFFFF',
                                  flexShrink: 0,
                                }}
                                title={asset.originalName}
                              >
                                <img
                                  src={getMediaUrl(asset.storageUrl)}
                                  alt={asset.originalName}
                                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                <label className="form-label">Biography Summary</label>
                <textarea
                  name="biography"
                  rows={5}
                  value={profile?.biography || ''}
                  onChange={handleChange}
                  required
                  className="form-textarea"
                ></textarea>
              </div>

              <button type="submit" disabled={saving} className="btn-primary">
                {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                <span>Save Profile Changes</span>
              </button>
            </form>
          </div>
        )}
      </div>
    </>
  );
};
