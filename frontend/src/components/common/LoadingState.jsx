function LoadingState({ label = 'Loading…' }) {
  return <main className="state-page" aria-live="polite"><p>{label}</p></main>;
}

export default LoadingState;
