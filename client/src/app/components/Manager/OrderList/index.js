/**
 *
 * OrderList
 *
 */

import React,{ useState, useEffect} from "react";

import { Link } from "react-router-dom";

import { formatDate } from "../../../utils/date";

import { ROLES } from "../../../constants";
import axios from "axios";
import { API_URL } from "../../../constants";

const OrderList = (props) => {
  const { orders, user, comefrom } = props;
  // console.log(user.merchant.branch);
  

console.log(orders)
  const [filteredOrders, setFilteredOrders] = useState([]);
  useEffect(() => {
    const fetchOrdersAndFilter = async () => {
      try {
        const ordersWithUserInfo = await Promise.all(
          orders.map(async (order) => {
            // Fetch user information for each order
            // console.log(order.user)
            if (order.user) {
              const response = await axios.get(`${API_URL}/user/${order.user}`);
              const { branchBelong } = response.data;
              
              return { ...order, userBranchBelong: branchBelong };
            }
            return order;
          })
        );
        // console.log(ordersWithUserInfo)
        // Filter orders based on branchBelong equality
        const filteredOrders = ordersWithUserInfo.filter((order) => {
          return (
            order.userBranchBelong &&
            order.userBranchBelong == user.merchant.branch
          );
        });
        

        setFilteredOrders(filteredOrders);
      } catch (error) {
        console.error("Error fetching user information:", error);
      }
    };

    if (user.role === ROLES.Merchant && comefrom == "customer") {
      fetchOrdersAndFilter();
    } else {
      // If user is not a Merchant, show all orders
      setFilteredOrders(orders);
    }
  }, [orders, user]);
  console.log(filteredOrders)
  console.log(orders);
  const renderFirstItem = (order) => {
    if (order.products) {
      const product = order.products[0].product;
      return (
        <img
          className="item-image"
          src={`${
            product && product?.imageUrl
              ? product?.imageUrl
              : "/images/placeholder-image.png"
          }`}
        />
      );
    } else {
      return <img className="item-image" src="/images/placeholder-image.png" />;
    }
  };

  return (
    <div className="order-list">
      {filteredOrders.map((order, index) => {
        const { userBranchBelong, ...restOrder } = order;
        console.log(restOrder._id)
        return (
        <div key={index} className="order-box">
          <Link to={`/order/${restOrder._id}`} className="d-block box-link">
            <div className="d-flex flex-column flex-lg-row mb-3">
              <div className="order-first-item p-lg-3">
                {renderFirstItem(restOrder)}
              </div>
              <div className="d-flex flex-column flex-xl-row justify-content-between flex-1 ml-lg-2 mr-xl-4 p-3">
                <div className="order-details">
                  <div className="mb-1">
                    <span>Status</span>
                    {restOrder?.products ? (
                      <span className="order-label order-status">{` ${restOrder?.products[0].status}`}</span>
                    ) : (
                      <span className="order-label order-status">{` Unavailable`}</span>
                    )}
                  </div>
                  <div className="mb-1">
                    <span>Order #</span>
                    <span className="order-label">{` ${restOrder._id}`}</span>
                  </div>
                  <div className="mb-1">
                    <span>Ordered on</span>
                    <span className="order-label">{` ${formatDate(
                      restOrder.created
                    )}`}</span>
                  </div>
                  <div className="mb-1">
                    <span>Order Total</span>
                    <span className="order-label">{` $${
                      restOrder?.totalWithTax ? order?.totalWithTax : 0
                    }`}</span>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        </div>)})}
    </div>
  );
};

export default OrderList;
