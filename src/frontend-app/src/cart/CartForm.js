import React, { Component } from "react";
import "whatwg-fetch";
import cookie from "react-cookies";

/* 
We have to make an initial get request to /api/cart/ to create a new cart if there are 
no previous cart assoicated with this session.
Other wise /api/cart/update/ will have no cart to point to when the user tries to add products to the cart 
*/

class CartForm extends Component {
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

  updateCart = (data) => {
    const endpoint = "/api/cart/update/"; 
    const csrfToken = cookie.load("csrftoken");

    if (csrfToken !== undefined) {
      // this goes into the options argument in fetch(url, options)
      let lookupOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrfToken
        },
        body: JSON.stringify(data),
        credentials: "include"
      };

      // fetch documentation: https://github.github.io/fetch/
      // more explaination on the Options argument: https://github.github.io/fetch/#options
      fetch(endpoint, lookupOptions)
        .then(response => {
          return response.json();
        })
        this.clearForm()
        .catch(error => {
          console.log("error", error);
          alert("An error occured, please try again later.");
        });
    }
  };

  getCart = () => {
    const endpoint = `/api/cart/`;
    const csrfToken = cookie.load("csrftoken");

    if (csrfToken !== undefined) {
      // this goes into the options argument in fetch(url, options)
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
    console.log(this.state.currentCart)
    console.log(this.state.currentCart.length)
  };

  handleSubmit = event => {
    event.preventDefault();
    let data = this.state;

    if (data !== undefined){
        this.updateCart(data)
    } else {
        ""
    }
    this.getCart()

  };

  handleInputChange = event => {
    event.preventDefault();
    console.log(event.target.name, event.target.value);
    this.setState({
      [event.target.name]: event.target.value
    });
  };

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

    // HAVE TO FIGURE OUT HOW TO MAKE DOM RE-RENDER AFTER STATE CHANGE

    return (
      <form onSubmit={this.handleSubmit}>
        <button className="btn btn-primary">Add to cart</button>
        <div>
          Cart Number:
          {this.state.currentCart.length}
        </div>
        
      </form>
    );
  }
}

export default CartForm;
