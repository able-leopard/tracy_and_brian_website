import React, { Component } from "react";
import "whatwg-fetch";
import cookie from "react-cookies";
import '../css/GuestEmailForm.css'
import { Redirect } from 'react-router-dom';

class ShippingAddressForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
        address_type: "shipping",
        address_1: "",
        address_2: "",
        city: "",
        province_or_state: "",
        country: "",
        postal_or_zip_code: "",
        successfulPOST: false,
    };
  }

  // either adding or removing the item coming from data into cart send sending it to the REST api
  // Important to note that the paintingId must be in the products[] before sending the data through or else the backend won't know what to do
  // this.getCart() also gets called in this
  updateAddress = (data) => {
    console.log(data)
    const endpoint = "/api/address/update-shipping/"; 
    const csrfToken = cookie.load("csrftoken");

    if (csrfToken !== undefined) {
      let lookupOptions = {
        method: "POST",
        redirect: 'follow',
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
          this.setState({
            address_1: responseData.address_1,
            city: responseData.city,
            province_or_state: responseData.province_or_state,
            country: responseData.country,
            postal_or_zip_code: responseData.postal_or_zip_code,
          })
        })
        .then(responseData => {
          this.setState({
            successfulPOST: true,
          });
        })
        .catch(error => {
          console.log("error", error);
          alert("An error occured, please try again later.");
        });
    }
  };

  // getting the items currently in cart placing them in this.state.currentCart
  getAddress = () => {
    const endpoint = `/api/address/update-shipping/`;
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
            address_1: responseData.address_1,
            address_2: responseData.address_2,
            city: responseData.city,
            province_or_state: responseData.province_or_state,
            country: responseData.country,
            postal_or_zip_code: responseData.postal_or_zip_code
          });
        })
        .catch(error => {
          console.log("error", error);
          alert("An error occured, please try again later.");
        });
    }
  };

  handleAddressChange = event => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };

  handleSubmit = (event) => {
    event.preventDefault();
    let data = this.state;

    if (data !== undefined){
        (
          this.updateAddress(data),
          console.log(this.state.address_type)
        )
    } else {
        ""
    }
  };

  resetSucessfulPOST = () => {
    this.setState({
      successfulPOST: false,
    })
  }


  componentDidMount() {

    this.getAddress()
    this.resetSucessfulPOST()
    console.log("checking when componentDidMount is loaded")
  }

  render() {

    console.log(this.state.billingSameAsShipping)


    const { address_type, 
            address_1, 
            address_2, 
            city, 
            province_or_state, 
            country, 
            postal_or_zip_code,
            billingSameAsShipping,
            successfulPOST } = this.state;
    
    // redirect to billing page after successful POST of shipping address
    if (successfulPOST === true)  

        // remember to use push to or else you lose the history and won't be able to go back to prev page
        // https://stackoverflow.com/questions/47956592/going-back-from-a-redirect-tag-react-router
        return <Redirect push to={{ pathname: '/checkout/billingaddress'}} />
              
    else
  
      return (
        <form onSubmit={this.handleSubmit}>
          <h1>Shipping Address</h1>
          <div>            
              <label>
                  Address:
                  <input 
                          className="input" 
                          type="text" 
                          name="address_1" 
                          onChange={event => {
                              this.handleAddressChange(event);
                            }}
                          value={address_1}
                          required="required"
                          />
              </label>
          </div>
          <div>            
              <label>
                  City:
                  <input 
                          className="input" 
                          type="text" 
                          name="city" 
                          onChange={event => {
                              this.handleAddressChange(event);
                            }}
                          value={city}
                          required="required"
                          />
              </label>
          </div>
          <div>            
              <label>
                  Province/ State:
                  <input 
                          className="input" 
                          type="text" 
                          name="province_or_state" 
                          onChange={event => {
                              this.handleAddressChange(event);
                            }}
                          value={province_or_state}
                          required="required"
                          />
              </label>
          </div>
          <div>
          <label for="country">Country</label>
            <select id="country"
                    name="country"
                    className=""
                    onChange={this.handleAddressChange}
                    value={country}
                    required="required">
              <option value="">-</option>
              <option value="canada">Canada</option>
              <option value="united_states">United States</option>
            </select>
          </div>
          <div>            
              <label>
                  Postal/ Zip Code:
                  <input 
                          className="input" 
                          type="text" 
                          name="postal_or_zip_code" 
                          onChange={event => {
                              this.handleAddressChange(event);
                            }}
                          value={postal_or_zip_code}
                          required="required"
                          />
              </label>
          </div>
          <button className="btn btn-primary">Submit</button>

        </form>
      );
  }
}

export default ShippingAddressForm;
