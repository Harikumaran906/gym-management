const initialState = {
  user: null,
  role: null, // "admin" | "member" | "user"
  loading: true,
};

export default function authReducer(state = initialState, action) {
  if (action.type === "SET_AUTH") {
    return {
      ...state,
      user: action.payload.user,
      role: action.payload.role,
      loading: false,
    };
  }

  if (action.type === "LOGOUT") {
    return {
      ...state,
      user: null,
      role: null,
      loading: false,
    };
  }

  if (action.type === "SET_LOADING") {
    return {
      ...state,
      loading: action.payload,
    };
  }

  return state;
}