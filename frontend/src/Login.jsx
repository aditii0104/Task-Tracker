import { useState } from "react";
import { useAuth } from "./context/AuthContext";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const Login = ({ onSuccess, onSwitchToRegister }) => {
  const { login } = useAuth();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  const validate = () => {
    const newErrors = {};
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!EMAIL_REGEX.test(formData.email.trim())) {
      newErrors.email = "Enter a valid email address";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
    if (formError) setFormError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    setFormError("");
    try {
      await login({ email: formData.email.trim(), password: formData.password });
      onSuccess?.();
    } catch (err) {
      setFormError(err.response?.data?.message || "Could not log in. Check your credentials.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="login-page-wrapper">
      {/* Branding Header */}
      <div className="brand-header" style={{ textAlign: 'center', marginBottom: '20px' }}>
        <h1 className="brand-title" style={{ fontSize: '2.5rem', color: '#00d1b2' }}>
          TaskLedger
        </h1>
        <p className="brand-subtitle">Streamline your productivity</p>
      </div>

      {/* Login Panel */}
      <form className="auth-panel" onSubmit={handleSubmit}>
        <h2 className="panel-title">Login</h2>
        
        {formError && <p className="error-msg">{formError}</p>}
        
        <div className="form-field">
          <label>Email</label>
          <input name="email" type="email" value={formData.email} onChange={handleChange} />
          {errors.email && <span className="error-text">{errors.email}</span>}
        </div>
        
        <div className="form-field">
          <label>Password</label>
          <input name="password" type="password" value={formData.password} onChange={handleChange} />
          {errors.password && <span className="error-text">{errors.password}</span>}
        </div>
        
        <button type="submit" className="btn-primary" disabled={submitting}>
          {submitting ? "Logging in..." : "Log in"}
        </button>
        
        <button type="button" onClick={onSwitchToRegister} className="btn-ghost">
          Need an account? Register
        </button>
      </form>
    </div>
  );
};

export default Login;