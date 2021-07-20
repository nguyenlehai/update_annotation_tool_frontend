import "index.less";
import "utils/i18n";

import React, { createContext, Suspense, useEffect } from "react";
import ReactDOM from "react-dom";
import reportWebVitals from "reportWebVitals";
import SuspenseFallback from "components/SuspenseFallback";
import useAppState, { DISPATCH_TYPE } from "services/hooks/useAppState";
import Screens from "screens";
import { loadExistUser } from "utils";

export const AppContext = createContext();

const App = () => {
  const [app, dispatch] = useAppState();

  useEffect(() => {
    dispatch({
      type: DISPATCH_TYPE.LOAD_USER,
      payload: loadExistUser(),
    });
  }, [dispatch]);

  return (
    <AppContext.Provider value={[app, dispatch]}>
      <Screens />
    </AppContext.Provider>
  );
};

ReactDOM.render(
  <Suspense fallback={<SuspenseFallback />}>
    <App />
  </Suspense>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

export default App;
