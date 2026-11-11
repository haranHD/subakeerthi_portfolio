import React, { useEffect, useState } from 'react';
import { adminApi } from '../services/adminApi';
import { Profile, MediaAsset } from '../types/admin';
import { Save, CheckCircle, Loader2, Upload, Image as ImageIcon, User, AlertCircle, Trash2 } from 'lucide-react';
import { getMediaUrl } from '../utils/media';
import { PageLoader } from '../components/PageLoader';
import { optimizeImageFile } from '../utils/imageOptimizer';

export const ProfilePage: React.FC = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [mediaAssets, setMediaAssets] = useState<MediaAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [portraitSavedNotice, setPortraitSavedNotice] = useState(false);
  const [uploadingPortrait, setUploadingPortrait] = useState(false);
  const [previewError, setPreviewError] = useState(false);
  const [urlInputValue, setUrlInputValue] = useState('');

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
      if (profData?.portraitUrl && !profData.portraitUrl.startsWith('data:')) {
        setUrlInputValue(profData.portraitUrl);
      } else {
        setUrlInputValue('');
      }
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

  const handleSelectMedia = async (storageUrl: string) => {
    if (!profile) return;
    try {
      setSaving(true);
      const updated = await adminApi.updateProfile({ portraitUrl: storageUrl });
      setProfile(updated);
      if (!storageUrl.startsWith('data:')) {
        setUrlInputValue(storageUrl);
      } else {
        setUrlInputValue('');
      }
      setPreviewError(false);
      setPortraitSavedNotice(true);
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setPortraitSavedNotice(false);
      }, 4000);
    } catch (err: any) {
      console.error('Failed to auto-save selected portrait:', err);
      alert(err?.response?.data?.message || err?.message || 'Failed to update portrait. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleResetToOfficialPortrait = async () => {
    if (!profile) return;
    try {
      setSaving(true);
      const updated = await adminApi.updateProfile({ portraitUrl: '/subakeerthii-portrait.png' });
      setProfile(updated);
      setUrlInputValue('/subakeerthii-portrait.png');
      setPreviewError(false);
      setPortraitSavedNotice(true);
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setPortraitSavedNotice(false);
      }, 4000);
    } catch (err: any) {
      console.error('Failed to reset to official portrait:', err);
      alert(err?.response?.data?.message || err?.message || 'Failed to reset portrait.');
    } finally {
      setSaving(false);
    }
  };

  const handleClearPortrait = async () => {
    if (!profile) return;
    try {
      setSaving(true);
      const updated = await adminApi.updateProfile({ portraitUrl: '' });
      setProfile(updated);
      setUrlInputValue('');
      setPreviewError(false);
      setPortraitSavedNotice(true);
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setPortraitSavedNotice(false);
      }, 4000);
    } catch (err: any) {
      console.error('Failed to clear portrait:', err);
      alert(err?.response?.data?.message || err?.message || 'Failed to clear portrait.');
    } finally {
      setSaving(false);
    }
  };

  const handleApplyCustomUrl = async () => {
    if (!profile) return;
    const trimmed = urlInputValue.trim();
    try {
      setSaving(true);
      const updated = await adminApi.updateProfile({ portraitUrl: trimmed });
      setProfile(updated);
      setPreviewError(false);
      setPortraitSavedNotice(true);
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setPortraitSavedNotice(false);
      }, 4000);
    } catch (err: any) {
      console.error('Failed to apply custom URL:', err);
      alert(err?.response?.data?.message || err?.message || 'Failed to apply custom URL.');
    } finally {
      setSaving(false);
    }
  };

  const handleDirectPortraitUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingPortrait(true);
    try {
      // 1. Optimize image in browser (downscales large mobile camera images to compact high-def JPEG)
      const optimizedFile = await optimizeImageFile(file);

      // 2. Upload to database storage
      const asset = await adminApi.uploadMedia(optimizedFile, 'PORTRAIT');

      // 3. Immediately persist to database profile so it remains permanent
      const updated = await adminApi.updateProfile({ portraitUrl: asset.storageUrl });
      setProfile(updated);
      setUrlInputValue('');
      setPreviewError(false);
      setMediaAssets((prev) => [asset, ...prev]);
      setPortraitSavedNotice(true);
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setPortraitSavedNotice(false);
      }, 4000);
    } catch (err: any) {
      console.error('Portrait upload or save failed:', err);
      alert(err?.response?.data?.message || err?.message || 'Failed to upload and save portrait image. Please try again.');
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
    } catch (err: any) {
      console.error(err);
      alert(err?.response?.data?.message || err?.message || 'Failed to save profile changes.');
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
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.35rem' }}>
                  <label className="form-label" style={{ fontWeight: 700, color: 'var(--admin-burgundy)', margin: 0 }}>
                    Hero Section Portrait Photo
                  </label>
                  {portraitSavedNotice && (
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                        backgroundColor: '#E8F5E9',
                        color: '#2E7D32',
                        padding: '0.2rem 0.65rem',
                        borderRadius: 16,
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        border: '1px solid #C8E6C9',
                      }}
                    >
                      <CheckCircle size={13} /> Saved permanently in Database!
                    </span>
                  )}
                </div>
                <p style={{ fontSize: '0.78rem', color: '#666', marginBottom: '1rem' }}>
                  This official portrait is displayed on the main website homepage inside the editorial arch frame. Any uploaded photo or selection is saved immediately to the database and remains set permanently until your next update.
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
                          cursor: uploadingPortrait || saving ? 'not-allowed' : 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          fontSize: '0.84rem',
                          padding: '0.6rem 1.1rem',
                        }}
                      >
                        {uploadingPortrait ? (
                          <>
                            <Loader2 size={15} className="animate-spin" /> Uploading & Saving...
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
                          disabled={uploadingPortrait || saving}
                          style={{ display: 'none' }}
                        />
                      </label>

                      <button
                        type="button"
                        onClick={handleResetToOfficialPortrait}
                        disabled={saving || uploadingPortrait}
                        className="btn-secondary"
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.4rem',
                          fontSize: '0.82rem',
                          padding: '0.6rem 0.9rem',
                          cursor: saving || uploadingPortrait ? 'not-allowed' : 'pointer',
                        }}
                      >
                        Use Official Portrait
                      </button>

                      {profile?.portraitUrl && (
                        <button
                          type="button"
                          onClick={handleClearPortrait}
                          disabled={saving || uploadingPortrait}
                          className="btn-secondary"
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.4rem',
                            fontSize: '0.82rem',
                            padding: '0.6rem 0.9rem',
                            color: '#DC2626',
                            borderColor: '#FECACA',
                            cursor: saving || uploadingPortrait ? 'not-allowed' : 'pointer',
                          }}
                          title="Clear current photo"
                        >
                          <Trash2 size={14} /> Clear Photo
                        </button>
                      )}
                    </div>

                    <div className="form-group" style={{ marginBottom: '1rem' }}>
                      <label className="form-label" style={{ fontSize: '0.78rem' }}>
                        Image Path / Direct URL
                      </label>

                      {profile?.portraitUrl?.startsWith('data:') ? (
                        <div>
                          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                            <input
                              type="text"
                              readOnly
                              value="[Embedded Photo Uploaded & Stored in Database]"
                              className="form-input"
                              style={{
                                fontSize: '0.82rem',
                                backgroundColor: '#F0FDF4',
                                borderColor: '#86EFAC',
                                color: '#166534',
                                fontWeight: 600,
                                flex: 1,
                                cursor: 'default',
                              }}
                            />
                            <button
                              type="button"
                              onClick={handleClearPortrait}
                              disabled={saving || uploadingPortrait}
                              className="btn-secondary"
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.35rem',
                                fontSize: '0.8rem',
                                padding: '0.55rem 0.85rem',
                                color: '#DC2626',
                                borderColor: '#FECACA',
                                whiteSpace: 'nowrap',
                                cursor: saving || uploadingPortrait ? 'not-allowed' : 'pointer',
                              }}
                            >
                              <Trash2 size={13} /> Clear / Replace
                            </button>
                          </div>
                          <span style={{ fontSize: '0.72rem', color: '#666', marginTop: 4, display: 'block' }}>
                            * Currently using uploaded photo stored in database. Click "Clear / Replace" to enter a custom URL or click "Use Official Portrait".
                          </span>
                        </div>
                      ) : (
                        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                          <input
                            type="text"
                            value={urlInputValue}
                            onChange={(e) => setUrlInputValue(e.target.value)}
                            placeholder="e.g. /subakeerthii-portrait.png or https://..."
                            className="form-input"
                            style={{ fontSize: '0.82rem', flex: 1 }}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                handleApplyCustomUrl();
                              }
                            }}
                          />
                          <button
                            type="button"
                            onClick={handleApplyCustomUrl}
                            disabled={saving || uploadingPortrait || urlInputValue === (profile?.portraitUrl || '')}
                            className="btn-primary"
                            style={{
                              fontSize: '0.8rem',
                              padding: '0.55rem 0.85rem',
                              whiteSpace: 'nowrap',
                              cursor: saving || uploadingPortrait || urlInputValue === (profile?.portraitUrl || '') ? 'not-allowed' : 'pointer',
                            }}
                          >
                            Apply & Save
                          </button>
                          {profile?.portraitUrl && (
                            <button
                              type="button"
                              onClick={handleClearPortrait}
                              disabled={saving || uploadingPortrait}
                              className="btn-secondary"
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.35rem',
                                fontSize: '0.8rem',
                                padding: '0.55rem 0.85rem',
                                color: '#DC2626',
                                borderColor: '#FECACA',
                                whiteSpace: 'nowrap',
                                cursor: saving || uploadingPortrait ? 'not-allowed' : 'pointer',
                              }}
                              title="Clear current image"
                            >
                              <Trash2 size={13} /> Clear
                            </button>
                          )}
                        </div>
                      )}
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
                                  onError={(e) => {
                                    (e.currentTarget as HTMLImageElement).style.opacity = '0.2';
                                  }}
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
