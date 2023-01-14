import React, { useState, useEffect } from "react";
import Spinner from "./Spinner";
import ShowProduct from "./ShowProduct";
import Cart from "./Cart";

const Feed = ({ products, setProducts, addToCart, quantity, totalCart }) => {
  const [loading, setLoading] = useState(false);

  // changing the title of the page
  document.title = `Homepage | Sasta Bazar`;

  useEffect(() => {

    setLoading(true);
    fetch(`${process.env.REACT_APP_API_URL}/product/all`)
      .then((resp) => resp.json())
      .then((data) => setProducts(data))
      .then(setLoading(false));
  
    // eslint-disable-next-line
  }, []);

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
