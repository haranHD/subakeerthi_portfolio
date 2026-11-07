import React, { useEffect, useState } from 'react';
import { adminApi } from '../services/adminApi';
import { Credential } from '../types/admin';
import { Plus, Edit, Trash2, Eye, EyeOff, Check, X, Loader2 } from 'lucide-react';

export const CredentialsPage: React.FC = () => {
  const [credentials, setCredentials] = useState<Credential[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Partial<Credential> | null>(null);

  useEffect(() => {
    loadCredentials();
  }, []);

  const loadCredentials = async () => {
    try {
      const data = await adminApi.getCredentials();
      setCredentials(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePublish = async (c: Credential) => {
    try {
      await adminApi.updateCredential(c.id, { isPublished: !c.isPublished });
      await loadCredentials();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this credential item?')) return;
    try {
      await adminApi.deleteCredential(id);
      await loadCredentials();
    } catch (err) {
      console.error(err);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;

    try {
      if (editing.id) {
        await adminApi.updateCredential(editing.id, editing);
      } else {
        await adminApi.createCredential(editing);
      }
      setEditing(null);
      await loadCredentials();
    } catch (err) {
      console.error(err);
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
                    onChange={(e) => setEditing({ ...editing, institution: e.target.value })}
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
                    <td><strong>{c.qualification}</strong></td>
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
      </div>
    </>
  );
};
