import React from 'react'

const CartItem = ({ imageUrl = '', name = '', price = 0, quantity = 0}) => {
  return (
    <div className="flex h-24 gap-4 text-gray-500">
      <img src={imageUrl} className="aspect-square h-full rounded-md" />
      <div className="py-2 flex flex-col">
        <h1 className="font-bold text-lg text-black">{name}</h1>
        <p className="text-sm mt-auto">En stock</p>
      </div>
      <div className="py-2 flex flex-col ml-auto">
        <h3 className="text-purple-500">${price}</h3>
        <span
          className="border border-black/20 rounded-sm mt-auto flex justify-center text-xs"
        >
          {quantity}
        </span>
      </div>
    </div>
  )
}

export default CartItem
