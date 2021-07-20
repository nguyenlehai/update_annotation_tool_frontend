import { useReducer } from "react";

export const DISPATCH_TYPE = {
  LOG_OUT: "LOG_OUT",
  LOAD_USER: "LOAD_USER",
};

const defaultAppState = {
  user: {},
};

const reducer = (state, action) => {
  switch (action.type) {
    case DISPATCH_TYPE.LOG_OUT:
      return defaultAppState;

    case DISPATCH_TYPE.LOAD_USER:
      return {
        ...state,
        user: action.payload,
      };

    default:
      return state;
  }
};

const useAppState = () => useReducer(reducer, defaultAppState);

export default useAppState;
