import React from "react";
import { Link, useLocation } from "react-router-dom";

const BottomBar = () => {
  const location = useLocation();

  const navItems = [
    {
      path: "/",
      label: "Home",
      icon: "M240-200h120v-240h240v240h120v-360L480-740 240-560v360Zm-80 80v-480l320-240 320 240v480H520v-240h-80v240H160Zm320-350Z"
    },
    {
      path: "/profile",
      label: "Profile",
      icon: "M234-276q51-39 114-61.5T480-360q69 0 132 22.5T726-276q35-41 54.5-93T800-480q0-133-93.5-226.5T480-800q-133 0-226.5 93.5T160-480q0 59 19.5 111t54.5 93Zm246-164q-59 0-99.5-40.5T340-580q0-59 40.5-99.5T480-720q59 0 99.5 40.5T620-580q0 59-40.5 99.5T480-440Zm0 360q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q53 0 100-15.5t86-44.5q-39-29-86-44.5T480-280q-53 0-100 15.5T294-220q39 29 86 44.5T480-160Zm0-360q26 0 43-17t17-43q0-26-17-43t-43-17q-26 0-43 17t-17 43q0 26 17 43t43 17Zm0-60Zm0 360Z"
    },
    {
      path: "/notifications",
      label: "Notification",
      icon: "M480-220q25 0 42.5-17.5T540-280H420q0 25 17.5 42.5T480-220ZM280-320h400v-80h-40v-104q0-61-31.5-111.5T520-680v-20q0-17-11.5-28.5T480-740q-17 0-28.5 11.5T440-700v20q-57 14-88.5 64.5T320-504v104h-40v80Zm120-80v-120q0-33 23.5-56.5T480-600q33 0 56.5 23.5T560-520v120H400Zm80 320q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"
    },
    {
      path: "/history-attendance",
      label: "History",
      icon: "M200-80q-33 0-56.5-23.5T120-160v-560q0-33 23.5-56.5T200-800h40v-80h80v80h320v-80h80v80h40q33 0 56.5 23.5T840-720v560q0 33-23.5 56.5T760-80H200Zm0-80h560v-400H200v400Zm0-480h560v-80H200v80Zm0 0v-80 80Zm280 240q-17 0-28.5-11.5T440-440q0-17 11.5-28.5T480-480q17 0 28.5 11.5T520-440q0 17-11.5 28.5T480-400Zm-160 0q-17 0-28.5-11.5T280-440q0-17 11.5-28.5T320-480q17 0 28.5 11.5T360-440q0 17-11.5 28.5T320-400Zm320 0q-17 0-28.5-11.5T600-440q0-17 11.5-28.5T640-480q17 0 28.5 11.5T680-440q0 17-11.5 28.5T640-400ZM480-240q-17 0-28.5-11.5T440-280q0-17 11.5-28.5T480-320q17 0 28.5 11.5T520-280q0 17-11.5 28.5T480-240Zm-160 0q-17 0-28.5-11.5T280-280q0-17 11.5-28.5T320-320q17 0 28.5 11.5T360-280q0 17-11.5 28.5T320-240Zm320 0q-17 0-28.5-11.5T600-280q0-17 11.5-28.5T640-320q17 0 28.5 11.5T680-280q0 17-11.5 28.5T640-240Z"
    }
  ];

  // Mobile view - bottom navigation
  const MobileBottomBar = () => (
    <div className="lg:hidden fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 shadow-lg z-40">
      <div className="bottombar__container flex justify-around items-center py-3 px-4">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`bottombar__container__item flex flex-col items-center gap-1 p-2 rounded-lg transition-all duration-300 ${
              location.pathname === item.path 
                ? "text-blue-600 bg-blue-50" 
                : "text-gray-600 hover:text-blue-600 hover:bg-gray-50"
            }`}
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              height="24px" 
              viewBox="0 -960 960 960" 
              width="24px" 
              fill="currentColor"
            >
              <path d={item.icon}/>
            </svg>
            <p className="text-xs font-medium">{item.label}</p>
          </Link>
        ))}
      </div>
    </div>
  );

  // Desktop view - horizontal navigation bar
  const DesktopBottomBar = () => (
    <div className="hidden lg:block fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-white/95 backdrop-blur-sm border border-gray-200 rounded-2xl shadow-xl z-40">
      <div className="flex items-center gap-8 py-3 px-6">
        {/* Logo */}
        

        {/* Navigation Links - Same items as mobile */}
        <div className="flex items-center gap-6">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                location.pathname === item.path 
                  ? "text-blue-600 bg-blue-50" 
                  : "text-gray-600 hover:text-blue-600 hover:bg-gray-50"
              }`}
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                height="20px" 
                viewBox="0 -960 960 960" 
                width="20px" 
                fill="currentColor"
              >
                <path d={item.icon}/>
              </svg>
              <span className="text-sm font-medium">{item.label}</span>
            </Link>
          ))}
        </div>

        
      </div>
    </div>
  );

  return (
    <>
      <MobileBottomBar />
      <DesktopBottomBar />
    </>
  );
};

export default BottomBar;






// import React from "react";
// import { Link, useLocation } from "react-router-dom";

// const BottomBar = () => {
//   const location = useLocation();

//   return (
//     <div className="bottombar fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 shadow-lg z-40">
//       <div className="bottombar__container flex justify-around items-center py-3 px-4">
//         <Link
//           className={`bottombar__container__item flex flex-col items-center gap-1 p-2 rounded-lg transition-all duration-300 ${
//             location.pathname === "/" 
//               ? "text-blue-600 bg-blue-50" 
//               : "text-gray-600 hover:text-blue-600 hover:bg-gray-50"
//           }`}
//           to="/"
//         >
//           <svg 
//             xmlns="http://www.w3.org/2000/svg" 
//             height="24px" 
//             viewBox="0 -960 960 960" 
//             width="24px" 
//             fill="currentColor"
//           >
//             <path d="M240-200h120v-240h240v240h120v-360L480-740 240-560v360Zm-80 80v-480l320-240 320 240v480H520v-240h-80v240H160Zm320-350Z"/>
//           </svg>
//           <p className="text-xs font-medium">Home</p>
//         </Link>

//         <Link
//           className={`bottombar__container__item flex flex-col items-center gap-1 p-2 rounded-lg transition-all duration-300 ${
//             location.pathname === "/profile" 
//               ? "text-blue-600 bg-blue-50" 
//               : "text-gray-600 hover:text-blue-600 hover:bg-gray-50"
//           }`}
//           to="/profile"
//         >
//           <svg 
//             xmlns="http://www.w3.org/2000/svg" 
//             height="24px" 
//             viewBox="0 -960 960 960" 
//             width="24px" 
//             fill="currentColor"
//           >
//             <path d="M234-276q51-39 114-61.5T480-360q69 0 132 22.5T726-276q35-41 54.5-93T800-480q0-133-93.5-226.5T480-800q-133 0-226.5 93.5T160-480q0 59 19.5 111t54.5 93Zm246-164q-59 0-99.5-40.5T340-580q0-59 40.5-99.5T480-720q59 0 99.5 40.5T620-580q0 59-40.5 99.5T480-440Zm0 360q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q53 0 100-15.5t86-44.5q-39-29-86-44.5T480-280q-53 0-100 15.5T294-220q39 29 86 44.5T480-160Zm0-360q26 0 43-17t17-43q0-26-17-43t-43-17q-26 0-43 17t-17 43q0 26 17 43t43 17Zm0-60Zm0 360Z"/>
//           </svg>
//           <p className="text-xs font-medium">Profile</p>
//         </Link>
          
//         <Link
//           className={`bottombar__container__item flex flex-col items-center gap-1 p-2 rounded-lg transition-all duration-300 ${
//             location.pathname === "/notifications" 
//               ? "text-blue-600 bg-blue-50" 
//               : "text-gray-600 hover:text-blue-600 hover:bg-gray-50"
//           }`}
//           to="/notifications"
//         >
//           <svg 
//             xmlns="http://www.w3.org/2000/svg" 
//             height="24px" 
//             viewBox="0 -960 960 960" 
//             width="24px" 
//             fill="currentColor"
//           >
//             <path d="M480-220q25 0 42.5-17.5T540-280H420q0 25 17.5 42.5T480-220ZM280-320h400v-80h-40v-104q0-61-31.5-111.5T520-680v-20q0-17-11.5-28.5T480-740q-17 0-28.5 11.5T440-700v20q-57 14-88.5 64.5T320-504v104h-40v80Zm120-80v-120q0-33 23.5-56.5T480-600q33 0 56.5 23.5T560-520v120H400Zm80 320q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"/>
//           </svg>
//           <p className="text-xs font-medium">Notification</p>
//         </Link>

//         <Link
//           className={`bottombar__container__item flex flex-col items-center gap-1 p-2 rounded-lg transition-all duration-300 ${
//             location.pathname === "/history-attendance" 
//               ? "text-blue-600 bg-blue-50" 
//               : "text-gray-600 hover:text-blue-600 hover:bg-gray-50"
//           }`}
//           to="/history-attendance"
//         >
//           <svg 
//             xmlns="http://www.w3.org/2000/svg" 
//             height="24px" 
//             viewBox="0 -960 960 960" 
//             width="24px" 
//             fill="currentColor"
//           >
//             <path d="M200-80q-33 0-56.5-23.5T120-160v-560q0-33 23.5-56.5T200-800h40v-80h80v80h320v-80h80v80h40q33 0 56.5 23.5T840-720v560q0 33-23.5 56.5T760-80H200Zm0-80h560v-400H200v400Zm0-480h560v-80H200v80Zm0 0v-80 80Zm280 240q-17 0-28.5-11.5T440-440q0-17 11.5-28.5T480-480q17 0 28.5 11.5T520-440q0 17-11.5 28.5T480-400Zm-160 0q-17 0-28.5-11.5T280-440q0-17 11.5-28.5T320-480q17 0 28.5 11.5T360-440q0 17-11.5 28.5T320-400Zm320 0q-17 0-28.5-11.5T600-440q0-17 11.5-28.5T640-480q17 0 28.5 11.5T680-440q0 17-11.5 28.5T640-400ZM480-240q-17 0-28.5-11.5T440-280q0-17 11.5-28.5T480-320q17 0 28.5 11.5T520-280q0 17-11.5 28.5T480-240Zm-160 0q-17 0-28.5-11.5T280-280q0-17 11.5-28.5T320-320q17 0 28.5 11.5T360-280q0 17-11.5 28.5T320-240Zm320 0q-17 0-28.5-11.5T600-280q0-17 11.5-28.5T640-320q17 0 28.5 11.5T680-280q0 17-11.5 28.5T640-240Z"/>
//           </svg>
//           <p className="text-xs font-medium">History</p>
//         </Link>
//       </div>
//     </div>
//   );
// };

// export default BottomBar;








// import React from "react";
// import "./BottomBar.css";
// import { Link, useLocation } from "react-router-dom";
// import { assets } from "../../assets/assets";
// // import { StoreContext } from "../context/StoreContext";
// // import { useContext } from "react";
// const BottomBar = () => {
// //   const { getTotalCartQuantity, getTotalCartAmount } = useContext(StoreContext);
//   const location = useLocation();

//   return (
//     <div className="bottombar">
//       <div className="bottombar__container">
//         <Link
//           className={`bottombar__container__item ${
//             location.pathname === "/" ? "active" : ""
//           }`}
//           to="/"
//         >
//           <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#3C3C3C"><path d="M240-200h120v-240h240v240h120v-360L480-740 240-560v360Zm-80 80v-480l320-240 320 240v480H520v-240h-80v240H160Zm320-350Z"/></svg>
//           <p>Home</p>
//         </Link>

//         <Link
//           className={`bottombar__container__item ${
//             location.pathname === "/profile" ? "active" : ""
//           }`}
//           to="/profile"
//         >
//           <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#3C3C3C"><path d="M234-276q51-39 114-61.5T480-360q69 0 132 22.5T726-276q35-41 54.5-93T800-480q0-133-93.5-226.5T480-800q-133 0-226.5 93.5T160-480q0 59 19.5 111t54.5 93Zm246-164q-59 0-99.5-40.5T340-580q0-59 40.5-99.5T480-720q59 0 99.5 40.5T620-580q0 59-40.5 99.5T480-440Zm0 360q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q53 0 100-15.5t86-44.5q-39-29-86-44.5T480-280q-53 0-100 15.5T294-220q39 29 86 44.5T480-160Zm0-360q26 0 43-17t17-43q0-26-17-43t-43-17q-26 0-43 17t-17 43q0 26 17 43t43 17Zm0-60Zm0 360Z"/></svg>
//           <p>Profile</p>
//         </Link>
          
//         <Link
//           className={`bottombar__container__item ${
//             location.pathname === "/notifications" ? "active" : ""
//           }`}
//           to="/notifications"
//         >
//             <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#3C3C3C"><path d="M480-220q25 0 42.5-17.5T540-280H420q0 25 17.5 42.5T480-220ZM280-320h400v-80h-40v-104q0-61-31.5-111.5T520-680v-20q0-17-11.5-28.5T480-740q-17 0-28.5 11.5T440-700v20q-57 14-88.5 64.5T320-504v104h-40v80Zm120-80v-120q0-33 23.5-56.5T480-600q33 0 56.5 23.5T560-520v120H400Zm80 320q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"/></svg>
//           <p>Notifi.</p>
//         </Link>


        
//       </div>
//     </div>
//   );
// };

// export default BottomBar;
