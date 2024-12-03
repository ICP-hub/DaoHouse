import React from "react";
import './global.scss';
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
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import DaoProfile from "./pages/DaoProfile/DaoProfile";
import "react-toastify/dist/ReactToastify.css";
import "react-quill/dist/quill.snow.css";
import MyProposals from "./pages/Proposals/myproposals/MyProposals";
import SingleProposal from "./Components/Proposals/SingleProposal/SingleProposal";
import Following from "./Components/MyProfile/Following/Following";

import { Toaster } from 'react-hot-toast';
import ScrollToTop from "./Components/utils/ScrollToTop";
import ProposalsDetails from "./pages/FeedPage/ProposalDetails";
import ProtectedRoute from "./utils/ProtectedRoute";

const App = () => {
  return (
    <PostProvider>
      <Navbar />
      <Toaster position="top-center" reverseOrder={false} />
      <ScrollToTop />
      <Routes>
        <Route path="/*" element={<Error404 />} />
        <Route path="/" element={<Dashboard />} />
        <Route path="/social-feed" element={<FeedPage />} />
        <Route path="/social-feed/proposal/:proposalId/dao/:daoCanisterId" element={<ProposalsDetails />} />
        <Route
          path="/create-proposal/:daoCanisterId"
          element={
            <ProtectedRoute>
              <CreateProposal />
            </ProtectedRoute>
          }
        />
        <Route path="/dao" element={<Dao />} />
        <Route
          path="/dao/create-dao"
          element={
            <ProtectedRoute>
              <CreateDao />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dao/profile/:daoCanisterId"
          element={
            <ProtectedRoute>
              <DaoProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/edit-profile"
          element={
            <ProtectedRoute>
              <EditProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/post/:postID"
          element={
            <ProtectedRoute>
              <Post />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-profile"
          element={
            <ProtectedRoute>
              <MyProfile childComponent={<AboutMe />} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-proposals"
          element={
            <ProtectedRoute>
              <MyProposals />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-proposals/:id"
          element={
            <ProtectedRoute>
              <SingleProposal />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-profile/posts"
          element={
            <ProtectedRoute>
              <MyProfile childComponent={<MyPosts />} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-profile/following"
          element={
            <ProtectedRoute>
              <MyProfile childComponent={<Following />} />
            </ProtectedRoute>
          }
        />
      </Routes>
      <Footer />
    </PostProvider>
  );
};

export default () => (
  <Router>
    <App />
  </Router>
);
