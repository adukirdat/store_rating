import { useEffect, useState } from 'react';
import { getOwnerDashboard } from '../../api/ownerApi.js';
import { formatAverageRating, getOwnerApiMessage } from '../../components/owner/ownerUtils.js';
import Button from '../../components/common/Button.jsx';
import Card from '../../components/common/Card.jsx';
import EmptyState from '../../components/common/EmptyState.jsx';
import ErrorMessage from '../../components/common/ErrorMessage.jsx';
import LoadingState from '../../components/common/LoadingState.jsx';
import PageContainer from '../../components/layout/PageContainer.jsx';

function OwnerDashboardPage() {
  const [store, setStore] = useState(null); const [error, setError] = useState(''); const [unassigned, setUnassigned] = useState(false);
  const load = async () => { setError(''); setUnassigned(false); try { const data = await getOwnerDashboard(); setStore(data.store); } catch (requestError) { if (requestError.status === 404) setUnassigned(true); else setError(getOwnerApiMessage(requestError)); } };
  useEffect(() => { load(); }, []);
  if (!store && !error && !unassigned) return <LoadingState label="Loading owner dashboard…" />;
  return <PageContainer><section className="page-heading"><p className="eyebrow">Store Owner</p><h1>Dashboard</h1><p>Review your assigned store and its customer ratings.</p></section>{unassigned && <EmptyState title="No store assigned" message="Your account is not currently assigned to a store." />}{error && <><ErrorMessage message={error} /><Button onClick={load}>Try again</Button></>}{store && <><section className="owner-overview"><Card><h2>{store.name}</h2><dl className="owner-store-details"><div><dt>Store email</dt><dd>{store.email}</dd></div><div><dt>Address</dt><dd>{store.address}</dd></div></dl></Card><Card className="owner-average"><p>Average rating</p><strong>{formatAverageRating(store.averageRating)}</strong></Card></section><section className="owner-ratings"><h2>Rating users</h2>{store.ratings.length === 0 ? <EmptyState title="No ratings submitted yet" message="Customer ratings will appear here when submitted." /> : <div className="table-wrap"><table><thead><tr><th>User</th><th>Email</th><th>Address</th><th>Rating</th></tr></thead><tbody>{store.ratings.map(({ user, rating }) => <tr key={user.id}><td>{user.name}</td><td>{user.email}</td><td>{user.address}</td><td>{rating} / 5</td></tr>)}</tbody></table></div>}</section></>}</PageContainer>;
}

export default OwnerDashboardPage;
