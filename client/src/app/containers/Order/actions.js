/*
 *
 * Order actions
 *
 */

import { push } from 'connected-react-router';
import axios from 'axios';
import { success,info } from 'react-notification-system-redux';
import { ROLES } from '../../constants';

import {
  FETCH_ORDERS,
  FETCH_SEARCHED_ORDERS,
  FETCH_ORDER,
  UPDATE_ORDER_STATUS,
  SET_ORDERS_LOADING,
  SET_ADVANCED_FILTERS,
  CLEAR_ORDERS
} from './constants';

import { clearCart, getCartId } from '../Cart/actions';
import { toggleCart } from '../Navigation/actions';
import handleError from '../../utils/error';
import { API_URL } from '../../constants';

export const updateOrderStatus = value => {
  return {
    type: UPDATE_ORDER_STATUS,
    payload: value
  };
};

export const setOrderLoading = value => {
  return {
    type: SET_ORDERS_LOADING,
    payload: value
  };
};

export const fetchOrders = (page = 1) => {
  return async (dispatch, getState) => {
    try {
      dispatch(setOrderLoading(true));

      const response = await axios.get(`${API_URL}/order`, {
        params: {
          page: page ?? 1,
          limit: 20
        }
      });

      const { orders, totalPages, currentPage, count } = response.data;

      dispatch({
        type: FETCH_ORDERS,
        payload: orders
      });

      dispatch({
        type: SET_ADVANCED_FILTERS,
        payload: { totalPages, currentPage, count }
      });
    } catch (error) {
      dispatch(clearOrders());
      handleError(error, dispatch);
    } finally {
      dispatch(setOrderLoading(false));
    }
  };
};

export const fetchAccountOrders = (page = 1) => {
  return async (dispatch, getState) => {
    try {
      dispatch(setOrderLoading(true));

      const response = await axios.get(`${API_URL}/order/me`, {
        params: {
          page: page ?? 1,
          limit: 20
        }
      });

      const { orders, totalPages, currentPage, count } = response.data;

      dispatch({
        type: FETCH_ORDERS,
        payload: orders
      });

      dispatch({
        type: SET_ADVANCED_FILTERS,
        payload: { totalPages, currentPage, count }
      });
    } catch (error) {
      dispatch(clearOrders());
      handleError(error, dispatch);
    } finally {
      dispatch(setOrderLoading(false));
    }
  };
};

export const searchOrders = filter => {
  return async (dispatch, getState) => {
    try {
      dispatch(setOrderLoading(true));

      const response = await axios.get(`${API_URL}/order/search`, {
        params: {
          search: filter.value
        }
      });

      dispatch({
        type: FETCH_SEARCHED_ORDERS,
        payload: response.data.orders
      });
    } catch (error) {
      handleError(error, dispatch);
    } finally {
      dispatch(setOrderLoading(false));
    }
  };
};

export const fetchOrder = (id, withLoading = true) => {
  return async (dispatch, getState) => {
    try {
      if (withLoading) {
        dispatch(setOrderLoading(true));
      }

      const response = await axios.get(`${API_URL}/order/${id}`);

      dispatch({
        type: FETCH_ORDER,
        payload: response.data.order
      });
    } catch (error) {
      handleError(error, dispatch);
    } finally {
      if (withLoading) {
        dispatch(setOrderLoading(false));
      }
    }
  };
};

export const cancelOrder = () => {
  return async (dispatch, getState) => {
    try {
      const order = getState().order.order;

      await axios.delete(`${API_URL}/order/cancel/${order._id}`);

      dispatch(push(`/dashboard/orders`));
    } catch (error) {
      handleError(error, dispatch);
    }
  };
};

export const updateOrderItemStatus = (itemId, status) => {
  return async (dispatch, getState) => {
    try {
      const order = getState().order.order;

      const response = await axios.put(
        `${API_URL}/order/status/item/${itemId}`,
        {
          orderId: order._id,
          cartId: order.cartId,
          status
        }
      );

      if (response.data.orderCancelled) {
        dispatch(push(`/dashboard/orders`));
      } else {
        dispatch(updateOrderStatus({ itemId, status }));
        dispatch(fetchOrder(order._id, false));
      }

      const successfulOptions = {
        title: `${response.data.message}`,
        position: 'tr',
        autoDismiss: 1
      };

      dispatch(success(successfulOptions));
    } catch (error) {
      handleError(error, dispatch);
    }
  };
};

// export const fetchAllOrdersAction = () => {
//   return async (dispatch, getState) => {
//     try {
//       const response = await axios.get(`${API_URL}/order/me`);
//       console.log(response.data)
//       const result = response.data.allOrders.map((order) => ({
//         id: order._id,
//         location: order.locations[order.locations.length - 1],
//       }));
      
      

//       result.forEach((item) => {
//         const { id, location } = item;
//         const successfulOptions = {
//           title: `Order: ${id} \n Location: ${location}`,
//           position: 'tr',
//           autoDismiss: 1
//         };
  
//         dispatch(success(successfulOptions));
//         console.log("Order", id, "is in", location);
//       });
//     } catch (error) {
//       console.error("Error fetching order :", error);
//     }
//   };
// };

// export const fetchAllOrdersAction = () => {
//   return async (dispatch, getState) => {
//     try {
//       const response = await axios.get(`${API_URL}/order/me`);
//       const allOrders = response.data.allOrders;
//       const orders = response.data.orders;

//       allOrders.forEach((allOrder) => {
//         const orderId = allOrder._id;
//         const location = allOrder.locations[allOrder.locations.length - 1];
//         const order = orders.find((order) => order._id === orderId);
//         if (order) {
//           const products = order.products.map((product) => ({
//             name: product.product.name,
//             status: product.status
//           }));

//           // Construct the message for each order
//           let orderMessage = `Order Id: ${orderId}\n`;
//           products.forEach((product) => {
//             orderMessage += `Product: ${product.name}   Status: ${product.status}\n`;
//           });
//           orderMessage += "------\nLocation: " + location;

//           const successfulOptions = {
//             title: orderMessage,
//             position: 'tr',
//             autoDismiss: 1
//           };

//           dispatch(success(successfulOptions));
//         }
//       });
//     } catch (error) {
//       console.error("Error fetching order :", error);
//     }
//   };
// };

export const fetchAllOrdersAction = () => {
  return async (dispatch, getState) => {
    try { // Assuming you have access to the user's role in your Redux state
      // if (getState().account.user.role != "ROLE MEMBER")
      //   return
    
      const response = await axios.get(`${API_URL}/order/me`);
      const allOrders = response.data.allOrders;
      const orders = response.data.orders;

      allOrders.forEach((allOrder) => {
        const orderId = allOrder._id;
        const orderLocation = allOrder.locations[allOrder.locations.length - 1];
        const order = orders.find((order) => order._id === orderId);
        if (order) {
          const products = order.products;

          products.forEach((product, index) => {
            const productName = product.product.name;
            const productStatus = product.status;
            let includeLocation = false;

            // Check if product status is "Shipped"
            if (productStatus === "Shipped") {
              includeLocation = true;
            }

            // Construct the message for each product
            let orderMessage = `Order Id: ${orderId}\n`;
            orderMessage += `Product Name: ${productName}\n`;
            orderMessage += `Status: ${productStatus}\n`;

            // Include location in the message if at least one product is shipped
            if (includeLocation) {
              orderMessage += `Location: ${orderLocation}\n`;
            }

            const successfulOptions = {
              title: orderMessage,
              position: 'tr',
              autoDismiss: 10
            };

            dispatch(info(successfulOptions));
          });
        }
      });
    } catch (error) {
      console.error("Error fetching order :", error);
    }
  };
};




export const addOrder = () => {
  return async (dispatch, getState) => {
    try {
      const cartId = localStorage.getItem('cart_id');
      const total = getState().cart.cartTotal;

      if (cartId) {
        const response = await axios.post(`${API_URL}/order/add`, {
          cartId,
          total
        });

        dispatch(push(`/order/success/${response.data.order._id}`));
        dispatch(clearCart());
      }
    } catch (error) {
      handleError(error, dispatch);
    }
  };
};

export const placeOrder = () => {
  return (dispatch, getState) => {
    const token = localStorage.getItem('token');

    const cartItems = getState().cart.cartItems;

    if (token && cartItems.length > 0) {
      Promise.all([dispatch(getCartId())]).then(() => {
        dispatch(addOrder());
      });
    }

    dispatch(toggleCart());
  };
};

export const clearOrders = () => {
  return {
    type: CLEAR_ORDERS
  };
};
