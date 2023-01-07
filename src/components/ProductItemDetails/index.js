import Cookies from 'js-cookie'
import {Component} from 'react'
import {Link} from 'react-router-dom'
import Loader from 'react-loader-spinner'
import {BsPlusSquare, BsDashSquare} from 'react-icons/bs'

import SimilarProductItem from '../SimilarProductItem'
import Header from '../Header'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class ProductItemDetails extends Component {
  state = {
    apiStatus: apiStatusConstants.initial,
    productItemData: null,
    quantity: 1,
  }

  componentDidMount() {
    this.getProductItemDetails()
  }

  getProductItemDetails = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const jwtToken = Cookies.get('jwt_token')
    const {match} = this.props
    const {params} = match
    const {id} = params
    const url = `https://apis.ccbp.in/products/${id}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(url, options)

    if (response.ok) {
      const fetchedData = await response.json()
      const updatedData = {
        id: fetchedData.id,
        imageUrl: fetchedData.image_url,
        title: fetchedData.title,
        style: fetchedData.style,
        description: fetchedData.description,
        price: fetchedData.price,
        brand: fetchedData.brand,
        totalReviews: fetchedData.total_reviews,
        rating: fetchedData.rating,
        availability: fetchedData.availability,
        similarProducts: fetchedData.similar_products,
      }

      this.setState({
        apiStatus: apiStatusConstants.success,
        productItemData: updatedData,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  renderProductDetailsView = () => {
    const {productItemData, quantity} = this.state
    const {
      id,
      imageUrl,
      title,

      description,
      price,
      brand,
      totalReviews,
      rating,
      availability,
      similarProducts,
    } = productItemData
    const updatedSimilarProducts = similarProducts.map(each => ({
      title: each.title,
      id: each.id,
      imageUrl: each.image_url,
    }))

    const increaseQuantity = () => {
      this.setState(prevState => ({quantity: prevState.quantity + 1}))
    }

    const decreaseQuantity = () => {
      if (quantity >= 1) {
        this.setState(prevState => ({quantity: prevState.quantity - 1}))
      }
    }

    return (
      <div>
        <Header />
        <div className="image-description-container">
          <div className="image-container">
            <img src={imageUrl} alt={`product ${id}`} className="item-image" />
          </div>
          <div className="rest-container">
            <h1>{title}</h1>
            <p>Rs {price} /- </p>
            <div className="rating-review-container">
              <p>{rating}</p>
              <p>{totalReviews}</p>
            </div>
            <p>{description}</p>
            <p>Available: {availability}</p>
            <p>Brand: {brand}</p>
            <div className="quantity-container">
              <button
                type="button"
                onClick={decreaseQuantity}
                data-testid="minus"
              >
                <BsDashSquare />
              </button>
              <p>{quantity}</p>
              <button
                type="button"
                onClick={increaseQuantity}
                data-testid="plus"
              >
                <BsPlusSquare />
              </button>
            </div>
            <button type="button">Add To Cart</button>
          </div>
        </div>
        <h2>Similar Products</h2>
        <div className="similar-products-container">
          {similarProducts.map(eachProduct => (
            <SimilarProductItem
              key={eachProduct.id}
              eachProduct={eachProduct}
              updatedSimilarProducts={updatedSimilarProducts}
            />
          ))}
        </div>
      </div>
    )
  }

  renderFailureView = () => (
    <div>
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png"
        alt="failure view"
      />
      <h1>Product Not Found</h1>
      <Link to="/products">
        <button type="button">Continue Shopping</button>
      </Link>
    </div>
  )

  renderLoaderView = () => (
    <div data-testid="loader" className="products-loader-container">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  renderProductItemDetails = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderProductDetailsView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoaderView()
      default:
        return null
    }
  }

  render() {
    return <>{this.renderProductItemDetails()}</>
  }
}

export default ProductItemDetails
