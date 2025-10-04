import React from "react";
import { useNavigate } from "react-router-dom";

const Sidebar = ({ onClose, isOpen }) => {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("user1Token");
    navigate("/");
    window.location.reload();
    onClose();
  };

  const menuItems = [
    {
      label: "Home",
      path: "/",
      icon: "M240-200h120v-240h240v240h120v-360L480-740 240-560v360Zm-80 80v-480l320-240 320 240v480H520v-240h-80v240H160Zm320-350Z"
    },
    {
      label: "Profile",
      path: "/profile",
      icon: "M234-276q51-39 114-61.5T480-360q69 0 132 22.5T726-276q35-41 54.5-93T800-480q0-133-93.5-226.5T480-800q-133 0-226.5 93.5T160-480q0 59 19.5 111t54.5 93Zm246-164q-59 0-99.5-40.5T340-580q0-59 40.5-99.5T480-720q59 0 99.5 40.5T620-580q0 59-40.5 99.5T480-440Zm0 360q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q53 0 100-15.5t86-44.5q-39-29-86-44.5T480-280q-53 0-100 15.5T294-220q39 29 86 44.5T480-160Zm0-360q26 0 43-17t17-43q0-26-17-43t-43-17q-26 0-43 17t-17 43q0 26 17 43t43 17Zm0-60Zm0 360Z"
    },
    {
      label: "Class Rooms",
      path: "/attendance-rooms",
      icon: "M320-320h480v-480h-80v280l-100-60-100 60v-280H320v480Zm0 80q-33 0-56.5-23.5T240-320v-480q0-33 23.5-56.5T320-880h480q33 0 56.5 23.5T880-800v480q0 33-23.5 56.5T800-240H320ZM160-80q-33 0-56.5-23.5T80-160v-560h80v560h560v80H160Zm360-720h200-200Zm-200 0h480-480Z"
    },
    {
      label: "History Attendance",
      path: "/history-attendance",
      icon: "M200-80q-33 0-56.5-23.5T120-160v-560q0-33 23.5-56.5T200-800h40v-80h80v80h320v-80h80v80h40q33 0 56.5 23.5T840-720v560q0 33-23.5 56.5T760-80H200Zm0-80h560v-400H200v400Zm0-480h560v-80H200v80Zm0 0v-80 80Zm280 240q-17 0-28.5-11.5T440-440q0-17 11.5-28.5T480-480q17 0 28.5 11.5T520-440q0 17-11.5 28.5T480-400Zm-160 0q-17 0-28.5-11.5T280-440q0-17 11.5-28.5T320-480q17 0 28.5 11.5T360-440q0 17-11.5 28.5T320-400Zm320 0q-17 0-28.5-11.5T600-440q0-17 11.5-28.5T640-480q17 0 28.5 11.5T680-440q0 17-11.5 28.5T640-400ZM480-240q-17 0-28.5-11.5T440-280q0-17 11.5-28.5T480-320q17 0 28.5 11.5T520-280q0 17-11.5 28.5T480-240Zm-160 0q-17 0-28.5-11.5T280-280q0-17 11.5-28.5T320-320q17 0 28.5 11.5T360-280q0 17-11.5 28.5T320-240Zm320 0q-17 0-28.5-11.5T600-280q0-17 11.5-28.5T640-320q17 0 28.5 11.5T680-280q0 17-11.5 28.5T640-240Z"
    },
    {
      label: "Notifications",
      path: "/notifications",
      icon: "M480-220q25 0 42.5-17.5T540-280H420q0 25 17.5 42.5T480-220ZM280-320h400v-80h-40v-104q0-61-31.5-111.5T520-680v-20q0-17-11.5-28.5T480-740q-17 0-28.5 11.5T440-700v20q-57 14-88.5 64.5T320-504v104h-40v80Zm120-80v-120q0-33 23.5-56.5T480-600q33 0 56.5 23.5T560-520v120H400Zm80 320q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"
    },
    {
      label: "About Us",
      path: "/about",
      icon: "M480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q54-75 84-158t30-182q0-99-30-182t-84-158q-54 75-84 158T366-480q0 99 30 182t84 158Zm0-280q25 0 42.5-17.5T540-500q0-25-17.5-42.5T480-560q-25 0-42.5 17.5T420-500q0 25 17.5 42.5T480-440Zm0 40q-42 0-71-29t-29-71q0-42 29-71t71-29q42 0 71 29t29 71q0 42-29 71t-71 29Zm0 280q131 0 225.5-94.5T800-480q0-131-94.5-225.5T480-800q-131 0-225.5 94.5T160-480q0 131 94.5 225.5T480-160Z"
    }
  ];

  const handleNavigation = (path) => {
    navigate(path);
    onClose();
  };

  return (
    <div
      className={`fixed top-0 right-0 h-full w-3/4 sm:w-80 bg-white shadow-2xl p-6 border-l border-gray-200 
        transform transition-transform duration-300 ease-in-out 
        ${isOpen ? "translate-x-0" : "translate-x-full"} z-[10000]`}
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-200">
        <h2 className="text-2xl font-bold text-blue-600">AuraCheck</h2>
        <button
          className="cursor-pointer p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors duration-300"
          onClick={onClose}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="24px"
            viewBox="0 -960 960 960"
            width="24px"
            fill="#4b5563"
          >
            <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
          </svg>
        </button>
      </div>

      {/* Navigation Menu */}
      <nav className="space-y-2">
        {menuItems.map((item) => (
          <div
            key={item.path}
            onClick={() => handleNavigation(item.path)}
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-blue-50 transition-all duration-300 cursor-pointer group"
          >
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors duration-300">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                height="20px" 
                viewBox="0 -960 960 960" 
                width="20px" 
                fill="#2563eb"
                className="flex-shrink-0"
              >
                <path d={item.icon}/>
              </svg>
            </div>
            <span className="text-gray-700 font-medium group-hover:text-blue-600 transition-colors duration-300">
              {item.label}
            </span>
          </div>
        ))}
      </nav>

      {/* Logout Section */}
      <div className="absolute bottom-6 left-6 right-6">
        <div className="pt-4 border-t border-gray-200">
          <button
            onClick={logout}
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-red-50 transition-all duration-300 cursor-pointer group w-full"
          >
            <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center group-hover:bg-red-200 transition-colors duration-300">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                height="20px" 
                viewBox="0 -960 960 960" 
                width="20px" 
                fill="#dc2626"
              >
                <path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h280v80H200v560h280v80H200Zm440-160-55-58 102-102H360v-80h327L585-622l55-58 200 200-200 200Z"/>
              </svg>
            </div>
            <span className="text-gray-700 font-medium group-hover:text-red-600 transition-colors duration-300">
              Logout
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;






// import React from "react";
// import { assets } from "../../assets/assets";
// import { useNavigate } from "react-router-dom";

// const Sidebar = ({ onClose, isOpen }) => {
//   const navigate = useNavigate();

//   const logout = () => {
//     localStorage.removeItem("user1Token");
//     navigate("/");
//     window.location.reload();
//     onClose();
//   };

//   return (
//     <div
//       className={`fixed top-0 right-0 h-full w-3/4 sm:w-80 bg-gray-900 shadow-2xl p-6 border-l border-gray-700 
//         transform transition-transform duration-300 ease-in-out 
//         ${isOpen ? "translate-x-0" : "translate-x-full"} z-[10000]`}
//     >
//       {/* Close Button */}
//       <div className="flex justify-end mb-8">
//         <div
//           className="cursor-pointer p-2 bg-gray-800 hover:bg-gray-700 rounded-full transition-colors duration-300"
//           onClick={onClose}
//         >
//           <svg
//             xmlns="http://www.w3.org/2000/svg"
//             height="24px"
//             viewBox="0 -960 960 960"
//             width="24px"
//             fill="#ffffff"
//           >
//             <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
//           </svg>
//         </div>
//       </div>

//       {/* Sidebar Menu Items */}
//       <ul className="space-y-4">
//         <li
//           onClick={() => {
//             navigate("/profile");
//             onClose();
//           }}
//           className="flex items-center gap-3 p-4 bg-gray-800 rounded-lg hover:bg-blue-900/50 transition-all duration-300 cursor-pointer border border-gray-700"
//         >
//           {/* <img src={assets.user_icon} alt="User" className="w-6" /> */}
//           <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#3653fbff"><path d="M234-276q51-39 114-61.5T480-360q69 0 132 22.5T726-276q35-41 54.5-93T800-480q0-133-93.5-226.5T480-800q-133 0-226.5 93.5T160-480q0 59 19.5 111t54.5 93Zm246-164q-59 0-99.5-40.5T340-580q0-59 40.5-99.5T480-720q59 0 99.5 40.5T620-580q0 59-40.5 99.5T480-440Zm0 360q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q53 0 100-15.5t86-44.5q-39-29-86-44.5T480-280q-53 0-100 15.5T294-220q39 29 86 44.5T480-160Zm0-360q26 0 43-17t17-43q0-26-17-43t-43-17q-26 0-43 17t-17 43q0 26 17 43t43 17Zm0-60Zm0 360Z"/></svg>
//           <span className="text-white">Profile</span>
//         </li>
          
//         <li
//           onClick={() => {
//             navigate("/about");
//             onClose();
//           }}
//           className="flex items-center gap-3 p-4 bg-gray-800 rounded-lg hover:bg-blue-900/50 transition-all duration-300 cursor-pointer border border-gray-700"
//         >
//           <span className="text-white">About Us</span>
//         </li>

//         <li
//           onClick={logout}
//           className="flex items-center gap-3 p-4 bg-gray-800 rounded-lg hover:bg-blue-900/50 transition-all duration-300 cursor-pointer border border-gray-700"
//         >
//           {/* <img src={assets.logout_icon} alt="Logout" className="w-6" /> */}
//           <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#3653fbff"><path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h280v80H200v560h280v80H200Zm440-160-55-58 102-102H360v-80h327L585-622l55-58 200 200-200 200Z"/></svg>
//           <span className="text-white">Logout</span>
//         </li>
//       </ul>
//     </div>
//   );
// };

// export default Sidebar;
