import React, { forwardRef, useState, useEffect } from 'react'
import { createPortal } from 'react-dom'

export const Iframe = forwardRef(({ src = '' }, ref) => {
  const [firstRender, setFirstRender] = useState(false)

  useEffect(() => {
    if (!firstRender) {
      setFirstRender(true)
    }
  }, [])
  

  return firstRender && !!src ? createPortal(
    <div
      className={`absolute inset-0 bg-white w-[400px] h-[600px]
        m-auto shadow-lg border rounded-md overflow-hidden`}
    >
      <div className='h-6 bg-gray-600' /> 
      <iframe width="400" height="600" src={src} ref={ref} />, 
    </div>,
  document.body
  ) : null
})
