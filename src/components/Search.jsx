import React, { useState, useEffect } from 'react';
import Spinner from './Spinner';
import ShowProduct from './ShowProduct';

const Search = ({ searchTerm }) => {

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => { 
    setLoading(true);
    fetch(`${process.env.REACT_APP_API_URL}/product/s/${searchTerm}`)
      .then((response) => response.json())
      .then((data) => setProducts(data))
      .then(setLoading(false))
      // .then(console.log(products[0]?.fields.productName))

  }, [searchTerm])

  return (
    <div>
      {loading && <Spinner message="searching product..."/>}
      {products.length === 0 && <p className='text-2xl text-center font-bold'>No product found :/</p>}
      {products.length !== 0 &&  <ShowProduct products={products}/>}
    </div>
  )
}

export default Search;