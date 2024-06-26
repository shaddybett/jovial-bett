import React, { useEffect, useState, useRef } from "react";
import { Card, Label, Select } from "flowbite-react";
import { useNavigate } from "react-router-dom";
function ProviderDetails() {

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
  // const [allServices, setAllServices] = useState([]);
  // const [newService, setNewService] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [counties, setCounties] = useState([]); // Initialize as empty array
  // const [services, setServices] = useState([]);
  const [county, setCounty] = useState(""); // New state for county
  const backendUrl = process.env.REACT_APP_BACKEND_URL;

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
  const fetchAllCounties = async () => {
    try {
      const response = await fetch(`${backendUrl}/county`, {
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

      const userDetailsResponse = await fetch(`${backendUrl}/signup2`, {
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
