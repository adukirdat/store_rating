import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getUsers } from '../../api/adminApi.js';
import CreateUserForm from '../../components/admin/CreateUserForm.jsx';
import { formatRole, getApiMessage } from '../../components/admin/adminUtils.js';
import Button from '../../components/common/Button.jsx';
import Card from '../../components/common/Card.jsx';
import EmptyState from '../../components/common/EmptyState.jsx';
import ErrorMessage from '../../components/common/ErrorMessage.jsx';
import Input from '../../components/common/Input.jsx';
import LoadingState from '../../components/common/LoadingState.jsx';
import PageContainer from '../../components/layout/PageContainer.jsx';

function AdminUsersPage() {
  const [users, setUsers] = useState(null); const [searchInput, setSearchInput] = useState(''); const [search, setSearch] = useState(''); const [role, setRole] = useState(''); const [sortBy, setSortBy] = useState('name'); const [order, setOrder] = useState('asc'); const [error, setError] = useState(''); const [success, setSuccess] = useState('');
  const load = async () => { setError(''); setUsers(null); try { const data = await getUsers({ ...(search && { search }), ...(role && { role }), sortBy, order }); setUsers(data.users); } catch (requestError) { setError(getApiMessage(requestError)); setUsers([]); } };
  useEffect(() => { load(); }, [search, role, sortBy, order]);
  const applySearch = (event) => { event.preventDefault(); setSearch(searchInput.trim()); };
  const created = (message) => { setSuccess(message); load(); };
  return <PageContainer><section className="page-heading"><p className="eyebrow">Administration</p><h1>Users</h1><p>Search, review, and create application users.</p></section><Card className="admin-section"><details><summary>Create user</summary><CreateUserForm onCreated={created} /></details></Card>{success && <p className="message message--success" role="status">{success}</p>}<Card className="admin-section"><form className="admin-controls" onSubmit={applySearch}><Input id="user-search" label="Search users" value={searchInput} onChange={(event) => setSearchInput(event.target.value)} placeholder="Name, email, or address" /><Button type="submit">Search</Button><label className="field" htmlFor="user-role"><span className="field__label">Role</span><select id="user-role" className="field__control" value={role} onChange={(event) => setRole(event.target.value)}><option value="">All roles</option><option value="ADMIN">Admin</option><option value="NORMAL_USER">Normal User</option><option value="STORE_OWNER">Store Owner</option></select></label><label className="field" htmlFor="user-sort"><span className="field__label">Sort by</span><select id="user-sort" className="field__control" value={sortBy} onChange={(event) => setSortBy(event.target.value)}><option value="name">Name</option><option value="email">Email</option><option value="address">Address</option><option value="role">Role</option></select></label><label className="field" htmlFor="user-order"><span className="field__label">Order</span><select id="user-order" className="field__control" value={order} onChange={(event) => setOrder(event.target.value)}><option value="asc">Ascending</option><option value="desc">Descending</option></select></label></form></Card><ErrorMessage message={error} />{users === null && <LoadingState label="Loading users…" />}{users?.length === 0 && !error && <EmptyState title="No users found" message="Try changing the search or filter." />}{users?.length > 0 && <div className="table-wrap"><table><thead><tr><th>Name</th><th>Email</th><th>Address</th><th>Role</th><th><span className="sr-only">Details</span></th></tr></thead><tbody>{users.map((user) => <tr key={user.id}><td>{user.name}</td><td>{user.email}</td><td>{user.address}</td><td>{formatRole(user.role)}</td><td><Link className="text-link" to={`/admin/users/${user.id}`}>View</Link></td></tr>)}</tbody></table></div>}</PageContainer>;
}
export default AdminUsersPage;
