import React from "react";

const Orders = ({ orders }) => {

  return (
    <div className="my-4">
      {/* <h1>Previous Orders</h1> */}
      {Object.keys(orders).reverse().map((orderIdx) => {
        if (orders[orderIdx].status !== "Pending" && orders[orderIdx].status !== "Placed") {
          return (
            <div className="shadow-lg rounded-md p-4 flex justify-around items-center m-2 w-[90vw] md:w-full" key={orders[orderIdx].id}>
              <div className="products flex flex-col justify-start items-center ">
                {Object.keys(JSON.parse(orders[orderIdx].product_name)).map(
                  (product) => product ?  (<p className="font-bold">{"🔸" + product}</p>) : <p />
                )}
              </div>
              <p className="font-bold text-gray-500 mx-2">
                {orders[orderIdx].order_date.slice(0, 10)}
              </p>

              <p className="font-bold mx-4">
                        ₹{orders[orderIdx].order_amount}
              </p>

              <p className={`p-2 font-bold rounded-md ${orders[orderIdx].status === "Failed" ? "bg-red-600" : "bg-green-600"}` }>
                {orders[orderIdx].status}
              </p>
            </div>
          );
        }
      })}
    </div>
  );
};

export default Orders;
