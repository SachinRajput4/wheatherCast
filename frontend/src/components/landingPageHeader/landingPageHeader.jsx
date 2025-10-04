import React from 'react'
import './landingPageHeader.css'
import { assets } from '../../assets/assets';

const LandingPageHeader = () => {
    const today = new Date().toLocaleDateString('en-GB', {
    day: 'numeric', month: 'long', year: 'numeric'
  });
  return (
    
        
    <div className="home-container">
      
      
      <div className="checkin-card">
        <h2 className="checkin-title">Welcome to FaceRoll</h2>
        <div className="date">{today}</div>
        <div className="icon-container">
          {/* <svg width="48" height="48" fill="none" stroke="white" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M12 9v4m0 4h.01M12 3a9 9 0 100 18 9 9 0 000-18z" />
          </svg> */}
          <img src={assets.logo} alt="" />
        </div>
        {/* <p className="checkin-text">Check In</p> */}
      </div>
    </div>
      
  )
}

export default LandingPageHeader
