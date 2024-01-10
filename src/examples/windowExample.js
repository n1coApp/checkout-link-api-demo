export default function(externalWindow, handleSuccess, handleCancel) {
  window.addEventListener(
    'message',
    (event) => {   
      if (event.data.type === 'link-api-connection') {
        if (event.data?.payload?.loaded) {
          // we receive an event with loaded = true to make sure that we are connected
          // with the external window for future events
          externalWindow?.current.postMessage(
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

  // we open a new window with the url from the request
  externalWindow.current = window.open(
    devUrl,
    '_blank',
    'height=600,width=400'
  )

  // we send an event to verify the connection
  setTimeout(() => {
    externalWindow.current?.postMessage({ 
      type: 'link-api-connection',
      payload: {
        connection: true
      }
      }, '*')
  }, 2000);
}