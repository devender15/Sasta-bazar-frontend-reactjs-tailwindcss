import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const Product = ({ product }) => {

  const navigate = useNavigate();

  return (
    <motion.div layout animate={{opacity: 1}} initial={{opacity: 0}} exit={{opacity: 0}} id={`div-${product.productId}`} className='flex flex-col rounded-lg bg-white shadow-md p-2 hover:cursor-pointer md:w-[20vw] justify-center space-y-4' onClick={() => navigate(`/product-detail/${product.productId}`)}>

      <div className='w-fit'> 
        <img className='w-70 h-50' src={product.productImage.includes(`${process.env.REACT_APP_API_URL}`) ? product.productImage : process.env.REACT_APP_API_URL + product.productImage} alt="prod" />
      </div>

      <h2 className='font-bold'>{product?.productName}</h2>
      <p className='text-gray-500'>{product?.description.slice(0, 100)}...</p>
      <p className='font-bold m-2'>Price : ₹{product.price}</p>

    </motion.div>
  )
}

export default Product;