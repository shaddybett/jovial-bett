import React, { useEffect, useState } from "react";
import {
  Card,
  Avatar,
  Button,
  TextInput,
  Label,
  Checkbox,
} from "flowbite-react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

function Profile() {
  const [data, setData] = useState({});
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [image, setImage] = useState(null);
  const [form, setForm] = useState({
    first_name: "",
    middle_name: "",
    last_name: "",
    national_id: "",
    phone_number: "",
    password: "",
  });
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const navigate = useNavigate();
  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    const handleEntry = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("Token not found");
        }
        const response = await fetch(`${backendUrl}/dashboard`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const responseData = await response.json();
          setData(responseData);
          setForm({
            first_name: responseData.first_name || "",
            middle_name: responseData.middle_name || "",
            last_name: responseData.last_name || "",
            national_id: responseData.national_id || "",
            phone_number: responseData.phone_number || "",
            password: "",
          });
        } else {
          const errorMessage = await response.json();
          setError(errorMessage || "An error occurred");
        }
      } catch (error) {
        setError("An error occurred. Please try again later.");
      }
    };
    handleEntry();
  }, [refresh]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value,
    });
    if (name === "password" && value) {
      setPasswordError(false);
    }
  };
  const handleDelete = async () => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });
    if (result.isConfirmed) {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("Token not found");
        }
        const response = await fetch(`${backendUrl}/delete`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const responseData = await response.json();
          setMessage(responseData.message);
          navigate("/");
        } else {
          const errorMessage = await response.json();
          setError(errorMessage.error || "An error occurred");
        }
      } catch (error) {
        setError("An error occurred. Please try again later.");
      }
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.password) {
      setPasswordError(true);
      return;
    }
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Token not found");
      }

      const updatedFields = {};
      Object.keys(form).forEach((key) => {
        if (form[key]) {
          updatedFields[key] = form[key];
        }
      });
      const formData = new FormData();
      formData.append("image", image);
      const imageResponse = await fetch(`${backendUrl}/update-image`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const response = await fetch(`${backendUrl}/update`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedFields),
      });

      if (response.ok && imageResponse.ok) {
        const responseData = await response.json();
        setMessage(responseData.message);
        setRefresh(!refresh);
        setShowUpdateForm(false);
      } else {
        const errorMessage = await response.json();
        setError(errorMessage.error || "An error occurred");
        if (
          errorMessage.error ===
          "Either the current password or a new one is required"
        ) {
          setPasswordError(true);
        }
      }
    } catch (error) {
      setError("An error occurred. Please try again later.");
    }
  };
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);
  return (
    <div className="flex flex-col items-center">
      <div className="flex justify-between w-full max-w-4xl mt-20">
        <Card className="max-w-sm">
          <div className="flex items-center gap-5 mt-10 ml-5">
            <Avatar img={data.image} size="xl" />
            <div>
              <h3 className="text-l font-bold tracking-tight text-gray-900 dark:text-white">
                Name:{" "}
                <p className="font-normal text-gray-700 dark:text-gray-400">
                  {data.first_name} {data.middle_name} {data.last_name}
                </p>
              </h3>
              <h3 className="text-l font-bold tracking-tight text-gray-900 dark:text-white">
                Email:{" "}
                <p className="font-normal text-gray-700 dark:text-gray-400">
                  {data.email}
                </p>
              </h3>
              <h3 className="text-l font-bold tracking-tight text-gray-900 dark:text-white">
                Phone Number:{" "}
                <p className="font-normal text-gray-700 dark:text-gray-400">
                  {data.phone_number}
                </p>
              </h3>
              <h3 className="text-l font-bold tracking-tight text-gray-900 dark:text-white">
                National Id:{" "}
                <p className="font-normal text-gray-700 dark:text-gray-400">
                  {data.national_id}
                </p>
              </h3>
            </div>
          </div>
          <Button
            className="mt-5"
            onClick={() => setShowUpdateForm(!showUpdateForm)}
          >
            Update
          </Button>
          <Button className="mt-5" onClick={handleDelete} color="failure">
            Delete Account
          </Button>
        </Card>
        {showUpdateForm && (
          <Card className="max-w-sm ml-10">
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <Label htmlFor="first_name" value="First Name" />
                <TextInput
                  id="first_name"
                  name="first_name"
                  type="text"
                  value={form.first_name}
                  onChange={handleChange}
                />
              </div>
              <div className="mb-4">
                <Label htmlFor="middle_name" value="Middle Name" />
                <TextInput
                  id="middle_name"
                  name="middle_name"
                  type="text"
                  value={form.middle_name}
                  onChange={handleChange}
                />
              </div>
              <div className="mb-4">
                <Label htmlFor="last_name" value="Last Name" />
                <TextInput
                  id="last_name"
                  name="last_name"
                  type="text"
                  value={form.last_name}
                  onChange={handleChange}
                />
              </div>
              <div className="mb-4">
                <Label htmlFor="national_id" value="National ID" />
                <TextInput
                  id="national_id"
                  name="national_id"
                  type="text"
                  value={form.national_id}
                  onChange={handleChange}
                />
              </div>
              <div className="mb-4">
                <Label htmlFor="phone_number" value="Phone Number" />
                <TextInput
                  id="phone_number"
                  name="phone_number"
                  type="text"
                  value={form.phone_number}
                  onChange={handleChange}
                />
              </div>
              <div className="mb-4">
                <Label htmlFor="password" value="Password" />
                <TextInput
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={handleChange}
                />
                {passwordError && (
                  <p className="text-red-500">
                    Enter either the current password or a new one
                  </p>
                )}
                <div className="flex items-center mt-2">
                  <Checkbox
                    id="show_password"
                    name="show_password"
                    checked={showPassword}
                    onChange={() => setShowPassword(!showPassword)}
                  />
                  <Label htmlFor="show_password" className="ml-2">
                    Show Password
                  </Label>
                </div>
              </div>
              <div className="mb-2 block">
                <Label htmlFor="file-upload" value={image ? image.name : ""} />
              </div>
              <input
                id="file-upload"
                type="file"
                onChange={(e) => setImage(e.target.files[0])}
              />
              <Button className="mt-5" type="submit">
                Update
              </Button>
            </form>
          </Card>
        )}
      </div>
      {error && <p className="mt-5 text-red-500">{error}</p>}
      {message && <p className="mt-5 text-green-500">{message}</p>}
    </div>
  );
}

export default Profile;
