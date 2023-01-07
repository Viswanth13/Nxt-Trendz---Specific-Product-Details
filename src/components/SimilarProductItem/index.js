import {Component} from 'react'
import './index.css'

class SimilarProductItem extends Component {
  render() {
    const {eachProduct, updatedSimilarProducts} = this.props
    const {id, title, brand, price, rating} = eachProduct

    const req = updatedSimilarProducts.filter(each => each.id === id)
    const {imageUrl} = req[0]

    return (
      <div className="similar-product-item-container">
        <img src={imageUrl} alt="similar product" className="similar-image" />
        <p>{title}</p>
        <p>By {brand}</p>
        <div className="price-rating-container">
          <p>Rs {price} /- </p>
          <p>{rating}</p>
        </div>
      </div>
    )
  }
}

export default SimilarProductItem
