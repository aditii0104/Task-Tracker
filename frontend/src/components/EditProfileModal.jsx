import { useState } from "react";

const EditProfileModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({ name: "", email: "" });

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h3>Edit Profile</h3>
        <input 
          type="text" 
          placeholder="New Name" 
          value={formData.name} 
          onChange={(e) => setFormData({...formData, name: e.target.value})} 
        />
        <div className="modal-actions">
          <button onClick={onClose} className="btn-ghost">Cancel</button>
          <button className="btn-primary">Save Changes</button>
        </div>
      </div>
    </div>
  );
};

export default EditProfileModal;