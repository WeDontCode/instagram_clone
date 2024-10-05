import React, { useEffect, useState, useContext } from 'react';
import { UserContext } from '../../App';

const Profile = () => {
  const [mypics, setPics] = useState([]);
  const { state, dispatch } = useContext(UserContext);
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchMyPosts = async () => {
      try {
        const response = await fetch('/mypost', {
          headers: {
            "Authorization": "Bearer " + localStorage.getItem("jwt"),
          },
        });
        const result = await response.json();
        if (result && result.mypost) {
          setPics(result.mypost);
        } else {
          console.error("My posts data is not available.");
        }
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    fetchMyPosts();
  }, []); // Dependency array for fetching posts - should remain empty if you don't want it to run again.

  useEffect(() => {
    const uploadImage = async () => {
      if (image) {
        setLoading(true);
        const data = new FormData();
        data.append("file", image);
        data.append("upload_preset", "insta-clone");
        data.append("cloud_name", "adejoh");

        try {
          const res = await fetch("https://api.cloudinary.com/v1_1/adejoh/image/upload", {
            method: "post",
            body: data,
          });
          const result = await res.json();

          const updateRes = await fetch('/updatepic', {
            method: "put",
            headers: {
              "Content-Type": "application/json",
              "Authorization": "Bearer " + localStorage.getItem("jwt"),
            },
            body: JSON.stringify({ pic: result.url }),
          });

          const updateResult = await updateRes.json();
          console.log(updateResult);
          localStorage.setItem("user", JSON.stringify({ ...state, pic: updateResult.pic }));
          dispatch({ type: "UPDATEPIC", payload: updateResult.pic });
        } catch (err) {
          console.error("Error during image upload or update:", err);
        } finally {
          setLoading(false);
        }
      }
    };

    uploadImage();
  }, [image, dispatch, state]); // Include dispatch and state in the dependency array

  const updatePhoto = (file) => {
    setImage(file);
  };

  return (
    <div style={{ maxWidth: '550px', margin: '0px auto' }}>
      <div style={{
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'center',
        margin: '18px 0px',
      }}>
        <div>
          <img
            style={{
              width: '160px',
              height: '160px',
              borderRadius: '80px',
            }}
            src={state ? state.pic : ""}
            alt="User Profile"
          />
        </div>
        <div style={{ marginLeft: '20px', flexGrow: 1 }}>
          <h4>{state && state.name ? state.name : "Loading..."}</h4>
          <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '300px' }}>
            <h6>{mypics.length} posts</h6>
            <h6>{state && state.followers ? state.followers.length : 0} followers</h6>
            <h6>{state && state.following ? state.following.length : 0} following</h6>
          </div>
        </div>
      </div>

      <div style={{ marginLeft: '15px', marginTop: '10px', display: 'flex', alignItems: 'center' }}>
        <button 
          onClick={() => document.getElementById('fileInput').click()}
          className={`btn waves-effect waves-light ${loading ? '#ccc' : '#64b5f6 blue darken-1'}`} 
          disabled={loading}
        >
          {loading ? 'Uploading...' : 'Update Pic'}
        </button>
        <input
          id="fileInput"
          type="file"
          style={{ display: 'none' }} // Hide the file input
          onChange={(e) => {
            const file = e.target.files[0];
            updatePhoto(file);
          }}
          aria-label="Update Profile Picture"
        />
      </div>

      <hr style={{ border: '1px solid grey', margin: '10px 0' }} />

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
