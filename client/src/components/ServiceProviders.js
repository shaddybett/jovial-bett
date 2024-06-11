// import React, { useEffect, useState } from "react";
// import { Card, Avatar } from "flowbite-react";
// import UserDetailsPopup from "./UserDetailsPopup";
// import { getDistance } from "geolib";

// function ServiceProviders() {
//   const [providers, setProviders] = useState([]);
//   const [selectedUser, setSelectedUser] = useState(null);
//   const [clientLocation, setClientLocation] = useState({
//     latitude: null,
//     longitude: null,
//   });

//   useEffect(() => {
//     navigator.geolocation.getCurrentPosition(
//       (position) => {
//         setClientLocation({
//           latitude: position.coords.latitude,
//           longitude: position.coords.longitude,
//         });
//       },
//       (error) => console.error(error)
//     );
//     const fetchProviderDetails = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         const providerIds = JSON.parse(localStorage.getItem("providerIds"));

//         const response = await fetch(
//           `/provider-details?provider_ids=${providerIds.join(",")}`,
//           {
//             method: "GET",
//             headers: {
//               "Content-Type": "application/json",
//               Authorization: `Bearer ${token}`,
//             },
//           }
//         );
//         if (response.ok) {
//           const providerDetails = await response.json();
//           setProviders(providerDetails);
//         } else {
//           throw new Error("Failed to fetch provider details");
//         }
//       } catch (error) {
//         console.error("Error fetching provider details:", error);
//       }
//     };

//     fetchProviderDetails();
//   }, []);

//   useEffect(() => {
//     if (
//       clientLocation.latitude &&
//       clientLocation.longitude &&
//       providers.length > 0
//     ) {
//       const sortedProviders = [...providers].sort((a, b) => {
//         const distanceA = getDistance(clientLocation, {
//           latitude: a.latitude,
//           longitude: a.longitude,
//         });
//         const distanceB = getDistance(clientLocation, {
//           latitude: b.latitude,
//           longitude: b.longitude,
//         });
//         return distanceA - distanceB;
//       });
//       setProviders(sortedProviders);
//     }
//   }, [clientLocation, providers]);

//   const handleProviderClick = async (provider) => {
//     try {
//       const token = localStorage.getItem("token");
//       const response = await fetch(`/user-details?email=${provider.email}`, {
//         method: "GET",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       if (response.ok) {
//         const userDetails = await response.json();
//         setSelectedUser(userDetails);
//       } else {
//         throw new Error("Failed to fetch user details");
//       }
//     } catch (error) {
//       console.error("Error fetching user details:", error);
//     }
//   };

//   const closePopup = () => {
//     setSelectedUser(null);
//   };
//   return (
//     <div>
//       <Card className="max-w-sm">
//         <div className="mb-4 flex items-center justify-between">
//           <h5 className="text-xl font-bold leading-none text-gray-900 dark:text-white">
//             Service Providers
//           </h5>
//         </div>
//         <div className="flow-root">
//           <ul className="divide-y divide-gray-200 dark:divide-gray-700">
//             {providers.map((provider, index) => (
//               <li
//                 key={index}
//                 className="py-3 sm:py-4 cursor-pointer"
//                 onClick={() => handleProviderClick(provider)}
//               >
//                 <div className="flex items-center space-x-4">
//                   <div className="shrink-0">
//                     <img
//                       alt={Avatar}
//                       height="32"
//                       src={provider.image}
//                       width="32"
//                       className="rounded-full"
//                     />
//                   </div>
//                   <div className="min-w-0 flex-1">
//                     <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
//                       {provider.first_name} {provider.last_name}
//                     </p>
//                     <p className="truncate text-sm text-gray-500 dark:text-gray-400">
//                       {provider.email}
//                     </p>
//                   </div>
//                 </div>
//               </li>
//             ))}
//           </ul>
//         </div>
//       </Card>
//       {selectedUser && (
//         <UserDetailsPopup user={selectedUser} onClose={closePopup} />
//       )}
//     </div>
//   );
// }

// export default ServiceProviders;

import React, { useEffect, useState } from "react";
import { Card, Avatar } from "flowbite-react";
import UserDetailsPopup from "./UserDetailsPopup";
import { getDistance } from "geolib";

function ServiceProviders() {
  const [providers, setProviders] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [clientLocation, setClientLocation] = useState({ latitude: null, longitude: null });

  useEffect(() => {
    // Get client's location from local storage
    const storedLocation = JSON.parse(localStorage.getItem("clientLocation"));
    if (storedLocation) {
      setClientLocation(storedLocation);
    }
  }, []);

  useEffect(() => {
    const fetchProviderDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        const providerIds = JSON.parse(localStorage.getItem("providerIds"));

        if (!clientLocation.latitude || !clientLocation.longitude) {
          return; // Wait until location is available
        }

        const response = await fetch(
          `/provider-details?provider_ids=${providerIds.join(",")}&client_lat=${clientLocation.latitude}&client_lon=${clientLocation.longitude}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.ok) {
          const providerDetails = await response.json();
          setProviders(providerDetails);
        } else {
          throw new Error("Failed to fetch provider details");
        }
      } catch (error) {
        console.error("Error fetching provider details:", error);
      }
    };

    if (clientLocation.latitude && clientLocation.longitude) {
      fetchProviderDetails();
    }
  }, [clientLocation]);

  useEffect(() => {
    if (clientLocation.latitude && clientLocation.longitude && providers.length > 0) {
      const sortedProviders = [...providers].sort((a, b) => {
        const distanceA = getDistance(clientLocation, { latitude: a.latitude, longitude: a.longitude });
        const distanceB = getDistance(clientLocation, { latitude: b.latitude, longitude: b.longitude });
        return distanceA - distanceB;
      });
      setProviders(sortedProviders);
    }
  }, [clientLocation, providers]);

  const handleProviderClick = async (provider) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`/user-details?email=${provider.email}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const userDetails = await response.json();
        setSelectedUser(userDetails);
      } else {
        throw new Error("Failed to fetch user details");
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  const closePopup = () => {
    setSelectedUser(null);
  };

  return (
    <div>
      <Card className="max-w-sm">
        <div className="mb-4 flex items-center justify-between">
          <h5 className="text-xl font-bold leading-none text-gray-900 dark:text-white">Service Providers</h5>
        </div>
        <div className="flow-root">
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {providers.map((provider, index) => (
              <li key={index} className="py-3 sm:py-4 cursor-pointer" onClick={() => handleProviderClick(provider)}>
                <div className="flex items-center space-x-4">
                  <div className="shrink-0">
                    <img
                      alt={Avatar}
                      height="32"
                      src={provider.image}
                      width="32"
                      className="rounded-full"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
                      {provider.first_name} {provider.last_name}
                    </p>
                    <p className="truncate text-sm text-gray-500 dark:text-gray-400">{provider.email}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </Card>
      {selectedUser && <UserDetailsPopup user={selectedUser} onClose={closePopup} />}
    </div>
  );
}

export default ServiceProviders;
