import React from "react";
import { ToastContainer } from "react-toastify";
import { BrowserRouter } from "react-router-dom";
import ReactDOM from "react-dom/client";
import App from "./App";
import "handsontable/dist/handsontable.full.min.css";
import "react-toastify/dist/ReactToastify.css";
import { registerAllModules } from "handsontable/registry";
import reportWebVitals from "./reportWebVitals";
//import mui and theme
import { ThemeProvider } from "@mui/material";
import { theme } from "./theme/theme";
import "./index.css";
//redux
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { persistor, store } from "./redux/store/store";

registerAllModules();

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <>
    <ThemeProvider theme={theme}>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <BrowserRouter>
            <App />
            <ToastContainer autoClose={1000} />
          </BrowserRouter>
        </PersistGate>
      </Provider>
    </ThemeProvider>
  </>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
