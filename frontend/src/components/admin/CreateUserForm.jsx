import { useId, useState } from 'react';
import { createUser } from '../../api/adminApi.js';
import Button from '../common/Button.jsx';
import ErrorMessage from '../common/ErrorMessage.jsx';
import Input from '../common/Input.jsx';
import { getApiMessage, getFieldErrors, hasErrors, validateUser } from './adminUtils.js';

const initial = { name: '', email: '', password: '', address: '', role: 'NORMAL_USER' };
function CreateUserForm({ onCreated }) {
  const [values, setValues] = useState(initial); const [errors, setErrors] = useState({}); const [message, setMessage] = useState(''); const [pending, setPending] = useState(false); const roleErrorId = useId();
  const change = (event) => setValues((current) => ({ ...current, [event.target.name]: event.target.value }));
  const submit = async (event) => { event.preventDefault(); const validation = validateUser(values); if (hasErrors(validation)) { setErrors(validation); return; } setErrors({}); setMessage(''); setPending(true); try { await createUser(values); setValues(initial); onCreated('User created successfully.'); } catch (error) { setErrors(getFieldErrors(error)); setMessage(getApiMessage(error)); } finally { setPending(false); } };
  return <form className="admin-form" onSubmit={submit} noValidate><ErrorMessage message={message} /><Input id="admin-user-name" name="name" label="Full name" autoComplete="name" value={values.name} onChange={change} error={errors.name} required /><Input id="admin-user-email" name="email" label="Email" type="email" autoComplete="email" value={values.email} onChange={change} error={errors.email} required /><Input id="admin-user-password" name="password" label="Password" type="password" autoComplete="new-password" value={values.password} onChange={change} error={errors.password} required /><Input id="admin-user-address" name="address" label="Address" autoComplete="street-address" value={values.address} onChange={change} error={errors.address} required /><label className="field" htmlFor="admin-user-role"><span className="field__label">Role</span><select id="admin-user-role" name="role" className="field__control" value={values.role} onChange={change} aria-invalid={Boolean(errors.role)} aria-describedby={errors.role ? roleErrorId : undefined}><option value="NORMAL_USER">Normal User</option><option value="ADMIN">Admin</option><option value="STORE_OWNER">Store Owner</option></select>{errors.role && <span id={roleErrorId} className="field__error">{errors.role}</span>}</label><Button type="submit" disabled={pending}>{pending ? 'Creating user…' : 'Create user'}</Button></form>;
}
export default CreateUserForm;
