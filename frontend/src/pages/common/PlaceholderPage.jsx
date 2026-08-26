import Card from '../../components/common/Card.jsx';
import PageContainer from '../../components/layout/PageContainer.jsx';

function PlaceholderPage({ title, description }) {
  return (
    <PageContainer>
      <Card className="placeholder-page">
        <p className="eyebrow">Application foundation</p>
        <h1 id="auth-title">{title}</h1>
        <p>{description}</p>
      </Card>
    </PageContainer>
  );
}

export default PlaceholderPage;
