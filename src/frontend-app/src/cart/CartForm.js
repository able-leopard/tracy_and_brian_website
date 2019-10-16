import React, { Component } from "react";
import "whatwg-fetch";
import cookie from "react-cookies";
import moment from "moment";

class CartForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: null,
      description: null,
      publish: null
    };
    this.cartTitleRef = React.createRef();
    this.cartDescriptionRef = React.createRef();
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
        .then(responseData => {
          console.log(responseData);
          if (this.props.newPaintingItemCreated) {
            this.props.newPaintingItemCreated(responseData);
          }
          this.clearForm()
        })
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
        .then(responseData => {
          console.log(responseData);
          if (this.props.cartItemUpdated) {
            this.props.cartItemUpdated(responseData);
          }
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

  // another way to clear the form
  clearFormRefs() {
    this.defaultState()
    this.paintingTitleRef.current = "";
    this.paintingDescriptionRef.current = "";
  }

  defaultState = () => {
      this.setState({
          title: null,
          description: null,
          publish: moment(new Date()).format("YYYY-MM-DD"), // this for automatically setting the date to today (good for like bpaintings etc. where you're showing the published date )
      })
  }

  componentDidMount() {
    const { painting } = this.props;
    if (painting !== undefined) {
      this.setState({
        title: painting.title,
        description: painting.description,
        publish: moment(new Date(painting.publish)).format("YYYY-MM-DD")
      });
    } else {
      this.defaultState()
    }
    // this.paintingTitleRef.current.focus();
  }

  render() {
    const { publish, title, description } = this.state;
    const cancelClass = this.props.cart !== undefined ? "d-none" : ""
    return (
      <form onSubmit={this.handleSubmit} ref={el => (this.paintingCreateForm = el)}>
        <div className="form-group">
          <label for="title">Painting title</label>
          <input
            type="text"
            id="title"
            ref={this.paintingTitleRef}
            name="title"
            value={title}
            className="form-control"
            placeholder="Painting title"
            ref={this.paintingTitleRef}
            onChange={this.handleInputChange}
          />
        </div>
        <div className="form-group">
          <label for="description">Description</label>
          <textarea
            id="description"
            ref={this.paintingDescriptionRef}
            name="description"
            value={description}
            className="form-control"
            placeholder="Painting description"
            onChange={this.handleInputChange}
          />
        </div>
        <div className="form-group">
          <label for="title">Painted Date</label>
          <input
            type="date"
            id="publish"
            name="publish"
            className="form-control"
            onChange={this.handleInputChange}
            value={publish}
            required="required"
          />
        </div>
        <button className="btn btn-primary">Save</button> 
        <button className={`btn btn-secondary`} onClick={this.clearForm}>
          Clear
        </button>
      </form>
    );
  }
}

export default CartForm;
