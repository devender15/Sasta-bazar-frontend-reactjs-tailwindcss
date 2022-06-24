import React, { useState } from "react";
import axios from "axios";
import { TextField } from "@material-ui/core";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  document.title = "Login | Sasta Bazar";
  localStorage.clear(); // for safety purpose

  const loginHandler = async () => {
    const resp = await axios.post(
      `${process.env.REACT_APP_API_URL}/user-auth/login`,
      { username: username, password: password }
    );

    // setting the access token in localStorage for giving access to the user
    localStorage.setItem("user", JSON.stringify(resp.data.token.access));

    // navigating to home after setting up localStorage
    navigate("/");
  };

  return (
    <div className="flex flex-col justify-center items-center">
      <h1 className="text-3xl text-center mt-4 md:text-4xl font-bold">
        Sasta Bazar
      </h1>

      <h2 className="text-purple-600 mt-4 text-2xl">Login </h2>

      <div className="flex flex-col w-[85vw] h-[60vh] mt-12 rounded-md shadow-lg space-y-4 p-4 md:w-[30vw]">
        <TextField
          id="outlined-basic"
          label="Username"
          varient="outlined"
          required
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <TextField
          id="outlined-basic"
          type="password"
          label="Password"
          varient="outlined"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          className="bg-blue-600 p-2 rounded-lg border-none text-white font-bold hover:bg-blue-700 hover:transition-all"
          onClick={loginHandler}
        >
          Login
        </button>

        <div>
          <p className="mt-5">
            Not have an account?
            <Link className="text-blue-600 underline" to="/register">
              {" "}
              Register
            </Link>{" "}
            here !{" "}
          </p>

          <div className="flex justify-center items-center mt-14">
            <button
              onClick={() => navigate("/")}
              className="p-2 font-bold bg-green-600 text-white rounded-lg text-1xl hover:bg-green-700"
            >
              Browse as a Guest
            </button>
          </div>
        </div>
      </div>

      <p className="absolute bottom-0 pb-6">Made with  🤎 by Dev</p>
    </div>
  );
};

export default Login;
