import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "flowbite-react";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword,setShowPassword] = useState(false)
  const [rememberMe,setRememberMe] = useState(false)

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("token", data.access_token);
        if (data.role_id === 2) {
          console.log(data.role_id);
          navigate("/providerPage");
        } else {
          console.log("Redirecting to providerPage");
          navigate("/clientPage");
        }
      } else {
        const errorMessage = await response.json();
        setError(errorMessage.error);
      }
    } catch (error) {
      setError("An error occurred.Please try again later");
    }
    if (rememberMe){
      localStorage.setItem('rememberMe', 'true');
      localStorage.setItem('email','email');
      localStorage.setItem('password','password');
    }
    else{
      localStorage.removeItem('rememberMe')
      localStorage.removeItem('email')
      localStorage.removeItem('password')
    }
  };

  return (
    <div>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          value={email}
          placeholder="Enter your email"
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type={showPassword ? 'text':'password'} 
          value={password}
          placeholder="*********"
          onChange={(e) => setPassword(e.target.value)}
        />
        <label>
          <input type="checkbox" onChange={()=>setShowPassword(!showPassword)}/>Show password
        </label>
        <Button type="submit">Submit</Button>
        {error && <p>{error}</p>}
        <label>
          <input type="checkbox" checked={rememberMe} onChange={()=>setRememberMe(!rememberMe)}/>
          Remember me
        </label>
      </form>
      <p>
        Don't have an account? <Link to="/signup">Signup</Link>
      </p>
    </div>
  );
}

export default Login;
