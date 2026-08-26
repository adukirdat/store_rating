import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login as loginRequest } from '../../api/authApi.js';
import Button from '../common/Button.jsx';
import ErrorMessage from '../common/ErrorMessage.jsx';
import Input from '../common/Input.jsx';
import useAuth from '../../hooks/useAuth.js';
import { getRoleHome } from '../../utils/roleRoutes.js';
import { getApiErrors, hasErrors, validateLogin } from './authFormUtils.js';

const initialValues = { email: '', password: '' };

function LoginForm() {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const updateValue = (event) => setValues((current) => ({ ...current, [event.target.name]: event.target.value }));

  const handleSubmit = async (event) => {
    event.preventDefault();
    const validation = validateLogin(values);
    if (hasErrors(validation)) { setErrors(validation); return; }
    setErrors({}); setFormError(''); setIsSubmitting(true);
    try {
      const session = await loginRequest(values);
      login(session);
      navigate(getRoleHome(session.user.role), { replace: true });
    } catch (error) {
      const apiErrors = getApiErrors(error, 'login');
      setErrors(apiErrors.fields); setFormError(apiErrors.message);
    } finally { setIsSubmitting(false); }
  };

  return <form className="auth-form" onSubmit={handleSubmit} noValidate>
    <ErrorMessage message={formError} />
    <Input id="login-email" name="email" label="Email address" type="email" autoComplete="email" value={values.email} onChange={updateValue} error={errors.email} required />
    <Input id="login-password" name="password" label="Password" type="password" autoComplete="current-password" value={values.password} onChange={updateValue} error={errors.password} required />
    <div className="form-actions"><Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Signing in…' : 'Sign in'}</Button></div>
    <p className="auth-card__footer">Need an account? <Link className="text-link" to="/signup">Create one</Link></p>
  </form>;
}

export default LoginForm;
