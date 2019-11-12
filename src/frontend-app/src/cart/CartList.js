import React, { Component } from "react";
import "whatwg-fetch";
import cookie from "react-cookies";
import { Link } from 'react-router-dom';


// majority of the code this under the class is copied over from CartForm except I added setProduct() in here

const CartItem = props => (
    <div>
        {console.log(props)}
    
        {props.item.title}
        {props.item.size_measurements}
        {props.item.price}
        <Link maintainScrollPosition={false} to={{
            pathname:`/paintings/detail/${props.item.slug}`,
            state:{fromDashboard: false}
        }}>
            <img    src={props.item.srcs[0].src}
                    /> 
        </Link>
        <div>
            <button     onClick={props.setProduct}
                        className="btn btn-primary">Remove from cart</button> 
        </div>
    </div>
)

class CartList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      products: [],
      sub_total: 0,
      shipping: 0,
      total: 0,
      currentCart: []
    };
  }

  // either adding or removing the item coming from data into cart send sending it to the REST api
  // this.getCart() also gets called in this
  updateCart = (data) => {
    const endpoint = "/api/cart/update/"; 
    const csrfToken = cookie.load("csrftoken");

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
          });
        })
        .catch(error => {
          console.log("error", error);
          alert("An error occured, please try again later.");
        });
    }
  };

  handleSubmit = (event) => {
    event.preventDefault();
    let data = this.state;
    console.log(data)

    if (data !== undefined){
        (
          this.updateCart(data),
          console.log(this.state.currentCart)
        )
    } else {
        ""
    }
  };

  setProduct = (paintingId) => {
    this.setState({
        products: [paintingId],
      })
  }

  defaultState = () => {
      this.setState({
        products: [],
      })
  }

  componentDidMount() {
    // getting the current painting's ID
    const { paintingId } = this.props;

    // getting the items currently in the cart and storing in this.state.currentCart
    this.getCart()

    if (paintingId !== undefined) {
      // putting the current painting id into the products so the cart can associate what painting is being added later
      this.setState({
        products: [paintingId],
      });
    } else {
      this.defaultState()
    }
  }

  render() {

    // Get rid of the remove form cart later

    const {currentCart, products} = this.state
    // console.log(currentCart)

    return (
      <form onSubmit={this.handleSubmit}>
        <div>
            {currentCart.map((item) => (
                <CartItem   item = {item}
                            setProduct = {() => this.setProduct(item.id)}
                />
            ))}
        </div>
        <Link maintainScrollPosition={false} to={{
          pathname:`/checkout/guestemail`,
          state:{fromDashboard: false}
      }}>
          <h4>Checkout </h4>
               
      </Link>
      </form>
    );
  }
}

export default CartList;
