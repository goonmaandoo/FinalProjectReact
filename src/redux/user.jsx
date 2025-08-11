// 액션 타입
const LOGIN_SUCCESS = "LOGIN_SUCCESS";
const LOGOUT = "LOGOUT";

// 액션 생성자
export const loginSuccess = (user, token) => {
    // 액션 생성자에서 localStorage에 저장
    try {
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
    } catch (e) {
        console.warn("localStorage 저장 실패", e);
    }

    return {
        type: LOGIN_SUCCESS,
        payload: { user, token },
    };
};

export const logout = () => {
    try {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
    } catch (e) {
        console.warn("localStorage 제거 실패", e);
    }

    return {
        type: LOGOUT,
    };
};


// 초기 상태
const initialState = {
    user: JSON.parse(localStorage.getItem("user")) || null,
    token: localStorage.getItem("token") || null,
    isAuthenticated: !!localStorage.getItem("token"),
    loading: false,
};
// 로그아웃 이후 반환할 깨끗한 상태를 명시적으로 정의
const clearedState = {
    user: null,
    token: null,
    isAuthenticated: false,
    loading: false,
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
                loading: false,
            };
        case LOGOUT:
            return {
                ...clearedState
            };
        default:
            return state;
    }
};

export default authReducer;