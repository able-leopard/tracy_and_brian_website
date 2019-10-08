import React, { Component } from 'react';
import PaintingInline from "./Paintinginline";

import "../css/PaintingGallery.css";

class PaintingGallery extends Component {
    
    constructor(props){
        super(props);
        this.state = {
            numOfColumns: 4 // breaking the painting gallery into four columns 
        }
    };

    // takes in an array splits it into even chunks and returns as an array of chucks
    chunkArray = (myArray, chunk_size) => {
        let index = 0;
        let arrayLength = myArray.length;
        const tempArray = [];

        for (index = 0; index < arrayLength; index += chunk_size) {
            let myChunk = myArray.slice(index, index+chunk_size);
            tempArray.push(myChunk);
        }
        return tempArray
    }

    render() { 
        
        const { numOfColumns } = this.state;
        const { paintings } = this.props;

        // splitting all the data into even columns
        const columns = this.chunkArray(paintings, paintings.length/numOfColumns)
  
        // applying the PaintingInline component for reach column
        const myColumns = [];    
        columns.forEach(column => myColumns.push(
                             <div>
                                {(
                                column.map((paintingItem) => {
                                 return <PaintingInline paintingItem={paintingItem}/>;
                                })
                                    )}
                             </div>
                           ))
        return (
             
            <div className={"painting-gallery"}>
                
                {paintings.length > 0 ? myColumns : <p>No Paintings Found</p>}
               
            </div>

         );
    }
}
 
export default PaintingGallery;