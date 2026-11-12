import React, { useEffect, useState } from 'react';
import { adminApi } from '../services/adminApi';
import { Service } from '../types/admin';
import { Plus, Edit, Trash2, Eye, EyeOff, Check, X, Loader2 } from 'lucide-react';
import { PageLoader } from '../components/PageLoader';

export const ServicesPage: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState<Partial<Service> | null>(null);

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await adminApi.getServices();
      setServices(data);
    } catch (err: any) {
      console.error(err);
      const msg = err.code === 'ECONNABORTED' || err.message?.includes('timeout')
        ? 'Connecting to backend timed out. Render may still be spinning up from idle.'
        : err?.response?.data?.message || err?.message || 'Failed to load services';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePublish = async (s: Service) => {
    try {
      await adminApi.updateService(s.id, { isPublished: !s.isPublished });
      await loadServices();
    } catch (err: any) {
      console.error(err);
      alert(err?.response?.data?.message || err?.message || 'Failed to update publish status.');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this service card?')) return;
    try {
      await adminApi.deleteService(id);
      await loadServices();
    } catch (err: any) {
      console.error(err);
      alert(err?.response?.data?.message || err?.message || 'Failed to delete service.');
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;

    try {
      if (editing.id) {
        await adminApi.updateService(editing.id, editing);
      } else {
        await adminApi.createService(editing);
      }
      setEditing(null);
      await loadServices();
    } catch (err: any) {
      console.error(err);
      alert(err?.response?.data?.message || err?.message || 'Failed to save service changes.');
    }
  };

  return (
    <>
      <header className="admin-header">
        <h1 className="page-title">Areas of Professional Work</h1>
        <button
          onClick={() =>
            setEditing({
              title: '',
              tag: '',
              category: '',
              description: '',
              audience: '',
              icon: 'ShieldCheck',
              displayOrder: services.length + 1,
              isPublished: true,
            })
          }
          className="btn-primary"
        >
          <Plus size={16} /> New Service Card
        </button>
      </header>

      <div className="admin-body">
        {loading || error ? (
          <PageLoader
            title="Areas of Work"
            message="Loading advisory, training, and counselling offerings..."
            error={error}
            onRetry={loadServices}
          />
        ) : (
          <>
            {editing && (
              <div className="data-card" style={{ marginBottom: '2rem', padding: '1.5rem' }}>
                <h2 className="card-title" style={{ marginBottom: '1.25rem' }}>
                  {editing.id ? 'Edit Service' : 'Create New Service'}
                </h2>
                <form onSubmit={handleSave}>
                  <div className="form-grid">
                    <div className="form-group">
                      <label className="form-label">Service Title</label>
                      <input
                        type="text"
                        value={editing.title || ''}
                        onChange={(e) => setEditing({ ...editing, title: e.target.value })}
                        required
                        className="form-input"
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Tag / Badge</label>
                      <input
                        type="text"
                        value={editing.tag || ''}
                        onChange={(e) => setEditing({ ...editing, tag: e.target.value })}
                        required
                        className="form-input"
                      />
                    </div>
                  </div>

                  <div className="form-grid">
                    <div className="form-group">
                      <label className="form-label">Category</label>
                      <input
                        type="text"
                        value={editing.category || ''}
                        onChange={(e) => setEditing({ ...editing, category: e.target.value })}
                        required
                        className="form-input"
                      />
                    </div>

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
                  </div>

                  <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                    <label className="form-label">Target Audience Description</label>
                    <input
                      type="text"
                      value={editing.audience || ''}
                      onChange={(e) => setEditing({ ...editing, audience: e.target.value })}
                      required
                      className="form-input"
                    />
                  </div>

                  <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                    <label className="form-label">Detailed Description</label>
                    <textarea
                      rows={4}
                      value={editing.description || ''}
                      onChange={(e) => setEditing({ ...editing, description: e.target.value })}
                      required
                      className="form-textarea"
                    ></textarea>
                  </div>

                  <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <button type="submit" className="btn-primary">
                      <Check size={16} /> Save Service
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
                      <th>Title & Tag</th>
                      <th>Category</th>
                      <th>Audience Focus</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {services.map((s) => (
                      <tr key={s.id}>
                        <td>#{s.displayOrder}</td>
                        <td>
                          <strong>{s.title}</strong>
                          <div style={{ fontSize: '0.76rem', color: '#666' }}>{s.tag}</div>
                        </td>
                        <td>{s.category}</td>
                        <td style={{ maxWidth: 260 }}>{s.audience}</td>
                        <td>
                          <span className={`badge ${s.isPublished ? 'badge-published' : 'badge-draft'}`}>
                            {s.isPublished ? 'PUBLISHED' : 'DRAFT'}
                          </span>
                        </td>
                        <td>
                          <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button
                              onClick={() => handleTogglePublish(s)}
                              className="btn-secondary"
                              style={{ padding: '0.35rem 0.6rem' }}
                              title={s.isPublished ? 'Unpublish' : 'Publish'}
                            >
                              {s.isPublished ? <EyeOff size={15} /> : <Eye size={15} />}
                            </button>
                            <button
                              onClick={() => setEditing(s)}
                              className="btn-secondary"
                              style={{ padding: '0.35rem 0.6rem' }}
                              title="Edit"
                            >
                              <Edit size={15} />
                            </button>
                            <button
                              onClick={() => handleDelete(s.id)}
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
