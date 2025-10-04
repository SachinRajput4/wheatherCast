import { useState } from 'react'
import {Route, Routes}from 'react-router-dom'
import './App.css'

import Navbar from './components/Navbar/Navbar'
import Sidebar from "./components/Sidebar/Sidebar";
import Footer from './components/Footer/Footer'
import BottomBar from './components/BottomBar/BottomBar'
import LoginPopup from './components/LoginPopup/LoginPopup'


import Home from './pages/Home/Home'
import Profile from './pages/Profile/Profile'



import AuraCastHome from './pages/AuraCastHome/AuraCastEvent'






function App() {
  const [showLogin,setShowLogin]=useState(false)
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <>
    {showLogin?<LoginPopup setShowLogin={setShowLogin} />:<></>}
    <Navbar setShowLogin={setShowLogin} toggleSidebar={toggleSidebar} />
      <div className="app pt-18 pb-20">
        <Routes>
        <Route path='/'element={<Home/>}/>
         <Route path="/login" element={<LoginPopup setShowLogin={setShowLogin} />} />
        <Route path='/profile' element={<Profile/>}/>

        <Route path='/aura-cast/*' element={<AuraCastHome/>}/>

        </Routes>
         <Footer />

        </div>
      <BottomBar />

      {isSidebarOpen && (
        <div className="fixed inset-0 z-[9999]">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={toggleSidebar}
          />
          <Sidebar onClose={toggleSidebar} isOpen={isSidebarOpen} />
        </div>
      )}

    </>
  )
}

export default App
