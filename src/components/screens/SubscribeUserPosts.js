import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from '../../App';
import { Link } from 'react-router-dom';

const Home = () => {
  const [data, setData] = useState([]);
  const [commentText, setCommentText] = useState('');
  const { state } = useContext(UserContext);

  useEffect(() => {
    fetchPosts();
  }, [state]);

  const fetchPosts = () => {
    fetch('/getsubpost', {
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
  };

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
            return result;
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
            return result;
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
            return result;
          }
          return post;
        });
        setData(updatedData);
        setCommentText('');
      })
      .catch(error => console.error("Error posting comment:", error));
  };

  const deletePost = (postId) => {
    fetch(`/deletepost/${postId}`, {
      method: "delete",
      headers: {
        "Authorization": "Bearer " + localStorage.getItem("jwt")
      }
    })
    .then(res => res.json())
    .then(result => {
      const updatedData = data.filter(post => post._id !== result._id);
      setData(updatedData);
    })
    .catch(error => console.error("Error deleting post:", error));
  };

  const deleteComment = (postId, commentId) => {
    fetch(`/deletecomment/${postId}/${commentId}`, {
      method: "delete",
      headers: {
        "Authorization": "Bearer " + localStorage.getItem("jwt")
      }
    })
    .then(res => res.json())
    .then(result => {
      const updatedData = data.map(post => {
        if (post._id === result._id) {
          return result;
        }
        return post;
      });
      setData(updatedData);
    })
    .catch(error => console.error("Error deleting comment:", error));
  };

  return (
    <div className='home'>
      {data.length > 0 ? (
        data.map(item => (
            
          <div className='card home-card' key={item._id}>
            <h5 style={{padding:"5px"}}>
              <Link 
                to={state?._id !== item.postedBy?._id ? "/profile/" + item.postedBy._id : "/profile"}
              >
                {item.postedBy?.name || 'Unknown User'}
              </Link>
              {state?._id === item.postedBy?._id && (
                <i
                  className="material-icons"
                  style={{ float: 'right', cursor: 'pointer' }}
                  onClick={() => deletePost(item._id)}
                >
                  delete
                </i>
              )}
            </h5>
            <div className='card-image'>
              <img src={item.photo} alt={item.title || 'Post Image'} />
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
                    <span style={{ fontWeight: '500' }}>{comment.postedBy?.name || 'Unknown User'}: </span>
                    {comment.text}
                    {(comment.postedBy?._id === state?._id || item.postedBy?._id === state?._id) && (
                      <i
                        className="material-icons"
                        style={{ float: 'right', cursor: 'pointer' }}
                        onClick={() => deleteComment(item._id, comment._id)}
                      >
                        delete
                      </i>
                    )}
                  </h6>
                ))}
              </div>
              {state && (
                <form onSubmit={(e) => {
                  e.preventDefault();
                  makeComment(commentText, item._id);
                }}>
                  <input
                    type='text'
                    placeholder='Add a comment'
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                  />
                </form>
              )}
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
