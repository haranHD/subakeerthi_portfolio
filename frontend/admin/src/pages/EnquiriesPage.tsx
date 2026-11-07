import React, { useEffect, useState } from 'react';
import { adminApi } from '../services/adminApi';
import { Enquiry } from '../types/admin';
import { Search, Filter, Loader2, MessageSquare, Phone, Mail, Building } from 'lucide-react';

export const EnquiriesPage: React.FC = () => {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null);
  const [adminNotes, setAdminNotes] = useState('');

  useEffect(() => {
    loadEnquiries();
  }, [statusFilter]);

  const loadEnquiries = async () => {
    try {
      const data = await adminApi.getEnquiries(statusFilter || undefined);
      setEnquiries(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id: string, newStatus: string) => {
    try {
      await adminApi.updateEnquiryStatus(id, newStatus, adminNotes || undefined);
      if (selectedEnquiry && selectedEnquiry.id === id) {
        setSelectedEnquiry({ ...selectedEnquiry, status: newStatus as any, notes: adminNotes });
      }
      await loadEnquiries();
    } catch (err) {
      console.error(err);
    }
  };

  const openDetail = (enq: Enquiry) => {
    setSelectedEnquiry(enq);
    setAdminNotes(enq.notes || '');
  };

  const filtered = enquiries.filter((e) => {
    const q = searchTerm.toLowerCase();
    return (
      e.fullName.toLowerCase().includes(q) ||
      e.organisation.toLowerCase().includes(q) ||
      e.areaOfInterest.toLowerCase().includes(q) ||
      (e.email && e.email.toLowerCase().includes(q))
    );
  });

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
        <h1 className="page-title">Client Training Enquiries</h1>
      </header>

      <div className="admin-body">
        {/* Detail Modal */}
        {selectedEnquiry && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: 'rgba(0,0,0,0.5)',
              zIndex: 1000,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '1.5rem',
            }}
          >
            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: 10,
                width: '100%',
                maxWidth: 620,
                padding: '2rem',
                maxHeight: '90vh',
                overflowY: 'auto',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                <h2 style={{ fontSize: '1.25rem', color: 'var(--admin-burgundy)' }}>Enquiry Details</h2>
                <button
                  onClick={() => setSelectedEnquiry(null)}
                  style={{ border: 'none', background: 'none', fontSize: '1.5rem', cursor: 'pointer' }}
                >
                  ×
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#666', textTransform: 'uppercase' }}>Full Name</div>
                  <strong>{selectedEnquiry.fullName}</strong>
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#666', textTransform: 'uppercase' }}>Organisation</div>
                  <strong>{selectedEnquiry.organisation}</strong>
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#666', textTransform: 'uppercase' }}>Email</div>
                  <div>{selectedEnquiry.email || '—'}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#666', textTransform: 'uppercase' }}>Phone</div>
                  <div>{selectedEnquiry.phone || '—'}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#666', textTransform: 'uppercase' }}>Category</div>
                  <div>{selectedEnquiry.category}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#666', textTransform: 'uppercase' }}>Area of Interest</div>
                  <div>{selectedEnquiry.areaOfInterest}</div>
                </div>
              </div>

              <div style={{ marginBottom: '1.25rem' }}>
                <div style={{ fontSize: '0.75rem', color: '#666', textTransform: 'uppercase', marginBottom: 4 }}>
                  Session Requirements
                </div>
                <div
                  style={{
                    backgroundColor: '#FAF7F4',
                    padding: '1rem',
                    borderRadius: 6,
                    fontSize: '0.88rem',
                    whiteSpace: 'pre-wrap',
                  }}
                >
                  {selectedEnquiry.requirements}
                </div>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ fontSize: '0.75rem', color: '#666', textTransform: 'uppercase', marginBottom: 4 }}>
                  Internal Admin Follow-up Notes
                </div>
                <textarea
                  rows={3}
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="Record follow-up calls, date of session proposed, fee notes..."
                  className="form-textarea"
                ></textarea>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontSize: '0.82rem', fontWeight: 600 }}>Update Status:</span>
                  <select
                    value={selectedEnquiry.status}
                    onChange={(e) => handleStatusUpdate(selectedEnquiry.id, e.target.value)}
                    className="form-select"
                  >
                    <option value="NEW">NEW</option>
                    <option value="PENDING">PENDING</option>
                    <option value="RESPONDED">RESPONDED</option>
                    <option value="ARCHIVED">ARCHIVED</option>
                  </select>
                </div>

                <button
                  onClick={() => handleStatusUpdate(selectedEnquiry.id, selectedEnquiry.status)}
                  className="btn-primary"
                >
                  Save Notes
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Filter Bar */}
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: '1 1 280px' }}>
            <input
              type="text"
              placeholder="Search by name, organisation, email, topic..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-input"
              style={{ paddingLeft: '2.4rem', width: '100%' }}
            />
            <Search size={16} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: '#888' }} />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Filter size={16} style={{ color: '#666' }} />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="form-select"
              style={{ width: 160 }}
            >
              <option value="">All Statuses</option>
              <option value="NEW">NEW</option>
              <option value="PENDING">PENDING</option>
              <option value="RESPONDED">RESPONDED</option>
              <option value="ARCHIVED">ARCHIVED</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="data-card">
          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Client / Contact</th>
                  <th>Organisation</th>
                  <th>Category & Area</th>
                  <th>Status</th>
                  <th>Received</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length > 0 ? (
                  filtered.map((enq) => (
                    <tr key={enq.id}>
                      <td>
                        <strong>{enq.fullName}</strong>
                        {enq.email && <div style={{ fontSize: '0.78rem', color: '#666' }}>{enq.email}</div>}
                        {enq.phone && <div style={{ fontSize: '0.78rem', color: '#666' }}>{enq.phone}</div>}
                      </td>
                      <td>{enq.organisation}</td>
                      <td>
                        <div>{enq.category}</div>
                        <div style={{ fontSize: '0.78rem', color: '#666' }}>{enq.areaOfInterest}</div>
                      </td>
                      <td>
                        <span className={`badge badge-${enq.status.toLowerCase()}`}>
                          {enq.status}
                        </span>
                      </td>
                      <td>{new Date(enq.createdAt).toLocaleDateString()}</td>
                      <td>
                        <button
                          onClick={() => openDetail(enq)}
                          className="btn-secondary"
                          style={{ padding: '0.4rem 0.75rem', fontSize: '0.82rem' }}
                        >
                          View & Reply
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} style={{ textAlign: 'center', padding: '2.5rem', color: '#888' }}>
                      No matching enquiries found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};
