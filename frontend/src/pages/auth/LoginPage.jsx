import LoginForm from '../../components/auth/LoginForm.jsx';
import Card from '../../components/common/Card.jsx';

function LoginPage() {
  return <Card className="auth-card"><p className="eyebrow">Store Rating</p><h1 id="auth-title">Sign in</h1><p className="auth-card__description">Use your account details to continue.</p><LoginForm /></Card>;
}

export default LoginPage;
