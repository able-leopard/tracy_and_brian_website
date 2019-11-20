import React, { Component } from "react";
import "whatwg-fetch";
import cookie from "react-cookies";
import '../css/CheckoutForms.css'
import { Redirect } from 'react-router-dom';

class BillingAddressForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
        address_type: "billing",
        first_name: "",
        last_name: "",
        address_1: "",
        address_2: "",
        city: "",
        province_or_state: "",
        country: "",
        postal_or_zip_code: "",
        phone: "",
        billingSameAsShipping: true,
        successfulPOST: false,
    };
  }

  // either adding or removing the item coming from data into cart send sending it to the REST api
  // Important to note that the paintingId must be in the products[] before sending the data through or else the backend won't know what to do
  // this.getCart() also gets called in this
  updateAddress = (data) => {
    console.log(data)
    const endpoint = "/api/address/update-billing/"; 
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
          this.setState({
            first_name: responseData.first_name,
            last_name: responseData.last_name,
            address_1: responseData.address_1,
            city: responseData.city,
            province_or_state: responseData.province_or_state,
            country: responseData.country,
            postal_or_zip_code: responseData.postal_or_zip_code,
            phone: responseData.phone,
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
    const endpoint = `/api/address/update-billing/`;
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
          console.log(responseData)
          this.setState({
            first_name: responseData.first_name,
            last_name: responseData.last_name,
            address_1: responseData.address_1,
            address_2: responseData.address_2,
            city: responseData.city,
            province_or_state: responseData.province_or_state,
            country: responseData.country,
            postal_or_zip_code: responseData.postal_or_zip_code,
            phone: responseData.phone,
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

/* 
this function auto fills the billing with the shipping info if billingSameAsShipping is true,
I had to do this.state.billingSameAsShipping === false for work around before there is no way to
wait for setState to complete before running the getAddress() or defaultState() functions
*/
  toggleBillingSameAsShipping = () => {
    this.setState(prevState => ({
      billingSameAsShipping: !prevState.billingSameAsShipping
    })),
    this.state.billingSameAsShipping === false ? this.getAddress() : this.defaultState()
  }

  handleSubmit = (event) => {
    event.preventDefault();
    let data = this.state;

    if (data !== undefined){
        (
          this.updateAddress(data)
        )
    } else {
        ""
    }
  };

  defaultState = () => {
      this.setState({
        first_name: "",
        last_name: "",
        address_1: "",
        address_2: "",
        city: "",
        province_or_state: "",
        country: "",
        postal_or_zip_code: "",
        phone: ""
      })
  }

  resetSucessfulPOST = () => {
    this.setState({
      successfulPOST: false,
    })
  }

  componentDidMount() {

    // getting the items currently in the cart and storing in this.state.currentCart
    this.getAddress()
    this.resetSucessfulPOST()
    console.log("check when componentDidMount prints")
  }

  render() {
    console.log(this.state.country)

    // getting all the info from shipping address
    const { first_name,
            last_name,
            address_1, 
            city, 
            province_or_state, 
            country, 
            postal_or_zip_code,
            phone,
            successfulPOST
          } = this.state;

    const all_provinces_and_states = [
      'Alberta', 'British Columbia', 'Manitoba', 'New Brunswick', 'Newfoundland and Labrador',
      'Northwest Territories', 'Nova Scotia', 'Nunavut', 'Ontario', 'Prince Edward Island', 
      'Quebec', 'Saskatchewan', 'Yukon', 
      'Alabama', 'Alaska', 'Arizona', ' Arkansas', 'California', 'Colorado', 'Connecticut',
      'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa',
      'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan',
      'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire',
      'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma',
      'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee',
      'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'                       
  ] 
        // redirect to billing page after successful POST of shipping address
    if (successfulPOST === true)  

        // remember to use push to or else you lose the history and won't be able to go back to prev page
        // https://stackoverflow.com/questions/47956592/going-back-from-a-redirect-tag-react-router
      return <Redirect push to={{ pathname: '/checkout/summary'}} />
              
      else

      return (
        <main className="container">
          <form 
            onSubmit={this.handleSubmit}
            className="form-group mt-3 border border-primary rounded shadow-1g p-3"
            >
            <h4>Billing Information</h4>
            <br/>          
            
            <input  
                    type="checkbox"
                    onClick={ () => this.toggleBillingSameAsShipping()}
                    checked={this.state.billingSameAsShipping}
                    />
              Same as Shipping
            <br/>
            <br/>          

            <label>
                First Name:
                <input 
                        className="input-group my-1 p-1 border border-dark"
                        type="text" 
                        name="first_name" 
                        onChange={event => {
                            this.handleAddressChange(event);
                          }}
                        value={first_name}
                        required="required"
                        />
              </label>
                  
            <label>
                Last Name:
                <input 
                        className="input-group my-1 p-1 border border-dark"
                        type="text" 
                        name="last_name" 
                        onChange={event => {
                            this.handleAddressChange(event);
                          }}
                        value={last_name}
                        required="required"
                        />
              </label>
                
                <label>
                    Address:
                    <input 
                            className="input-group my-1 p-1 border border-dark" 
                            type="text" 
                            name="address_1" 
                            onChange={event => {
                                this.handleAddressChange(event);
                            }}
                            value={address_1}
                            required="required"
                            />
                </label>
                      
                <label>
                    City:
                    <input 
                            className="input-group my-1 p-1 border border-dark" 
                            type="tel" 
                            name="city" 
                            onChange={event => {
                                this.handleAddressChange(event);
                            }}
                            value={city}
                            required="required"
                            />
                </label>
                      
                <label for="province_or_state">Province/ State</label>
                <select id="province_or_state"
                        name="province_or_state"
                        className="input-group my-1 p-1 border border-dark"
                        onChange={this.handleAddressChange}
                        value={province_or_state}
                        required="required">
                  <option value="">-</option>
                  {
                      all_provinces_and_states.map((item) => 
                        <option value={item} >{item}</option>
                        )
                    }
                </select>
                <br/>
                <label for="country">Country</label>
                <select id="country"
                        name="country"
                        className="input-group my-1 p-1 border border-dark"
                        onChange={this.handleAddressChange}
                        value={country}
                        required="required">
                    <option value="">-</option>
                    <option value="Canada">Canada</option>
                    <option value="United States">United States</option>
                </select>
                <br/>          
                <label>
                    Postal/ Zip Code:
                    <input 
                            className="input-group my-1 p-1 border border-dark" 
                            type="text" 
                            name="postal_or_zip_code" 
                            onChange={event => {
                                this.handleAddressChange(event);
                            }}
                            value={postal_or_zip_code}
                            required="required"
                            />
                </label>
        
                <label>
                    Phone Number:
                    <input 
                            className="input-group my-1 p-1 border border-dark" 
                            type="text" 
                            name="phone" 
                            onChange={event => {
                                this.handleAddressChange(event);
                            }}
                            value={phone}
                            required="required"
                            />
                </label>

            <button className="btn btn-primary">Confirm & Continue</button>

          </form>
        </main>    
      );
  }
}

export default BillingAddressForm;
