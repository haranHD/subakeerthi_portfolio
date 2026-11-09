import React, { useEffect, useState } from 'react';
import { adminApi } from '../services/adminApi';
import { AuditLog } from '../types/admin';
import { ShieldCheck, Loader2 } from 'lucide-react';
import { PageLoader } from '../components/PageLoader';

export const AuditLogsPage: React.FC = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadLogs();
  }, []);

  const loadLogs = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await adminApi.getAuditLogs();
      setLogs(data);
    } catch (err: any) {
      console.error(err);
      const msg = err.code === 'ECONNABORTED' || err.message?.includes('timeout')
        ? 'Connecting to backend timed out. Render may still be spinning up from idle.'
        : err?.response?.data?.message || err?.message || 'Failed to load audit logs';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <header className="admin-header">
        <h1 className="page-title">Administrative Audit Logs</h1>
      </header>

      <div className="admin-body">
        {loading || error ? (
          <PageLoader
            title="Audit Logs"
            message="Loading administrative activity history and security events..."
            error={error}
            onRetry={loadLogs}
          />
        ) : (
          <div className="data-card">
          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Timestamp</th>
                  <th>Action</th>
                  <th>Entity Type</th>
                  <th>Target ID</th>
                  <th>Operator</th>
                  <th>Client IP</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <tr key={log.id}>
                    <td>{new Date(log.createdAt).toLocaleString()}</td>
                    <td>
                      <span className="badge" style={{ backgroundColor: '#FAF4EB', color: 'var(--admin-burgundy)' }}>
                        {log.action}
                      </span>
                    </td>
                    <td><strong>{log.entityType}</strong></td>
                    <td style={{ fontSize: '0.78rem', color: '#666' }}>{log.entityId || '—'}</td>
                    <td>{log.adminUser?.email || 'System'}</td>
                    <td>{log.ipAddress || '—'}</td>
                  </tr>
                ))}

                {logs.length === 0 && (
                  <tr>
                    <td colSpan={6} style={{ textAlign: 'center', padding: '2.5rem', color: '#888' }}>
                      No audit events recorded yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        )}
      </div>
    </>
  );
};
