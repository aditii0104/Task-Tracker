import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import EditProfileModal from "./EditProfileModal";

const ProfileButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { logout } = useAuth();
  const [isEditOpen, setIsEditOpen] = useState(false);

  const toggleTheme = () => {
    document.body.classList.toggle("light-theme");
  };

  return (
    <>
      <button className="profile-btn" onClick={() => setIsOpen(true)}>AD</button>

      {isOpen && <div className="overlay" onClick={() => setIsOpen(false)} />}

      <div className={`side-panel ${isOpen ? "open" : ""}`}>
        <div className="panel-content">
          <h3>Menu</h3>
          <button onClick={toggleTheme} className="menu-item">
            Theme: {document.body.classList.contains("light-theme") ? "Light" : "Dark"}
          </button>
          <button className="menu-item" onClick={() => setIsEditOpen(true)}>
            Edit Profile
          </button>
        </div>
        <EditProfileModal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} />
        
        {/* This pushes the logout button to the bottom */}
        <div className="panel-footer">
          <button onClick={logout} className="menu-item logout">
            Logout
          </button>
        </div>
      </div>
    </>
  );
};
export default ProfileButton;