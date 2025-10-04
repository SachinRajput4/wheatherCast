import React from 'react'
import './Home.css'
import LandingPageHeader from '../../components/landingPageHeader/landingPageHeader';
// import ActionGrid from '../../components/ActionGrid/ActionGrid';

const Home = () => {
  
  const user1Token = localStorage.getItem('user1Token');
  // console.log("user1Token", user1Token);
  return (
    <>
      {/* <LandingPageHeader /> */}
      <ActionGrid/>
    </>
  );
}

export default Home
