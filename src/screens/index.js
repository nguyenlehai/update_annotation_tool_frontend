import { lazy } from "react";
import { BrowserRouter } from "react-router-dom";

const Home = lazy(() => import("./Home"));

const Screens = () => (
  <BrowserRouter>
    <Home />
  </BrowserRouter>
);

export default Screens;
