import React, { useEffect, useState } from 'react';
import { adminApi } from '../services/adminApi';
import { Profile } from '../types/admin';
import { Save, CheckCircle, Loader2 } from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const data = await adminApi.getProfile();
      setProfile(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (profile) {
      setProfile({ ...profile, [name]: value });
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
        <h1 className="page-title">Client Profile Management</h1>
        {success && (
          <span style={{ color: '#2E7D32', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.86rem', fontWeight: 600 }}>
            <CheckCircle size={16} /> Saved successfully!
          </span>
        )}
      </header>

      <div className="admin-body">
        <div className="data-card" style={{ maxWidth: 840 }}>
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

            <div className="form-group" style={{ marginBottom: '1.25rem' }}>
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

            <div className="form-group" style={{ marginBottom: '1.25rem' }}>
              <label className="form-label">Portrait Image Path / URL</label>
              <input
                type="text"
                name="portraitUrl"
                value={profile?.portraitUrl || ''}
                onChange={handleChange}
                className="form-input"
              />
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
      </div>
    </>
  );
};
