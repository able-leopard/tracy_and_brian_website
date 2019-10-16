import React, { Component } from "react";
import "whatwg-fetch";
import cookie from "react-cookies";
import moment from "moment";

import '../css/PaintingForm.css'
import PaintingPhotoForm from './PaintingPhotoForm'


class PaintingForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: null,
      title: null,
      description: null,
      style: null,
      size_class: null,
      size_measurements: null,
      artist: null,     
      completed_year: null,   
      price: null,  
    };
  }

  createPainting = (data) => {
    const endpoint = "/api/paintings/"; //notice the endpoint is going to a relative request, (relative to where the final javascript built code will be)
    const csrfToken = cookie.load("csrftoken");
    console.log(data)
    console.log(JSON.stringify(data))

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

  updatePainting = data => {
    const { painting } = this.props;
    const endpoint = `/api/paintings/${painting.slug}/`; //notice the endpoint is going to a relative request, (relative to where the final javascript built code will be)
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

    const {painting} = this.props
    if (painting !== undefined){
        this.updatePainting(data)
    } else {
        this.createPainting(data)
    }
  };

  handleInputChange = event => {
    event.preventDefault();
    // console.log(event.target.name, event.target.value);
    this.setState({
      [event.target.name]: event.target.value
    });
  };

  // clearing the form
  clearForm = event => {
    // console.log(event)
    if (event) {
      event.preventDefault();
    }
    this.paintingCreateForm.reset();
    this.defaultState();
  };


  defaultState = () => {
      this.setState({
          id: null,  
          title: null,
          description: null,
          style: null,
          size_class: null,
          size_measurements: null,
          artist: null,     
          completed_year: null,
          price: null,   
      })
  }

  componentDidMount() {
    const { painting } = this.props;
    // console.log(painting.id)
    // console.log(painting.title)
    if (painting !== undefined) {
      this.setState({
        id: painting.id,  
        title: painting.title,
        description: painting.description,
        style: painting.style,
        size_class: painting.size_class,
        size_measurements: painting.size_measurements,
        artist: painting.artist,
        completed_year: painting.completed_year,
        price: painting.price,
      });
    } else {
      this.defaultState()
    }

  }

  render() {
    // for the style options remember it has to match with the options in paintings model.py

    const { id, title, description, style, size_class, size_measurements, artist, completed_year, price} = this.state;

    return (
      <div>
        <form onSubmit={this.handleSubmit} ref={(el) => this.paintingCreateForm = el}>
          <div>
            <label for="title">Painting title</label>
            <input
              type="text"
              id="title"
              name="title"
              value={title}
              className="form-control"
              placeholder="Painting title"
              onChange={this.handleInputChange}
              required='required'
            />
          </div>
          <div>
            <label for="description">Description</label>
            <input
              id="description"
              name="description"
              value={description}
              className="submissionfield"
              placeholder="Painting description"
              onChange={this.handleInputChange}
            />
          </div>
          <div>
            <label for="style">Style</label>
            <select id="style"
                    name="style"
                    className=""
                    onChange={this.handleInputChange}
                    value={style}
                    required="required">
              <option value="">-</option>
              <option value="abstract">Abstract</option>
              <option value="animal">Animal</option>
              <option value="landscape">Landscape</option>
              <option value="nature">Nature</option>
              <option value="people">People</option>
              <option value="portrait">Portrait</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <label for="size_class">Size</label>
            <select id="size_class"
                    name="size_class"
                    className=""
                    onChange={this.handleInputChange}
                    value={size_class}
                    required="required">
              <option value="">-</option>
              <option value="small">Small</option>
              <option value="medium">Medium</option>
              <option value="large">Large</option>
            </select>
          </div>
          <div>
            <label for="size_measurements">Size Measurements</label>
            <input
              id="size_measurements"
              name="size_measurements"
              value={size_measurements}
              className="submissionfield"
              placeholder="size measurements"
              onChange={this.handleInputChange}
              required='required'
            />
          </div>
          <div>
            <label for="artist">Artist</label>
            <select id="artist"
                    name="artist"
                    className=""
                    onChange={this.handleInputChange}
                    value={artist}
                    required="required">
              <option value="">-</option>
              <option value="brian">Brian</option>
              <option value="tracy">Tracy</option>
            </select>
          </div>
          <div>
          <label for="completed_year">Completed Year</label>
            <input
              type="number"
              id="completed_year"
              name="completed_year"
              value={completed_year}
              className="form-control"
              placeholder="completed_year"
              onChange={this.handleInputChange}
              required='required'
            />
          </div>
          <div>
            <label for="price">Price</label>
            <input
              type="number"
              id="price"
              name="price"
              value={price}
              className="form-control"
              placeholder="price"
              onChange={this.handleInputChange}
              required='required'
            />
          </div>
          <button className="btn btn-primary">Save</button> 
          <button className={`btn btn-secondary`} onClick={this.clearForm}>
            Clear
          </button>
        </form>
        <PaintingPhotoForm title_id={id} title={title}/>
      </div>
    );
  }
}

export default PaintingForm;
