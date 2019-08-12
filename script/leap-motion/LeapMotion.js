// https://developer-archive.leapmotion.com/documentation/javascript/api/Leap_Classes.html#leap-namespace
// https://developer-archive.leapmotion.com/documentation/javascript/api/Leap.Controller.html

// https://github.com/leapmotion/leapjs/wiki/Websocket-Server-JSON

/*
    TODO
        *
*/

import Frame from "./classes/Frame.js";
import {EventDispatcher} from "../../node_modules/three/src/core/EventDispatcher.js";

class LeapMotion {
    constructor() {
        this.addEventListener("message", event => this.messageCallback(event));

        this.frames = [];
        this.framesLength = 100;
        this.addEventListener("frame", event => {
            const frame = event.detail;
            this.frames.unshift(frame);
            this.frames.splice(this.framesLength);
        });
    }

    static get eventTypes() {
        return [
            "open", "close",

            "message",
                "version",
                "device",
                    "deviceConnected", "deviceDisconnected",
                    "startedStreaming", "stoppedStreaming",
                "rawframe", "frame",
        ];
    }

    messageCallback(event) {
        const data = JSON.parse(event.detail);

        if(data.hasOwnProperty("version")) {
            this.serviceVersion = data.serviceVersion;
            this.version = data.version;
            
            this.dispatchEvent(new LeapMotion.CustomEvent("version", {
                bubbles : false,
                detail : event,
            }));
        }
        else if(data.hasOwnProperty("event")) {
            switch(data.event.type) {
                case "deviceEvent":
                    const {attached, id, streaming, type} = data.event.state;
                    
                    this.attached = attached;
                    this.id = id;
                    this.streaming = streaming;
                    this.type = type;

                    this.dispatchEvent(new LeapMotion.CustomEvent("device", {
                        bubbles : false,
                        detail : data,
                    }));

                    this.dispatchEvent(new LeapMotion.CustomEvent(`device${data.event.state.attached? "Connected":"Disconnected"}`, {
                        bubbles : false,
                    }));
                    this.dispatchEvent(new LeapMotion.CustomEvent(`${data.event.state.streaming? "started":"stopped"}Streaming`, {
                        bubbles : false,
                    }));
                    break;
                default:
                    this.dispatchEvent(new LeapMotion.CustomEvent("unknown", {
                        bubbles : false,
                        detail : data,
                    }));
                    break;
            }
        } else if(data.hasOwnProperty("currentFrameRate")) {
            this.frame = new Frame(data);

            this.dispatchEvent(new LeapMotion.CustomEvent("rawframe", {
                bubbles : false,
                detail : data,
            }));

            this.dispatchEvent(new LeapMotion.CustomEvent("frame", {
                bubbles : false,
                detail : this.frame,
            }));
        }
    }

    open() {
        if(this.webSocket == undefined) {
            this.webSocket = new LeapMotion.WebSocket("ws://localhost:6437/v7.json");

            this.webSocket.addEventListener("open", event => {
                this.dispatchEvent(new LeapMotion.CustomEvent("open", {
                    bubbles : false,
                }));

                this.webSocket.addEventListener("message", event => {
                    this.dispatchEvent(new LeapMotion.CustomEvent("message", {
                        bubbles : false,
                        detail : event.data,
                    }));
                });

                this.webSocket.addEventListener("close", event => {
                    this.dispatchEvent(new LeapMotion.CustomEvent("close", {
                        bubbles : false,
                    }));
                });
            });    
        }
        else {
            if(this.webSocket.readyState !== 1) {
                // re-open the websocket
                delete this.webSocket;
                this.open();
            }
        }
    }

    close() {
        if(this.webSocket !== undefined) {
            this.webSocket.close();
            delete this.webSocket;    
        }
    }
}

if(typeof WebSocket !== "undefined") {
    LeapMotion.WebSocket = WebSocket;
}
if(typeof CustomEvent !== "undefined") {
    LeapMotion.CustomEvent = class extends CustomEvent {};
    Object.defineProperty(LeapMotion.CustomEvent.prototype, "target", {writable : true});
}

Object.assign(LeapMotion.prototype, EventDispatcher.prototype);


// When building for Node, uncomment the line below:
// module.exports = LeapMotion
// and comment out the line below:
export default LeapMotion;