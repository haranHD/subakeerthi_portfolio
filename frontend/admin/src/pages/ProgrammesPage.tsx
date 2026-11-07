import React, { useEffect, useState } from 'react';
import { adminApi } from '../services/adminApi';
import { Programme } from '../types/admin';
import { Plus, Edit, Trash2, Eye, EyeOff, Check, X, Loader2 } from 'lucide-react';

export const ProgrammesPage: React.FC = () => {
  const [programmes, setProgrammes] = useState<Programme[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Partial<Programme> | null>(null);
  const [highlightsInput, setHighlightsInput] = useState('');

  useEffect(() => {
    loadProgrammes();
  }, []);

  const loadProgrammes = async () => {
    try {
      const data = await adminApi.getProgrammes();
      setProgrammes(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePublish = async (p: Programme) => {
    try {
      await adminApi.updateProgramme(p.id, { isPublished: !p.isPublished });
      await loadProgrammes();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this training programme?')) return;
    try {
      await adminApi.deleteProgramme(id);
      await loadProgrammes();
    } catch (err) {
      console.error(err);
    }
  };

  const startEdit = (p: Programme) => {
    setEditing(p);
    setHighlightsInput((p.highlights || []).join('\n'));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;

    const highlights = highlightsInput
      .split('\n')
      .map((h) => h.trim())
      .filter(Boolean);

    const payload = {
      ...editing,
      highlights,
    };

    try {
      if (editing.id) {
        await adminApi.updateProgramme(editing.id, payload);
      } else {
        await adminApi.createProgramme(payload);
      }
      setEditing(null);
      await loadProgrammes();
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
        <h1 className="page-title">Structured Training Programmes</h1>
        <button
          onClick={() => {
            setEditing({
              title: '',
              category: '',
              intendedAudience: '',
              purpose: '',
              description: '',
              highlights: [],
              displayOrder: programmes.length + 1,
              isPublished: true,
            });
            setHighlightsInput('');
          }}
          className="btn-primary"
        >
          <Plus size={16} /> New Programme Module
        </button>
      </header>

      <div className="admin-body">
        {editing && (
          <div className="data-card" style={{ marginBottom: '2rem', padding: '1.5rem' }}>
            <h2 className="card-title" style={{ marginBottom: '1.25rem' }}>
              {editing.id ? 'Edit Programme Module' : 'Create Programme Module'}
            </h2>
            <form onSubmit={handleSave}>
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Programme Title</label>
                  <input
                    type="text"
                    value={editing.title || ''}
                    onChange={(e) => setEditing({ ...editing, title: e.target.value })}
                    required
                    className="form-input"
                  />
                </div>

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
              </div>

              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Intended Audience</label>
                  <input
                    type="text"
                    value={editing.intendedAudience || ''}
                    onChange={(e) => setEditing({ ...editing, intendedAudience: e.target.value })}
                    required
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Duration / Format (Optional)</label>
                  <input
                    type="text"
                    value={editing.duration || ''}
                    onChange={(e) => setEditing({ ...editing, duration: e.target.value })}
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                <label className="form-label">Core Purpose & Objective</label>
                <input
                  type="text"
                  value={editing.purpose || ''}
                  onChange={(e) => setEditing({ ...editing, purpose: e.target.value })}
                  required
                  className="form-input"
                />
              </div>

              <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                <label className="form-label">Comprehensive Description</label>
                <textarea
                  rows={4}
                  value={editing.description || ''}
                  onChange={(e) => setEditing({ ...editing, description: e.target.value })}
                  required
                  className="form-textarea"
                ></textarea>
              </div>

              <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                <label className="form-label">Curriculum Highlights (one item per line)</label>
                <textarea
                  rows={3}
                  value={highlightsInput}
                  onChange={(e) => setHighlightsInput(e.target.value)}
                  placeholder="e.g. Mandatory reporting legal mandates&#10;Child safeguarding protocols"
                  className="form-textarea"
                ></textarea>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button type="submit" className="btn-primary">
                  <Check size={16} /> Save Programme
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
                  <th>Title & Category</th>
                  <th>Target Audience</th>
                  <th>Purpose</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {programmes.map((p) => (
                  <tr key={p.id}>
                    <td>#{p.displayOrder}</td>
                    <td>
                      <strong>{p.title}</strong>
                      <div style={{ fontSize: '0.76rem', color: '#666' }}>{p.category}</div>
                    </td>
                    <td style={{ maxWidth: 220 }}>{p.intendedAudience}</td>
                    <td style={{ maxWidth: 260, fontSize: '0.82rem' }}>{p.purpose}</td>
                    <td>
                      <span className={`badge ${p.isPublished ? 'badge-published' : 'badge-draft'}`}>
                        {p.isPublished ? 'PUBLISHED' : 'DRAFT'}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button
                          onClick={() => handleTogglePublish(p)}
                          className="btn-secondary"
                          style={{ padding: '0.35rem 0.6rem' }}
                          title={p.isPublished ? 'Unpublish' : 'Publish'}
                        >
                          {p.isPublished ? <EyeOff size={15} /> : <Eye size={15} />}
                        </button>
                        <button
                          onClick={() => startEdit(p)}
                          className="btn-secondary"
                          style={{ padding: '0.35rem 0.6rem' }}
                          title="Edit"
                        >
                          <Edit size={15} />
                        </button>
                        <button
                          onClick={() => handleDelete(p.id)}
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
