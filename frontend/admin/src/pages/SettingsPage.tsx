import React, { useEffect, useState } from 'react';
import { adminApi } from '../services/adminApi';
import { SiteSetting } from '../types/admin';
import { Save, CheckCircle, Loader2 } from 'lucide-react';
import { PageLoader } from '../components/PageLoader';

export const SettingsPage: React.FC = () => {
  const [settings, setSettings] = useState<SiteSetting[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [savingKey, setSavingKey] = useState<string | null>(null);
  const [successKey, setSuccessKey] = useState<string | null>(null);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await adminApi.getSettings();
      setSettings(data);
    } catch (err: any) {
      console.error(err);
      const msg = err.code === 'ECONNABORTED' || err.message?.includes('timeout')
        ? 'Connecting to backend timed out. Render may still be spinning up from idle.'
        : err?.response?.data?.message || err?.message || 'Failed to load site settings';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleValueChange = (key: string, val: string) => {
    setSettings((prev) =>
      prev.map((s) => (s.key === key ? { ...s, value: val } : s))
    );
  };

  const handleSave = async (s: SiteSetting) => {
    setSavingKey(s.key);
    try {
      await adminApi.updateSetting(s.key, s.value, s.description);
      setSuccessKey(s.key);
      setTimeout(() => setSuccessKey(null), 2500);
    } catch (err: any) {
      console.error(err);
      alert(err?.response?.data?.message || err?.message || 'Failed to update setting.');
    } finally {
      setSavingKey(null);
    }
  };

  return (
    <>
      <header className="admin-header">
        <h1 className="page-title">Website Configuration & Settings</h1>
      </header>

      <div className="admin-body">
        {loading || error ? (
          <PageLoader
            title="Site Settings"
            message="Loading operational keys, helpline notices, and brand flags..."
            error={error}
            onRetry={loadSettings}
          />
        ) : (
          <div className="data-card" style={{ maxWidth: 840, padding: '1.5rem' }}>
          <h2 className="card-title" style={{ marginBottom: '1.5rem' }}>Global Content & Contact Parameters</h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {settings.map((s) => (
              <div key={s.key} style={{ borderBottom: '1px solid var(--admin-border)', paddingBottom: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <label className="form-label" style={{ textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    {s.key.replace(/_/g, ' ')}
                  </label>
                  {successKey === s.key && (
                    <span style={{ color: '#2E7D32', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: 4 }}>
                      <CheckCircle size={14} /> Updated!
                    </span>
                  )}
                </div>

                {s.value.length > 80 ? (
                  <textarea
                    rows={3}
                    value={s.value}
                    onChange={(e) => handleValueChange(s.key, e.target.value)}
                    className="form-textarea"
                    style={{ marginBottom: '0.75rem' }}
                  ></textarea>
                ) : (
                  <input
                    type="text"
                    value={s.value}
                    onChange={(e) => handleValueChange(s.key, e.target.value)}
                    className="form-input"
                    style={{ marginBottom: '0.75rem' }}
                  />
                )}

                <button
                  type="button"
                  disabled={savingKey === s.key}
                  onClick={() => handleSave(s)}
                  className="btn-secondary"
                  style={{ fontSize: '0.78rem', padding: '0.35rem 0.75rem' }}
                >
                  {savingKey === s.key ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                  <span>Update Setting</span>
                </button>
              </div>
            ))}
          </div>
        </div>
        )}
      </div>
    </>
  );
};
