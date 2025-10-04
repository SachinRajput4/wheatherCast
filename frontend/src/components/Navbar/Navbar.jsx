import React, { useContext, useState } from "react";
import { assets } from "../../assets/assets";
import { Link, useNavigate } from "react-router-dom";
import { StoreContext } from "../context/StoreContext";

const Navbar = ({ setShowLogin, toggleSidebar }) => {
  const [menu, setMenu] = useState("home");
  const { user2Url, user1Token, setUser1Token } = useContext(StoreContext);
  const [signinbarOpen, setSigninbarOpen] = useState(false);
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("user1Token");
    setUser1Token("");
    navigate("/");
  };

  return (
    <div className="fixed top-0 left-0 w-full px-6 py-4 flex justify-between items-center bg-white border-b border-gray-200 shadow-sm z-50">
      {/* Logo */}
      <Link to="/" className="flex items-center gap-3">
        <h2 className="text-2xl font-bold text-blue-600 hover:text-blue-700 transition-colors duration-300">
          AuraCheck
        </h2>
      </Link>

      {/* Desktop Menu */}
      <ul className="hidden md:flex list-none gap-8 text-gray-700 text-lg">
        <li>
          <Link
            to="/"
            onClick={() => setMenu("home")}
            className={`pb-1 transition-all duration-300 hover:text-blue-600 ${
              menu === "home" ? "text-blue-600 border-b-2 border-blue-600" : ""
            }`}
          >
            Home
          </Link>
        </li>
        <li>
          <a
            href="#explore-services"
            onClick={() => setMenu("explore-services")}
            className={`pb-1 transition-all duration-300 hover:text-blue-600 ${
              menu === "explore-services"
                ? "text-blue-600 border-b-2 border-blue-600"
                : ""
            }`}
          >
            Explore Services
          </a>
        </li>
        <li>
          <a
            href="#footer"
            onClick={() => setMenu("contact-us")}
            className={`pb-1 transition-all duration-300 hover:text-blue-600 ${
              menu === "contact-us"
                ? "text-blue-600 border-b-2 border-blue-600"
                : ""
            }`}
          >
            Contact Us
          </a>
        </li>
        <li>
          <a
            to="/about"
            onClick={() => setMenu("about-us")}
            className={`pb-1 transition-all duration-300 hover:text-blue-600 ${
              menu === "about-us"
                ? "text-blue-600 border-b-2 border-blue-600"
                : ""
            }`}
          >
            About Us
          </a>
        </li>
      </ul>

      <div className="flex items-center gap-6">
        {/* Search Bar */}
        <div className="hidden md:flex items-center w-48 gap-3 rounded-full bg-gray-100 px-4 py-2 border border-gray-200">
          <input
            type="text"
            placeholder="Search..."
            className="border-none outline-none w-full text-gray-700 bg-transparent placeholder-gray-500"
          />
          <img
            src={assets.search_icon}
            alt="Search"
            className="w-5 cursor-pointer opacity-70 hover:opacity-100"
          />
        </div>

        {!user1Token ? (
          <div className="relative">
            <button
              onClick={() => setSigninbarOpen(!signinbarOpen)}
              className="bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 transition-all duration-300 shadow-sm hover:shadow-md font-medium"
            >
              Sign in
            </button>

            {signinbarOpen && (
              <ul className="absolute right-0 mt-2 bg-white shadow-lg rounded-lg p-2 w-48 z-10 border border-gray-200">
                <li
                  onClick={() => {setShowLogin(true); setSigninbarOpen(false)}}
                  className="flex items-center p-3 hover:bg-blue-50 cursor-pointer rounded-md transition-all duration-300 text-gray-700 hover:text-blue-600"
                >
                  <p>As an Attendee</p>
                </li>
                <li
                  onClick={() => (window.location.href = `${user2Url}`)}
                  className="flex items-center p-3 hover:bg-blue-50 cursor-pointer rounded-md transition-all duration-300 text-gray-700 hover:text-blue-600"
                >
                  <p>As an Instructor</p>
                </li>
              </ul>
            )}
          </div>
        ) : (
          <>
            {/* Menu Icon */}
            <div
              className="cursor-pointer p-2 hover:bg-gray-100 rounded-lg transition-all duration-300"
              onClick={toggleSidebar}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24px"
                viewBox="0 -960 960 960"
                width="24px"
                fill="#4b5563"
              >
                <path d="M120-240v-80h720v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z" />
              </svg>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Navbar;





// import React, { useContext, useState } from "react";
// import { assets } from "../../assets/assets";
// import { Link, useNavigate } from "react-router-dom";
// import { StoreContext } from "../context/StoreContext";

// const Navbar = ({ setShowLogin, toggleSidebar }) => {
//   const [menu, setMenu] = useState("home");
//   const { user2Url, user1Token, setUser1Token } = useContext(StoreContext);
//   const [signinbarOpen, setSigninbarOpen] = useState(false);
//   const navigate = useNavigate();

//   const logout = () => {
//     localStorage.removeItem("user1Token");
//     setUser1Token("");
//     navigate("/");
//   };

//   return (
//     <div className="fixed top-0 left-0 w-full px-6 py-4 flex justify-between items-center bg-white border-b border-gray-700/50 z-50">
//       {/* Logo */}
//       <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
//         AuraCheck
//       </h2>

//       {/* Desktop Menu */}
//       <ul className="hidden md:flex list-none gap-8 text-gray-300 text-lg">
//         <li>
//           <Link
//             to="/"
//             onClick={() => setMenu("home")}
//             className={`pb-1 transition-all duration-300 hover:text-blue-400 ${
//               menu === "home" ? "text-blue-400 border-b-2 border-blue-400" : ""
//             }`}
//           >
//             Home
//           </Link>
//         </li>
//         <li>
//           <a
//             href="#explore-services"
//             onClick={() => setMenu("explore-services")}
//             className={`pb-1 transition-all duration-300 hover:text-blue-400 ${
//               menu === "explore-services"
//                 ? "text-blue-400 border-b-2 border-blue-400"
//                 : "  text-gray-800"
//             }`}
//           >
//             Explore Services
//           </a>
//         </li>
//         <li>
//           <a
//             href="#footer"
//             onClick={() => setMenu("contact-us")}
//             className={`pb-1 transition-all duration-300 hover:text-blue-400 ${
//               menu === "contact-us"
//                 ? "text-blue-400 border-b-2 border-blue-400"
//                 : ""
//             }`}
//           >
//             Contact Us
//           </a>
//         </li>
//         <li>
//           <Link
//             to="/about"
//             onClick={() => setMenu("about-us")}
//             className={`pb-1 transition-all duration-300 hover:text-blue-400 ${
//               menu === "about-us"
//                 ? "text-blue-400 border-b-2 border-blue-400"
//                 : ""
//             }`}
//           >
//             About Us
//           </Link>
//         </li>
//       </ul>

//       <div className="flex items-center gap-6">
//         {/* Search Bar */}
//         <div className="hidden md:flex items-center w-48 gap-3 rounded-full bg-gray-800/50 px-4 py-2 border border-gray-700/50 backdrop-blur-sm">
//           <input
//             type="text"
//             placeholder="Search..."
//             className="border-none outline-none w-full text-gray-300 bg-transparent placeholder-gray-500"
//           />
//           <img
//             src={assets.search_icon}
//             alt="Search"
//             className="w-5 cursor-pointer opacity-70 hover:opacity-100"
//           />
//         </div>

//         {!user1Token ? (
//           <div className="relative">
//             <button
//               onClick={() => setSigninbarOpen(!signinbarOpen)}
//               className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-2.5 rounded-full hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg hover:shadow-blue-500/20"
//             >
//               Sign in
//             </button>

//             {signinbarOpen && (
//               <ul className="absolute right-0 mt-2 bg-gray-800/95 backdrop-blur-sm shadow-2xl rounded-xl p-2 w-48 z-10 border border-gray-700/50">
//               <li
//                   onClick={() => {setShowLogin(true); setSigninbarOpen(false)}}
//                   className="flex items-center p-3 hover:bg-blue-900/30 cursor-pointer rounded-lg transition-all duration-300 text-gray-300 hover:text-white"
//                 >
//                   <p >As an Attendee</p>
//                 </li>
//                 <li
//                   onClick={() => (window.location.href = `${user2Url}`)}
//                   className="flex items-center p-3 hover:bg-blue-900/30 cursor-pointer rounded-lg transition-all duration-300 text-gray-300 hover:text-white"
//                 >
//                   <p>As an Instructor</p>
//                 </li>
                
//               </ul>
//             )}
//           </div>
//         ) : (
//           <>
//             {/* Menu Icon */}
//             <div
//               className="cursor-pointer p-2 hover:bg-gray-800/50 rounded-full transition-all duration-300"
//               onClick={toggleSidebar}
//             >
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 height="24px"
//                 viewBox="0 -960 960 960"
//                 width="24px"
//                 fill="#ffffff"
//               >
//                 <path d="M120-240v-80h720v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z" />
//               </svg>
//             </div>
//           </>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Navbar;









// import React, { useContext, useState } from "react";
// import "./Navbar.css";
// import { assets } from "../../assets/assets";
// import { Link, useNavigate } from "react-router-dom";
// import { StoreContext } from "../context/StoreContext";
// const Navbar = ({ setShowLogin }) => {
//   const [menu, setMenu] = useState("home");

//   const { user2Url, user1Token, setUser1Token } = useContext(StoreContext);

//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);

//   const toggleSidebar = () => {
//     setIsSidebarOpen(!isSidebarOpen);
//   };

//   const navigate = useNavigate();
//   const logout = () => {
//     localStorage.removeItem("user1Token");
//     setUser1Token("");
//     navigate("/");
//   };

//   return (
//     <div className="navbar" id="navbar">
//       {/* <Link to="/">
//         <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill=""><path d="M261-200q-51 0-85-34t-34-85q0-51 34-85.5t85-34.5q51 0 85 34t34 85q0 51-34 85.5T261-200ZM153-521v-239h51v239h-51Zm108 275q31 0 51-21t20-53q0-32-19.5-52.5T261-393q-31 0-51 20.5T190-320q0 32 20 53t51 21Zm-11-275v-239h56l90 152-2-38v-114h50v239h-51l-96-161 3 38v123h-50Zm262 321q-42 0-67-27t-25-72v-140h49v143q0 21 12.5 35t30.5 14q18 0 30-14t12-35v-143h49v140q0 45-25 72t-66 27Zm194 0v-192h-64v-47h176v47h-63v192h-49Z"/></svg>
//       </Link> */}
//       <h2>FaceRoll</h2>
//       <ul className="navbar-menu">
//         <Link
//           to="/"
//           onClick={() => setMenu("home")}
//           className={menu === "home" ? "active" : ""}
//         >
//           home
//         </Link>
//         <a
//           href="#explore-menu"
//           onClick={() => setMenu("menu")}
//           className={menu === "menu" ? "active" : ""}
//         >
//           menu
//         </a>
//         {/* <a
//           href="#app-download"
//           onClick={() => setMenu("mobile-app")}
//           className={menu === "mobile-app" ? "active" : ""}
//         >
//           mobile-app
//         </a> */}
//         <a
//           href="#footer"
//           onClick={() => setMenu("contact-us")}
//           className={menu === "contact-us" ? "active" : ""}
//         >
//           contact us
//         </a>
//         <Link
//           to="/about"
//           onClick={() => setMenu("about-us")}
//           className={menu === "about-us" ? "active" : ""}
//         >
//           about us
//         </Link>
//       </ul>
//       <div className="navbar-right">
//         <div className="navbar-search-bar">
//           <input type="text" placeholder="Search" />
//           <img src={assets.search_icon} alt="" />
//         </div>

//         {/* <div className="navbar-cart ">
//           <Link to="/cart">
//             <img src={assets.basket_icon} alt="" />
//             <div className={`cart__quantity_desktop cart__quantity  ${getTotalCartQuantity() === 0 ? "hidden" : ""}`}>
//             {getTotalCartQuantity()===0?'':getTotalCartQuantity()}
//           </div>
//           </Link>
          
//         </div> */}

//         {!user1Token ? (
//           <div className="navbar-sign-in">
//             <button>Sign in</button>
//             <ul className="navbar-sign-in-drop-down">
//               <li onClick={() => setShowLogin(true)}>
//                 <p>As a Attendee</p>
//               </li>

//               <li onClick={() => (window.location.href = `${user2Url}`)}>
//                 <p>As a Instructor</p>
//               </li>
//             </ul>
//           </div>
//         ) : (
//           <>
//             <div className="manu_system">
//               <div className="menu_icon" onClick={toggleSidebar}>
//                 <img src={assets.menuicon} alt="menu" />
//               </div>
//             </div>
//             <div className="menu_desktop">
//               <div className="navbar-profile">
//                 <img src={assets.profile_icon} alt="" />
//                 <ul className="navbar-profile-dropdown">
//                   <li onClick={() => navigate("/profile")}>
//                     <img src={assets.user_icon} alt="" />
//                     <p>Profile</p>
//                   </li>
//                   <hr />
//                   <li onClick={() => navigate("/myorders")}>
//                     <img src={assets.bag_icon} alt="" />
//                     <p>Orders</p>
//                   </li>
//                   <hr />
//                   <li onClick={logout}>
//                     <img src={assets.logout_icon} alt="" />
//                     <p>Logout</p>
//                   </li>
//                 </ul>
//               </div>
//             </div>
//             {isSidebarOpen && user1Token && (
//               <div className="mobile_sidebar">
//                 <div className="close_btn" onClick={toggleSidebar}>
//                   <img src={assets.menucloseicon} alt="close" />
//                 </div>
//                 <ul>
//                   <li
//                     onClick={() => {
//                       navigate("/profile");
//                       toggleSidebar();
//                     }}
//                   >
//                     <img src={assets.user_icon} alt="user" />
//                     <p>Profile</p>
//                   </li>
//                   <hr />
//                   <li
//                     onClick={() => {
//                       navigate("/about");
//                       toggleSidebar();
//                     }}
//                   >
//                     {/* <img src={assets.user_icon} alt="user" /> */}
//                     <p>About-us</p>
//                   </li>
//                   <hr />
//                   <li
//                     onClick={() => {
//                       logout();
//                       toggleSidebar();
//                     }}
//                   >
//                     <img src={assets.logout_icon} alt="logout" />
//                     <p>Logout</p>
//                   </li>
//                 </ul>
//               </div>
//             )}
//           </>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Navbar;
