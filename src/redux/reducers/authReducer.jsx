import { LOGIN_SUCCESS, LOGOUT } from "../actions/authActions";

const initialState = {
    user: null,
    token: null,
    isAuthenticated: false,
};

const authReducer = (state = initialState, action) => {
    switch (action.type) {
        case LOGIN_SUCCESS:
            return {
                ...state,
                user: action.payload.user,
                token: action.payload.token,
                isAuthenticated: true,
            };
        case LOGOUT:
            return initialState;
        default:
            return state;
    }
};

export default authReducer;