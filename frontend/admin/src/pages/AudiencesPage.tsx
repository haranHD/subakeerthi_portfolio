import React, { useEffect, useState } from 'react';
import { adminApi } from '../services/adminApi';
import { AudienceGroup } from '../types/admin';
import { Plus, Edit, Trash2, Eye, EyeOff, Check, X, Loader2 } from 'lucide-react';

export const AudiencesPage: React.FC = () => {
  const [audiences, setAudiences] = useState<AudienceGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Partial<AudienceGroup> | null>(null);

  useEffect(() => {
    loadAudiences();
  }, []);

  const loadAudiences = async () => {
    try {
      const data = await adminApi.getAudiences();
      setAudiences(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePublish = async (a: AudienceGroup) => {
    try {
      await adminApi.updateAudience(a.id, { isPublished: !a.isPublished });
      await loadAudiences();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this audience group?')) return;
    try {
      await adminApi.deleteAudience(id);
      await loadAudiences();
    } catch (err) {
      console.error(err);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;

    try {
      if (editing.id) {
        await adminApi.updateAudience(editing.id, editing);
      } else {
        await adminApi.createAudience(editing);
      }
      setEditing(null);
      await loadAudiences();
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
        <h1 className="page-title">Who She Supports (Audience Groups)</h1>
        <button
          onClick={() =>
            setEditing({
              title: '',
              badge: '',
              icon: 'School',
              description: '',
              actionText: 'Enquire for Sessions',
              displayOrder: audiences.length + 1,
              isPublished: true,
            })
          }
          className="btn-primary"
        >
          <Plus size={16} /> New Audience Group
        </button>
      </header>

      <div className="admin-body">
        {editing && (
          <div className="data-card" style={{ marginBottom: '2rem', padding: '1.5rem' }}>
            <h2 className="card-title" style={{ marginBottom: '1.25rem' }}>
              {editing.id ? 'Edit Audience Group' : 'Create Audience Group'}
            </h2>
            <form onSubmit={handleSave}>
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Group Title</label>
                  <input
                    type="text"
                    value={editing.title || ''}
                    onChange={(e) => setEditing({ ...editing, title: e.target.value })}
                    required
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Badge Tag</label>
                  <input
                    type="text"
                    value={editing.badge || ''}
                    onChange={(e) => setEditing({ ...editing, badge: e.target.value })}
                    required
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Icon Name (Lucide)</label>
                  <input
                    type="text"
                    value={editing.icon || ''}
                    onChange={(e) => setEditing({ ...editing, icon: e.target.value })}
                    required
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">CTA Button Label</label>
                  <input
                    type="text"
                    value={editing.actionText || ''}
                    onChange={(e) => setEditing({ ...editing, actionText: e.target.value })}
                    required
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                <label className="form-label">Description</label>
                <textarea
                  rows={3}
                  value={editing.description || ''}
                  onChange={(e) => setEditing({ ...editing, description: e.target.value })}
                  required
                  className="form-textarea"
                ></textarea>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button type="submit" className="btn-primary">
                  <Check size={16} /> Save Audience Group
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
                  <th>Order</th>
                  <th>Title & Badge</th>
                  <th>Description</th>
                  <th>CTA Button</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {audiences.map((a) => (
                  <tr key={a.id}>
                    <td>#{a.displayOrder}</td>
                    <td>
                      <strong>{a.title}</strong>
                      <div style={{ fontSize: '0.76rem', color: '#666' }}>{a.badge}</div>
                    </td>
                    <td style={{ maxWidth: 280, fontSize: '0.84rem' }}>{a.description}</td>
                    <td>{a.actionText}</td>
                    <td>
                      <span className={`badge ${a.isPublished ? 'badge-published' : 'badge-draft'}`}>
                        {a.isPublished ? 'PUBLISHED' : 'DRAFT'}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button
                          onClick={() => handleTogglePublish(a)}
                          className="btn-secondary"
                          style={{ padding: '0.35rem 0.6rem' }}
                          title={a.isPublished ? 'Unpublish' : 'Publish'}
                        >
                          {a.isPublished ? <EyeOff size={15} /> : <Eye size={15} />}
                        </button>
                        <button
                          onClick={() => setEditing(a)}
                          className="btn-secondary"
                          style={{ padding: '0.35rem 0.6rem' }}
                          title="Edit"
                        >
                          <Edit size={15} />
                        </button>
                        <button
                          onClick={() => handleDelete(a.id)}
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
