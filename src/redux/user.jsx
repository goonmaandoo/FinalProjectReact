// 액션 타입
const LOGIN_SUCCESS = "LOGIN_SUCCESS";
const LOGOUT = "LOGOUT";

// 액션 생성자
export const loginSuccess = (user, token) => ({
    type: LOGIN_SUCCESS,
    payload: { user, token },
    loading: false,
});

export const logout = () => ({
    type: LOGOUT,
    loading: false,
});

// 초기 상태
const initialState = {
    user: null,
    token: null,
    isAuthenticated: false,
    loading: true,
};

// 리듀서
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