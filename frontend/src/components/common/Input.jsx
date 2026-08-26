function Input({ id, label, error, ...props }) {
  return (
    <label className="field" htmlFor={id}>
      {label && <span className="field__label">{label}</span>}
      <input id={id} className="field__control" aria-invalid={Boolean(error)} aria-describedby={error ? `${id}-error` : undefined} {...props} />
      {error && <span id={`${id}-error`} className="field__error">{error}</span>}
    </label>
  );
}

export default Input;
