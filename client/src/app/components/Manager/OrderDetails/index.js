/**
 *
 * OrderDetails
 *
 */

import axios from "axios";
import React, { useEffect, useState } from "react";
import { success } from "react-notification-system-redux";

import toast, { Toaster } from "react-hot-toast";

import { Col, Row } from "reactstrap";

import "@geoapify/geocoder-autocomplete/styles/minimal.css";
import {
  GeoapifyContext,
  GeoapifyGeocoderAutocomplete,
} from "@geoapify/react-geocoder-autocomplete";

import Button from "../../Common/Button";

import { ROLES } from "../../../constants";
import { API_URL } from "../../../constants";

import OrderItems from "../OrderItems";
import OrderMeta from "../OrderMeta";
import OrderSummary from "../OrderSummary";

const OrderDetails = (props) => {
  const { order, user, cancelOrder, updateOrderItemStatus, onBack } = props;
  const [orderLocation, setOrderLocation] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [currentLocationText, setCurrentLocationText] = useState("");
  const [shippingAddress, setShippingAddress] = useState("");

  useEffect(() => {
    fetchCurrentLocation();
    fetchShippingAddress();
  }, []);

  const fetchShippingAddress = async () => {
    try {
      const response = await axios.get(`${API_URL}/address/user/${order.user}`);
      const defaultAddress = response.data.address;
      if (defaultAddress) {
        setShippingAddress(defaultAddress.address);
      } else {
        console.log("No default address found.");
      }
    } catch (error) {
      console.error("Error fetching shipping address:", error);
    }
  };

  const fetchCurrentLocation = async () => {
    try {
      const orderId = order._id;
      const response = await axios.get(`${API_URL}/order/${orderId}`);
      const { order: updatedOrder } = response.data;
      setCurrentLocationText(updatedOrder.latestLocation);
    } catch (error) {
      console.error("Error fetching current location:", error);
    }
  };

  const handleLocationChange = (value) => {
    setOrderLocation(value);
    handleAutoComplete(value);
    setSuggestions([]);
  };

  const handleUpdateLocation = async () => {
    try {
      const orderId = order._id;
      const newLocationName = orderLocation.trim();
      setCurrentLocationText(newLocationName);

      if (!newLocationName) {
        console.error("New location name is required.");
        return;
      }

      const newLocations = [newLocationName]; // Wrap new location name in an array

      const response = await axios.put(
        `${API_URL}/order/location/${orderId}`,
        { locations: newLocations } // Send an array with the new location name
      );
      setOrderLocation(""); // Reset order location state to clear the input field
      setSuggestions([]);
      console.log("Update Location response:", response.data);

      toast("Location Update succefully");
      console.log(response.data.order.locations);
    } catch (error) {
      toast(`Error updating location: ${error}`);
    }
  };

  const handleAutoComplete = async (searchText) => {
    try {
      const apiKey = "c6cf872d5125418083c861098d36db50";
      const apiUrl = `https://api.geoapify.com/v1/geocode/autocomplete?text=${searchText}&apiKey=${apiKey}`;

      const response = await axios.get(apiUrl);
      console.log("Autocomplete response:", response.data);

      const newSuggestions = response.data.features.map((feature) => ({
        id: feature.properties.id,
        name: feature.properties.formatted,
      }));

      setSuggestions(newSuggestions);
    } catch (error) {
      console.error("Error autocompleting location:", error);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setOrderLocation(suggestion.name);
    setSuggestions([]); // Clear suggestions after selection
  };

  const renderLocationUpdate = () => {
    const isAdmin = user.role != ROLES.Member;
    return (
      <>
        {isAdmin && (
          <>
            <GeoapifyContext apiKey="c6cf872d5125418083c861098d36db50">
              <GeoapifyGeocoderAutocomplete
                placeholder="Enter address here"
                value={orderLocation}
                placeSelect={(value) =>
                  handleLocationChange(value.properties.formatted)
                }
                suggestionsChange={(suggestions) => setSuggestions(suggestions)}
              />
            </GeoapifyContext>
            {/* Render suggestions */}
            <div
              className="suggestions-container"
              style={{ marginBottom: "15px" }}
            >
              {suggestions.map((suggestion, index) => (
                <div
                  key={index}
                  className="suggestion"
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  {suggestion.name}
                </div>
              ))}
            </div>
            <Button text="Update Location" onClick={handleUpdateLocation} />
          </>
        )}
      </>
    );
  };

  return (
    <div className="order-details">
      <Row>
        <Col xs="12" md="12">
          <OrderMeta
            order={order}
            cancelOrder={cancelOrder}
            onBack={onBack}
            user={user}
          />
        </Col>
      </Row>
      <Row className="mt-5">
        <Col xs="12" lg="8">
          <OrderItems
            order={order}
            user={user}
            updateOrderItemStatus={updateOrderItemStatus}
          />
        </Col>
        <Col xs="12" lg="4" className="mt-5 mt-lg-0">
          <div>
            <h2>Order Shipping</h2>
            {user.role === ROLES.Admin && (
              <p>Shipping Address:{shippingAddress || "not yet implmented"}</p>
            )}
            <p>
              Delivery Current Address: {currentLocationText || " At Store"}{" "}
            </p>
            {renderLocationUpdate()}
          </div>
        </Col>
        <Col xs="12" lg="4" className="mt-5 mt-lg-0">
          <OrderSummary order={order} />
        </Col>
      </Row>
      <Toaster position="top-right" reverseOrder={false} />
    </div>
  );
};
export default OrderDetails;
