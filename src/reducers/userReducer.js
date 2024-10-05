export const initialState = {
    followers: [],
    following: [],
    pic: null, // Add a property for the profile picture if you want to store it in the state
    // Include other initial user properties if needed
};

export const reducer = (state, action) => {
    switch (action.type) {
        case "USER": // Action to set user data
            return action.payload;

        case "CLEAR": // Action to clear user data
            return null;

        case "UPDATE": // Action to update following/followers
            return {
                ...state,
                followers: action.payload.followers,
                following: action.payload.following,
            };

        case "UPDATEPIC": // Action to update the profile picture
            return {
                ...state,
                pic: action.payload, // Update the profile picture in the state
            };

        default:
            return state;
    }
};
