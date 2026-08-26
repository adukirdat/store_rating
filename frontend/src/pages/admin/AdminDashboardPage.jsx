import { useEffect, useState } from 'react';
import { getDashboardStats } from '../../api/adminApi.js';
import Button from '../../components/common/Button.jsx';
import Card from '../../components/common/Card.jsx';
import ErrorMessage from '../../components/common/ErrorMessage.jsx';
import LoadingState from '../../components/common/LoadingState.jsx';
import PageContainer from '../../components/layout/PageContainer.jsx';
import { getApiMessage } from '../../components/admin/adminUtils.js';

function AdminDashboardPage() {
  const [stats, setStats] = useState(null); const [error, setError] = useState('');
  const load = async () => { setError(''); try { setStats(await getDashboardStats()); } catch (requestError) { setError(getApiMessage(requestError)); } };
  useEffect(() => { load(); }, []);
  if (!stats && !error) return <LoadingState label="Loading dashboard…" />;
  return <PageContainer><section className="page-heading"><p className="eyebrow">Administration</p><h1>Dashboard</h1><p>Live overview of the Store Rating application.</p></section><ErrorMessage message={error} />{error && <Button onClick={load}>Try again</Button>}{stats && <section className="metric-grid" aria-label="Dashboard statistics">{[['Total Users', stats.totalUsers], ['Total Stores', stats.totalStores], ['Total Ratings', stats.totalRatings]].map(([label, value]) => <Card key={label} className="metric-card"><p>{label}</p><strong>{value}</strong></Card>)}</section>}</PageContainer>;
}
export default AdminDashboardPage;
