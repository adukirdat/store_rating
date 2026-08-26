import SignupForm from '../../components/auth/SignupForm.jsx';
import Card from '../../components/common/Card.jsx';

function SignupPage() {
  return <Card className="auth-card"><p className="eyebrow">Store Rating</p><h1 id="auth-title">Create an account</h1><p className="auth-card__description">New accounts are created as standard user accounts.</p><SignupForm /></Card>;
}

export default SignupPage;
