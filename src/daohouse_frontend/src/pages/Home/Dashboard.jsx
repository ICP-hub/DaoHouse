import React from "react";
import HeroSection from "../../Components/Home/HeroSection";
import Empowering from "../../Components/Home/Empowering";
import About from "../../Components/Home/About";
import Feature from "../../Components/Home/features/Feature";
import Decentralization from "../../Components/Home/Decentralization";
import SupportingPartners from "../../Components/Home/SupportingPartners";


const Dashboard = () => {

  return (
    <React.Fragment>
     
    
      <HeroSection />
      <Empowering />
      <About />
      <Feature />
      <Decentralization />
      <SupportingPartners />
    
    </React.Fragment>
  );
};

export default Dashboard;
