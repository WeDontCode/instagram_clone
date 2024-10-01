import React, { useContext } from 'react';
import { UserContext } from '../App';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const { state, dispatch } = useContext(UserContext);
  const navigate = useNavigate(); // To programmatically redirect after logout

  const renderList = () => {
    if (state) {
      // If the user is logged in, show profile and create post links
      return [
        <li key="1"><Link to="/profile">Profile</Link></li>,
        <li key="2"><Link to="/create">Create Post</Link></li>,
        <li key="3">
          <button
            className="btn #c62828 red darken-3"
            onClick={() => {
              localStorage.removeItem("authToken"); // Remove only auth-related data
              dispatch({ type: "CLEAR" });
              navigate("/signin"); // Redirect to signin page after logout
            }}
          >
            Sign Out
          </button>
        </li>
      ];
    } else {
      // If the user is not logged in, show login and signup options
      return [
        <li key="4"><Link to="/signin">Login</Link></li>,
        <li key="5"><Link to="/signup">Signup</Link></li>
      ];
    }
  };

  return (
    <nav>
      <div className="nav-wrapper white">
        <Link to={state ? "/" : "/signin"} className="brand-logo left">Instagram</Link>
        <ul id="nav-mobile" className="right">
          {renderList()}
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
