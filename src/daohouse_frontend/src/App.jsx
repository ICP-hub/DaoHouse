import React, { Children } from "react";
import './global.scss'
import PostProvider from "./PostProvider";
import Dao from "./pages/dao/Dao";
import Dashboard from "../src/pages/Home/Dashboard";
import Navbar from "./Components/layouts/Navbar";
import Error404 from "./Components/utils/Error404";
import Footer from "./Components/layouts/Footer";
import FeedPage from "./pages/FeedPage/FeedPage";
import CreateDao from "./pages/CreateDao/CreateDao";
import Post from "./pages/Post/Post";
import MyProfile from "./pages/MyProfile/MyProfile";
import EditProfile from "./pages/EditProfile/EditProfile";
import CreateProposal from "./pages/Proposals/CreateProposal";
import MyPosts from "./Components/MyProfile/MyPosts/MyPosts";
import AboutMe from "./Components/MyProfile/AboutMe/AboutMe";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import DaoProfile from "./pages/DaoProfile/DaoProfile";
import "react-toastify/dist/ReactToastify.css";
import "react-quill/dist/quill.snow.css";
import MyProposals from "./pages/Proposals/myproposals/MyProposals";
import SingleProposal from "./Components/Proposals/SingleProposal/SingleProposal";
import Following from "./Components/MyProfile/Following/Following";

import { Toaster } from 'react-hot-toast';
import ScrollToTop from "./Components/utils/ScrollToTop";
import ProposalsDetails from "./pages/FeedPage/ProposalDetails";


const App = () => {

  const location = useLocation();

  return (
    <PostProvider>
        <Navbar />
       
        <Toaster
  position="top-center"
  reverseOrder={false}
/>
        <ScrollToTop />
        <Routes>
          <Route path="/*" element={<Error404 />} />
          <Route path="/" element={<Dashboard />} />
          <Route path="/social-feed" element={<FeedPage />} />
          <Route path="/social-feed/proposal/:proposalId/dao/:daoCanisterId" element={<ProposalsDetails />} />
          {/* <Route path="/proposals" element={<Proposals />} /> */}
          <Route path="/create-proposal/:daoCanisterId" element={<CreateProposal />} />
          <Route path="/dao" element={<Dao />} />
          <Route path="/dao/create-dao" element={<CreateDao />} />
          <Route path="/dao/profile/:daoCanisterId" element={<DaoProfile />} />
          <Route path="/edit-profile" element={<EditProfile />} />
          <Route path="/post/:postID" element={<Post />} />
          <Route
            path="/my-profile"
            element={<MyProfile childComponent={<AboutMe />} />}
          />
          <Route path="/my-proposals" element={<MyProposals />} />
          <Route path="/my-proposals/:id" element={<SingleProposal />} />
          <Route
            path="/my-profile/posts"
            element={<MyProfile childComponent={<MyPosts />} />}
          />
             <Route
            path="/my-profile/following"
            element={<MyProfile childComponent={<Following />} />}
          />
        </Routes>
        <Footer />
 
      {/* <ToastContainer /> */}
    </PostProvider>
  );
};

export default () => (
  <Router>
    <App />
  </Router>
);
