import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getUserById } from '../../api/adminApi.js';
import { formatRating, formatRole, getApiMessage } from '../../components/admin/adminUtils.js';
import Card from '../../components/common/Card.jsx';
import EmptyState from '../../components/common/EmptyState.jsx';
import ErrorMessage from '../../components/common/ErrorMessage.jsx';
import LoadingState from '../../components/common/LoadingState.jsx';
import PageContainer from '../../components/layout/PageContainer.jsx';

function AdminUserDetailsPage() {
  const { userId } = useParams(); const [user, setUser] = useState(null); const [error, setError] = useState(''); const [notFound, setNotFound] = useState(false);
  useEffect(() => { const load = async () => { try { const data = await getUserById(userId); setUser(data.user); } catch (requestError) { if (requestError.status === 404) setNotFound(true); else setError(getApiMessage(requestError)); } }; load(); }, [userId]);
  if (!user && !error && !notFound) return <LoadingState label="Loading user details…" />;
  return <PageContainer><Link className="text-link" to="/admin/users">← Back to users</Link><section className="page-heading"><p className="eyebrow">Administration</p><h1>User details</h1></section>{notFound && <EmptyState title="User not found" message="The requested user may no longer exist." />}{error && <ErrorMessage message={error} />}{user && <><Card className="detail-card"><dl><div><dt>Name</dt><dd>{user.name}</dd></div><div><dt>Email</dt><dd>{user.email}</dd></div><div><dt>Address</dt><dd>{user.address}</dd></div><div><dt>Role</dt><dd>{formatRole(user.role)}</dd></div></dl></Card>{user.role === 'STORE_OWNER' && (user.store ? <Card className="detail-card"><h2>Assigned store</h2><dl><div><dt>Store name</dt><dd>{user.store.name}</dd></div><div><dt>Average rating</dt><dd>{formatRating(user.store.averageRating)}</dd></div></dl></Card> : <EmptyState title="No assigned store" message="This Store Owner does not have a store assigned." />)}</>}</PageContainer>;
}
export default AdminUserDetailsPage;
