/**
 *
 * OrderDetails
 *
 */

import axios from "axios";
import React, { useEffect, useState, useRef } from "react";
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

import { Map, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import { icon } from "leaflet";
import "leaflet/dist/leaflet.css";

const OrderDetails = (props) => {
  const { order, user, cancelOrder, updateOrderItemStatus, onBack } = props;
  const [orderLocation, setOrderLocation] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [currentLocationText, setCurrentLocationText] = useState("");
  const [shippingAddress, setShippingAddress] = useState("");
  const [addisAbabaCoords, setAddisAbabaCoords] = useState([9.033, 38.74]);

  const [city, setCity] = useState("");

  const [currentIndex, setCurrentIndex] = useState(0);

  const intermediatRoutes = [
    "Sendafa",
    "Sheno",
    "Debre Birhan",
    "Shewa Robit",
    "Ataye",
    "Karakore",
    "Harbu",
    "Weranso",
    "Logiya",
    "Dubti",
  ];

  useEffect(() => {
    const fetchInterval = setInterval(() => {
      setCurrentLocationText(intermediatRoutes[currentIndex]);
      setOrderLocation(intermediatRoutes[currentIndex]);
      setCurrentIndex((prevIndex) => {
        if (prevIndex + 1 >= intermediatRoutes.length) {
          clearInterval(fetchInterval);
          return prevIndex;
        }
        return prevIndex + 1;
      });
    }, 10000);

    return () => clearInterval(fetchInterval);
  }, [currentIndex]);

  useEffect(() => {
    if (orderLocation) {
      handleUpdateLocationV2();
    }
  }, [orderLocation]);

  const handleUpdateLocationV2 = async () => {
    try {
      const orderId = order._id;
      const newLocationName = orderLocation.trim();

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

      toast("Location Update successfully");
      console.log("Update Location response:", response.data);
      console.log(response.data.order.locations);
    } catch (error) {
      toast(`Error updating location: ${error}`);
    }
  };

  useEffect(() => {
    fetchCurrentLocation();
    fetchShippingAddress();
  }, []);

  const fetchShippingAddress = async () => {
    try {
      const response = await axios.get(`${API_URL}/address/user/${order.user}`);
      const defaultAddress = response.data.address;
      if (defaultAddress) {
        setCity(defaultAddress?.city);
        setShippingAddress(
          `${defaultAddress?.address} , ${defaultAddress?.region}, ${defaultAddress?.zone}, ${defaultAddress?.kebele}, ${defaultAddress?.city}`
        );
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

  const [currentLocationCoords, setCurrentLocationCoords] = useState([]);
  const [shippingLocationCoords, setShippingLocationCoords] = useState([]);

  useEffect(() => {
    if (currentLocationText) {
      fetchCoordinates(currentLocationText);
    }
    if (shippingAddress) {
      fetchShippingCoordinates(city);
    }
  }, [currentLocationText]);

  const fetchCoordinates = async (address) => {
    try {
      const apiKey = "66667e4a40729220571970fvn870b0c"; // Replace with your actual API key
      const apiUrl = `https://geocode.maps.co/search?q=${encodeURIComponent(
        address
      )}&api_key=${apiKey}`;

      const response = await fetch(apiUrl);
      const data = await response.json();
      console.log(data);

      const coordinates = [data[0].lat, data[0].lon]; // Reverse because Leaflet expects [lat, lon]
      setCurrentLocationCoords(coordinates);
      console.log(coordinates);
    } catch (error) {
      console.error("Error fetching coordinates:", error);
    }
  };

  const fetchShippingCoordinates = async (address) => {
    try {
      const apiKey = "66667e4a40729220571970fvn870b0c"; // Replace with your actual API key
      const apiUrl = `https://geocode.maps.co/search?q=${encodeURIComponent(
        address
      )}&api_key=${apiKey}`;

      const response = await fetch(apiUrl);
      const data = await response.json();
      console.log(data);

      const coordinates = [data[0].lat, data[0].lon]; // Reverse because Leaflet expects [lat, lon]
      setShippingLocationCoords(coordinates);
      console.log(coordinates);
    } catch (error) {
      console.error("Error fetching coordinates:", error);
    }
  };

  const mapIcon = icon({
    iconUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });

  const homeIcon = icon({
    iconUrl:
      "https://cdn.iconscout.com/icon/free/png-256/free-dot-22-433567.png?f=webp",
    iconSize: [30, 30],
    iconAnchor: [12, 41],
    popupAnchor: [-15, -34],
  });

  const destinationIcon = icon({
    iconUrl:
      "https://cdn.iconscout.com/icon/free/png-256/free-dot-22-433567.png?f=webp",
    iconSize: [30, 30],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  });

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
        <Col xs="12" lg="4" className="mt-5 mt-lg-4">
          <div>
            <h2>Order Shipping</h2>
            {(user.role === ROLES.Admin || user.role === ROLES.Merchant) && (
              <p>
                Shipping Address: {shippingAddress || "not yet put address"}
              </p>
            )}
            <p>
              Delivery Current Address: {currentLocationText || " At Store"}{" "}
            </p>
            {/* {renderLocationUpdate()} */}
          </div>
        </Col>

        <Col>
          {currentLocationCoords.length > 0 && (
            <Map
              center={currentLocationCoords}
              zoom={7}
              style={{ height: "400px", width: "100%" }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              {addisAbabaCoords.length > 0 && (
                <Marker position={addisAbabaCoords} icon={homeIcon}>
                  <Popup>Addis Ababa</Popup>
                </Marker>
              )}

              {shippingLocationCoords.length > 0 && (
                <Marker
                  position={shippingLocationCoords}
                  icon={destinationIcon}
                >
                  <Popup>Shipping Address</Popup>
                </Marker>
              )}
              <Marker position={currentLocationCoords} icon={mapIcon}>
                <Popup>{currentLocationText}</Popup>
              </Marker>

              {addisAbabaCoords.length > 0 &&
                shippingLocationCoords.length > 0 && (
                  <Polyline
                    positions={[
                      addisAbabaCoords,
                      currentLocationCoords,
                      shippingLocationCoords,
                    ]}
                    color="blue"
                  />
                )}
            </Map>
          )}
        </Col>

        <Col xs="12" lg="4" className="mt-5 mt-lg-4">
          <OrderSummary order={order} />
        </Col>
      </Row>
      <Toaster position="top-right" reverseOrder={false} />
    </div>
  );
};
export default OrderDetails;
