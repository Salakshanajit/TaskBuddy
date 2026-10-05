import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout.jsx';
import useAuth from '../hooks/useAuth.js';
import { getErrorMessage } from '../utils/helpers.js';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from?.pathname || '/dashboard';

  const [form, setForm] = useState({ email: 'demo@taskbuddy.com', password: 'Demo@123' });
  const [loginMode, setLoginMode] = useState('demo');
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setLoginMode('personal');
    setErrors((prev) => ({ ...prev, [name]: '' }));
    setServerError('');
  };

  const handleUseDemoAccount = () => {
    setForm({ email: 'demo@taskbuddy.com', password: 'Demo@123' });
    setLoginMode('demo');
    setErrors({});
    setServerError('');
  };

  const handleUsePersonalAccount = () => {
    setForm({ email: '', password: '' });
    setLoginMode('personal');
    setErrors({});
    setServerError('');
  };

  const validate = () => {
    const next = {};
    if (!form.email.trim()) next.email = 'Email is required.';
    else if (!EMAIL_REGEX.test(form.email.trim())) next.email = 'Enter a valid email address.';
    if (!form.password) next.password = 'Password is required.';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting || !validate()) return;

    setSubmitting(true);
    setServerError('');
    try {
      await login({ email: form.email.trim(), password: form.password });
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setServerError(getErrorMessage(err, 'Could not log in. Please try again.'));
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout
      title="Log in"
      subtitle="Welcome back. Enter your details to open your tasks."
      footer={<>New to TaskBuddy? <Link to="/register">Create an account</Link></>}
    >
      <div className="login-mode" role="group" aria-label="Choose how to log in">
        <button
          type="button"
          className={`login-mode-option${loginMode === 'demo' ? ' is-active' : ''}`}
          onClick={handleUseDemoAccount}
          aria-pressed={loginMode === 'demo'}
          disabled={submitting}
        >
          Demo account
        </button>
        <button
          type="button"
          className={`login-mode-option${loginMode === 'personal' ? ' is-active' : ''}`}
          onClick={handleUsePersonalAccount}
          aria-pressed={loginMode === 'personal'}
          disabled={submitting}
        >
          My account
        </button>
      </div>
      {loginMode === 'demo' && (
        <p className="login-mode-note">Demo credentials are ready to use. Shared demo data may be changed by visitors.</p>
      )}

      <form onSubmit={handleSubmit} noValidate className="form">
        {serverError && <div className="alert alert-error" role="alert">{serverError}</div>}

        <div className="field">
          <label htmlFor="email">Email</label>
          <input id="email" name="email" type="email" autoComplete="email" value={form.email} onChange={handleChange} placeholder="you@example.com" />
          {errors.email && <span className="field-error">{errors.email}</span>}
        </div>

        <div className="field">
          <label htmlFor="password">Password</label>
          <input id="password" name="password" type="password" autoComplete="current-password" value={form.password} onChange={handleChange} placeholder="Your password" />
          {errors.password && <span className="field-error">{errors.password}</span>}
        </div>

        <button type="submit" className="btn btn-primary btn-block" disabled={submitting}>
          {submitting ? 'Logging in…' : 'Log in'}
        </button>
      </form>
    </AuthLayout>
  );
}
