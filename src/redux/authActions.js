export const setAuth = (user, role) => {
  return {
    type: "SET_AUTH",
    payload: { user, role },
  };
};

export const setLoading = (val) => {
  return {
    type: "SET_LOADING",
    payload: val,
  };
};

export const logoutAction = () => {
  return { type: "LOGOUT" };
};