import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';


import { TextField } from "@material-ui/core";
import { BsFillArrowLeftCircleFill } from "react-icons/bs";

import PaytmLogo from '../assets/paytm.webp';


const PaymentPage = ({ totalCart, user, setTotalCart }) => {
  const navigate = useNavigate();
  const [promo, setPromo] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);
  const [error, setError] = useState(false);
  
  // changing the title of the page
  document.title = `Checkout | Sasta Bazar`;

  // using this promo code a new user can have upto 90% off discount
  const PROMOCODE = "NEWUSER90";

  const myCart =
    localStorage.getItem("items") !== null
      ? JSON.parse(localStorage.getItem("items"))
      : {};

  // storing titles of the all the products in the cart so that we can save it to the db when we do payment using paytm
  const productsArray = [];

  for(let product in myCart){
    productsArray.push(product)
  }

  // getting the actual total cart value because we want to restore the actual price when user removes the coupon
  const getActualTotalCartValue = () => {
    let prods = myCart;
    let sum = 0;
    for (let value in prods) {
      sum += prods[value]?.quant * prods[value]?.price;
    }
    return sum;
  };

  const originalCartVal = getActualTotalCartValue();

  const applyCoupon = () => {
    if (promo === PROMOCODE) {
      const discountVal = Math.round(totalCart * (1 - 0.9));
      setTotalCart(discountVal);
      setCouponApplied(true);
      setError(false);

      console.log(originalCartVal);
    } else {
      setError(true);
    }
  };

  const removeCoupon = () => {
    setTotalCart(originalCartVal);
    setCouponApplied(false);
    setPromo("");
  };


  const handleSuccess = (res) => {

    // we will be getting response param_dict ( object ) from backend
    let keyArr = Object.keys(res);
    let valArr = Object.values(res);

    // when we start the payment verification we will hide our Product form
    document.getElementById("paymentFrm").style.display = "none";

    // Lets create a form by DOM manipulation
    // display messages as soon as payment starts
    let heading1 = document.createElement("h1");
    heading1.innerText = "Redirecting you to the paytm....";
    let heading2 = document.createElement("h1");
    heading2.innerText = "Please do not refresh your page....";

    //create a form that will send necessary details to the paytm
    let frm = document.createElement("form");
    frm.action = "https://securegw-stage.paytm.in/order/process/";
    frm.method = "post";
    frm.name = "paytmForm";

    // we have to pass all the credentials that we've got from param_dict
    keyArr.map((k, i) => {
      // create an input element
      let inp = document.createElement("input");
      inp.key = i;
      inp.type = "hidden";
      // input tag's name should be a key of param_dict
      inp.name = k;
      // input tag's value should be a value associated with the key that we are passing in inp.name
      inp.value = valArr[i];
      // append those all input tags in the form tag
      frm.appendChild(inp);
    });

    // append all the above tags into the body tag
    document.body.appendChild(heading1);
    document.body.appendChild(heading2);
    document.body.appendChild(frm);
    // finally submit that form
    frm.submit();

    // if you remember, the param_dict also has "'CALLBACK_URL': 'http://127.0.0.1:8000/payment/handlepayment/'"
    // so as soon as Paytm gets the payment it will hit that callback URL with some response and
    // on the basis of that response we are displaying the "payment successful" or "failed" message

  }


  const startPayment = async () => {
    let bodyData = new FormData();

    // send data to the backend
    bodyData.append("amount", totalCart);
    bodyData.append("name", JSON.stringify(productsArray));
    bodyData.append("email", user?.username);

    await axios({
      url: `${process.env.REACT_APP_API_URL}/payment/pay/`,
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      data: bodyData,
    }).then((res) => {
      // we will retrieve the param_dict that we are sending from the backend with
      // all the necessary credentials, and we will pass it to the handleSuccess() func 
     //  for the further process
      if (res) {
        handleSuccess(res.data.param_dict);
      }
    });
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
          <div  className="p-1 md:grid md:grid-cols-2 gap-6">
            <div className="flex flex-col mt-4">
              {Object.values(myCartItems).map((product) => {
                return (
                  <div
                    className="grid grid-cols-2 space-x-2 bg-white p-2 w-fit m-2"
                    key={product.name}
                  >
                    <div className="flex justify-center hover:cursor-pointer" onClick={() => navigate(`/product-detail/${product.id}`)}>
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

              <div className="my-4 bg-white p-1">
                {/* adding input field for applying promo code */}
                <div className="flex space-x-2 items-center">
                  <p className="font-light mt-4 mr-4">Have promo code? </p>
                  <div>
                    <TextField
                      id="standard-basic"
                      label="Promo Code"
                      variant="standard"
                      value={promo}
                      onChange={(e) => setPromo(e.target.value)}
                    />
                    {couponApplied ? (
                      <p className="text-green-500">Coupon applied !</p>
                    ) : (
                      ""
                    )}

                    {/* showing error is user enters wrong promo code */}
                    {error ? (
                      <p className="text-red-600">Wrong promo code !</p>
                    ) : (
                      ""
                    )}
                  </div>
                  {couponApplied ? (
                    <button
                      className="p-2 bg-red-700 rounded-md text-white font-bold"
                      onClick={removeCoupon}
                    >
                      Remove
                    </button>
                  ) : (
                    <button
                      className="p-2 bg-blue-700 rounded-md text-white font-bold"
                      onClick={applyCoupon}
                    >
                      Apply
                    </button>
                  )}
                </div>

                {/* showing updated cart value */}
                <h1 className="font-bold text-xl my-6 flex items-center">
                  Subtotal: ₹{totalCart}
                  {couponApplied && (
                    <p className="text-green-600 italic ml-2 text-sm">
                      Yeah 90% off 😃
                    </p>
                  )}
                </h1>
              </div>

              {/* shipping address */}

              <div className="my-8">
                <h1 className="text-xl text-center my-2">Shipping Address</h1>

                <div className="flex flex-col space-y-4">
                  <div className="flex flex-col">
                    <label htmlFor="fname">Full Name</label>
                    <input
                      type="text"
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
                      className="border-2 border-black p-1 outline-none rounded-md bg-gray-300 font-bold"
                      required
                    />
                  </div>

                  <div className="flex flex-col">
                    <label htmlFor="address">Address</label>
                    <input
                      type="text"
                      id="address"
                      className="border-2 border-black p-1 outline-none rounded-md bg-gray-300 font-bold"
                      required
                    />
                  </div>

                  <div className="flex flex-col">
                    <label htmlFor="city">City</label>
                    <input
                      type="text"
                      id="city"
                      className="border-2 border-black p-1 outline-none rounded-md bg-gray-300 font-bold"
                      required
                    />
                  </div>

                  <div className="flex flex-col">
                    <label htmlFor="zip">Zip Code</label>
                    <input
                      type="text"
                      id="zip"
                      className="border-2 border-black p-1 outline-none rounded-md bg-gray-300 font-bold"
                      required
                    />
                  </div>

                  <div className="flex flex-col">
                    <label htmlFor="state">State</label>
                    <input
                      type="text"
                      id="state"
                      className="border-2 border-black p-1 outline-none rounded-md bg-gray-300 font-bold"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>
            

            {/* payment section */}
            {
              <div id="paymentFrm" className="flex flex-col justify-center items-center md:justify-start mr-10">
                <h1 className="text-center text-xl my-8">Payment methods</h1>
                
                <div className="w-[60vw] h-[15vh] md:w-[20vw] bg-white p-1">
                  <img src={PaytmLogo} alt="paytm-button" onClick={ startPayment} className="w-full h-full hover:cursor-pointer"/>
                </div>
                
              </div>
            }
          </div>
        )}
      </div>
    </>
  );
};

export default PaymentPage;
