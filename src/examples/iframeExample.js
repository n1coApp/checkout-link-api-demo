export default function(iframeRef, handleCancel, handleSuccess) {
  window.addEventListener(
  'message',
  (event) => {
    console.log("🚀 ~ file: Home.jsx:186 ~ handleCheckout ~ event:", event)
    if (event.data.type === 'link-api-connection') {
      if (event.data?.payload?.loaded) {
        iframeRef?.current.contentWindow.postMessage(
          {
            type: 'link-api-connection',
            payload: {
              connection: true,
              origin: window.location.href,
            },
          },
          '*'
        )
        console.log('event connection established')
      }
      if (event.data?.payload?.cancel) {
        // handle window close event
        handleCancel()
      }

      if (event.data?.payload?.paidSuccess) {
        // handle success event
        // we receive the order data and success url from the event
        handleSuccess({ data: event.data?.payload?.data, url: event.data?.payload?.data.order.successUrl })
      }
    }
  },
  false
  )

  setTimeout(() => {
    iframeRef.current?.contentWindow.postMessage({ 
      type: 'link-api-connection',
      payload: {
        connection: true
      }
    }, '*')
  }, 2000);
}