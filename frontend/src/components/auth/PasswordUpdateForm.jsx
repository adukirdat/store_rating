import { useState } from 'react';
import { updatePassword } from '../../api/authApi.js';
import Button from '../common/Button.jsx';
import ErrorMessage from '../common/ErrorMessage.jsx';
import Input from '../common/Input.jsx';
import { getApiErrors, hasErrors, validatePasswordUpdate } from './authFormUtils.js';

const initialValues = { currentPassword: '', newPassword: '' };

function PasswordUpdateForm() {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccessful, setIsSuccessful] = useState(false);
  const updateValue = (event) => setValues((current) => ({ ...current, [event.target.name]: event.target.value }));

  const handleSubmit = async (event) => {
    event.preventDefault();
    const validation = validatePasswordUpdate(values);
    if (hasErrors(validation)) { setErrors(validation); return; }
    setErrors({}); setFormError(''); setIsSuccessful(false); setIsSubmitting(true);
    try {
      await updatePassword(values);
      setValues(initialValues); setIsSuccessful(true);
    } catch (error) {
      const apiErrors = getApiErrors(error, 'password');
      setErrors(apiErrors.fields); setFormError(apiErrors.message);
    } finally { setIsSubmitting(false); }
  };

  return <form className="auth-form" onSubmit={handleSubmit} noValidate>
    <ErrorMessage message={formError} />
    {isSuccessful && <p className="message message--success" role="status">Password updated successfully.</p>}
    <Input id="current-password" name="currentPassword" label="Current password" type="password" autoComplete="current-password" value={values.currentPassword} onChange={updateValue} error={errors.currentPassword} required />
    <Input id="new-password" name="newPassword" label="New password" type="password" autoComplete="new-password" value={values.newPassword} onChange={updateValue} error={errors.newPassword} required />
    <div className="form-actions"><Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Updating password…' : 'Update password'}</Button></div>
  </form>;
}

export default PasswordUpdateForm;
