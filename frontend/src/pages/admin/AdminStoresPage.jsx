import { useEffect, useState } from 'react';
import { getStores, getUsers } from '../../api/adminApi.js';
import CreateStoreForm from '../../components/admin/CreateStoreForm.jsx';
import { formatRating, getApiMessage } from '../../components/admin/adminUtils.js';
import Button from '../../components/common/Button.jsx';
import Card from '../../components/common/Card.jsx';
import EmptyState from '../../components/common/EmptyState.jsx';
import ErrorMessage from '../../components/common/ErrorMessage.jsx';
import Input from '../../components/common/Input.jsx';
import LoadingState from '../../components/common/LoadingState.jsx';
import PageContainer from '../../components/layout/PageContainer.jsx';

function AdminStoresPage() {
  const [stores, setStores] = useState(null); const [owners, setOwners] = useState([]); const [searchInput, setSearchInput] = useState(''); const [search, setSearch] = useState(''); const [sortBy, setSortBy] = useState('name'); const [order, setOrder] = useState('asc'); const [error, setError] = useState(''); const [success, setSuccess] = useState('');
  const loadStores = async () => { setError(''); setStores(null); try { const data = await getStores({ ...(search && { search }), sortBy, order }); setStores(data.stores); } catch (requestError) { setError(getApiMessage(requestError)); setStores([]); } };
  useEffect(() => { loadStores(); }, [search, sortBy, order]);
  useEffect(() => { getUsers({ role: 'STORE_OWNER', sortBy: 'name', order: 'asc' }).then((data) => setOwners(data.users)).catch(() => setOwners([])); }, []);
  const applySearch = (event) => { event.preventDefault(); setSearch(searchInput.trim()); };
  const created = (message) => { setSuccess(message); loadStores(); };
  return <PageContainer><section className="page-heading"><p className="eyebrow">Administration</p><h1>Stores</h1><p>Review stores and assign a Store Owner when creating one.</p></section><Card className="admin-section"><details><summary>Create store</summary><CreateStoreForm owners={owners} onCreated={created} /></details></Card>{success && <p className="message message--success" role="status">{success}</p>}<Card className="admin-section"><form className="admin-controls" onSubmit={applySearch}><Input id="store-search" label="Search stores" value={searchInput} onChange={(event) => setSearchInput(event.target.value)} placeholder="Name, email, or address" /><Button type="submit">Search</Button><label className="field" htmlFor="store-sort"><span className="field__label">Sort by</span><select id="store-sort" className="field__control" value={sortBy} onChange={(event) => setSortBy(event.target.value)}><option value="name">Name</option><option value="email">Email</option><option value="address">Address</option></select></label><label className="field" htmlFor="store-order"><span className="field__label">Order</span><select id="store-order" className="field__control" value={order} onChange={(event) => setOrder(event.target.value)}><option value="asc">Ascending</option><option value="desc">Descending</option></select></label></form></Card><ErrorMessage message={error} />{stores === null && <LoadingState label="Loading stores…" />}{stores?.length === 0 && !error && <EmptyState title="No stores found" message="Try changing the search or sorting options." />}{stores?.length > 0 && <div className="table-wrap"><table><thead><tr><th>Store name</th><th>Email</th><th>Address</th><th>Overall rating</th></tr></thead><tbody>{stores.map((store) => <tr key={store.id}><td>{store.name}</td><td>{store.email}</td><td>{store.address}</td><td>{formatRating(store.overallRating)}</td></tr>)}</tbody></table></div>}</PageContainer>;
}
export default AdminStoresPage;
