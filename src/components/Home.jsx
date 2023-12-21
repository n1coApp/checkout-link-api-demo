import React, { useRef, useState } from 'react'
import cn from 'classnames'
import { toast } from 'react-toastify'

import classes from './home.module.css'
import cartItems from '../items.json';
import checkoutOpts from '../checkoutOpts.json';
import CartItem from './CartItem.jsx';
import { isWindowOpen, checkoutData } from '../store'

const Home = () => {
  const externalWindow = useRef(null)
  const [selectedCheckoutOpt, setSelectedCheckoutOpt] = useState(checkoutOpts.at(0)?.value)
  const [loading, setLoading] = useState(false)

  const handleSelectChange = (ev) => {
    setSelectedCheckoutOpt(ev.target.value)
  }

  const handleCheckout = async () => {
    const body = {
      orderName: `my-store-order-${Math.floor(Math.random() * 1000) + 1}`,
      orderDescription: "generado desde un tostador inteligente",
      lineItems: cartItems.map((item) => ({
        product: item,
        quantity: item.quantity,
      })),
      successUrl: `${window.location.href}success`,
      cancelUrl: window.location.href,
    }

    try {
      setLoading(true)
      const res = await fetch(`${import.meta.env.PUBLIC_API_URL}/checkout`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${import.meta.env.PUBLIC_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
      const jsonres = await res.json();

      if (jsonres.paymentLinkUrl) {
        // TODO: update this when client-link gets updated
        const devUrl = jsonres.paymentLinkUrl.replace(
          "https://pay.h4b.dev",
          "https://mango-pebble-0a392a510-163.centralus.azurestaticapps.net"
        );

        setLoading(false)

        switch (Number(selectedCheckoutOpt)) {
          case checkoutOpts[0].value: {
            window.location.assign(jsonres.paymentLinkUrl);
            break;
          }
          default: {
            isWindowOpen.set(true)

            window.addEventListener(
              "message",
              (event) => {
                console.log("🚀 ~ file: Home.jsx:105 ~ handleCheckout ~ event:", event)
                
                if (event.data.type === 'link-api-connection') {
                  if (event.data?.payload?.loaded) {
                    externalWindow?.current.postMessage(
                      {
                        type: "link-api-connection",
                        payload: {
                          connection: true,
                          origin: window.location.href,
                        },
                      },
                      "*"
                    );
                    console.log("event connection established");
                  }
  
                  if (event.data?.payload?.cancel) {
                    externalWindow.current.close();
                    isWindowOpen.set(false)
  
                    toast.error('Pago cancelado :(', {
                      style: {
                        background:
                          "linear-gradient(148deg, rgba(225,29,72,1) 0%, rgba(251,113,133,1) 100%)",
                        borderRadius: "8px",
                      },
                    })
                  }

                  if (event.data?.payload?.paidSuccess) {
                    externalWindow.current.close();
                    isWindowOpen.set(false)
                    console.log('checkoutData', checkoutData, event.data?.payload?.data);
                    checkoutData.set(event.data?.payload?.data)
                    window.location.assign(event.data?.payload?.data.order.successUrl)
                  }
                }
              },
              false
            );

            externalWindow.current = window.open(
              devUrl,
              "_blank",
              "height=600,width=400"
            );
            break;
          }
        }
      }
    } catch (error) {
      toast.error(`Error: ${error.message}`);
      console.error(`Error: ${error.message}`);
    }
  }

  return (
    <div>
      <h1 className="font-bold text-4xl mb-4">Carrito</h1>
      <p className="opacity-40 text-sm">Codigo ejemplo de link de integraciones</p>
      <div className="flex flex-col gap-8 my-4">
        {
          cartItems.map(({ imageUrl, name, price, quantity }) => (
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
      <div
        className={`
          bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white
          p-4 flex gap-4 mt-8 rounded-md
        `}
      >
        <div>
          <h1 className="font-bold text-lg">Subtotal</h1>
          <p className="opacity-50 text-sm">
            Los impuestos y shipping seran calculados en el checkout
          </p>
        </div>
        <p className="ml-auto flex items-center font-bold">
          ${cartItems.reduce((prev, { price }) => prev + price, 0)}
        </p>
      </div>
      <div className="ml-auto flex gap-4 items-center justify-end mt-8">
        <select onChange={handleSelectChange}>
          {
            checkoutOpts.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))
          }
        </select>
        <button
          onClick={handleCheckout}
          className={cn(
            "rounded-md bg-black text-white px-4 py-2",
            { [classes.loadingBtn]: loading }
          )}
        >
          Checkout →
        </button>
      </div>
    </div>
  )
}

export default Home