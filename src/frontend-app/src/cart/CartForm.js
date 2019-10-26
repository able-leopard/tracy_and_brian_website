import React, { Component } from "react";
import "whatwg-fetch";
import cookie from "react-cookies";
import moment from "moment";



class CartForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      products: null,
      "sub_total": null,
      "total": null,
      "updated": null,
      "timestamp": null
    };
    
  }

  createCart = (data) => {
    const endpoint = "/api/cart/"; //notice the endpoint is going to a relative request, (relative to where the final javascript built code will be)
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

  updateCart = data => {
    const endpoint = `/api/cart/`; //notice the endpoint is going to a relative request, (relative to where the final javascript built code will be)
    const csrfToken = cookie.load("csrftoken");

    if (csrfToken !== undefined) {
      // this goes into the options argument in fetch(url, options)
      let lookupOptions = {
        method: "PUT",
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
        .catch(error => {
          console.log("error", error);
          alert("An error occured, please try again later.");
        });
    }
  };

  handleSubmit = event => {
    event.preventDefault();
    let data = this.state;

    const {cart} = this.props
    if (cart !== undefined){
        this.updateCart(data)
    } else {
        this.createCart(data)
    }
    // this.updatePainting(data);
  };

  handleInputChange = event => {
    event.preventDefault();
    console.log(event.target.name, event.target.value);
    this.setState({
      [event.target.name]: event.target.value
    });
  };

  // clearing the form
  clearForm = event => {
    if (event) {
      event.preventDefault();
    }
    this.paintingCreateForm.reset();
  };

  defaultState = () => {
      this.setState({
        products: null,
        "sub_total": null,
        "total": null,
        "updated": null,
        "timestamp": null
      })
  }

  componentDidMount() {
    const { painting } = this.props;
    if (painting !== undefined) {
      this.setState({
        title: painting.title,
        description: painting.description,

      });
    } else {
      this.defaultState()
    }
    // this.paintingTitleRef.current.focus();
  }

  render() {
    const { products, sub_total, total, updated, timestamp } = this.state;

    return (
      <form onSubmit={this.handleSubmit} ref={el => (this.paintingCreateForm = el)}>

        <button className="btn btn-primary">Save</button> 
        <button className={`btn btn-secondary`} onClick={this.clearForm}>
          Clear
        </button>
      </form>
    );
  }
}

export default CartForm;
