import React, { Component } from "react";
import "whatwg-fetch";
import cookie from "react-cookies";
import moment from "moment";

import '../css/PaintingForm.css'

class PaintingPhotoForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: null,
      src: null,
      apiPaintingPhotosEndpoint: `/api/paintings/photos?`,
      paintingPhotos: null,
    };
  }
  // Note that id in painting model matches title_id in the paintingphoto model 
  // (look at the postgres database if you want to verify)

  /* 
  This answer gives a good explaination of options for POSTing files to servers
  https://stackoverflow.com/questions/48097597/angular-5-django-rest-issue-uploading-files

  When sending files, we have to use FormData. 
  Remember to don't mannually specify the Content-Type in headers when using FormData
  https://stackoverflow.com/questions/35192841/fetch-post-with-multipart-form-data

  Here I created the FormData and POST using fetch. But here is the javascript way of doing it just for reference
  https://developer.mozilla.org/en-US/docs/Learn/HTML/Forms/Sending_forms_through_JavaScript#Using_XMLHttpRequest_and_the_FormData_object

  Another thing to note is that when sending files, you have to send the actual file.
  For example: let file = event.target.files[0]
  Sending only the name like this won't do anything event.target.files[0].name 

  More on formData:
  https://developer.mozilla.org/en-US/docs/Learn/HTML/Forms/Sending_forms_through_JavaScript#Using_XMLHttpRequest_and_the_FormData_object

  - Understand fetch fully
  */
  
  createPainting = (data) => {

    // console.log(data.title)
    // console.log(data.src)

    const endpoint = "/api/paintings/photos"; //notice the endpoint is going to a relative request, (relative to where the final javascript built code will be)
    const csrfToken = cookie.load("csrftoken");

    var FD  = new FormData();

    if (csrfToken !== undefined) {

      for(name in data) {
        FD.append(name, data[name]);
      }
    }
      fetch(endpoint, {
        method: 'POST',
        headers: {
          "X-CSRFToken": csrfToken
        },
        body: FD,
        credentials: "include"
      })
        .then(response => {
          return response.json();
        })
        this.clearForm()
        .catch(error => {
          console.log("error", error);
          alert("An error occured, please try again later.");
        });
    }

  updatePainting = data => {
    const { painting } = this.props;
    const endpoint = `/api/paintings/photos`;
    const csrfToken = cookie.load("csrftoken");

    if (csrfToken !== undefined) {
      // this goes into the options argument in fetch(url, options)
      let lookupOptions = {
        method: "POST",
        headers: {
          "Content-Type": "multipart/form-data",
          "Accept": "multipart/form-data, application/json",
          "X-CSRFToken": csrfToken
        },
        body: JSON.stringify(data),
        credentials: "include"
    };
  
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

  handleInputFile = event => {
    event.preventDefault();

    let file = event.target.files[0];
    this.setState({
      src: file
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
          title: null, 
          src: null,  
      })
  }
  

  loadUniqueTitleIds = (clickedEndpoint) => {
   
    let endpoint = this.state.apiPaintingPhotosEndpoint
 
    if (clickedEndpoint !== undefined){
        endpoint = clickedEndpoint
    }

    let lookupOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    }; 
    
    const csrfToken = cookie.load("csrftoken");
    if (csrfToken !== undefined) {
      lookupOptions["credentials"] = "include";
      lookupOptions["headers"]["X-CSRFToken"];
    }
    
    fetch(endpoint, lookupOptions)
      .then(response => {
        return response.json();
      })
      .then(responseData => {
        this.setState({
          paintingPhotos: responseData,
        });
        // console.log(responseData);
      })
      .catch(error => {
        console.log("error", error);
      });
  }

  componentDidMount() {
    this.loadUniqueTitleIds()
    const { title_id } = this.props;

    if (title_id !== undefined) {
      this.setState({
        title: title_id,
      });
    } else {
      this.defaultState()
    }
  }

  render() {
    // for the style options remember it has to match with the options in paintings model.py
    // right now the title_id goes in the title field of the PaintingPhoto model. Try to see if we can switch to slug later


    const { title_id } = this.props;
    const {paintingPhotos} = this.state;
    console.log(paintingPhotos)
    // console.log(typeof(paintingPhotos))

    return (
      <form onSubmit={this.handleSubmit} ref={(el) => this.paintingCreateForm = el}>
    
       <div>

          <label for="title">Title ID</label>
          <select id="title"
                  name="title"
                  className=""
                  onChange={this.handleInputChange}
                  value={title_id}
                  // required="required"
                  >
              <option value="">-</option>
              {
                    paintingPhotos !== null ? 
                    paintingPhotos.map((anObjectMapped, index) => 
                      <option value={anObjectMapped.title} >{anObjectMapped.title_name}</option>
                      )
                    : ""
                  }
          </select>
       
        </div>

        <div>
          <label for="src">Photos</label>
          <input
            type="file"
            id="src"
            name="src"
            // value={this.state.src} can't have value here because its a file
            className="submissionfield"
            placeholder="src"
            onChange={this.handleInputFile}
            // required='required'
            accept=".jpg,.jpeg,.png"
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

export default PaintingPhotoForm;
