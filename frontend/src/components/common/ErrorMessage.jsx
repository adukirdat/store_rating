function ErrorMessage({ message }) {
  return message ? <p className="message message--error" role="alert">{message}</p> : null;
}

export default ErrorMessage;
