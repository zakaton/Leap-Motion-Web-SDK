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

        LeapMotion.eventTypes.forEach(eventName => {
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
            "open",
            "framesLength",
        ].concat(LeapMotion.eventTypes.map(eventName => {
            return `on${eventName}`;
        })).map(attributeName => attributeName.toLowerCase())
    }

    attributeChangedCallback(attributeName, oldValue, newValue) {
        switch(attributeName) {
            case "open":
                this.addEventListener("load", event => {
                    this.leapMotion.open();
                });
                break;
            case "framesLength".toLowerCase():
                const framesLength = Number(newValue);
                if(!isNaN(framesLength))
                    this.leapMotion.framesLength = framesLength;
                break;
            default:
                if(attributeName.startsWith("on")) {
                    LeapMotion.eventTypes.forEach(eventName => {
                        if(eventName.toLowerCase() == attributeName.substr(2)) {
                            this.addEventListener(eventName, event => eval(newValue))
                        }
                    });
                }
                break;
        }
    }
}

if(document.createElement("leap-motion").constructor.name == "HTMLElement")
    customElements.define("leap-motion", LeapMotionElement);

export default LeapMotionElement;