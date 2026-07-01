const Toast = ({ toasts }) => {
  if (!toasts.length) return null;

  return (
    <div className="toast-stack">
      {toasts.map((t) => (
        <div key={t.id} className={`toast ${t.type === "error" ? "error" : ""}`}>
          {t.message}
        </div>
      ))}
    </div>
  );
};

export default Toast;
