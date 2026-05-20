import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface LocationState {
  from?: {
    pathname: string;
  };
}

export function LoginPage() {
  const { isAuthenticated, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('student@mergington.edu');
  const [password, setPassword] = useState('Pass123!');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!email.trim() || password.trim().length < 6) {
      setError('Enter a valid email and a password with at least 6 characters.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await login({ email, password });
      const destination = (location.state as LocationState | null)?.from?.pathname ?? '/dashboard';
      navigate(destination, { replace: true });
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Unable to sign in.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="auth-card">
      <div>
        <p className="eyebrow">Mock login</p>
        <h1>Welcome back</h1>
        <p className="muted">Use the seeded demo account to explore the app.</p>
      </div>

      <form className="form-grid" onSubmit={handleSubmit}>
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
          {loading ? 'Signing in...' : 'Sign in'}
        </button>
      </form>

      <p className="helper-text">
        Need an account? <Link to="/register">Create one</Link>
      </p>
    </section>
  );
}
