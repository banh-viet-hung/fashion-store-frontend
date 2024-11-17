import React from "react"
import { CartContext } from "../CartContext"
import { addCartItem } from "../../hooks/UseCart"
import ModalQuickView from "../ModalQuickView"
import CardProductDefault from "./Default"

const CardProduct = ({ product, masonry, cardType }) => {
  const [cartItems, dispatch] = React.useContext(CartContext)
  const [quickView, setQuickView] = React.useState(false)

  const addToCart = (e, product) => {
    e.preventDefault()
    addCartItem(product, "1")
    dispatch({ type: "add", payload: product, quantity: "1" })
  }

  const params = {
    setQuickView: setQuickView,
    product: product,
    addToCart: addToCart,
    quickView: quickView,
    masonry: masonry,
  }

  return (
    <React.Fragment>
      {!cardType && <CardProductDefault {...params} />}
      <ModalQuickView
        isOpen={quickView}
        toggle={() => setQuickView((prev) => !prev)}
        product={product}
      />
    </React.Fragment>
  )
}

export default CardProduct
