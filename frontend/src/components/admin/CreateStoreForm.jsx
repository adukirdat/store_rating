import { useState } from 'react';
import { createStore } from '../../api/adminApi.js';
import Button from '../common/Button.jsx';
import ErrorMessage from '../common/ErrorMessage.jsx';
import Input from '../common/Input.jsx';
import { getApiMessage, getFieldErrors, hasErrors, validateStore } from './adminUtils.js';

const initial = { name: '', email: '', address: '', ownerId: '' };
function CreateStoreForm({ owners, onCreated }) {
  const [values, setValues] = useState(initial); const [errors, setErrors] = useState({}); const [message, setMessage] = useState(''); const [pending, setPending] = useState(false);
  const change = (event) => setValues((current) => ({ ...current, [event.target.name]: event.target.value }));
  const submit = async (event) => { event.preventDefault(); const validation = validateStore(values); if (hasErrors(validation)) { setErrors(validation); return; } setErrors({}); setMessage(''); setPending(true); try { await createStore(values); setValues(initial); onCreated('Store created successfully.'); } catch (error) { setErrors(getFieldErrors(error)); setMessage(getApiMessage(error)); } finally { setPending(false); } };
  if (!owners.length) return <p className="message">No store owners are available. Create or assign a Store Owner through the existing administration process.</p>;
  return <form className="admin-form" onSubmit={submit} noValidate><ErrorMessage message={message} /><Input id="store-name" name="name" label="Store name" value={values.name} onChange={change} error={errors.name} required /><Input id="store-email" name="email" label="Store email" type="email" value={values.email} onChange={change} error={errors.email} required /><Input id="store-address" name="address" label="Store address" autoComplete="street-address" value={values.address} onChange={change} error={errors.address} required /><label className="field" htmlFor="store-owner"><span className="field__label">Store owner</span><select id="store-owner" name="ownerId" className="field__control" value={values.ownerId} onChange={change} aria-invalid={Boolean(errors.ownerId)}><option value="">Select a Store Owner</option>{owners.map((owner) => <option key={owner.id} value={owner.id}>{owner.name} ({owner.email})</option>)}</select>{errors.ownerId && <span className="field__error">{errors.ownerId}</span>}</label><Button type="submit" disabled={pending}>{pending ? 'Creating store…' : 'Create store'}</Button></form>;
}
export default CreateStoreForm;
