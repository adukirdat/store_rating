import { useState } from 'react';
import { Link } from 'react-router-dom';
import { signup } from '../../api/authApi.js';
import Button from '../common/Button.jsx';
import ErrorMessage from '../common/ErrorMessage.jsx';
import Input from '../common/Input.jsx';
import { getApiErrors, hasErrors, validateSignup } from './authFormUtils.js';

const initialValues = { name: '', email: '', password: '', address: '' };

function SignupForm() {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccessful, setIsSuccessful] = useState(false);
  const updateValue = (event) => setValues((current) => ({ ...current, [event.target.name]: event.target.value }));

  const handleSubmit = async (event) => {
    event.preventDefault();
    const validation = validateSignup(values);
    if (hasErrors(validation)) { setErrors(validation); return; }
    setErrors({}); setFormError(''); setIsSubmitting(true);
    try {
      await signup(values);
      setIsSuccessful(true);
      setValues(initialValues);
    } catch (error) {
      const apiErrors = getApiErrors(error, 'signup');
      setErrors(apiErrors.fields); setFormError(apiErrors.message);
    } finally { setIsSubmitting(false); }
  };

  if (isSuccessful) return <div aria-live="polite"><p className="message message--success">Your account was created successfully. You can now sign in.</p><p className="auth-card__footer"><Link className="text-link" to="/login">Go to sign in</Link></p></div>;

  return <form className="auth-form" onSubmit={handleSubmit} noValidate>
    <ErrorMessage message={formError} />
    <Input id="signup-name" name="name" label="Full name" autoComplete="name" value={values.name} onChange={updateValue} error={errors.name} required />
    <Input id="signup-email" name="email" label="Email address" type="email" autoComplete="email" value={values.email} onChange={updateValue} error={errors.email} required />
    <Input id="signup-password" name="password" label="Password" type="password" autoComplete="new-password" value={values.password} onChange={updateValue} error={errors.password} required />
    <Input id="signup-address" name="address" label="Address" autoComplete="street-address" value={values.address} onChange={updateValue} error={errors.address} required />
    <div className="form-actions"><Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Creating account…' : 'Create account'}</Button></div>
    <p className="auth-card__footer">Already have an account? <Link className="text-link" to="/login">Sign in</Link></p>
  </form>;
}

export default SignupForm;
