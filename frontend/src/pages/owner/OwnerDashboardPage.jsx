import { useEffect, useRef, useState } from 'react';
import { getOwnerDashboard } from '../../api/ownerApi.js';
import { formatAverageRating, getOwnerApiMessage } from '../../components/owner/ownerUtils.js';
import Button from '../../components/common/Button.jsx';
import Card from '../../components/common/Card.jsx';
import EmptyState from '../../components/common/EmptyState.jsx';
import ErrorMessage from '../../components/common/ErrorMessage.jsx';
import LoadingState from '../../components/common/LoadingState.jsx';
import PageContainer from '../../components/layout/PageContainer.jsx';

function OwnerDashboardPage() {
  const [store, setStore] = useState(null); const [error, setError] = useState(''); const [unassigned, setUnassigned] = useState(false); const [sortBy, setSortBy] = useState('name'); const [order, setOrder] = useState('asc');
  const latestRequest = useRef(0);
  const load = async () => { const requestId = ++latestRequest.current; setError(''); setUnassigned(false); try { const data = await getOwnerDashboard({ sortBy, order }); if (requestId === latestRequest.current) setStore(data.store); } catch (requestError) { if (requestId === latestRequest.current) { if (requestError.status === 404) setUnassigned(true); else setError(getOwnerApiMessage(requestError)); } } };
  useEffect(() => { load(); }, [sortBy, order]);
  if (!store && !error && !unassigned) return <LoadingState label="Loading owner dashboard…" />;
  return <PageContainer><section className="page-heading"><p className="eyebrow">Store Owner</p><h1>Dashboard</h1><p>Review your assigned store and its customer ratings.</p></section>{unassigned && <EmptyState title="No store assigned" message="Your account is not currently assigned to a store." />}{error && <><ErrorMessage message={error} /><Button onClick={load}>Try again</Button></>}{store && <><section className="owner-overview"><Card><h2>{store.name}</h2><dl className="owner-store-details"><div><dt>Store email</dt><dd>{store.email}</dd></div><div><dt>Address</dt><dd>{store.address}</dd></div></dl></Card><Card className="owner-average"><p>Average rating</p><strong>{formatAverageRating(store.averageRating)}</strong></Card></section><section className="owner-ratings"><h2>Rating users</h2>{store.ratings.length === 0 ? <EmptyState title="No ratings submitted yet" message="Customer ratings will appear here when submitted." /> : <><div className="admin-controls"><label className="field" htmlFor="owner-rating-sort"><span className="field__label">Sort by</span><select id="owner-rating-sort" className="field__control" value={sortBy} onChange={(event) => setSortBy(event.target.value)}><option value="name">Name</option><option value="email">Email</option><option value="rating">Rating</option></select></label><label className="field" htmlFor="owner-rating-order"><span className="field__label">Order</span><select id="owner-rating-order" className="field__control" value={order} onChange={(event) => setOrder(event.target.value)}><option value="asc">Ascending</option><option value="desc">Descending</option></select></label></div><div className="table-wrap"><table><thead><tr><th>User</th><th>Email</th><th>Address</th><th>Rating</th></tr></thead><tbody>{store.ratings.map(({ user, rating }) => <tr key={user.id}><td>{user.name}</td><td>{user.email}</td><td>{user.address}</td><td>{rating} / 5</td></tr>)}</tbody></table></div></>}</section></>}</PageContainer>;
}

export default OwnerDashboardPage;
