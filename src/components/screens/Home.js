import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from '../../App'; 

const Home = () => {
  const [data, setData] = useState([]);
  const [commentText, setCommentText] = useState(''); // Add state to hold the comment input
  const { state } = useContext(UserContext); // Extract state from context

  useEffect(() => {
    fetch('/allpost', {
      headers: {
        "Authorization": "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then(res => res.json())
      .then(result => {
        setData(result.posts);
      })
      .catch(error => {
        console.error("Error fetching posts:", error);
      });
  }, []);

  const likePost = (id) => {
    fetch('/like', {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        postId: id
      })
    }).then(res => res.json())
      .then(result => {
        const updatedData = data.map(post => {
          if (post._id === result._id) {
            return result; // Replace the updated post
          }
          return post;
        });
        setData(updatedData);
      })
      .catch(error => console.error("Error liking post:", error));
  };

  const unlikePost = (id) => {
    fetch('/unlike', {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        postId: id
      })
    }).then(res => res.json())
      .then(result => {
        const updatedData = data.map(post => {
          if (post._id === result._id) {
            return result; // Replace the updated post
          }
          return post;
        });
        setData(updatedData);
      })
      .catch(error => console.error("Error unliking post:", error));
  };

  const makeComment = (text, postId) => {
    fetch('/comment', {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        postId,
        text
      })
    })
      .then(res => res.json())
      .then(result => {
        const updatedData = data.map(post => {
          if (post._id === result._id) {
            return result; // Replace the post with the updated one
          }
          return post;
        });
        setData(updatedData);
        setCommentText(''); // Clear comment input after submission
      })
      .catch(error => console.error("Error posting comment:", error));
  };

  return (
    <div className='home'>
      {data.length > 0 ? (
        data.map(item => (
          <div className='card home-card' key={item._id}>
            <h5>{item.postedBy.name}</h5>
            <div className='card-image'>
              <img
                src={item.photo}
                alt={item.title || 'Post Image'} 
              />
            </div>
            <div className='card-content'>
              <i className="material-icons" style={{ color: "red" }}>favorite</i>
              {state && state._id && item.likes.includes(state._id) ? (
                <i className="material-icons" onClick={() => unlikePost(item._id)}>
                  thumb_down
                </i>
              ) : (
                <i className="material-icons" onClick={() => likePost(item._id)}>
                  thumb_up
                </i>
              )}
              <h6>{item.likes.length} likes</h6>
              <h6>{item.title}</h6>
              <p>{item.body}</p>
              <div>
                {item.comments.map((comment, index) => (
                  <h6 key={index}>
                    <span style={{ fontWeight: '500' }}>{comment.postedBy.name} </span>
                    {comment.text}
                  </h6>
                ))}
              </div>
              <form onSubmit={(e) => {
                e.preventDefault();
                makeComment(commentText, item._id); // Pass commentText and postId to makeComment
              }}>
                <input
                  type='text'
                  placeholder='Add a comment'
                  value={commentText} // Bind the input to commentText state
                  onChange={(e) => setCommentText(e.target.value)} // Update commentText state
                />
              </form>
            </div>
          </div>
        ))
      ) : (
        <h5>No posts available</h5>
      )}
    </div>
  );
};

export default Home;
