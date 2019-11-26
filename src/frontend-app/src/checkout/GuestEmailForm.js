import React, { Component } from "react";
import "whatwg-fetch";
import cookie from "react-cookies";
import "../css/GuestEmailForm.css";
import { Redirect } from "react-router-dom";

class GuestEmailForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      successfulPOST: false
    };
  }

  updateGuestEmail = data => {
    const endpoint = "/api/account/update/";
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
        .then(responseData => {
          this.setState({ email: responseData.email });
        })
        .then(responseData => {
          this.setState({
            successfulPOST: true
          });
        })
        .catch(error => {
          console.log("error", error);
          alert("An error occured, please try again later.");
        });
    }
  };

  getGuestEmail = () => {
    const endpoint = `/api/account/`;
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
            email: responseData.email
          });
        })
        .catch(error => {
          console.log("error", error);
          alert("An error occured, please try again later.");
        });
    }
  };

  handleEmailChange = event => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };

  handleSubmit = event => {
    event.preventDefault();
    let data = this.state;

    if (data !== undefined) {
      this.updateGuestEmail(data);
    } else {
      ("");
    }
  };

  resetSucessfulPOST = () => {
    this.setState({
      successfulPOST: false
    });
  };

  tiggerSucessfulPOST = () => {
    this.setState({
      successfulPOST: true
    });
  };

  componentDidMount() {
    this.resetSucessfulPOST();
    this.getGuestEmail();
  }

  render() {
    const { email, successfulPOST } = this.state;

    // redirect to shipping page after successful POST of email
    if (successfulPOST === true)
      // remember to use push to or else you lose the history and won't be able to go back to prev page
      // https://stackoverflow.com/questions/47956592/going-back-from-a-redirect-tag-react-router
      return <Redirect push to={{ pathname: "/checkout/shippingaddress" }} />;
    else
      return (
        <main className="container">
          <form
            onSubmit={this.handleSubmit}
            className="form-group mt-3 border border-primary rounded shadow-1g p-3"
          >
            <label>
              Guest Email
              <input
                className="input-group my-1 p-1 border border-dark my-width"
                type="email"
                name="email"
                value={email}
                onChange={event => {
                  this.handleEmailChange(event);
                }}
              />
            </label>
            <br />
            <br />
            <button className="btn btn-primary border border-dark shadow">
              Confirm & Continue
            </button>
          </form>
        </main>
      );
  }
}

export default GuestEmailForm;
