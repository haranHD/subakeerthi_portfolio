import React, { useEffect, useState } from 'react';
import { adminApi } from '../services/adminApi';
import { MediaAsset } from '../types/admin';
import { Upload, Trash2, Copy, Check, Loader2, Image as ImageIcon } from 'lucide-react';
import { getMediaUrl } from '../utils/media';

export const MediaPage: React.FC = () => {
  const [media, setMedia] = useState<MediaAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [assetType, setAssetType] = useState('OTHER');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    loadMedia();
  }, []);

  const loadMedia = async () => {
    try {
      const data = await adminApi.getMedia();
      setMedia(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      await adminApi.uploadMedia(file, assetType);
      await loadMedia();
    } catch (err) {
      console.error(err);
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this media asset?')) return;
    try {
      await adminApi.deleteMedia(id);
      await loadMedia();
    } catch (err) {
      console.error(err);
    }
  };

  const copyUrl = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
        <Loader2 size={32} className="animate-spin" style={{ color: 'var(--admin-burgundy)' }} />
      </div>
    );
  }

  return (
    <>
      <header className="admin-header">
        <h1 className="page-title">Media & Asset Management</h1>
      </header>

      <div className="admin-body">
        {/* Upload Card */}
        <div className="data-card" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
          <h2 className="card-title" style={{ marginBottom: '1rem' }}>Upload Official Assets</h2>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <select
              value={assetType}
              onChange={(e) => setAssetType(e.target.value)}
              className="form-select"
              style={{ width: 200 }}
            >
              <option value="PORTRAIT">Client Portrait</option>
              <option value="BANNER">Website Banner</option>
              <option value="CERTIFICATE">Certificate Document</option>
              <option value="OTHER">Other Graphic</option>
            </select>

            <label className="btn-primary" style={{ cursor: 'pointer' }}>
              {uploading ? (
                <>
                  <Loader2 size={16} className="animate-spin" /> Uploading...
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
        </div>

        {/* Media Grid */}
        <div
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
                      // Fallback gracefully to direct relative URL or placeholder
                      const img = e.currentTarget;
                      if (!img.dataset.retried) {
                        img.dataset.retried = 'true';
                        img.src = item.storageUrl;
                      }
                    }}
                  />
                ) : (
                  <div style={{ padding: '1rem', textAlign: 'center', fontSize: '0.8rem', color: '#666' }}>
                    📄 {item.originalName}
                  </div>
                )}
              </div>

              <div style={{ padding: '1rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <span className="badge" style={{ width: 'fit-content', marginBottom: 6, fontSize: '0.68rem' }}>
                  {item.assetType}
                </span>
                <div
                  style={{
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    marginBottom: 4,
                  }}
                  title={item.originalName}
                >
                  {item.originalName}
                </div>
                <div style={{ fontSize: '0.72rem', color: '#888', marginBottom: '0.75rem' }}>
                  {(item.size / 1024).toFixed(1)} KB · {new Date(item.createdAt).toLocaleDateString()}
                </div>

                <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto' }}>
                  <button
                    onClick={() => copyUrl(item.storageUrl, item.id)}
                    className="btn-secondary"
                    style={{ flex: 1, padding: '0.4rem', justifyContent: 'center', fontSize: '0.78rem' }}
                  >
                    {copiedId === item.id ? <Check size={14} color="#2E7D32" /> : <Copy size={14} />}
                    <span>{copiedId === item.id ? 'Copied' : 'Copy'}</span>
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="btn-danger"
                    style={{ padding: '0.4rem 0.6rem' }}
                    title="Delete"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {media.length === 0 && (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem', color: '#888' }}>
              No media uploaded yet. Use the upload button above.
            </div>
          )}
        </div>
      </div>
    </>
  );
};
