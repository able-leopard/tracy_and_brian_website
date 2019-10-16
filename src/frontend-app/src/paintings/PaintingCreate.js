import React, { Component } from 'react';
import PaintingForm from './PaintingForm'
import PaintingPhotoForm from './PaintingPhotoForm'

class PaintingCreate extends Component {
  
  render() { 
    return ( 
      <div>
        <h1>Create New Painting</h1>
        <PaintingForm />
   
      </div>
     );
  }
}
 
export default PaintingCreate;

