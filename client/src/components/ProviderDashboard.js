// import React, { useState, useEffect } from "react";
// import { Avatar, Dropdown, Navbar } from "flowbite-react";
// import { useNavigate } from "react-router-dom";
// import Swal from "sweetalert2";

// function ProviderDashboard() {
//   const [data, setData] = useState({});
//   const [services, setServices] = useState([]);
//   const [error, setError] = useState("");
//   const [newService, setNewService] = useState("");
//   const navigate = useNavigate();

//   const handleProfile = () => {
//     navigate("/profile");
//   };

//   const handleLogout = async () => {
//     const result = await Swal.fire({
//       title: "Are you sure?",
//       icon: "warning",
//       showCancelButton: true,
//       confirmButtonColor: "#3085d6",
//       cancelButtonColor: "#d33",
//       confirmButtonText: "Yes, Logout!",
//     });
//     if (result.isConfirmed) {
//       localStorage.removeItem("token");
//       navigate("/login");
//     }
//   };

//   useEffect(() => {
//     const handleEntry = async () => {
//       const token = localStorage.getItem("token");
//       try {
//         const response = await fetch("/dashboard", {
//           method: "GET",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//         });
//         if (response.ok) {
//           const responseData = await response.json();
//           setData(responseData);
//         } else {
//           const errorMessage = await response.json();
//           setError(errorMessage.error || "An error occurred");
//         }
//       } catch (error) {
//         setError("An error occurred. Please try again later");
//       }
//     };

//     const fetchData = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         const response = await fetch("/offers", {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//         });
//         if (response.ok) {
//           const responseData = await response.json();
//           setServices(responseData.services || []); // Ensure responseData.services is an array
//         } else {
//           const errorMessage = await response.json();
//           setError(
//             errorMessage.error
//           );
//         }
//       } catch (error) {
//         setError("An error occurred. Please try again later.");
//       }
//     };

//     fetchData();
//     handleEntry();
//   }, []);

//   const handleAddService = async () => {
//     const result = await Swal.fire({
//       title: "Are you sure?",
//       icon: "warning",
//       showCancelButton: true,
//       confirmButtonColor: "#3085d6",
//       cancelButtonColor: "#d33",
//       confirmButtonText: "Yes, Add Service!",
//     });
//     if (result.isConfirmed) {
//       const token = localStorage.getItem("token");
//       try {
//         const response = await fetch("/add-service", {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//           body: JSON.stringify({ service_name: newService }),
//         });
//         if (response.ok) {
//           setNewService("");
//           Swal.fire("Success", "Service added successfully", "success");
//           window.location.reload(); // Reload the entire page
//         } else {
//           const errorMessage = await response.json();
//           setError(errorMessage.error || "An error occurred");
//         }
//       } catch (error) {
//         setError("An error occurred. Please try again later");
//       }
//     }
//   };

//   const handleDeleteService = async (serviceId) => {
//     const result = await Swal.fire({
//       title: "Are you sure?",
//       icon: "warning",
//       showCancelButton: true,
//       confirmButtonColor: "#3085d6",
//       cancelButtonColor: "#d33",
//       confirmButtonText: "Yes, Delete!",
//     });
//     if (result.isConfirmed) {
//       const token = localStorage.getItem("token");
//       try {
//         const response = await fetch(`/delete-service/${serviceId}`, {
//           method: "DELETE",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//         });
//         if (response.ok) {
//           Swal.fire("Success", "Service deleted successfully", "success");
//           window.location.reload(); // Reload the entire page
//         } else {
//           const errorMessage = await response.json();
//           setError(errorMessage.error || "An error occurred");
//         }
//       } catch (error) {
//         setError("An error occurred. Please try again later");
//       }
//     }
//   };

//   return (
//     <div>
//       <Navbar fluid rounded className="bg-black ">
//         <div className="flex md:order-2">
//           <Dropdown
//             arrowIcon={false}
//             inline
//             label={<Avatar alt="User settings" img={data.image} rounded />}
//           >
//             <Dropdown.Header>
//               <span className="block text-sm">
//                 {data.first_name} {data.last_name}
//               </span>
//               <span className="block truncate text-sm font-medium">
//                 {data.email}
//               </span>
//             </Dropdown.Header>
//             <Dropdown.Item onClick={handleProfile}>Profile</Dropdown.Item>
//             <Dropdown.Divider />
//             <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
//           </Dropdown>
//           <Navbar.Toggle />
//         </div>
//         <Navbar.Collapse>
//           <Navbar.Link href="#" active></Navbar.Link>
//           <Navbar.Link href="#"></Navbar.Link>
//           <Navbar.Link href="#"></Navbar.Link>
//           <Navbar.Link href="#"></Navbar.Link>
//           <Navbar.Link href="#"></Navbar.Link>
//         </Navbar.Collapse>
//       </Navbar>
//       <div>
//         <h2>Hello, {data.first_name} welcome </h2>
//         <h1>Services you offer</h1>
//         {services.length > 0 ? (
//           <ul>
//             {services.map((service) => (
//               <li key={service.id}>
//                 {service.name}{" "}
//                 <button onClick={() => handleDeleteService(service.id)}>
//                   Delete
//                 </button>{" "}
//               </li>
//             ))}
//           </ul>
//         ) : (
//           <p>No services found</p>
//         )}
//       </div>
//       <div>
//         <input
//           type="text"
//           value={newService}
//           onChange={(e) => setNewService(e.target.value)}
//           placeholder="Add new service"
//         />
//         <button onClick={handleAddService}>Add Service</button>
//       </div>
//       {error && <p>{error}</p>}
//     </div>
//   );
// }

// export default ProviderDashboard;

import React, { useState, useEffect } from "react";
import { Avatar, Dropdown, Navbar } from "flowbite-react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

function ProviderDashboard() {
  const [data, setData] = useState({});
  const [services, setServices] = useState([]);
  const [error, setError] = useState("");
  const [newService, setNewService] = useState("");
  const [selectedServices, setSelectedServices] = useState([]);
  const navigate = useNavigate();

  const handleProfile = () => {
    navigate("/profile");
  };

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: "Are you sure?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Logout!",
    });
    if (result.isConfirmed) {
      localStorage.removeItem("token");
      navigate("/login");
    }
  };

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

  useEffect(() => {
    const handleEntry = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await fetch("/dashboard", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const responseData = await response.json();
          setData(responseData);
        } else {
          const errorMessage = await response.json();
          setError(errorMessage.error || "An error occurred");
        }
      } catch (error) {
        setError("An error occurred. Please try again later");
      }
    };

    fetchData();
    handleEntry();
  }, []);

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
          body: JSON.stringify({ service_name: newService }),
        });
        if (response.ok) {
          const responseData = await response.json();
          setNewService("");
          Swal.fire("Success", "Service added successfully", "success");
          fetchData();
        } else {
          const errorMessage = await response.json();
          setError(errorMessage.error || "An error occurred");
          if ((errorMessage.error = "Service already exists")) {
            useEffect(() => {
              const fetchData = async () => {
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
                    setData(responseData.all_services);
                  } else {
                    const errorMessage = await response.json();
                    setError(errorMessage.error);
                  }
                } catch (error) {
                  setError("An error occurred. Please try again later.");
                }
              };
              fetchData();
            }, []);
            const handleCheckboxChange = (service) => {
              const selectedIndex = selectedServices.findIndex(
                (s) => s.id === service.id
              );
              if (selectedIndex === -1) {
                setSelectedServices([...selectedServices, service]);
              } else {
                setSelectedServices(
                  selectedServices.filter((s) => s.id !== service.id)
                );
              }
            };
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

  return (
    <div>
      <Navbar fluid rounded className="bg-black ">
        <div className="flex md:order-2">
          <Dropdown
            arrowIcon={false}
            inline
            label={<Avatar alt="User settings" img={data.image} rounded />}
          >
            <Dropdown.Header>
              <span className="block text-sm">
                {data.first_name} {data.last_name}
              </span>
              <span className="block truncate text-sm font-medium">
                {data.email}
              </span>
            </Dropdown.Header>
            <Dropdown.Item onClick={handleProfile}>Profile</Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
          </Dropdown>
          <Navbar.Toggle />
        </div>
        <Navbar.Collapse>
          <Navbar.Link href="#" active></Navbar.Link>
          <Navbar.Link href="#"></Navbar.Link>
          <Navbar.Link href="#"></Navbar.Link>
          <Navbar.Link href="#"></Navbar.Link>
          <Navbar.Link href="#"></Navbar.Link>
        </Navbar.Collapse>
      </Navbar>
      <div>
        <h2>Hello, {data.first_name} welcome </h2>
        <h1>Services you offer</h1>
        {services.length > 0 ? (
          <ul>
            {services.map((service) => (
              <li key={service.id}>
                {service.name}{" "}
                <button onClick={() => handleDeleteService(service.id)}>
                  delete
                </button>{" "}
              </li>
            ))}
          </ul>
        ) : (
          <p>No services found</p>
        )}
      </div>
      <div>
        <input
          type="text"
          value={newService}
          onChange={(e) => setNewService(e.target.value)}
          placeholder="Add new service"
        />
        <button onClick={handleAddService}>Add Service</button>
      </div>
      {error && <p>{error}</p>}
    </div>
  );
}

export default ProviderDashboard;
