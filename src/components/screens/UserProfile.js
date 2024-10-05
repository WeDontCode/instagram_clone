import React, { useEffect, useState, useContext, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { UserContext } from '../../App';

const Profile = () => {
    const [userProfile, setProfile] = useState(null);
    const [isFollowing, setIsFollowing] = useState(false);
    const { state, dispatch } = useContext(UserContext);
    const { userid } = useParams();

    // Remove setShowFollow if it's not used
    const fetchUserProfile = useCallback(async () => {
        try {
            const response = await fetch(`/user/${userid}`, {
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("jwt"),
                },
            });
            const result = await response.json();
            if (result && result.user) {
                setProfile(result);
                setIsFollowing(result.user.followers.includes(state._id));
            }
        } catch (error) {
            console.error("Error fetching user profile:", error);
        }
    }, [userid, state]);

    useEffect(() => {
        fetchUserProfile();
    }, [fetchUserProfile]); // use fetchUserProfile as a dependency

    const updateProfileState = (data) => {
        setProfile((prevState) => ({
            ...prevState,
            user: {
                ...prevState.user,
                followers: data.followers || [],
                following: data.following || [],
            },
        }));
    };

    const unfollowUser = async () => {
        try {
            const response = await fetch('/unfollow', {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + localStorage.getItem('jwt'),
                },
                body: JSON.stringify({ unfollowId: userid }),
            });
            const data = await response.json();
            if (data && data.followers) {
                dispatch({ type: "UPDATE", payload: { following: data.following, followers: data.followers } });
                localStorage.setItem("user", JSON.stringify(data));
                updateProfileState(data);
                setIsFollowing(false);
            }
        } catch (err) {
            console.error("Error unfollowing user:", err);
        }
    };

    const followUser = async () => {
        try {
            const response = await fetch('/follow', {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + localStorage.getItem('jwt'),
                },
                body: JSON.stringify({ followId: userid }),
            });
            const data = await response.json();
            if (data && data.followers) {
                dispatch({ type: "UPDATE", payload: { following: data.following, followers: data.followers } });
                localStorage.setItem("user", JSON.stringify(data));
                updateProfileState(data);
                setIsFollowing(true);
            }
        } catch (err) {
            console.error("Error following user:", err);
        }
    };

    return (
        <>
            {userProfile ? (
                <div style={{ maxWidth: '550px', margin: '0px auto' }}>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'flex-start',
                        margin: '18px 0px',
                        alignItems: 'center',
                        borderBottom: '1px solid grey',
                    }}>
                        <div>
                            <img
                                style={{
                                    width: '160px',
                                    height: '160px',
                                    borderRadius: '80px',
                                }}
                                src={userProfile.user.pic || "https://via.placeholder.com/160"} // Default image if none
                                alt="User Profile"
                            />
                        </div>
                        <div style={{ marginLeft: '20px' }}>
                            <h4>{userProfile.user.name}</h4>
                            <h5>{userProfile.user.email}</h5>
                            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '300px' }}>
                                <h6>{Array.isArray(userProfile.posts) ? userProfile.posts.length : 0} posts</h6>
                                <h6>{Array.isArray(userProfile.user.followers) ? userProfile.user.followers.length : 0} followers</h6>
                                <h6>{Array.isArray(userProfile.user.following) ? userProfile.user.following.length : 0} following</h6>
                            </div>
                            {state && !state.followers.includes(userid) && (
                                <button
                                    style={{ margin: "10px" }}
                                    className="btn waves-effect waves-light #64b5f6 blue darken-1"
                                    onClick={isFollowing ? unfollowUser : followUser}
                                >
                                    {isFollowing ? 'Unfollow' : 'Follow'}
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="gallery">
                        {Array.isArray(userProfile.posts) && userProfile.posts.length > 0 ? (
                            userProfile.posts.map((item, index) => (
                                <img key={index} className="item" src={item.photo} alt={item.title} />
                            ))
                        ) : (
                            <h5>No posts available</h5>
                        )}
                    </div>
                </div>
            ) : (
                <h2>Loading profile...</h2>
            )}
        </>
    );
};

export default Profile;
