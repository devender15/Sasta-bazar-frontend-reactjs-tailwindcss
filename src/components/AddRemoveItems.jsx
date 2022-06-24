import React, { useState, useEffect } from "react";

const AddRemoveItems = ({ defaultVal, setDefault, itemValue, setItemVal, itemValTime, setItemValTime }) => {


  useEffect(() => {
    setItemValTime(false);
    // console.log(defaultVal)
  }, [])

    const addItem = () => {

      if(!itemValTime){
        // console.log("just below setItemValTime")
        setItemValTime(true);
        setItemVal(defaultVal + 1);
        setDefault(itemValue);
        // console.log(false)
      }
      else {
        setItemVal(itemValue + 1);
        // console.log("else case")
      }
    }

    const removeItem = () => {
      if(!itemValTime){
        let val = defaultVal - 1;
        if(val < 0) val = 0; // to prevent from negative values
        setItemVal(val);
        setDefault(itemValue);
        setItemValTime(true);
      }
      else{
        let val = itemValue - 1;
        if(val < 0) val = 0; // to prevent from negative values
        setItemVal(val);
      }
    }


  return (
    <div className="flex space-x-1 my-4">
      <button className="w-8 p-1 bg-blue-600 font-bold rounded-lg text-center text-white" onClick={addItem}>
        +
      </button>
      <p className="p-1 font-bold">{itemValTime ? itemValue : defaultVal}</p>
      <button className="w-8 p-1 bg-blue-600 font-bold rounded-lg flex items-center justify-center text-white" onClick={removeItem}>
        -
      </button>
    </div>
  );
};

export default AddRemoveItems;
