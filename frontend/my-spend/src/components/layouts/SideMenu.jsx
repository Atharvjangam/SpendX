
import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { SIDE_MENU_DATA } from "../../utils/data"; 
import { UserContext } from "../../context/UserContext";


const SideMenu = ({ activeMenu }) => {
  const { user, clearUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleClick = (route) => {
    if (route === "/logout") {
      handleLogout();
      return;
    }
    navigate(route);
  };

  const handleLogout = () => {
    localStorage.clear();
    clearUser();
    navigate("/login");
  };

  return (
    <div className="side-menu w-64 bg-white min-h-screen p-4 shadow-sm">
      {/* Profile section */}
      <div className="mb-6 flex flex-col items-center">
        {user?.profileImageUrl && (
          <img
            src={user.profileImageUrl}
            alt="Profile"
            className="w-16 h-16 rounded-full mb-2"
          />
        )}
        <h5 className="text-lg font-semibold">{user?.fullName || ""}</h5>
      </div>

      {/* Menu items */}
      {SIDE_MENU_DATA.map((item, index) => (
        <button
          key={`menu_${index}`}
          className={`w-full flex items-center gap-4 text-[15px] ${
            activeMenu === item.label ? "text-white bg-primary" : "hover:bg-purple-100"
          } py-3 px-3 rounded-lg mb-3`}
          onClick={() => handleClick(item.path)}
        >
          <item.icon className="w-5 h-5" />
          {item.label}
        </button>
      ))}
    </div>
  );
};

export default SideMenu;

