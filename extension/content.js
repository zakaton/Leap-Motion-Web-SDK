const injectScript = (filename) => {
    const path = chrome.extension.getURL(filename)
    const script = document.createElement("script");
    script.setAttribute("src", path);
    document.body.appendChild(script);
}

injectScript("/three.js");
injectScript("/injection.js");

const invervalId = setInterval(() => {
    if(document.getElementsByTagName("leap-motion").length > 0) {
        injectScript("/leap-motion.js");
        clearInterval(invervalId);
    }
}, 10);