import React, { useState, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';

import PaymentPage from "./PaymentPage";

import { Navbar, Feed, ProductDetail, Search } from "/";
import { fetchUser } from "../utils/fetchUser";

const Products = ({ user, token }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState([]);
  const [quantity, setQuantity] = useState(0);
  const [prodProperty, setProdProperty] = useState({});
  const [itemVal, setItemVal] = useState(0);
  const [totalCart, setTotalCart] = useState(0);
  const [cart, setCart] = useState("");
  const navigate = useNavigate();

  // this is the function for showing the toast success message 
  const addToCartSuccess = (productName, isRemoved) => {
    toast(isRemoved ? "Item removed successfully !" : `${productName} added to the cart`, {
      type: "success",
      theme: "colored",
      position: "top-center",
      autoClose: 2000,
    });
  }

  const getCart = () => {
    fetch(`${process.env.REACT_APP_API_URL}/user-auth/update-cart`, {
      method: "GET",
      headers: {
        Authorization: "Bearer " + token,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        localStorage.setItem("items", data);
      })
  };

  const updateCart = (cartVal) => {
    fetch(`${process.env.REACT_APP_API_URL}/user-auth/update-cart`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: {
        "cart": cartVal
      }
    });
  };

  // after loading the component the total cart items value should be there so thats why we are using useEffect and getting the value from localStorage
  useEffect(() => {

    // incrementing the quantity of the cart
    let prods = JSON.parse(localStorage.getItem("items"));
    let sum = 0;
    for (let value in prods) {
      sum += prods[value].quant;
    }
    setQuantity(sum);
  }, []);


  // whenever the no. of cart items changes then we will change the total price of all the products
  useEffect(() => {
    const myCart =
      localStorage.getItem("items") !== null
        ? JSON.parse(localStorage.getItem("items"))
        : {};

    let total = 0;
    Object.values(myCart)?.map((prodDetail) => {
      total += prodDetail.quant * prodDetail.price;
    });

    setTotalCart(total);
  }, [quantity]);



  // this function will add the items and their details to the localStorage
  const addToCart = (e) => {
    
    // checking whether the user is logged in or not
    const user = fetchUser();

    if (!user) navigate("/login");
    // else case if the user is logged in
    else {
      
      let myCart =
        localStorage.getItem("items") !== null
          ? JSON.parse(localStorage.getItem("items"))
          : {};


      const prodId = e.target.id;
      
      // getting product title from h2 tag from div of which id we got from button
      const prodTitle = document.querySelector(`#div-${prodId} > h2`).innerText;

      // storing the quantity and price of the products
      myCart[prodTitle] = prodProperty;

      let isRemoved = false;
      // deleting if a product has 0 quantity
      if (myCart[prodTitle].quant === 0){ 
        delete myCart[prodTitle];
        isRemoved = true;
      }

      // setting all added items to localStorage so that we can get it even after reloading the page
      localStorage.setItem("items", JSON.stringify(myCart));
      // updateCart(myCart);

      // incrementing the quantity of the cart
      let prods = JSON.parse(localStorage.getItem("items"));
      let sum = 0;
      for (let value in prods) {
        sum += prods[value].quant;
      }

      setQuantity(sum);

      // calling the success notification message
      addToCartSuccess(prodTitle, isRemoved);
    }
  };

  return (
    <div className="px-2 md:px-5">
      <div className="bg-gray-50">
        <Navbar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          user={user}
        />
      </div>

      <div className="h-full my-10">
        <Routes>
          <Route
            exact
            path="/"
            element={
              <Feed
                products={products}
                setProducts={setProducts}
                addToCart={addToCart}
                quantity={quantity}
                totalCart={totalCart}
              />
            }
          />
          <Route
            exact
            path="/category/:categoryId"
            element={
              <Feed
                products={products}
                setProducts={setProducts}
                addToCart={addToCart}
                quantity={quantity}
                totalCart={totalCart}
              />
            }
          />
          <Route
            exact
            path="/product-detail/:productId"
            element={
              <ProductDetail
                allProds={products}
                addToCart={addToCart}
                setProdProperty={setProdProperty}
                quantity={quantity}
                itemVal={itemVal}
                setItemVal={setItemVal}
                totalCart={totalCart}
                user={user && user}
                // getCart={getCart}
              />
            }
          />
          <Route
            exact
            path="/search"
            element={
              <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
            }
          />
          <Route
            exact
            path="/payment-section"
            element={
              <PaymentPage
                totalCart={totalCart}
                user={user}
                setTotalCart={setTotalCart}
                token={token}
                setQuantity={setQuantity}
              />
            }
          />
        </Routes>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Products;
