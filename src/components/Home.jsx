import React, { useRef, useState } from 'react'
import cn from 'classnames'
import { toast } from 'react-toastify'

import classes from './home.module.css'
import cartItems from '../items.json'
import checkoutOpts from '../checkoutOpts.json'
import CartItem from './CartItem.jsx'
import { isWindowOpen, checkoutData, isIframeOpen } from '../store'
import { Iframe } from './Iframe.jsx'

import handleCheckoutItems from '../examples/handleCheckoutItems'
import handleCheckoutAmount from '../examples/handleCheckoutAmount'
import redirectExample from '../examples/redirectExample'
import windowExample from '../examples/windowExample'
import iframeExample from '../examples/iframeExample'

const Home = () => {
  const externalWindow = useRef(null)
  const iframeRef = useRef(null)
  const [selectedCheckoutOpt, setSelectedCheckoutOpt] = useState(checkoutOpts.at(0)?.value)
  const [loading, setLoading] = useState(false)
  const [iframeSrc, setIframeSrc] = useState('')
  const [activeTab, setActiveTab] = useState(0)
  const [inputValue, setInputValue] = useState('')

  const subTotal = activeTab ? inputValue : cartItems.reduce((prev, { price }) => prev + price, 0)

  const handleSelectChange = (ev) => {
    setSelectedCheckoutOpt(ev.target.value)
  }

  const handleInputChange = (ev) => {
   if(/\d/g.test(+ev.target.value)) {
    setInputValue(ev.target.value)
   }
  }

  const handleWindowCancel = () => {
    externalWindow.current.close()
    isWindowOpen.set(false)

    toast.error('Pago cancelado.', {
      style: {
        background:
          'linear-gradient(148deg, rgba(225,29,72,1) 0%, rgba(251,113,133,1) 100%)',
        borderRadius: '8px',
      },
    })
  }

  const handleWindowSuccess = ({ data, url }) => {
    externalWindow.current.close()
    isWindowOpen.set(false)
    checkoutData.set(data)
    window.location.assign(url)
  }

  const handleIframeCancel = () => {
    setIframeSrc('')
    isIframeOpen.set(false)

    toast.error('Pago cancelado :(', {
      style: {
        background:
          'linear-gradient(148deg, rgba(225,29,72,1) 0%, rgba(251,113,133,1) 100%)',
        borderRadius: '8px',
      },
    })
  }

  const handleIframeSuccess = ({ data, url }) => {
    setIframeSrc('')
    isIframeOpen.set(false)
    checkoutData.set(data)
    window.location.assign(url)
  }

  // we create the link in this request
  const handleCheckout = async () => {
    try {
      setLoading(true)
      let url = ''

      if (activeTab) {
        // handle amount link example
        url = await handleCheckoutAmount(+inputValue)
      } else {
        // handle lineItems link example
        url = await handleCheckoutItems()
      }

      if (url) {
        // default redirect method
        if (+selectedCheckoutOpt === 1) {
          redirectExample(url)
        }
        // window popup method
        if (+selectedCheckoutOpt === 2) {
          isWindowOpen.set(true)
          // we open a new window with the url from the request
          externalWindow.current = window.open(
            url,
            '_blank',
            'height=600,width=400'
          )
          windowExample(externalWindow, handleWindowSuccess, handleWindowCancel, url)
        }
        // iframe method
        if (+selectedCheckoutOpt === 3) {
          setIframeSrc(url)
          // we create a new iframe with the url from the request
          isIframeOpen.set(true)
          iframeExample(iframeRef, handleIframeCancel, handleIframeSuccess)
        }
      }

    } catch(e) {
      toast.error(`Error: ${e}`)
    }
  }

  return (
    <>
      <div className="tabs mb-4 flex gap-4">
        <span
          className={cn(
            `border border-black p-2 rounded-md cursor-pointer hover:bg-black/40
              transition-all ease-in-out`,
            { 'bg-black text-white': activeTab === 0 }
          )}
          onClick={() => setActiveTab(0)}
        >
          Carrito
        </span>
        <span
          className={cn(
            `border border-black p-2 rounded-md cursor-pointer hover:bg-black/40
              transition-all ease-in-out`,
            { 'bg-black text-white': activeTab === 1 }
          )}
          onClick={() => setActiveTab(1)}
        >
          Monto
        </span>
      </div>
      {activeTab === 0 && (
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
        </div>
      )}
      {activeTab === 1 && (
        <div className="px-4 py-16 flex items-center justify-center">
          <input
            className="border border-black p-2 focus:outline-none rounded-md"
            placeholder="9.99"
            value={inputValue}
            onChange={handleInputChange}
          />
        </div>
      )}
      <div className="footer">
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
            ${subTotal || 0}
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
      <Iframe src={iframeSrc} ref={iframeRef} />
    </>
  )
}

export default Home