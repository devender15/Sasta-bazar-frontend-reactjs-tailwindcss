import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { BsFillArrowLeftCircleFill } from "react-icons/bs";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// importing required components
import Product from "./Product";
import Spinner from "./Spinner";
import Cart from "./Cart";
import Notfound from "./Notfound";

// importing all required icons
import LockIcon from "../assets/shield.png";
import CODIcon from "../assets/cod.png";
import ReplacementIcon from "../assets/exchange.png";
import DeliveryIcon from "../assets/delivery.png";
import WarrentyIcon from "../assets/security.png";
import AddRemoveItems from "./AddRemoveItems";

const ProductDetail = ({
  allProds,
  addToCart,
  setProdProperty,
  quantity,
  itemVal,
  setItemVal,
  totalCart,
  getCart,
}) => {
  const [product, setProduct] = useState({});
  const [loading, setLoading] = useState(false);
  const [subTotal, setSubTotal] = useState(null);
  const [productQuant, setproductQuant] = useState(0);
  const [itemValTime, setItemValTime] = useState(false);
  const [similarProducts, setSimilarProducts] = useState([]);
  const { productId } = useParams();
  const navigate = useNavigate();

  // changing the title of the page
  document.title = `${product.productName} | Check details | My Shop`;

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/product/${productId}`)
      .then((response) => response.json())
      .then((data) => setProduct(data))
      .then(getSimilarProducts())
      .then(getSavedProdQuantity())
      .then(
        setSubTotal(
          itemValTime ? itemVal * product.price : productQuant * product.price
        )
      );
  }, [product]);

  // changing the value of subTotal amount after every change in itemVal
  useEffect(() => {
    setSubTotal(itemVal * product.price);
    setProdProperty({
      name: product.productName,
      quant: itemVal,
      price: product.price,
      image: product.productImage,
      id: product.productId,
    });
  }, [itemVal]);

  const getSavedProdQuantity = () => {
    const myCart =
      localStorage.getItem("items") !== null
        ? JSON.parse(localStorage.getItem("items"))
        : {};

    const itemQuantity = myCart[product.productName]?.quant;
    setproductQuant(itemQuantity || 0);
  };

  const getSimilarProducts = () => {
    const similar = [];

    allProds?.map((sameProduct) => {
      if (
        sameProduct.category === product.category &&
        sameProduct.subCategory === product.subCategory &&
        sameProduct.productName !== product.productName
      ) {
        similar.push(sameProduct);
      }
    });

    setSimilarProducts(similar);
  };

  return (
    <>
      <div className="flex space-x-4 items-center">
        <BsFillArrowLeftCircleFill
          fontSize={30}
          className="hover:cursor-pointer"
          onClick={() => navigate("/")}
        />
        {/* adding cart icon   */}
        <Cart quantity={quantity} totalCart={totalCart} />
      </div>

      {loading && <Spinner message="loading" />}

      {!product.detail ? (
        <>
          <div
            className="flex flex-col md:grid md:grid-cols-3 p-2"
            id={`div-${product.productId}`}
          >
            <div className="bg-white flex justify-center items-center">
              <img
                src={product.productImage}
                className="rounded-md md:w-70 md:h-50"
                alt="product"
              />
            </div>

            <div
              className="p-2 md:h-50 overflow-y-auto"
              id={`div-${product.productId}`}
            >
              <h2 className="text-2xl font-extrabold text-center">
                {product.productName}
              </h2>

              <div className="flex justify-center my-3 bg-white rounded-md border-2 h-fit">
                <p className="font-bold my-4 ml-4">Price: ₹{product.price}</p>
                <p className="text-gray-500 my-4 ml-4">FREE Same-Day</p>
              </div>

              <div className="my-4 bg-white p-4">
                <h1 className="text-2xl">Description</h1>
                <p className="text-gray-500 mt-2">{product.description}</p>
              </div>

              <div className="my-6 bg-white p-4">
                <ul className="flex space-x-4 justify-center items-center">
                  <li>
                    <img src={CODIcon} width="50" height="50" alt="cod-icon" />
                    <p>Pay on Delivery</p>
                  </li>
                  <li>
                    <img
                      src={ReplacementIcon}
                      width="50"
                      height="50"
                      alt="replacement-icon"
                    />
                    <p>7 Days Replacement</p>
                  </li>
                  <li>
                    <img
                      src={DeliveryIcon}
                      alt="delivery-icon"
                      width="50"
                      height="50"
                    />
                    <p>Best Delivery</p>
                  </li>
                  <li>
                    <img
                      src={WarrentyIcon}
                      alt="warrenty-icon"
                      width="50"
                      height="50"
                    />
                    <p>1 Year Warrenty</p>
                  </li>
                </ul>
              </div>
            </div>

            <div className="flex flex-col bg-white p-2">
              <div className="my-2">
                <p>
                  Free Delivery by <b>Today</b> !
                </p>
                <p>Order within 2 hours.</p>
              </div>

              <AddRemoveItems
                defaultVal={productQuant}
                setDefault={setproductQuant}
                itemValue={itemVal}
                setItemVal={setItemVal}
                setItemValTime={setItemValTime}
                itemValTime={itemValTime}
              />

              <h1 className="font-bold">Subtotal: ₹{subTotal}</h1>

              <div className="flex flex-col my-4">
                <button
                  className="p-2 bg-yellow-400 font-bold rounded-md m-1 hover:bg-yellow-500 transition-all duration-100"
                  onClick={addToCart}
                  id={`${product.productId}`}
                  disabled={itemVal === 0 && totalCart === 0}
                >
                  Add to cart
                </button>
                <button
                  className="p-2 bg-orange-500 font-bold rounded-md m-1 hover:bg-orange-600 transition-all duration-100"
                  onClick={() => navigate("/payment-section")}
                  // onClick={addToCartSuccess}
                >
                  Checkout page
                </button>
              </div>

              <div className="flex my-2">
                <img src={LockIcon} width="26" height="20" />
                <p className="text-green-600 ml-2">Secure transaction</p>
              </div>
            </div>
          </div>
          {/* showing similar products */}
          <div className="mt-10">
            <h1 className="text-2xl">You may also like</h1>

            {similarProducts.length !== 0 ? (
              <div className="flex overflow-y-hidden space-x-2 w-full mt-2">
                {similarProducts?.map((simProd) => {
                  return (
                    <Product
                      product={simProd}
                      key={simProd.productId}
                      addToCart={addToCart}
                    />
                  );
                })}
              </div>
            ) : (
              <p className="font-bold text-center m-2 text-xl">
                No related products to show 😞
              </p>
            )}
          </div>
        </>
      ) : (
        <Notfound />
      )}

      <ToastContainer />
    </>
  );
};

export default ProductDetail;