import React, { useEffect, useState } from 'react';
import { adminApi } from '../services/adminApi';
import { DashboardData } from '../types/admin';
import { Inbox, CheckCircle, Clock, Archive, Layers, BookOpen } from 'lucide-react';
import { PageLoader } from '../components/PageLoader';

export const DashboardPage: React.FC = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await adminApi.getDashboard();
      setData(res);
    } catch (err: any) {
      console.error(err);
      const msg = err.code === 'ECONNABORTED' || err.message?.includes('timeout')
        ? 'Connecting to backend server timed out. Render may still be spinning up from idle.'
        : err?.response?.data?.message || err?.message || 'Failed to load dashboard data';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id: string, status: string) => {
    try {
      await adminApi.updateEnquiryStatus(id, status);
      await loadDashboard();
    } catch (err) {
      console.error(err);
    }
  };

  const metrics = data?.metrics || {
    totalEnquiries: 0,
    newEnquiries: 0,
    pendingEnquiries: 0,
    respondedEnquiries: 0,
    totalServices: 0,
    totalProgrammes: 0,
  };

  return (
    <>
      <header className="admin-header">
        <h1 className="page-title">Operational Overview</h1>
      </header>

      <div className="admin-body">
        {loading || error ? (
          <PageLoader
            title="Operational Overview"
            message="Loading editorial metrics, recent enquiries, and system logs..."
            error={error}
            onRetry={loadDashboard}
          />
        ) : (
          <>
            {/* Metric Cards */}
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon"><Inbox size={22} /></div>
                <div>
                  <div className="stat-val">{metrics.totalEnquiries}</div>
                  <div className="stat-label">Total Enquiries</div>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon" style={{ backgroundColor: '#E3F2FD', color: '#1565C0' }}>
                  <Clock size={22} />
                </div>
                <div>
                  <div className="stat-val">{metrics.newEnquiries}</div>
                  <div className="stat-label">New Enquiries</div>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon" style={{ backgroundColor: '#E8F5E9', color: '#2E7D32' }}>
                  <CheckCircle size={22} />
                </div>
                <div>
                  <div className="stat-val">{metrics.respondedEnquiries}</div>
                  <div className="stat-label">Responded</div>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon" style={{ backgroundColor: '#EBF5F1', color: '#145A43' }}>
                  <Layers size={22} />
                </div>
                <div>
                  <div className="stat-val">{metrics.totalServices}</div>
                  <div className="stat-label">Areas of Work</div>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon" style={{ backgroundColor: '#EBF5F1', color: '#145A43' }}>
                  <BookOpen size={22} />
                </div>
                <div>
                  <div className="stat-val">{metrics.totalProgrammes}</div>
                  <div className="stat-label">Active Programmes</div>
                </div>
              </div>
            </div>

            {/* Recent Enquiries */}
            <div className="data-card">
              <div className="card-header">
                <h2 className="card-title">Recent Training Enquiries</h2>
              </div>
              <div className="table-responsive">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Client / Contact</th>
                      <th>Organisation</th>
                      <th>Category & Area</th>
                      <th>Status</th>
                      <th>Date</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data?.recentEnquiries && data.recentEnquiries.length > 0 ? (
                      data.recentEnquiries.map((enq) => (
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
                            <select
                              value={enq.status}
                              onChange={(e) => handleStatusChange(enq.id, e.target.value)}
                              className="form-select"
                              style={{ padding: '0.35rem 0.6rem', fontSize: '0.78rem' }}
                            >
                              <option value="NEW">NEW</option>
                              <option value="PENDING">PENDING</option>
                              <option value="RESPONDED">RESPONDED</option>
                              <option value="ARCHIVED">ARCHIVED</option>
                            </select>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} style={{ textAlign: 'center', padding: '2rem', color: '#888' }}>
                          No enquiries received yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Recent Activity Log */}
            <div className="data-card">
              <div className="card-header">
                <h2 className="card-title">Recent Administrative Audit Log</h2>
              </div>
              <div className="table-responsive">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Action</th>
                      <th>Entity Type</th>
                      <th>Admin</th>
                      <th>IP Address</th>
                      <th>Timestamp</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data?.recentLogs && data.recentLogs.length > 0 ? (
                      data.recentLogs.map((log) => (
                        <tr key={log.id}>
                          <td><strong>{log.action}</strong></td>
                          <td>{log.entityType}</td>
                          <td>{log.adminUser?.email || 'System'}</td>
                          <td>{log.ipAddress || '—'}</td>
                          <td>{new Date(log.createdAt).toLocaleString()}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} style={{ textAlign: 'center', padding: '2rem', color: '#888' }}>
                          No audit events logged yet.
                        </td>
                      </tr>
                    )}
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
