import React from 'react'
import { assets } from '../../assets/assets'
import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <div id="footer" className='footer bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4 sm:px-6 lg:px-8'>
      <div className="footer-content max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Left Section - Brand */}
        <div className="footer-content-left">
          <h2 className="text-2xl font-bold text-blue-600 mb-4">AuraCast</h2>
          <p className="text-gray-600 leading-relaxed mb-6">
            Stay connected with us! For any inquiries, feel free to contact us or call us. 
            Follow us on social media for the latest updates and exclusive offers. 
            We're here to assist you!
          </p>
          <div className="footer-social-icon flex gap-4">
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-700 transition-colors duration-300">
              <img src={assets.facebook_icon} alt="Facebook" className="w-5 h-5 filter invert" />
            </div>
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-700 transition-colors duration-300">
              <img src={assets.linkedin_icon} alt="LinkedIn" className="w-5 h-5 filter invert" />
            </div>
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-700 transition-colors duration-300">
              <img src={assets.twitter_icon} alt="Twitter" className="w-5 h-5 filter invert" />
            </div>
          </div>
        </div>

        {/* Center Section - Company Links */}
        <div className="footer-content-center">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">COMPANY</h2>
          <ul className="space-y-3">
            <li>
              <Link to="/" className="text-gray-600 hover:text-blue-600 transition-colors duration-300">
                Home
              </Link>
            </li>
            <li>
              <Link to="/about" className="text-gray-600 hover:text-blue-600 transition-colors duration-300">
                About Us
              </Link>
            </li>
            <li>
              <a href="#footer" className="text-gray-600 hover:text-blue-600 transition-colors duration-300">
                Contact Us
              </a>
            </li>
            <li>
              <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors duration-300">
                Privacy Policy
              </a>
            </li>
          </ul>
        </div>

        {/* Right Section - Contact Info */}
        <div className="footer-content-right">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">GET IN TOUCH</h2>
          <ul className="space-y-3">
            <li className="flex items-center gap-3 text-gray-600">
              <div className="w-6 h-6 bg-teal-500 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" height="16px" viewBox="0 -960 960 960" width="16px" fill="#ffffff">
                  <path d="M798-120q-125 0-247-54.5T329-329Q229-429 174.5-551T120-798q0-18 12-30t30-12h162q14 0 25 9.5t13 22.5l26 140q2 16-1 27t-11 19l-97 98q20 37 47.5 71.5T387-386q31 31 65 57.5t72 48.5l94-94q9-9 23.5-13.5T670-390l138 28q14 4 23 14.5t9 23.5v162q0 18-12 30t-30 12Z"/>
                </svg>
              </div>
              +919636000000
            </li>
            <li className="flex items-center gap-3 text-gray-600">
              <div className="w-6 h-6 bg-teal-500 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" height="16px" viewBox="0 -960 960 960" width="16px" fill="#ffffff">
                  <path d="M160-160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h640q33 0 56.5 23.5T880-720v480q0 33-23.5 56.5T800-160H160Zm320-280L160-640v400h640v-400L480-440Zm0-80 320-200H160l320 200ZM160-640v-80 480-400Z"/>
                </svg>
              </div>
              Contact@AuraCheck.com
            </li>
          </ul>
        </div>
      </div>
      
      <hr className="my-8 border-gray-200" />
      
      <div className="max-w-6xl mx-auto text-center">
        <p className="footer-copyright text-gray-500 text-sm">
          Copyright 2024 © AuraCheck.com - All Right Reserved.
        </p>
      </div>
    </div>
  )
}

export default Footer




// import React from 'react'
// import './Footer.css'
// import { assets } from '../../assets/assets'
// import { Link } from 'react-router-dom'

// const Footer = () => {
//   return (
//     <div className='footer' id='footer'>
//       <div className="footer-content">
//         <div className="footer-content-left">
//           {/* <img src={assets.logo} alt="" />
//            */}
//             <h2>AuraCheck</h2>
//           <p>Stay connected with us! For any inquiries, feel free to contact us or call us. Follow us on social media for the latest updates and exclusive offers. We’re here to assist you 24/7!</p>
//           <div className="footer-social-icon">
//               <img src={assets.facebook_icon} alt="" /><img src={assets.linkedin_icon} alt="" /><img src={assets.twitter_icon} alt="" />
//           </div>

//         </div>
//         <div className="footer-content-center">
//           <h2>COMPANY</h2>
//           <ul>
//               <li>Home</li>
//               <li><Link  to="/about">About Us</Link></li>
            
//               <li>Privacy Policy</li>
//           </ul>
//         </div>
//         <div className="footer-content-right">
//           <h2>GET IN TOUCH</h2>
//           <ul>
//               <li>+919636000000</li>
//               <li>Contact@AuraCheck.com</li>
//           </ul>
//         </div>
//       </div>
//       <hr />
//       <div>

//         <p className="footer-copyright">Copyright 2024 © AuraCheck.com - All Right Reserved. </p>

//       </div>
      
//     </div>
//   )
// }

// export default Footer
