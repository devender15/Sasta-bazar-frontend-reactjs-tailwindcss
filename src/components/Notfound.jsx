import React from 'react'

const Notfound = () => {

    // changing the title of the page
  document.title = "Product not found ";

  return (
    <div className='text-center flex justify-center items-center'>
        <p className='text-4xl font-bold my-16'>Product not found ! 😢</p>
    </div>
  )
}

export default Notfound;