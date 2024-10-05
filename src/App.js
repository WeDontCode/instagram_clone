import React, { useEffect, createContext, useReducer } from 'react';
import Navbar from './components/Navbar';
import './App.css';
import { BrowserRouter, Routes, Route, useNavigate, Navigate } from 'react-router-dom'; // Import Navigate here
import Home from './components/screens/Home';
import Signin from './components/screens/Signin';
import Profile from './components/screens/Profile';
import Signup from './components/screens/Signup';
import CreatePost from './components/screens/CreatePost';
import { reducer, initialState } from './reducers/userReducer';
import UserProfile from './components/screens/UserProfile';
import SubscribeUserPosts from './components/screens/SubscribeUserPosts';

export const UserContext = createContext();

const Routing = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    // Redirect user to signin if not logged in and trying to access restricted pages
    if (!user && (window.location.pathname !== "/signin" && window.location.pathname !== "/signup")) {
      navigate('/signin');
    }
  }, [user, navigate]);

  return (
    <Routes>
      <Route path="/" element={user ? <Home /> : <Navigate to="/signin" />} />
      <Route path="/signin" element={<Signin />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/create" element={<CreatePost />} />
      <Route path="/profile/:userid" element={<UserProfile />} />
      <Route path="/myfollowingpost" element={<SubscribeUserPosts />} />
    </Routes>
  );
};

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <UserContext.Provider value={{ state, dispatch }}>
      <BrowserRouter>
        <Navbar />
        <Routing />
      </BrowserRouter>
    </UserContext.Provider>
  );
}

export default App
