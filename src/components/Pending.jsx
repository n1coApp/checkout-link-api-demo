import React, { useEffect } from 'react'
import cn from 'classnames'
import { useStore } from '@nanostores/react'

import { isWindowOpen } from '../store'

const Pending = () => {
  const $isWindowOpen = useStore(isWindowOpen);
  
  useEffect(() => {
    if ($isWindowOpen) {
      document.getElementById('content').classList.add('blur-sm')
    } else {
      document.getElementById('content').classList.remove('blur-sm')
    }
  }, [$isWindowOpen])
  

  return $isWindowOpen ? (
    <div
      className={
        `absolute inset-0 items-center justify-center text-4xl font-bold
        bg-white/50 flex`
      }
    >
      Termina el checkout en la otra ventana.
    </div>
  ) : null
}

export default Pending