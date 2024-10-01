import React, { useEffect, useState, useContext } from 'react';
import { UserContext } from '../../App';

const Profile = () => {
  const [mypics, setPics] = useState([]);
  const { state } = useContext(UserContext);

  useEffect(() => {
    fetch('/mypost', {
      headers: {
        "Authorization": "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then(res => res.json())
      .then(result => {
        setPics(result.mypost);
      })
      .catch(error => {
        console.error("Error fetching posts:", error);
      });
  }, []);

  return (
    <div style={{ maxWidth: '550px', margin: '0px auto' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-start',
          margin: '18px 0px',
          alignItems: 'center',
          borderBottom: '1px solid grey',
        }}
      >
        <div>
          <img
            style={{
              width: '160px',
              height: '160px',
              borderRadius: '80px',
            }}
            src="https://images.unsplash.com/photo-1727179380219-bb0b15a97e05?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTUzfHxwZXJzb258ZW58MHx8Mnx8fDA%3D"
            alt="User Profile"
          />
        </div>
        <div style={{ marginLeft: '20px' }}>
          <h4>{state ? state.name : "Loading..."}</h4>
          <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '300px' }}>
            <h6>{mypics.length} posts</h6> {/* Dynamic post count */}
            <h6>40 followers</h6>
            <h6>40 following</h6>
          </div>
        </div>
      </div>

      {/* Updated gallery section with CSS grid layout */}
      <div className="gallery">
        {mypics.length > 0 ? (
          mypics.map((item, index) => (
            <img key={index} className="item" src={item.photo} alt={item.title} />
          ))
        ) : (
          <h5>No posts available</h5>
        )}
      </div>
    </div>
  );
};

export default Profile;
