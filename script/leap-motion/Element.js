/*
    TODO
        Socket.IO Broadcasting
            how to 
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
            "send", "receive",
        ].map(attributeName => attributeName.toLowerCase())
    }

    attributeChangedCallback(attributeName, oldValue, newValue) {
        switch(attributeName) {
            case "send":
                this.addEventListener("open", event => {
                    this.leapMotion.startBroadcast(newValue);
                });
                break;
            case "receive":
                this.addEventListener("load", event => {
                    this.leapMotion.listenToBroadcast(newValue);
                });
                break;
            default:
                break;
        }
    }
}

if(document.createElement("leap-motion").constructor == HTMLElement)
    customElements.define("leap-motion", LeapMotionElement);

export default LeapMotionElement;