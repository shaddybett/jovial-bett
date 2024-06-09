import React, { useState } from "react";

const ServiceDropdown = ({
  services,
  selectedServices,
  handleCheckboxChange,
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredServices = services.filter((service) =>
    service.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="relative max-h-40 overflow-y-auto">
      {" "}
      {/* Apply max-h-40 here */}
      <input
        type="text"
        placeholder="Search services..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full px-4 py-2 border border-gray-300 rounded-md mb-4 focus:outline-none focus:border-blue-500"
      />
      <div>
        {filteredServices.map((service) => (
          <label key={service.id} className="block mb-2">
            <input
              type="checkbox"
              value={service.id}
              onChange={() => handleCheckboxChange(service)}
              checked={selectedServices.some((s) => s.id === service.id)}
              className="mr-2"
            />
            {service.name}
          </label>
        ))}
      </div>
    </div>
  );
};

export default ServiceDropdown;
