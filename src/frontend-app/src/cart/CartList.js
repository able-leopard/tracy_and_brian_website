import React, { Component } from "react";
import "whatwg-fetch";
import cookie from "react-cookies";
import { Link } from "react-router-dom";
import "../css/CartList.css";

// majority of the code this under the class is copied over from CartForm except I added setProduct() in here

const CartItem = props => (
  <div>
    <div className="my-container">
      <div className="photo-and-info-container">
        <div>
          <Link
            maintainScrollPosition={false}
            to={{
              pathname: `/paintings/detail/${props.item.slug}`,
              state: { fromDashboard: false }
            }}
          >
            <img className="my-img" src={props.item.srcs[0].src} />
          </Link>
        </div>
        <div className="item-info">
          <a>{props.item.title}</a>
          <a>{props.item.size_measurements}</a>
          <button onClick={props.setProduct} className="delete-button">
            Remove
          </button>
        </div>
      </div>

      <div className="price-info">
        <a>${parseInt(props.item.price).toLocaleString()}.00 CAD</a>
        <p>Shipping Included</p>
      </div>
    </div>
    <br />
    <hr />
  </div>
);

class CartList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentPaintingId: [],
      sub_total: 0,
      shipping: 0,
      total: 0,
      currentCart: []
    };
  }

  // either adding or removing the item coming from data into cart send sending it to the REST api
  // this.getCart() also gets called in this
  updateCart = data => {
    const endpoint = "/api/cart/update/";
    const csrfToken = cookie.load("csrftoken");
    cookie.save('csrftoken', csrfToken);

    if (csrfToken !== undefined) {
      let lookupOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrfToken
        },
        body: JSON.stringify(data),
        credentials: "include"
      };
      fetch(endpoint, lookupOptions)
        .then(response => {
          return response.json();
        })
        .then(() => {
          this.getCart();
        })
        .catch(error => {
          console.log("error", error);
          alert("An error occured, please try again later.");
        });
    }
  };

  // getting the items currently in cart placing them in this.state.currentCart
  getCart = () => {
    const endpoint = `/api/cart/`;
    const csrfToken = cookie.load("csrftoken");
    cookie.save('csrftoken', csrfToken);

    if (csrfToken !== undefined) {
      let lookupOptions = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrfToken
        },
        credentials: "include"
      };
      fetch(endpoint, lookupOptions)
        .then(response => {
          return response.json();
        })
        .then(responseData => {
          this.setState({
            currentCart: responseData.products,
            total: responseData.total
          });
        })
        .catch(error => {
          console.log("error", error);
          alert("An error occured, please try again later.");
        });
    }
  };

  handleSubmit = event => {
    event.preventDefault();
    let data = this.state;
    console.log(data);

    if (data !== undefined) {
      this.updateCart(data), console.log(this.state.currentCart);
    } else {
      ("");
    }
  };

  setProduct = paintingId => {
    this.setState({
      currentPaintingId: [paintingId]
    });
  };

  defaultState = () => {
    this.setState({
      currentPaintingId: []
    });
  };

  componentDidMount() {
    // getting the current painting's ID
    const { paintingId } = this.props;

    // getting the items currently in the cart and storing in this.state.currentCart
    this.getCart();

    if (paintingId !== undefined) {
      // putting the current painting id into the currentPaintingId so the cart can associate what painting is being added later
      this.setState({
        currentPaintingId: [paintingId]
      });
    } else {
      this.defaultState();
    }
  }
  GET;
  render() {
    const { currentCart, currentPaintingId, total } = this.state;
    const { billing_postal_or_zip_code } = this.props;

    /* 
    using billing_postal_or_zip_code as a check for condition display since billing_postal_or_zip_code is a 
    required field in BillingAddressForm.js, this ensures that the checkout link only gets displayed in the cart page 
    because once we get to the order summary page, billing_postal_or_zip_code is already filled so the
    checkout link doesn't get displayed  
    */

    return (
      <form onSubmit={this.handleSubmit}>
        <div className="cart-list">
          <div>
            {currentCart.map(item => (
              <CartItem
                item={item}
                setProduct={() => this.setProduct(item.id)}
              />
            ))}

            {currentCart.length > 0 ? (
              <div className="price-total">
                <table>
                  <tr>
                    <td>Product Total:</td>
                    <td align="right">
                      ${parseInt(total).toLocaleString()}.00 CAD
                    </td>
                  </tr>
                  <tr>
                    <td>Shipping:</td>
                    <td align="right">$0.00 CAD</td>
                  </tr>
                  <tr>
                    <td>Total:</td>
                    <td align="right">
                      ${parseInt(total).toLocaleString()}.00 CAD
                    </td>
                  </tr>
                </table>
              </div>
            ) : (
              ""
            )}
          </div>

          {currentCart.length < 1 ? "Cart is empty" : ""}

          <div className="checkout-button">
            {currentCart.length > 0 &&
            billing_postal_or_zip_code === undefined ? (
              <Link
                maintainScrollPosition={false}
                to={{
                  pathname: `/checkout/guestemail`,
                  state: { fromDashboard: false }
                }}
              >
                <button className="btn btn-primary">Proceed to Checkout</button>
              </Link>
            ) : (
              ""
            )}
          </div>
        </div>
      </form>
    );
  }
}

export default CartList;
