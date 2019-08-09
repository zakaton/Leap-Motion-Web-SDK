/*
    TODO
        Re-design remote streaming to allow many ways to stream data
            Websocket, Socket.io, webRTC, etc
            can add a "load" eventlistener to implement how to send/receive data
            can also add a "remote" attribute that prevents connecting to a local websocket on load
*/

import LeapMotion from "./LeapMotion.js";

class LeapMotionElement extends HTMLElement {
    constructor() {
        super();

        this.leapMotion = new LeapMotion();

        this.leapMotion.constructor.eventTypes.forEach(eventName => {
            this.leapMotion.addEventListener(eventName, event => this.dispatchEvent(event));
        });
    }

    connectedCallback() {
        // when added to a DOM
        this.dispatchEvent(new Event("load"));
    }

    disconnectedCallback() {
        // when removed from a DOM
    }


    static get observedAttributes() {
        return [
            
        ].map(attributeName => attributeName.toLowerCase())
    }

    attributeChangedCallback(attributeName, oldValue, newValue) {
        switch(attributeName) {
            default:
                break;
        }
    }
}

if(document.createElement("leap-motion").constructor == HTMLElement)
    customElements.define("leap-motion", LeapMotionElement);

export default LeapMotionElement;