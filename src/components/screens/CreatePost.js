import React, { useState, useEffect } from "react";
import M from 'materialize-css';
import { useNavigate } from 'react-router-dom'; 

const CreatePost = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [image, setImage] = useState("");
  const [url, setUrl] = useState("");

  // UseEffect with title, body, and navigate dependencies included
  useEffect(() => {
    if (url) {
      fetch("/createpost", { 
        method: "post",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + localStorage.getItem("jwt")
        },
        body: JSON.stringify({        
          title,
          body,
          pic: url
        })
      })
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          M.toast({html: data.error, classes: "#c62828 red darken-3"});
        } else {
          M.toast({html: "Post created successfully", classes: "#43a047 green darken-1"});
          navigate('/'); // Redirect to home page
        }
      })
      .catch(err => {
        console.error(err);
      });
    }
  }, [url, body, title, navigate]); // Added missing dependencies

  const postDetails = () => {
    const data = new FormData();
    data.append("file", image);
    data.append("upload_preset", "insta-clone");
    data.append("cloud_name", "adejoh");
    
    fetch("https://api.cloudinary.com/v1_1/adejoh/image/upload", {
      method: "post",
      body: data
    })
    .then(res => res.json())
    .then(data => {
      setUrl(data.url); // Set the uploaded image URL
    })
    .catch(err => {
      console.error(err);
    });
  };

  return (
    <div className="card input-filled" style={{ margin: "40px auto", maxWidth: "500px", padding: "20px", textAlign: "center" }}>
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <input
        type="text"
        placeholder="Body"
        value={body}
        onChange={(e) => setBody(e.target.value)}
      />
      <div className="file-field input-field">
        <div className="btn #64b5f6 blue lighten-2">
          <span>Upload Image</span>
          <input type="file" onChange={(e) => setImage(e.target.files[0])} />
        </div>
        <div className="file-path-wrapper">
          <input className="file-path validate" type="text" />
        </div>
      </div>
      <button
        className="btn waves-effect waves-light #64b5f6 blue lighten-2"
        onClick={postDetails}
      >
        Submit Post
      </button>
    </div>
  );
};

export default CreatePost;
