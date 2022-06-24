import React from "react";
import Product from "./Product";
import { motion } from "framer-motion";

const ShowProduct = ({ products, addToCart, addRemoveItemButton, setaddRemoveItemButton }) => {

  const subCats = [
    "upperclothing",
    "bottomclothing",
    "footwear",
    "accessories",
    "decoration",
    "technology",
  ];

  return (
    <>
      {subCats.map((cat) => {
        return (
          <div className="mt-2">
            {/* <h1 className="text-3xl text-center">{}</h1> */}
            <motion.div
              layout
              className="grid grid-cols-2 md:grid-cols-4 gap-3"
              // key={cat}
            >
              {products
                ?.filter((product) => {
                  if (product.subCategory === cat || product.category === cat) {
                    return product;
                  }
                })
                .map((productItem) => {
                  return (
                    <Product
                      product={productItem}
                      key={productItem.productId}
                      addToCart={addToCart}
                      addRemoveItemButton={addRemoveItemButton}
                      setaddRemoveItemButton={setaddRemoveItemButton}
                    />
                  );
                })}
            </motion.div>
          </div>
        );
      })}
    </>
  );
};

export default ShowProduct;
