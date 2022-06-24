import React, { useEffect } from "react";

const Filter = ({ categoryId, products, setFilteredProducts }) => {

  useEffect(() => {

    console.log(categoryId?.toLowerCase());


    if (categoryId === undefined) setFilteredProducts(products[0]);

    const filtered = [];

    products.map((product) => {
        filtered.push(product);
    })

    setFilteredProducts(filtered);
    console.log(filtered);



  }, [categoryId]);

  return <div></div>;
};

export default Filter;
