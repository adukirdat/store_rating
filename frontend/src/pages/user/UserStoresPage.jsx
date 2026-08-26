import { useEffect, useState } from 'react';
import { getStores } from '../../api/userApi.js';
import StoreRatingForm from '../../components/user/StoreRatingForm.jsx';
import { formatRating, getUserApiMessage } from '../../components/user/userUtils.js';
import Button from '../../components/common/Button.jsx';
import Card from '../../components/common/Card.jsx';
import EmptyState from '../../components/common/EmptyState.jsx';
import ErrorMessage from '../../components/common/ErrorMessage.jsx';
import Input from '../../components/common/Input.jsx';
import LoadingState from '../../components/common/LoadingState.jsx';
import PageContainer from '../../components/layout/PageContainer.jsx';

function UserStoresPage() {
  const [stores, setStores] = useState(null); const [searchInput, setSearchInput] = useState(''); const [search, setSearch] = useState(''); const [sortBy, setSortBy] = useState('name'); const [order, setOrder] = useState('asc'); const [error, setError] = useState(''); const [success, setSuccess] = useState('');
  const load = async () => { setError(''); try { const data = await getStores({ ...(search && { search }), sortBy, order }); setStores(data.stores); } catch (requestError) { setError(getUserApiMessage(requestError)); setStores([]); } };
  useEffect(() => { setStores(null); load(); }, [search, sortBy, order]);
  const applySearch = (event) => { event.preventDefault(); setSuccess(''); setSearch(searchInput.trim()); };
  const clearSearch = () => { setSearchInput(''); setSearch(''); };
  const rated = (_storeId, message) => { setSuccess(message); load(); };
  return <PageContainer><section className="page-heading"><p className="eyebrow">Discover stores</p><h1>Stores</h1><p>Find a store, see its ratings, and share your experience.</p></section><Card className="user-controls"><form className="store-controls" onSubmit={applySearch}><Input id="store-discovery-search" label="Search stores" value={searchInput} onChange={(event) => setSearchInput(event.target.value)} placeholder="Search by name or address" /><Button type="submit">Search</Button>{search && <Button variant="secondary" onClick={clearSearch}>Clear search</Button>}<label className="field" htmlFor="user-store-sort"><span className="field__label">Sort by</span><select id="user-store-sort" className="field__control" value={sortBy} onChange={(event) => setSortBy(event.target.value)}><option value="name">Name</option><option value="address">Address</option></select></label><label className="field" htmlFor="user-store-order"><span className="field__label">Order</span><select id="user-store-order" className="field__control" value={order} onChange={(event) => setOrder(event.target.value)}><option value="asc">Ascending</option><option value="desc">Descending</option></select></label></form></Card>{success && <p className="message message--success" role="status">{success}</p>}<ErrorMessage message={error} />{stores === null && <LoadingState label="Loading stores…" />}{stores?.length === 0 && !error && <EmptyState title={search ? 'No matching stores' : 'No stores found'} message={search ? 'Try a different search term.' : 'Stores will appear here when available.'} />}{stores?.length > 0 && <section className="store-grid" aria-label="Store listing">{stores.map((store) => <Card key={store.id} className="store-card"><h2>{store.name}</h2><p className="store-card__address">{store.address}</p><dl className="store-ratings"><div><dt>Overall rating</dt><dd>{formatRating(store.overallRating)}</dd></div><div><dt>My rating</dt><dd>{store.userSubmittedRating === null ? 'Not rated' : `${store.userSubmittedRating} / 5`}</dd></div></dl><StoreRatingForm store={store} onRated={rated} /></Card>)}</section>}</PageContainer>;
}

export default UserStoresPage;
