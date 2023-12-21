import React, { useEffect, useMemo } from 'react'
import { useStore } from '@nanostores/react'

import CartItem from './CartItem'
import { checkoutData } from '../store'

const Success = ({ order = null }) => {
  const $checkoutData = useStore(checkoutData)

  const eventData = useMemo(() => {
    if ($checkoutData) {
      return {
        orderId: $checkoutData?.order.id,
        payment: $checkoutData?.buyer,
        created: $checkoutData?.order.created,
        orderStatus: $checkoutData?.order.status,
        lineItems: $checkoutData?.order.orderDetails.map((det) => ({ imageUrl: det.productImageUrl, ...det }))
      }
    }
    else return null
  }, [$checkoutData])

    const data = order ?? eventData
  
  if (!data) {
    typeof window !== 'undefined' && window.location.replace('/')
  }

  return (
    <div>
      <div className="flex gap-4">
        <div>
          <h1 className="text-4xl mt-4 font-bold">Orden #{data?.orderId}</h1>
          <p className="text-sm opacity-50">{`Gracias por tu compra ${data?.payment?.buyer?.name ?? ''}`}</p>
        </div>
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 48 48" className="ml-auto w-20 h-20 text-green-400">
          <defs><mask id="ipSShoppingBag0">
            <g fill="none">
              <path fill="#fff" stroke="#fff" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 17h38l-4.2 26H9.2z"/>
              <path stroke="#fff" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M35 17c0-6.627-4.925-12-11-12s-11 5.373-11 12"/>
              <circle cx="17" cy="26" r="2" fill="#000"/><path stroke="#000" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M18 33s2 3 6 3s6-3 6-3"/>
              <circle cx="31" cy="26" r="2" fill="#000"/>
            </g></mask>
          </defs>
          <path fill="currentColor" d="M0 0h48v48H0z" mask="url(#ipSShoppingBag0)"/>
        </svg>
      </div>
      <div className="mt-16">
        {/* <h2>Creada: {new Date(data.created ??).toISOString().substring(0, 10)}</h2> */}
        <h2>Estado de tu orden: {data?.orderStatus}</h2>
      </div>
      <div className="flex flex-col gap-4 mt-8">
        {
          data?.lineItems?.map(({ imageUrl, name, price, quantity }) => (
            <CartItem
              key={name}
              imageUrl={imageUrl}
              name={name}
              price={price}
              quantity={quantity}
            />
          ))
        }
      </div>
    </div>
  )
}

export default Success