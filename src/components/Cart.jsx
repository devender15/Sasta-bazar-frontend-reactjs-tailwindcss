import React from "react";
import { FaShoppingCart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Cart = ({ quantity, totalCart }) => {
  const navigate = useNavigate();

  return (
    <div
      className="flex hover:cursor-pointer space-x-2 items-center ml-2 w-fit my-6 "
      onClick={() => navigate("/payment-section")}
    >
      <h1 className="text-xl">Cart</h1>
      <FaShoppingCart fontSize={30} />
      <p className="rounded-full bg-blue-600 p-2 w-10 text-center text-white font-bold">
        {quantity}
      </p>

      <h1 className="font-bold">Total cart value: ₹{totalCart}</h1>
    </div>
  );
};

export default Cart;
