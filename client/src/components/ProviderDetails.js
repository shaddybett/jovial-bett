import React, { useEffect, useState, useRef } from "react";
import { Card, Label, Select } from "flowbite-react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import ServiceDropdown from "./ServiceDropdown";

function ProviderDetails() {
  const [selectedServices, setSelectedServices] = useState([]);
  const [error, setError] = useState("");
  const [middle_name, setMiddle] = useState("");
  const [phone_number, setNumber] = useState("");
  const [national_id, setN_id] = useState("");
  const [message, setMessage] = useState("");
  const [image, setImage] = useState(null);
  const navigate = useNavigate();
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [manualLocation, setManualLocation] = useState(false);
  const [allServices, setAllServices] = useState([]);
  const [newService, setNewService] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [counties, setCounties] = useState([]); // Initialize as empty array
  const [services, setServices] = useState([]);
  const [county, setCounty] = useState(""); // New state for county

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLatitude(position.coords.latitude);
        setLongitude(position.coords.longitude);
      },
      (error) => {
        console.error(error);
        setManualLocation(true);
      }
    );
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/offers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const responseData = await response.json();
        setServices(responseData.services || []);
      } else {
        const errorMessage = await response.json();
        setError(errorMessage.error);
      }
    } catch (error) {
      setError("An error occurred. Please try again later.");
    }
  };

  const fetchAllServices = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/service", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const responseData = await response.json();
        setAllServices(responseData.all_services || []);
      } else {
        const errorMessage = await response.json();
        setError(errorMessage.error);
      }
    } catch (error) {
      setError("An error occurred. Please try again later.");
    }
  };

  const fetchAllCounties = async () => {
    try {
      const response = await fetch("/county", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        const responseData = await response.json();
        console.log("Counties data:", responseData); // Debugging line
        setCounties(responseData.all_counties || []);
      } else {
        setError("Error fetching all counties");
      }
    } catch (error) {
      setError("An error occurred. Please try again later.");
    }
  };

  const handleAddService = async () => {
    const result = await Swal.fire({
      title: "Are you sure?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Add Service!",
    });
    if (result.isConfirmed) {
      const token = localStorage.getItem("token");
      try {
        const response = await fetch("/add-service", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            service_name: newService,
            existing_services: selectedServices.map((service) => service.id),
          }),
        });
        if (response.ok) {
          setNewService("");
          setError("");
          Swal.fire("Success", "Service added successfully", "success");
          fetchData();
        } else {
          const errorMessage = await response.json();
          if (
            errorMessage.error ===
            "Service entered already exists,please mark from the list provided"
          ) {
            setError(errorMessage.error);
            setNewService("");
            fetchAllServices();
            if (
              errorMessage.error === "At least one service must be provided" &&
              errorMessage.error === "Service is already registered" &&
              errorMessage.error === "Missing required fields"
            ) {
              const timer = setTimeout(() => {
                setError("");
              }, 5000);
              return () => clearTimeout(timer); // Cleanup the timer on component unmount or error change
            }
          } else {
            setError(errorMessage.error || "An error occurred");
          }
        }
      } catch (error) {
        setError("An error occurred. Please try again later");
      }
    }
  };

  const handleDeleteService = async (serviceId) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Delete!",
    });
    if (result.isConfirmed) {
      const token = localStorage.getItem("token");
      try {
        const response = await fetch(`/delete-service/${serviceId}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.ok) {
          Swal.fire("Success", "Service deleted successfully", "success");
          fetchData();
        } else {
          const errorMessage = await response.json();
          setError(errorMessage.error || "An error occurred");
        }
      } catch (error) {
        setError("An error occurred. Please try again later");
      }
    }
  };

  const handleCheckboxChange = (service) => {
    const selectedIndex = selectedServices.findIndex(
      (s) => s.id === service.id
    );
    if (selectedIndex === -1) {
      setSelectedServices([...selectedServices, service]);
    } else {
      setSelectedServices(selectedServices.filter((s) => s.id !== service.id));
    }
  };

  useEffect(() => {
    // Fetch counties when the component mounts
    fetchAllCounties();
  }, []);

  useEffect(() => {
    // Add event listener for clicks outside the dropdown when the dropdown is open
    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    // Cleanup function to remove event listener
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownOpen]);

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setDropdownOpen(false);
    }
  };

  const handleServiceFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const uuid = localStorage.getItem("signupUUID");

      const formData = new FormData();
      formData.append("image", image);
      formData.append("middle_name", middle_name);
      formData.append("national_id", national_id);
      formData.append("phone_number", phone_number);
      formData.append("uids", uuid);
      formData.append("latitude", latitude);
      formData.append("longitude", longitude);
      formData.append("county", county);

      const userDetailsResponse = await fetch("/signup2", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (userDetailsResponse.ok) {
        const userDetailsData = await userDetailsResponse.json();
        localStorage.setItem(
          "userDetailsData",
          JSON.stringify(userDetailsData)
        );
        setMessage("Services and user details added successfully");
        navigate("/providerPage");
      } else {
        const userDetailsErrors = await userDetailsResponse.json();
        setError(userDetailsErrors.error);
      }
    } catch (error) {
      setError(error.message || "An error occurred. Please try again later.");
    }
  };

  return (
    <div>
      <h1>Fill the forms below to complete your signup</h1>
      <form onSubmit={handleServiceFormSubmit}>
        <input
          type="text"
          placeholder="mama Junior"
          value={middle_name}
          onChange={(e) => setMiddle(e.target.value)}
        />
        <input
          type="text"
          placeholder="0722000000"
          value={phone_number}
          onChange={(e) => setNumber(e.target.value)}
        />
        <input
          type="text"
          placeholder="12345678"
          value={national_id}
          onChange={(e) => setN_id(e.target.value)}
        />
        <div>
          <label>
            <input
              type="checkbox"
              checked={manualLocation}
              onChange={() => setManualLocation(!manualLocation)}
            />
            Manually enter location
          </label>
          {manualLocation && (
            <>
              <input
                type="text"
                placeholder="Latitude"
                value={latitude || ""}
                onChange={(e) => setLatitude(e.target.value)}
              />
              <input
                type="text"
                placeholder="Longitude"
                value={longitude || ""}
                onChange={(e) => setLongitude(e.target.value)}
              />
            </>
          )}
        </div>
        <div className="mb-2 block">
          <Label htmlFor="file-upload" value={image ? image.name : ""} />
        </div>
        <input
          id="file-upload"
          type="file"
          onChange={(e) => setImage(e.target.files[0])}
        />

        <button type="submit">Submit</button>
      </form>
      <Card className="max-w-sm">
        {/* <h1 className="text-xl font-bold leading-none text-gray-900 dark:text-white">
          Services you offer
        </h1>
        <div ref={dropdownRef}>
          {error &&
            error ===
              "Service entered already exists,please mark from the list provided" && (
              <div>
                <ServiceDropdown
                  services={allServices}
                  selectedServices={selectedServices}
                  handleCheckboxChange={handleCheckboxChange}
                />
              </div>
            )}
        </div>
        {services.length > 0 ? (
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {services.map((service) => (
              <li
                key={service.id}
                className="flex justify-between items-center"
              >
                <span>{service.name}</span>
                <button
                  className="text-red-500"
                  onClick={() => handleDeleteService(service.id)}
                >
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p>No services found</p>
        )}
        <div className="mt-4">
          <input
            className="rounded border border-blue-300 p-2"
            type="text"
            value={newService}
            onChange={(e) => setNewService(e.target.value)}
            placeholder="Add new service"
          />
          <button
            className="ml-4 p-2 bg-blue-500 text-white rounded"
            onClick={handleAddService}
          >
            Add
          </button>
        </div> */}
        <div className="max-w-md">
          <div className="mb-2 block">
            <Label
              htmlFor="counties"
              value="Select your county"
            />
          </div>
          <Select
            id="counties"
            required
            value={county}
            onChange={(e) => setCounty(e.target.value)} // Update state on change
            className="text-black" // Ensure the text is visible
          >
            <option value="" disabled>
              Select your county
            </option>
            {counties.map((county) => (
              <option
                key={county.id}
                value={county.name}
                className="text-black"
              >
                {county.name}
              </option>
            ))}
          </Select>
        </div>
      </Card>
      {error && <p className="text-red-500">{error}</p>}
      {message && <p>{message}</p>}
    </div>
  );
}

export default ProviderDetails;
