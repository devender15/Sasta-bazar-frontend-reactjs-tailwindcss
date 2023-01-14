import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { fetchUser } from "../utils/fetchUser";
import { TextField } from "@material-ui/core";
import { ToastContainer, toast } from "react-toastify";
import { Spinner, Orders } from "/";

const UserProfile = ({ user }) => {
  const [fname, setFname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState(0);
  const [userId, setUserId] = useState(0);
  const [currentOrderNumber, setCurrentOrderNumber] = useState(0);
  const [allOrders, setAllOrders] = useState({});
  const [loading, setLoading] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showOrders, setShowOrders] = useState(false);

  const navigate = useNavigate();

  // importing user token from local storage
  const userToken = fetchUser();

  document.title = "User profile | My Shop";

  useEffect(() => {
    setUserId(user?.id);
    setFname(user?.fname);
    setEmail(user?.email);
    setPhone(user?.phone);
  }, [user]);

  const toastMessage = (type, message) => {
    toast(message, {
      type: type === "error" ? "error" : "success",
      theme: "colored",
      position: "top-center",
      autoClose: 2000,
    });
  };

  const updateDetails = () => {
    if (password.length !== 0) {
      fetch(`${process.env.REACT_APP_API_URL}/user-auth/update-user`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + userToken,
        },
        body: JSON.stringify({
          userId,
          fname,
          email,
          phone,
          password,
        }),
      })
        .then((res) => res.json())
        .then((data) => toastMessage(data.status, data.msg));
    } else {
      toastMessage("error", "Enter the password to make changes !");
    }
  };

  const orderHistory = () => {
    setLoading(true);
    fetch(`${process.env.REACT_APP_API_URL}/user-auth/order-history`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + userToken,
      },
      body: JSON.stringify({
        userId,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setLoading(false);
        setCurrentOrderNumber(data.orderCount);
        setAllOrders(data.orders);
      });
  };

  return (
    <>
      <h1 className="font-bold text-2xl text-center my-6">Profile</h1>

      <div className="flex flex-col justify-center items-center md:grid md:grid-cols-3 md:gap-20">
        <div className="flex flex-col w-[85vw] h-[55vh] mt-10 rounded-md shadow-lg space-y-8 p-10 md:w-[30vw] justify-center ">
          <h2 className="font-bold text-xl">Personel Details</h2>

          <TextField
            id="outlined-basic"
            label="Email"
            varient="outlined"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <TextField
            id="outlined-basic"
            label="Full Name"
            varient="outlined"
            value={fname}
            onChange={(e) => setFname(e.target.value)}
          />

          <TextField
            id="outlined-basic"
            label="Phone Number"
            varient="outlined"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />

          <TextField
            id="outlined-basic"
            type="password"
            label="Enter password"
            varient="outlined"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <p
            className="text-blue-600 underline hover:cursor-pointer"
            onClick={() => navigate("/user/change-password")}
          >
            Change password?
          </p>

          <button
            className="bg-yellow-400 font-bold text-black p-3 rounded-md shadow-sm"
            onClick={updateDetails}
          >
            Update Details
          </button>
        </div>

        <button
          className="p-4 text-white bg-blue-600 font-bold rounded-md md:w-[20vw] mt-6"
          onClick={() => {
            setShowOrders(!showOrders);
            orderHistory();
          }}
        >
          Orders
        </button>

        {showOrders ? (
          <>
            {loading && <Spinner className="my-4" message="Loading..." />}

            {currentOrderNumber >= 1 || Object.keys(allOrders).length >= 1 ? (
              <>
                <div className="my-6">
                  <h1 className="font-extrabold text-xl text-center my-3">
                    Active Order Status
                  </h1>

                  {Object.keys(allOrders).map((orderIdx) => {
                    if (
                      allOrders[orderIdx].status === "Pending" ||
                      allOrders[orderIdx].status === "Placed"
                    ) {
                      return (
                        <div
                          className="shadow-lg rounded-md p-4 flex justify-around items-center m-2 w-[90vw] md:w-full text-sm"
                          key={allOrders[orderIdx].id}
                        >
                          <div className="products flex flex-col justify-start items-center mx-2">
                            {Object.keys(
                              JSON.parse(allOrders[orderIdx].product_name)
                            ).map((product) =>
                              product ? (
                                <p className="font-bold">{"🔸 " + product}</p>
                              ) : (
                                <p />
                              )
                            )}
                          </div>
                          <p className="font-bold text-gray-500 mr-2">
                            {allOrders[orderIdx].order_date.slice(0, 10)}
                          </p>

                          <p className="font-bold mr-5 font-sans-serif">
                            ₹{allOrders[orderIdx].order_amount}
                          </p>

                          <p
                            className={`p-2 font-bold rounded-md ${
                              allOrders[orderIdx].status === "Placed"
                                ? "bg-blue-600"
                                : "bg-yellow-400"
                            }`}
                          >
                            {allOrders[orderIdx].status}
                          </p>
                        </div>
                      );
                    }
                  })}
                </div>

                {/* toggle button from which we can see all history */}
                <div className="md:h-[50vh] md:overflow-y-auto flex items-center flex-col">
                  <button
                    className="p-4 text-white bg-blue-600 font-bold rounded-md md:w-[20vw]"
                    onClick={() => setShowHistory(!showHistory)}
                  >
                    {showHistory
                      ? "Hide all orders history"
                      : "Show all orders history"}
                  </button>
                  {/* rendering the order history component when state changes */}
                  {showHistory && <Orders orders={allOrders} />}
                </div>
              </>
            ) : (
              <p className="my-6 font-bold text-2xl">
                You haven't made any purchases yet !
              </p>
            )}
          </>
        ) : (
          <p></p>
        )}
      </div>
      <ToastContainer />
    </>
  );
};

export default UserProfile;
