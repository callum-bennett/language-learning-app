import { createContext, createRef } from "react";

export const navigationRef = createRef();

export const navigate = (name, params) => {
  navigationRef.current?.navigate(name, params);
};

export const availableRoutes = () =>
  navigationRef.current?.getRootState().routeNames;

export const CategoryContext = createContext(null);
