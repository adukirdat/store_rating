import PasswordUpdateForm from '../../components/auth/PasswordUpdateForm.jsx';
import Card from '../../components/common/Card.jsx';
import PageContainer from '../../components/layout/PageContainer.jsx';

function UpdatePasswordPage() {
  return <PageContainer><Card className="auth-card"><p className="eyebrow">Account security</p><h1>Update password</h1><p className="auth-card__description">Choose a new password for your account.</p><PasswordUpdateForm /></Card></PageContainer>;
}

export default UpdatePasswordPage;
