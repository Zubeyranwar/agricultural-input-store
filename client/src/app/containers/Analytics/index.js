import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "../../constants";
import { Bar } from "react-chartjs-2";
import "chart.js/auto";
import "./Analytics.css";

import SubPage from "../../components/Manager/SubPage";

function Analytics() {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  const fetchAnalyticsData = async () => {
    try {
      const productCount = await axios.get(`${API_URL}/analytics/products`);
      const categoryCount = await axios.get(`${API_URL}/analytics/categories`);
      const userCount = await axios.get(`${API_URL}/analytics/users`);
      const orderCount = await axios.get(`${API_URL}/analytics/orders`);
      const processingOrdersCount = await axios.get(
        `${API_URL}/analytics/orders/processing`
      );
      const deliveredOrdersCount = await axios.get(
        `${API_URL}/analytics/orders/delivered`
      );
      const shippedOrdersCount = await axios.get(
        `${API_URL}/analytics/orders/shipped`
      );

      setAnalyticsData({
        productCount: productCount.data.productCount,
        categoryCount: categoryCount.data.categoryCount,
        userCount: userCount.data.userCount,
        orderCount: orderCount.data.orderCount,
        processingOrders: processingOrdersCount.data.processingOrdersCount,
        deliveredOrders: deliveredOrdersCount.data.deliveredOrdersCount,
        shippedOrders: shippedOrdersCount.data.shippedOrdersCount,
      });
      setLoading(false);
    } catch (error) {
      console.error("Error fetching analytics data:", error);
    }
  };

  const getChartData = () => {
    if (!analyticsData) return {};

    return {
      labels: ["Processing Orders", "Delivered Orders", "Shipped Orders"],
      datasets: [
        {
          label: "Order Counts",
          data: [
            analyticsData.processingOrders,
            analyticsData.deliveredOrders,
            analyticsData.shippedOrders,
          ],
          backgroundColor: ["#FFCE56", "#4BC0C0", "#FF6384"],
          borderColor: ["#36A2EB", "#FFCE56", "#4BC0C0", "#FF6384"],
          borderWidth: 1,
        },
      ],
    };
  };

  return (
    <div className="analytics-container">
      <SubPage title="Analytics" />
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="analytics-data">
          <div className="analytics-card">
            <p className="analytics-label">Number of Products:</p>
            <p className="analytics-value">{analyticsData.productCount}</p>
          </div>
          <div className="analytics-card">
            <p className="analytics-label">Number of Categories:</p>
            <p className="analytics-value">{analyticsData.categoryCount}</p>
          </div>
          <div className="analytics-card">
            <p className="analytics-label">Number of Users:</p>
            <p className="analytics-value">{analyticsData.userCount}</p>
          </div>
          <div className="analytics-card">
            <p className="analytics-label">Processing Orders:</p>
            <p className="analytics-value">{analyticsData.processingOrders}</p>
          </div>
          <div className="analytics-card">
            <p className="analytics-label">Delivered Orders:</p>
            <p className="analytics-value">{analyticsData.deliveredOrders}</p>
          </div>
          <div className="analytics-card">
            <p className="analytics-label">Shipped Orders:</p>
            <p className="analytics-value">{analyticsData.shippedOrders}</p>
          </div>
          <div
            className="analytics-chart"
            style={{ width: "100%", height: "400px" }}
          >
            <Bar
              data={getChartData()}
              options={{ responsive: true, maintainAspectRatio: false }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default Analytics;
