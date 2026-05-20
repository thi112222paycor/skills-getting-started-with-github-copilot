import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function RegisterPage() {
  const { isAuthenticated, register } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!name.trim() || !email.trim() || password.trim().length < 6) {
      setError('Provide your name, a valid email, and a password with at least 6 characters.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await register({ name, email, password });
      navigate('/dashboard', { replace: true });
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Unable to register.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="auth-card">
      <div>
        <p className="eyebrow">Mock register</p>
        <h1>Create your account</h1>
        <p className="muted">Registration is stored in the in-memory backend while the API is running.</p>
      </div>

      <form className="form-grid" onSubmit={handleSubmit}>
        <label>
          Name
          <input type="text" value={name} onChange={(event) => setName(event.target.value)} required />
        </label>

        <label>
          Email
          <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
        </label>

        <label>
          Password
          <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} required />
        </label>

        {error && <p className="error-banner">{error}</p>}

        <button disabled={loading} type="submit">
          {loading ? 'Creating account...' : 'Create account'}
        </button>
      </form>

      <p className="helper-text">
        Already have an account? <Link to="/login">Sign in</Link>
      </p>
    </section>
  );
}
