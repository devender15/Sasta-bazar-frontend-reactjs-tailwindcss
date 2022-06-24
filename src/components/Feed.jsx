import React, { useState, useEffect } from "react";
import Spinner from "./Spinner";
import { useParams } from "react-router-dom";
import ShowProduct from "./ShowProduct";
import Cart from "./Cart";

const Feed = ({ products, setProducts, addToCart, quantity, totalCart }) => {
  const [loading, setLoading] = useState(false);
  const { categoryId } = useParams();

  // changing the title of the page
  document.title = `Homepage | Sasta Bazar`;

  useEffect(() => {
    if (categoryId) {
      setLoading(true);
      fetch(
        `${
          process.env.REACT_APP_API_URL
        }/product/filter/${categoryId.toLowerCase()}`
      )
        .then((response) => response.json())
        .then((data) => setProducts(data))
        .then(setLoading(false));
    } else {
      setLoading(true);
      fetch(`${process.env.REACT_APP_API_URL}/product/all`)
        .then((resp) => resp.json())
        .then((data) => setProducts(data))
        .then(setLoading(false));
    }

    // eslint-disable-next-line
  }, [categoryId]);

  return (
    <>
      {/* adding cart icon   */}
      <Cart quantity={quantity} totalCart={totalCart} />

      <div className="my-4">
        {loading && <Spinner message="fetching all products..." />}
        <div>
          <ShowProduct products={products} addToCart={addToCart} />
        </div>
      </div>
    </>
  );
};

export default Feed;
