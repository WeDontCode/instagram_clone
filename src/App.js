import React, { useEffect, createContext, useReducer } from 'react';
import Navbar from './components/Navbar';
import './App.css';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom'; // Removed Switch
import Home from './components/screens/Home';
import Signin from './components/screens/Signin';
import Profile from './components/screens/Profile';
import Signup from './components/screens/Signup';
import CreatePost from './components/screens/CreatePost';
import { reducer, initialState } from './reducers/userReducer';

export const UserContext = createContext();

const Routing = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));

    // If the user is not logged in and tries to access restricted pages, redirect them to signin
    if (!user && (window.location.pathname !== "/signin" && window.location.pathname !== "/signup")) {
      navigate('/signin'); // Redirect to signin only if not already on signin/signup page
    }
  }, [navigate]);

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/signin" element={<Signin />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/create" element={<CreatePost />} />
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

export default App;
