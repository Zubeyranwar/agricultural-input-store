/**
 *
 * OrderMeta
 *
 */

import axios from "axios";
import React, { useEffect, useState } from "react";
import { API_URL } from "../../../constants";

import { Col, Row } from "reactstrap";

import { CART_ITEM_STATUS } from "../../../constants";
import { formatDate } from "../../../utils/date";
import Button from "../../Common/Button";
import { ArrowBackIcon } from "../../Common/Icon";

const OrderMeta = (props) => {
  const { order, cancelOrder, onBack } = props;
  const [userName, setUserName] = useState("");
  console.log(order.user);

  useEffect(() => {
    const fetchUserName = async () => {
      try {
        const response = await axios.get(`${API_URL}/user/${order.user}`);
        const { firstName, lastName } = response.data;
        setUserName(`${firstName} ${lastName}`);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    fetchUserName();
  }, [order.user]);

  const renderMetaAction = () => {
    const isNotDelivered =
      order.products.filter((i) => i.status === CART_ITEM_STATUS.Delivered)
        .length < 1;

    if (isNotDelivered) {
      return <Button size="sm" text="Cancel Order" onClick={cancelOrder} />;
    }
  };

  return (
    <div className="order-meta">
      <div className="d-flex align-items-center justify-content-between mb-3 title">
        <h2 className="mb-0">Order Details</h2>
        <Button
          variant="link"
          icon={<ArrowBackIcon />}
          size="sm"
          text="Back to orders"
          onClick={onBack}
        ></Button>
      </div>

      <Row>
        <Col xs="12" md="8">
          <Row>
            <Col xs="4">
              <p className="one-line-ellipsis">Order ID</p>
            </Col>
            <Col xs="8">
              <span className="order-label one-line-ellipsis">{` ${order._id}`}</span>
            </Col>
          </Row>
          <Row>
            <Col xs="4">
              <p className="one-line-ellipsis">Order Date</p>
            </Col>
            <Col xs="8">
              <span className="order-label one-line-ellipsis">{` ${formatDate(
                order.created
              )}`}</span>
            </Col>
          </Row>
          <Row>
            <Col xs="4">
              <p className="one-line-ellipsis">User</p>
            </Col>
            <Col xs="8">
              <span className="order-label one-line-ellipsis">{userName}</span>
            </Col>
          </Row>
        </Col>
        <Col xs="12" md="4" className="text-left text-md-right">
          {renderMetaAction()}
        </Col>
      </Row>
    </div>
  );
};

export default OrderMeta;
