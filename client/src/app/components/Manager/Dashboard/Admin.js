/*
 *
 * Admin
 *
 */

import React, { useEffect } from "react";

import { Route, Switch } from "react-router-dom";
import { Col, Row } from "reactstrap";

import Page404 from "../../Common/Page404";
import AccountMenu from "../AccountMenu";

import Account from "../../../containers/Account";
import AccountSecurity from "../../../containers/AccountSecurity";
import Address from "../../../containers/Address";
import Brand from "../../../containers/Brand";
import Category from "../../../containers/Category";
import Merchant from "../../../containers/Merchant";
import Order from "../../../containers/Order";
import Product from "../../../containers/Product";
import Review from "../../../containers/Review";
import Users from "../../../containers/Users";
import Wishlist from "../../../containers/WishList";

import { fetchProducts } from "../../../containers/Product/actions";

import store from "../../../store";

const Admin = (props) => {
  useEffect(() => {
    const fetchInterval = setInterval(() => {
      store.dispatch(fetchProducts());
    }, 100000000);

    return () => clearInterval(fetchInterval);
  }, []);
  return (
    <div className="admin">
      <Row>
        <Col xs="12" md="5" xl="3">
          <AccountMenu {...props} />
        </Col>
        <Col xs="12" md="7" xl="9">
          <div className="panel-body">
            <Switch>
              <Route exact path="/dashboard" component={Account} />
              <Route path="/dashboard/security" component={AccountSecurity} />
              <Route path="/dashboard/address" component={Address} />
              <Route path="/dashboard/product" component={Product} />
              <Route path="/dashboard/category" component={Category} />
              <Route path="/dashboard/brand" component={Brand} />
              <Route path="/dashboard/users" component={Users} />
              <Route path="/dashboard/merchant" component={Merchant} />
              <Route path="/dashboard/orders/customers" component={Order} />
              <Route path="/dashboard/review" component={Review} />
              <Route path="/dashboard/wishlist" component={Wishlist} />
              <Route path="*" component={Page404} />
            </Switch>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default Admin;
