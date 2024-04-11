import React, { useEffect, useState } from "react";
import { Dropdown } from "flowbite-react";
import {useNavigate} from 'react-router-dom'

function ProviderDetails() {
  const [data, setData] = useState([]);
  const [selectedServices, setSelectedServices] = useState([]);
  const [newServiceName, setNewServiceName] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [middleName,setMiddleName] = useState('')
  const [id,setId] = useState('')
  const [number,setNumber] = useState('')
  const [image,setImage] = useState('')
  const navigate = useNavigate()

  const handleDetails = async(e)=>{
    e.preventDefault()
    try{
      const token = localStorage.getItem(token)
      const response = await fetch('/signup',{
        method:'POST',
        headers:{
          'Content-Type':'application/json',
          Authorization:`Bearer ${token}`
        },
        body:JSON.stringify({middleName,id,number,image})
      })
      if (response.ok){
        const message = await  response.json()
        setMessage(message)
        navigate("/providerPage")
      }
      else{
        const errorMessage = await response.json()
        setError(errorMessage)
      }
    }
    catch(error){
      setError("An error occurred.Please try again later.")
    }
  }

  const handleForm = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const id = localStorage.getItem("id");
      const requestBody = {
        user_id: id,
        existing_services: selectedServices.map((service) => service.id),
        service_name: newServiceName.trim() !== "" ? newServiceName : null,
      };

      const response = await fetch("/service", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestBody),
      });

      if (response.ok) {
        const responseData = await response.json();
        setMessage(responseData.message);
      } else {
        const errors = await response.json();
        setError(errors.error);
      }
    } catch (error) {
      setError("An error occurred. Please try again later.");
    }
  };

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
      setSelectedServices(selectedServices.filter((s) => s.id !== service.id));
    }
  };

  return (
    <div>
      <form onSubmit={handleDetails}>
        <input type='text' placeholder='mamaJunior' value={middleName} onChange={(e)=>setMiddleName(e.target.value)} />
        <input type='text' placeholder='0722000000' value={number} onChange={(e)=>setNumber(e.target.value)} />
        <input type='text' placeholder='mamaJunior' value={middleName} onChange={(e)=>setMiddleName(e.target.value)} />
        <input type='text' placeholder='mamaJunior' value={middleName} onChange={(e)=>setMiddleName(e.target.value)} />

      </form>
      <form onSubmit={handleForm}>
        <Dropdown label="Services">
          {data &&
            data.map((service) => (
              <Dropdown.Item key={service.id} className="text-black">
                <label>
                  <input
                    type="checkbox"
                    value={service.id}
                    onChange={() => handleCheckboxChange(service)}
                    checked={selectedServices.some((s) => s.id === service.id)}
                  />
                  {service.name}
                </label>
              </Dropdown.Item>
            ))}
        </Dropdown>

        <input
          type="text"
          value={newServiceName}
          onChange={(e) => setNewServiceName(e.target.value)}
          placeholder="Enter new service name"
        />
        <button type="submit">Add Services</button>
      </form>
      {error && <p>{error}</p>}
      {message && <p>{message}</p>}
    </div>
  );
}

export default ProviderDetails;
