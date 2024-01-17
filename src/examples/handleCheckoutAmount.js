// env vars
const { PUBLIC_API_URL, PUBLIC_API_KEY } = import.meta.env

export default async function handleCheckoutAmount(amount) {
    const body = {
      orderName: `my-store-order-${Math.floor(Math.random() * 1000) + 1}`,
      orderDescription: 'generada desde checkout link',
      successUrl: `${window.location.href}success`,
      cancelUrl: window.location.href,
      amount,
    }

    try {
      const res = await fetch(`${PUBLIC_API_URL}/checkout`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${PUBLIC_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      })
      const jsonres = await res.json()

      if (jsonres.paymentLinkUrl) {
        return jsonres.paymentLinkUrl
      } else {
        throw new Error({ message: 'Request failed succesfully.' })
      }
    } catch (error) {
      console.error(`Error: ${error.message}`)
      throw new Error(error.message)
    }
}