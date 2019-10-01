import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
// import registerServiceWorker from './registerServiceWorker';


// by doing it this way, you can add another app down below and render multiple apps at the same time
// see https://youtu.be/AHhQRHE8IR8?list=PLa8ORkQE1_pdMeufrzOdZRAw-bZUx3ARB&t=4989 1:23:09 for explaination
let myComponent = document.getElementById('frontend-app')
if (myComponent !== null){
    ReactDOM.render(<App />, myComponent);
}
