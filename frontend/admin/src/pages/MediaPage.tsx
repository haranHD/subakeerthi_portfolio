import React, { useEffect, useState } from 'react';
import { adminApi } from '../services/adminApi';
import { MediaAsset } from '../types/admin';
import { Upload, Trash2, Copy, Check, Loader2, Image as ImageIcon, AlertCircle } from 'lucide-react';
import { getMediaUrl } from '../utils/media';
import { PageLoader } from '../components/PageLoader';
import { optimizeImageFile } from '../utils/imageOptimizer';

export const MediaPage: React.FC = () => {
  const [media, setMedia] = useState<MediaAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [assetType, setAssetType] = useState('PORTRAIT');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);

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
      const msg = err.code === 'ECONNABORTED' || err.message?.includes('timeout')
        ? 'Connecting to server timed out. The backend instance may be waking up.'
        : err?.response?.data?.message || err?.message || 'Failed to load media assets';
      setPageError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadProgress(0);
    setUploadError(null);
    setUploadSuccess(null);

    try {
      const optimizedFile = await optimizeImageFile(file);
      await adminApi.uploadMedia(optimizedFile, assetType, (percent) => {
        setUploadProgress(percent);
      });
      setUploadSuccess(`Successfully uploaded "${file.name}"`);
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
      e.target.value = '';
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this media asset permanently?')) return;
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

  return (
    <>
      <header className="admin-header">
        <h1 className="page-title">Media & Asset Management</h1>
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

            {/* Upload Card */}
            <div className="data-card" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
              <h2 className="card-title" style={{ marginBottom: '1rem' }}>
                Upload Official Assets
              </h2>

              <div
                className="media-upload-controls"
                style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}
              >
                <select
                  value={assetType}
                  onChange={(e) => setAssetType(e.target.value)}
                  className="form-select"
                  disabled={uploading}
                  style={{ width: 200, minWidth: 160 }}
                >
                  <option value="PORTRAIT">Client Portrait</option>
                  <option value="BANNER">Website Banner</option>
                  <option value="CERTIFICATE">Certificate Document</option>
                  <option value="OTHER">Other Graphic</option>
                </select>

                <label
                  className="btn-primary"
                  style={{
                    cursor: uploading ? 'not-allowed' : 'pointer',
                    opacity: uploading ? 0.7 : 1,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                  }}
                >
                  {uploading ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      <span>{uploadProgress !== null ? `Uploading ${uploadProgress}%...` : 'Uploading...'}</span>
                    </>
                  ) : (
                    <>
                      <Upload size={16} /> Choose File to Upload
                    </>
                  )}
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    onChange={handleFileUpload}
                    disabled={uploading}
                    style={{ display: 'none' }}
                  />
                </label>

                <span style={{ fontSize: '0.78rem', color: '#666' }}>
                  Accepts PNG, JPG, WebP, SVG, PDF up to 10MB
                </span>
              </div>

              {/* Progress Bar when uploading */}
              {uploading && (
                <div
                  style={{
                    marginTop: '1.25rem',
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
                    <span>Uploading asset to server...</span>
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
                  <p style={{ fontSize: '0.75rem', color: '#666', marginTop: '0.5rem', margin: 0 }}>
                    Sending file to server. Please wait while Render verifies and saves your asset.
                  </p>
                </div>
              )}
            </div>

            {/* Media Grid */}
            <div
              className="media-grid"
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
                gap: '1.25rem',
              }}
            >
              {media.map((item) => (
                <div
                  key={item.id}
                  className="data-card"
                  style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}
                >
                  <div
                    style={{
                      height: 140,
                      backgroundColor: '#FAF7F4',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      overflow: 'hidden',
                    }}
                  >
                    {item.mimeType.startsWith('image/') ? (
                      <img
                        src={getMediaUrl(item.storageUrl)}
                        alt={item.originalName}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
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
                          fontSize: '0.8rem',
                          color: '#666',
                        }}
                      >
                        📄 {item.originalName}
                      </div>
                    )}
                  </div>

                  <div style={{ padding: '1rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginBottom: '0.5rem',
                      }}
                    >
                      <span className="badge badge-published" style={{ fontSize: '0.68rem' }}>
                        {item.assetType}
                      </span>
                      <span style={{ fontSize: '0.72rem', color: '#999' }}>
                        {(item.size / 1024).toFixed(0)} KB
                      </span>
                    </div>

                    <p
                      title={item.originalName}
                      style={{
                        fontSize: '0.82rem',
                        fontWeight: 600,
                        color: 'var(--admin-charcoal)',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        marginBottom: '0.75rem',
                      }}
                    >
                      {item.originalName}
                    </p>

                    <div
                      style={{
                        display: 'flex',
                        gap: '0.5rem',
                        marginTop: 'auto',
                        paddingTop: '0.75rem',
                        borderTop: '1px solid var(--admin-border)',
                      }}
                    >
                      <button
                        onClick={() => copyUrl(item.storageUrl, item.id)}
                        className="btn-secondary"
                        style={{ flex: 1, padding: '0.4rem', fontSize: '0.75rem' }}
                        title="Copy Public URL"
                      >
                        {copiedId === item.id ? (
                          <>
                            <Check size={14} style={{ color: '#2E7D32' }} /> Copied
                          </>
                        ) : (
                          <>
                            <Copy size={14} /> Copy URL
                          </>
                        )}
                      </button>

                      <button
                        onClick={() => handleDelete(item.id)}
                        className="action-btn"
                        style={{ color: '#C62828' }}
                        title="Delete Asset"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {media.length === 0 && (
                <div
                  style={{
                    gridColumn: '1 / -1',
                    textAlign: 'center',
                    padding: '3rem 1rem',
                    color: '#999',
                  }}
                >
                  <ImageIcon size={44} style={{ opacity: 0.3, marginBottom: '0.75rem' }} />
                  <p style={{ fontSize: '0.92rem', fontWeight: 500 }}>No media uploaded yet.</p>
                  <p style={{ fontSize: '0.8rem', color: '#888', marginTop: '0.25rem' }}>
                    Select an asset category above and click "Choose File to Upload".
                  </p>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
};
