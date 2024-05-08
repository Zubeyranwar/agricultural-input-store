/**
 *
 * app.js
 *
 */

import React, { useEffect } from "react";

import { fetchAllOrdersAction } from "./containers/Order/actions";

import { ConnectedRouter } from "connected-react-router";
import { Provider } from "react-redux";
import Application from "./containers/Application";
import { SET_AUTH } from "./containers/Authentication/constants";
import { SocketProvider } from "./contexts/Socket";
import ScrollToTop from "./scrollToTop";
import store, { history } from "./store";
import setToken from "./utils/token";

// Import application sass styles
import "./styles/style.scss";

// Import Font Awesome Icons Set
import "font-awesome/css/font-awesome.min.css";

// Import Simple Line Icons Set
import "simple-line-icons/css/simple-line-icons.css";

// react-bootstrap-table2 styles
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";

// rc-slider style
import "rc-slider/assets/index.css";

// Authentication
const token = localStorage.getItem("token");

if (token) {
  // authenticate api authorization
  setToken(token);

  // authenticate routes
  store.dispatch({ type: SET_AUTH });
}

// const fetchAllOrders = async () => {
//   try {
//     const response = await axios.get(`${API_URL}/order/me`);
//     const result = response.data.allOrders.map((order) => ({
//       id: order._id,
//       location: order.locations[order.locations.length - 1],
//     }));

//     result.forEach((item) => {
//       const { id, location } = item;
//       toast(`Order ${id} is in ${location}`);
//       console.log("hellow world");
//     });
//   } catch (error) {
//     console.error("Error fetching order :", error);
//   }
// };
const app = () => {
  useEffect(() => {
    const fetchInterval = setInterval(() => {
      store.dispatch(fetchAllOrdersAction());
    }, 3000000);

    return () => clearInterval(fetchInterval);
  }, []);
  return (
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <SocketProvider>
          <ScrollToTop>
            <Application />
          </ScrollToTop>
        </SocketProvider>
      </ConnectedRouter>
    </Provider>
  );
};

export default app;
