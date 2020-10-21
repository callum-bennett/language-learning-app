export const AUTHENTICATE_USER = "authenticate_user";
export const REGISTER_USER = "register_user";

export const setAuthenticated = (token) => {
  return {
    type: AUTHENTICATE_USER,
    payload: {
      token,
    },
  };
};

export const registerUser = (email, password) => async (dispatch) => {};