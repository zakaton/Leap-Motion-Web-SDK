// https://developer-archive.leapmotion.com/documentation/javascript/api/Leap_Classes.html#leap-namespace
// https://developer-archive.leapmotion.com/documentation/javascript/api/Leap.Controller.html

// https://github.com/leapmotion/leapjs/wiki/Websocket-Server-JSON

/*
    TODO
        Events for individual hands/pointables?
*/

import Frame from "./classes/Frame.js";

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
            
            this.dispatchEvent(new CustomEvent("version", {
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

                    this.dispatchEvent(new CustomEvent("device", {
                        bubbles : false,
                        detail : data,
                    }));

                    this.dispatchEvent(new CustomEvent(`device${data.event.state.attached? "Connected":"Disconnected"}`, {
                        bubbles : false,
                    }));
                    this.dispatchEvent(new CustomEvent(`${data.event.state.streaming? "started":"stopped"}Streaming`, {
                        bubbles : false,
                    }));
                    break;
                default:
                    this.dispatchEvent(new CustomEvent("unknown", {
                        bubbles : false,
                        detail : data,
                    }));
                    break;
            }
        } else if(data.hasOwnProperty("currentFrameRate")) {
            this.frame = new Frame(data);

            this.dispatchEvent(new CustomEvent("rawframe", {
                bubbles : false,
                detail : data,
            }));

            this.dispatchEvent(new CustomEvent("frame", {
                bubbles : false,
                detail : this.frame,
            }));
        }
    }

    open() {
        if(this.webSocket == undefined) {
            this.webSocket = new WebSocket("ws://localhost:6437/v7.json");

            this.webSocket.addEventListener("open", event => {
                this.dispatchEvent(new CustomEvent("open", {
                    bubbles : false,
                }));

                this.webSocket.addEventListener("message", event => this.dispatchEvent(new CustomEvent("message", {
                    bubbles : false,
                    detail : event.data,
                })));

                this.webSocket.addEventListener("close", event => {
                    this.dispatchEvent(new CustomEvent("close", {
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

Object.assign(LeapMotion.prototype, THREE.EventDispatcher.prototype);

export default LeapMotion;