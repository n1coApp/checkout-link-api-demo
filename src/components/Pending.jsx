import React, { useEffect } from 'react'
import cn from 'classnames'
import { useStore } from '@nanostores/react'

import { isWindowOpen, isIframeOpen } from '../store'

const Pending = () => {
  const $isWindowOpen = useStore(isWindowOpen);
  const $isIframeOpen = useStore(isIframeOpen)
  
  useEffect(() => {
    if ($isWindowOpen || $isIframeOpen) {
      document.getElementById('content').classList.add('blur-sm')
    } else {
      document.getElementById('content').classList.remove('blur-sm')
    }
  }, [$isWindowOpen, $isIframeOpen])
  

  return $isWindowOpen || $isIframeOpen ? (
    <div
      className={
        `absolute inset-0 items-center justify-center text-4xl font-bold
        bg-white/50 flex`
      }
    >
      {$isWindowOpen && `Termina el checkout en la otra ventana.`}
    </div>
  ) : null
}

export default Pending