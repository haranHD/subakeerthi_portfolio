import React, { useEffect, useState } from 'react';
import { adminApi } from '../services/adminApi';
import { Credential } from '../types/admin';
import { Plus, Edit, Trash2, Eye, EyeOff, Check, X, Loader2, Award } from 'lucide-react';
import { PageLoader } from '../components/PageLoader';

export const CredentialsPage: React.FC = () => {
  const [credentials, setCredentials] = useState<Credential[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState<Partial<Credential> | null>(null);

  useEffect(() => {
    loadCredentials();
  }, []);

  const loadCredentials = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await adminApi.getCredentials();
      setCredentials(data);
    } catch (err: any) {
      console.error(err);
      const msg = err.code === 'ECONNABORTED' || err.message?.includes('timeout')
        ? 'Connecting to backend timed out. Render may still be spinning up from idle.'
        : err?.response?.data?.message || err?.message || 'Failed to load credentials';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePublish = async (c: Credential) => {
    try {
      await adminApi.updateCredential(c.id, { isPublished: !c.isPublished });
      await loadCredentials();
    } catch (err: any) {
      console.error(err);
      alert(err?.response?.data?.message || err?.message || 'Failed to update credential status.');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this credential item?')) return;
    try {
      await adminApi.deleteCredential(id);
      await loadCredentials();
    } catch (err: any) {
      console.error(err);
      alert(err?.response?.data?.message || err?.message || 'Failed to delete credential.');
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;

    const { id, createdAt, updatedAt, ...cleanPayload } = editing as any;
    const payload = {
      ...cleanPayload,
      institution: cleanPayload.institution?.trim(),
      issuingBody: cleanPayload.institution?.trim() || cleanPayload.issuingBody?.trim() || null,
      qualification: cleanPayload.qualification?.trim(),
      period: cleanPayload.period?.trim(),
      status: cleanPayload.status?.trim(),
      details: cleanPayload.details?.trim(),
      statutoryDomain: cleanPayload.statutoryDomain ? cleanPayload.statutoryDomain.trim() : null,
      certificateUrl: cleanPayload.certificateUrl ? cleanPayload.certificateUrl.trim() : null,
    };

    try {
      if (editing.id) {
        await adminApi.updateCredential(editing.id, payload);
      } else {
        await adminApi.createCredential(payload);
      }
      setEditing(null);
      await loadCredentials();
    } catch (err: any) {
      console.error(err);
      const backendErrors = err?.response?.data?.errors;
      const errorMsg = Array.isArray(backendErrors) && backendErrors.length > 0
        ? backendErrors.map((e: any) => `${e.field}: ${e.message}`).join('\n')
        : err?.response?.data?.message || err?.message || 'Failed to save credential.';
      alert(errorMsg);
    }
  };

  return (
    <>
      <header className="admin-header">
        <h1 className="page-title">Education & Credentials Timeline</h1>
        <button
          onClick={() =>
            setEditing({
              credentialType: 'EDUCATION',
              institution: '',
              qualification: '',
              period: '',
              status: '',
              details: '',
              displayOrder: credentials.length + 1,
              isPublished: true,
            })
          }
          className="btn-primary"
        >
          <Plus size={16} /> New Credential Entry
        </button>
      </header>

      <div className="admin-body">
        {loading || error ? (
          <PageLoader
            title="Credentials Timeline"
            message="Loading academic degrees, certifications, and appointments..."
            error={error}
            onRetry={loadCredentials}
          />
        ) : (
          <>
            {/* Hero Strip Live Sync Notice */}
            <div
              className="data-card"
              style={{
                marginBottom: '1.5rem',
                padding: '1.15rem 1.35rem',
                backgroundColor: '#FAF7F2',
                border: '1px solid #D7C7A1',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '0.85rem',
              }}
            >
              <Award size={20} color="#145A43" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <strong style={{ fontSize: '0.92rem', color: '#145A43', display: 'block', marginBottom: '0.25rem' }}>
                  Homepage Hero Credentials Strip Highlights
                </strong>
                <p style={{ fontSize: '0.82rem', color: '#555', margin: 0, lineHeight: 1.5 }}>
                  The 4 core credentials below (marked with <strong>Hero Highlight</strong>: <strong>LL.B. (Legal Scholarship)</strong>, <strong>Certified POSH Trainer</strong>, <strong>Certified POCSO Trainer</strong>, and <strong>Diploma in Child Psychology</strong>) automatically power the horizontal credentials strip directly beneath the hero section on your live website homepage. Any changes you make to their qualification title, status, or details will update immediately on the live website homepage.
                </p>
              </div>
            </div>

            {editing && (
              <div className="data-card" style={{ marginBottom: '2rem', padding: '1.5rem' }}>
                <h2 className="card-title" style={{ marginBottom: '1.25rem' }}>
                  {editing.id ? 'Edit Credential' : 'Create Credential'}
                </h2>
                <form onSubmit={handleSave}>
                  <div className="form-grid">
                    <div className="form-group">
                      <label className="form-label">Classification Type</label>
                      <select
                        value={editing.credentialType || 'EDUCATION'}
                        onChange={(e) =>
                          setEditing({ ...editing, credentialType: e.target.value as 'EDUCATION' | 'ACCREDITATION' })
                        }
                        className="form-select"
                      >
                        <option value="EDUCATION">Formal Academic Education</option>
                        <option value="ACCREDITATION">Certified Trainer Accreditation</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Qualification / Credential Name</label>
                      <input
                        type="text"
                        value={editing.qualification || ''}
                        onChange={(e) => setEditing({ ...editing, qualification: e.target.value })}
                        required
                        className="form-input"
                      />
                    </div>
                  </div>

                  <div className="form-grid">
                    <div className="form-group">
                      <label className="form-label">Institution / Issuing Body</label>
                      <input
                        type="text"
                        value={editing.institution || ''}
                        onChange={(e) =>
                          setEditing({ ...editing, institution: e.target.value, issuingBody: e.target.value })
                        }
                        required
                        className="form-input"
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Period / Year</label>
                      <input
                        type="text"
                        value={editing.period || ''}
                        onChange={(e) => setEditing({ ...editing, period: e.target.value })}
                        required
                        className="form-input"
                      />
                    </div>
                  </div>

                  <div className="form-grid">
                    <div className="form-group">
                      <label className="form-label">Status Badge (e.g. Currently Pursuing, Completed, Certified Trainer)</label>
                      <input
                        type="text"
                        value={editing.status || ''}
                        onChange={(e) => setEditing({ ...editing, status: e.target.value })}
                        required
                        className="form-input"
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Statutory Domain (Optional)</label>
                      <input
                        type="text"
                        value={editing.statutoryDomain || ''}
                        onChange={(e) => setEditing({ ...editing, statutoryDomain: e.target.value })}
                        className="form-input"
                      />
                    </div>
                  </div>

                  <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                    <label className="form-label">Description & Syllabus Details</label>
                    <textarea
                      rows={3}
                      value={editing.details || ''}
                      onChange={(e) => setEditing({ ...editing, details: e.target.value })}
                      required
                      className="form-textarea"
                    ></textarea>
                  </div>

                  <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <button type="submit" className="btn-primary">
                      <Check size={16} /> Save Credential
                    </button>
                    <button type="button" onClick={() => setEditing(null)} className="btn-secondary">
                      <X size={16} /> Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            <div className="data-card">
              <div className="table-responsive">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Type</th>
                      <th>Qualification</th>
                      <th>Institution</th>
                      <th>Period</th>
                      <th>Status</th>
                      <th>Published</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {credentials.map((c) => (
                      <tr key={c.id}>
                        <td>
                          <span className="badge" style={{ backgroundColor: c.credentialType === 'EDUCATION' ? '#E3F2FD' : '#F3E5F5', color: '#333' }}>
                            {c.credentialType}
                          </span>
                        </td>
                        <td>
                          <strong>{c.qualification}</strong>
                          {(c.qualification.toLowerCase().includes('posh') ||
                            c.qualification.toLowerCase().includes('pocso') ||
                            c.qualification.toLowerCase().includes('ll.b') ||
                            c.qualification.toLowerCase().includes('law') ||
                            c.qualification.toLowerCase().includes('psychology')) && (
                            <span
                              className="badge"
                              style={{
                                backgroundColor: '#E8F5E9',
                                color: '#1B5E20',
                                marginLeft: '0.5rem',
                                fontSize: '0.68rem',
                                border: '1px solid #C8E6C9',
                              }}
                            >
                              Hero Highlight
                            </span>
                          )}
                        </td>
                        <td>{c.institution}</td>
                        <td>{c.period}</td>
                        <td>{c.status}</td>
                        <td>
                          <span className={`badge ${c.isPublished ? 'badge-published' : 'badge-draft'}`}>
                            {c.isPublished ? 'YES' : 'NO'}
                          </span>
                        </td>
                        <td>
                          <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button
                              onClick={() => handleTogglePublish(c)}
                              className="btn-secondary"
                              style={{ padding: '0.35rem 0.6rem' }}
                              title={c.isPublished ? 'Unpublish' : 'Publish'}
                            >
                              {c.isPublished ? <EyeOff size={15} /> : <Eye size={15} />}
                            </button>
                            <button
                              onClick={() => setEditing(c)}
                              className="btn-secondary"
                              style={{ padding: '0.35rem 0.6rem' }}
                              title="Edit"
                            >
                              <Edit size={15} />
                            </button>
                            <button
                              onClick={() => handleDelete(c.id)}
                              className="btn-danger"
                              style={{ padding: '0.35rem 0.6rem' }}
                              title="Delete"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};
   </div>
    </>
  );
};
