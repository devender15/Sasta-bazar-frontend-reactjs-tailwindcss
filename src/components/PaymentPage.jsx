import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";

import { BsFillArrowLeftCircleFill } from "react-icons/bs";


const PaymentPage = ({ totalCart, user, token, setTotalCart, setQuantity }) => {
  const [fname, setFname] = useState("");
  const [phone, setPhone] = useState(0);
  const [addr, setAddr] = useState("");
  const [city, setCity] = useState("");
  const [zipCode, setZipCode] = useState(0);
  const [state, setState] = useState("");

  const navigate = useNavigate();

  // changing the title of the page
  document.title = `Checkout | Sasta Bazar`;

  const myCart =
    localStorage.getItem("items") !== null
      ? JSON.parse(localStorage.getItem("items"))
      : {};

  // storing titles and quantity of the all the products in the cart so that we can save it to the db when we do payment using paytm
  const productSell = {};

  Object.keys(myCart).map((productName) => {
    productSell[productName] = {
      "quantity": myCart[productName].quant,
      "price": myCart[productName].price
    }
  })


  // showing the current status will we be using this toast message
  const toastMessage = (type, message) => {
    toast(message, {
      type: type==="error" ? "error" : "success",
      theme: "colored",
      position: "top-center",
      autoClose: 2000,
    });
  };

  // console.log(user);

  const placeOrder = () => {
    // checking first if user has entered all shipping details or not
    if (
      fname.length === 0 ||
      phone.length === 0 ||
      addr.length === 0 ||
      city.length === 0 ||
      zipCode.length === 0 ||
      state.length === 0
    ) {
      toastMessage("error", "Please enter all shipping details !");
    } else {  
      fetch(`${process.env.REACT_APP_API_URL}/payment/place-order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + token,
        },
        body: JSON.stringify({
          "userId": user?.id,
          "pname": JSON.stringify(productSell),
          "fname": fname,
          "phone": phone,
          "city": city,
          "zip_code": zipCode,
          "state": state,
          "address": addr,
          "email": user.email,
          "total_payment": totalCart
        })
      })
      .then(res => res.json())
      .then(data => {
        if(data.status === "success") { 
          toastMessage("success", "Order placed Successfully!");
          localStorage.removeItem("items");
          setTotalCart(0);
          setQuantity(0);
          navigate("/");
        }
        else {
          toastMessage("error", "Something went wrong!");
        }
      })
    }
  };

  let myCartItems =
    localStorage.getItem("items") !== null
      ? JSON.parse(localStorage.getItem("items"))
      : {};

  return (
    <>
      <div className="flex space-x-4 items-center justify-around mr-16 md:justify-center">
        <BsFillArrowLeftCircleFill
          fontSize={30}
          className="hover:cursor-pointer mb-3"
          onClick={() => navigate("/")}
        />
        <h1 className="font-bold mb-4 text-3xl text-center">Checkout page</h1>
      </div>

      <div>
        {Object.keys(myCartItems).length === 0 ? (
          <p className="font-extrabold my-16 text-3xl text-center">
            Your cart is empty 😞 Please go do some shopping !
          </p>
        ) : (
          <div className="p-1 md:grid md:grid-cols-2 gap-6">
            <div className="flex flex-col mt-4">
              {Object.values(myCartItems).map((product) => {
                return (
                  <div
                    className="grid grid-cols-2 space-x-2 bg-white p-2 w-fit m-2"
                    key={product.name}
                  >
                    <div
                      className="flex justify-center hover:cursor-pointer"
                      onClick={() => navigate(`/product-detail/${product.id}`)}
                    >
                      <img
                        src={product.image}
                        alt="product"
                        className="w-[full] h-full md:h-[30vh]"
                      />
                    </div>
                    <div className="flex flex-col justify-center space-y-2">
                      <h2 className="font-bold md:text-2xl">{product.name}</h2>
                      <p className="font-light md:text-xl">
                        Price: ₹{product.price}
                      </p>
                      <p className="font-light md:text-xl">
                        Quantity: {product.quant}
                      </p>
                    </div>
                  </div>
                );
              })}

              <div className="p-2 my-6 bg-white">
                <p className="font-bold text-2xl">Total Price: ₹{totalCart}</p>
                {/* <p>Total Cart Items: </p> */}
              </div>

              {/* shipping address */}

              <div className="my-8">
                <h1 className="text-xl text-center my-2">Shipping Address</h1>

                <div className="flex flex-col space-y-4">
                  <div className="flex flex-col">
                    <label htmlFor="fname">Full Name</label>
                    <input
                      type="text"
                      value={fname}
                      onChange={(e) => setFname(e.target.value)}
                      id="fname"
                      className="border-2 border-black p-1 outline-none rounded-md bg-gray-300 font-bold"
                      required
                    />
                  </div>

                  <div className="flex flex-col">
                    <label htmlFor="phone">Phone number</label>
                    <input
                      type="number"
                      id="phone"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="border-2 border-black p-1 outline-none rounded-md bg-gray-300 font-bold"
                      required
                    />
                  </div>

                  <div className="flex flex-col">
                    <label htmlFor="address">Address</label>
                    <input
                      type="text"
                      id="address"
                      value={addr}
                      onChange={(e) => setAddr(e.target.value)}
                      className="border-2 border-black p-1 outline-none rounded-md bg-gray-300 font-bold"
                      required
                    />
                  </div>

                  <div className="flex flex-col">
                    <label htmlFor="city">City</label>
                    <input
                      type="text"
                      id="city"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="border-2 border-black p-1 outline-none rounded-md bg-gray-300 font-bold"
                      required
                    />
                  </div>

                  <div className="flex flex-col">
                    <label htmlFor="zip">Zip Code</label>
                    <input
                      type="text"
                      id="zip"
                      value={zipCode}
                      onChange={(e) => setZipCode(e.target.value)}
                      className="border-2 border-black p-1 outline-none rounded-md bg-gray-300 font-bold"
                      required
                    />
                  </div>

                  <div className="flex flex-col">
                    <label htmlFor="state">State</label>
                    <input
                      type="text"
                      id="state"
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      className="border-2 border-black p-1 outline-none rounded-md bg-gray-300 font-bold"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* payment section */}
            {
              <div
                id="paymentFrm"
                className="flex flex-col justify-center items-center md:justify-start mr-10"
              >
                <h1 className="text-center text-xl my-8">Payment methods</h1>

                <p>Currently only <b> Cash On Delivery </b> is available.</p>

                <button className="p-2 bg-green-600 rounded-md text-white font-bold my-4 w-[30vw] h-15" onClick={placeOrder}> Order Now</button>


              </div>
            }
          </div>
        )}
      </div>
      <ToastContainer />
    </>
  );
};

export default PaymentPage;
