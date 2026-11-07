import React, { useEffect, useState } from 'react';
import { adminApi } from '../services/adminApi';
import { SiteSetting } from '../types/admin';
import { Save, CheckCircle, Loader2 } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const [settings, setSettings] = useState<SiteSetting[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingKey, setSavingKey] = useState<string | null>(null);
  const [successKey, setSuccessKey] = useState<string | null>(null);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const data = await adminApi.getSettings();
      setSettings(data);
    } catch (err) {
      console.error(err);
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
    } catch (err) {
      console.error(err);
    } finally {
      setSavingKey(null);
    }
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
        <h1 className="page-title">Website Configuration & Settings</h1>
      </header>

      <div className="admin-body">
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
      </div>
    </>
  );
};
