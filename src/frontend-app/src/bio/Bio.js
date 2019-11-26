import React, { Component } from "react";
import { Link } from "react-router-dom";
import cookie from "react-cookies";

import "../css/Bio.css";

// react-router-dom <Link> documentation: https://reacttraining.com/react-router/web/api/Link

class Bio extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bio: ""
    };
  }

  getBioPhotos = () => {
    const endpoint = `/api/bio/`;
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
          console.log(responseData);
          this.setState({
            bio: responseData[0]
          });
        })
        .catch(error => {
          console.log("error", error);
          alert("An error occured, please try again later.");
        });
    }
  };

  componentDidMount() {
    this.getBioPhotos();
  }

  render() {
    const { bio } = this.state;
    console.log(bio["src"]);

    return (
      <div className="bio-section">
        <img className={"bio-img"} src={bio["src"]} />
        <br />
        <h1>Our Story</h1>
        <br />
        <p>
          Brian is an painter for over 10 years, currently residing in Niagara
          Falls, Canada.
        </p>
        <br />
        <p>
          Tracy is an painter for over 10 years, currently residing in Niagara
          Falls, Canada.
        </p>
        <br />
        <p>They paint landscape, abstract, portraits, and other paintings.</p>
      </div>
    );
  }
}

export default Bio;
