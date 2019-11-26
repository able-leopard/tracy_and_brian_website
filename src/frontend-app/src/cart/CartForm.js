import React, { Component } from "react";
import "whatwg-fetch";
import cookie from "react-cookies";

/* 
We have to make an initial get request to /api/cart/ to create a new cart if there are 
no previous cart assoicated with this session.
Other wise /api/cart/update/ will have no cart to point to when the user tries to add currentPaintingId to the cart 
*/

class CartForm extends Component {
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
  // Important to note that the paintingId must be in the currentPaintingId[] before sending the data through or else the backend won't know what to do
  // this.getCart() also gets called in this
  updateCart = data => {
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
            currentCart: responseData.products
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

    if (data !== undefined) {
      this.updateCart(data), console.log(this.state.currentCart);
    } else {
      ("");
    }
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

  render() {
    // Get rid of the remove form cart later

    const { currentCart, currentPaintingId } = this.state;
    const myCart = [];
    currentCart.forEach(function(item) {
      myCart.push(item.id);
    });

    return (
      <form onSubmit={this.handleSubmit}>
        {myCart.includes(currentPaintingId[0]) ? (
          <div>
            <br />
            <a>Current painting already in cart</a>
          </div>
        ) : (
          <div>
            <button className="btn btn-primary">Add to cart</button>
          </div>
        )}
      </form>
    );
  }
}

export default CartForm;
