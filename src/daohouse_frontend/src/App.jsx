import React from "react";
// import Login from './Components/Auth/Login';
import Dao from "./pages/dao/Dao";
import Dashboard from "../src/pages/Home/Dashboard";
import Navbar from "./Components/layouts/Navbar";
import Error404 from "./Components/utils/Error404";
import Footer from "./Components/layouts/Footer";
import FeedPage from "./pages/FeedPage/FeedPage";
import CreateDao from "./pages/CreateDao/CreateDao";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Proposals from "./pages/Proposals/Proposals";
import CreateProposal from "./pages/Proposals/CreateProposal";
import MyProfile from "./pages/MyProfile/MyProfile";
import EditProfile from "./pages/EditProfile/EditProfile";

const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/*" element={<Error404 />} />
        <Route path="/" element={<Dashboard />} />
        <Route path="/social-feed" element={<FeedPage />} />
        <Route path="/proposals" element={<Proposals />} />
        <Route path="/create-proposal" element={<CreateProposal />} />
        <Route path="/dao" element={<Dao />} />
        <Route path="/dao/create-dao" element={<CreateDao />} />
        <Route path="/my-profile" element={<MyProfile />} />
        <Route path="/edit-profile" element={<EditProfile />} />
      </Routes>
      <Footer />
    </Router>
  );
};

export default App;
