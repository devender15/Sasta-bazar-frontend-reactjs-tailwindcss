import React from "react";
import Product from "./Product";
import { motion } from "framer-motion";

const ShowProduct = ({ products, addToCart, addRemoveItemButton, setaddRemoveItemButton }) => {

  const subCats = [
    "Inverters",
    "Electronic Limit Switches",
    "SMPS Meanwell",
    "Electrical Wire",
    "Electrical Switch Board",
    "Crompton Ceiling Fans",
    "Connectwell Terminal Block",
    "Schneider MCB",
    "Schneider Indicator LAMP",
    "Bandsaw Machine",
    "Siemens Contactor",
    "Heavy Duty Connector",
    "Electrical Components",
    "PTFE Teflon Tape",
    "SAK 10AP Terminal Connector",
    "Automatic Changeover switches",
    "6 Way MCB Box",
    "Led panel light",
    "GIC Electric timer",
    "K Type Thermocouple",
    "Opple LED bulb",
    "Electrical Control Panel",
    "PVC Electrical switches",
    "Connectwell Endplate",
    "Black Welding Helmet",
    "Electrical Products Repairing Service",
    "Push Button Station",
    "Plastic Cable Gland",
    "Hand Held Metal Detector",
    "Bimetal Bandsaw Blade",
    "Mitsubishi Hmi Plc",
    "12v Buzzer",
    "Power Tools"
  ];

  return (
    <>
      {subCats.map((cat) => {
        return (
          <div className="mt-2" key={cat}>
            {/* <h1 className="text-3xl text-center my-4">{cat}</h1> */}
            <motion.div
              layout
              className="grid grid-cols-2 md:grid-cols-4 gap-3"
            >
              {products
                ?.filter((product) => {
                  if (product.category === cat) {
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
