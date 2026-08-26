function LoadingState({ label = 'Loading…' }) {
  return <div className="state-page" aria-live="polite"><p>{label}</p></div>;
}

export default LoadingState;
