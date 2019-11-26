import React, { Component } from "react";
import "../App.css";
import "../css/PaintingDetail.css";

const ImagePreview = props => (
  <div className={"image-preview-container"}>
    <img src={props.image.src} className={props.className} />
    <button onClick={props.clickIndex} />
  </div>
);

class PaintingPhoto extends Component {
  constructor(props) {
    super(props);
    this.state = {
      clickedImageIndex: 0
    };
  }

  // this collapes the image
  clickReset = () => {
    this.setState({
      clickedImageIndex: 0
    });
  };

  clickIndex = index => {
    this.setState({
      clickedImageIndex: index
    });
  };

  render() {
    const mySrcs = this.props.srcs;
    return (
      <div className={"detail-view-images-grid"}>
        <div className={"detail-view-preview-image"}>
          {mySrcs.map((image, index) => (
            <ImagePreview
              image={image}
              index={index}
              clickIndex={() => {
                this.clickIndex(index);
              }}
              className={
                index === this.state.clickedImageIndex
                  ? "image-preview-border"
                  : ""
              }
            />
          ))}
        </div>
        <div className={"detail-view-main-image"}>
          <img src={mySrcs[this.state.clickedImageIndex].src} />
        </div>
      </div>
    );
  }
}

export default PaintingPhoto;
