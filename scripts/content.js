const rejOpts = [
    "accept required cookies",
    "Proceed with Required Cookies only", //new
    "only essential", //new
    "do not consent", //new
    "decline non-essential cookies", //new
    "required only", //new
    "only required", //new
    "accept essential only", //new
    "only accept essential", //new
    "accept only essential cookies", //new
    "refuse non-essential cookies", //new
    "accept only essential", //new
    "reject additional cookies", //new
    "decline all", //new
    "Decline all", //new
    "continue without accepting", //new
    "necessary cookies only", //new
    "deny all", //new
    "necessary only", //new
    "necessary cookies only", //new
    "required cookies", //new
    "essential cookies only", //new
    "continue without agreeing", //new
    'decline',
    'reject',
    'opt out',
    'no, give me more info',
    'no, thanks',
    'dismiss',
    'reject all',
    'disagree',
    'No thanks',
    'I do not accept',
    'Click here to opt out of Google Analytics',
    'Require Opt-Out',
    'I Reject',
    'I Refuse',
    'I Do Not Agree',
    'No, I want to find out more',
    'Click here to turn off cookies for this site',
    'Dismiss cookie notification',
    'Disable third party non-functional cookies.',
    'Disable them/read more',
    'Disable analytics',
    'Disallow cookies',
    'I DO NOT ACCEPT',
    "allow essential cookies",
    'Disable All',
    'No take me to settings',
    'Reject cookies',
    'Do Not Sell My Info',
    'Reject all...',
    'Decline All',
    'deny',
    'Reject All',
    'Reject',
    'Reject Non-Essential Cookies',
    'Do not use analytics cookies',
    "reject optional"
];

const options = [
    "options", //added
    "Customise choices", //added
    "Customise", //added
    "customize", //added
    "settings", //added
    "preferences", //added
    "learn more", //added
    "cookie settings", //added
    "manage my choices",//added
    "manage my cookies",//added
    "set preferences", //added
    "Manage settings", //added
    "manage", //added
    "options", //added
    "more options",
    "allow selection",
    "see full vendor list",
    "cookie settings",
    "our partners",
    "change my preferences",
    "settings",
    "change preferences",
    "change settings",
    "manage",
    "browser settings",
    "how to manage cookies",
    "manage your cookie preferences",
    "manage your account",
    "manage your Consents",
    "manage your settings",
    "manage your Cookie Settings",
    "manage your preferences",
    "manage cookies and view our policy",
    "manage Tracking Options",
    "manage Privacy Settings",
    "set cookie settings",
    "manage Email Preferences",
    "Manage Cookie settings",
    "Managing cookies",
    "set cookies",
    "adjust your browser settings.",
    "click here to change your settings",
    "cookie preferences",
    "Privacy settings",
    "View preferences",
    "Privacy dashboard",
    "Customise Cookies",
    "- See how to change settings »",
    "control your settings",
    "please see our cookies page",
    "adjust your cookie settings",
    "My Cookie Preferences",
    "I need help choosing",
    "Confirm your choices",
    "View Preferences",
    "updated privacy and cookies policy",
    "updated privacy policy",
    "third-party companies",
    "their partners' use of cookies",
    "view our privacy policy",
    "view our cookie policy.",
    "view our cookie policy",
    "terms of service",
    "terms & conditions",
    "read our cookie policy here",
    "read our Cookie Policy",
    "read more about what cookies we use here",
    "read more about our cookies",
    "process personal data",
    "MORE OPTIONS",
    "show purposes",
    "manage my cookies",
    "set cookie preferences"
];

const confirmOpts = [
    "save my preferences",
    "save preferences",
    "confirm choices",
    "save selection",
    "save options",
    "save changes",
    "save and exit",
    "save & exit",
    "confirm my choices",
    "save settings",
    "save and continue",
    "save & continue",
    "allow selection",
    "save and accept",
    "save & accept",
    "save my cookie settings",
    "accept selection"
]
// "save",
// "continue",
// "confirm",

var isBannerFound = false;
var isRejected = false;
var hasMoreOptions = false;
let showPopUpMessage;

chrome.storage.local.get(['popUp'], (result) => {
    console.log('storage.get', result);
    if (result.popUp.toLowerCase() === "yes") {
        showPopUpMessage = true;
        console.log("PopUp will be shown")
    } else {
        showPopUpMessage = false;
        console.log("PopUp will not be shown")
    }
})

const hostname = document.location.hostname.replace(/^w{2,3}\d*\./i, "");
console.log("hostname", hostname);
let enforceConsent;

console.log("enforceConsent", enforceConsent);
    chrome.storage.local.get({settings: {whitelistedDomains: {}, statusIndicators: true}}, (data) => {
        const {whitelistedDomains, statusIndicators} = data.settings;
        console.log('storage.get', data.settings);
        if (statusIndicators) {
            for (let domain in whitelistedDomains) {
                console.log(domain);
                console.log(hostname);
                if (domain===hostname){
                    enforceConsent = false;
                    console.log("Do not perform any operations ")
                }
            } if (enforceConsent===undefined) {
                enforceConsent = true;
            }
        }
    });


//Function to display a popup to the user
function showMessage(text, backgroundColour) {
    const messageElement = document.createElement("div");
    messageElement.innerHTML = text;
    messageElement.style.position = "fixed";
    messageElement.style.top = "10px";
    messageElement.style.right = "10px";
    messageElement.style.zIndex = "9999";
    messageElement.style.backgroundColor = backgroundColour;
    messageElement.style.border = "1px solid white";
    messageElement.style.borderRadius = "5px";
    messageElement.style.padding = "10px";
    messageElement.style.fontFamily = "Arial, sans-serif";
    messageElement.style.fontSize = "14px";
    document.body.appendChild(messageElement);

    setTimeout(() => {
        messageElement.remove();
    }, 5000); //5 seconds
}


//Function to search for a cookie banner
function checkForCookieBanner() {
    //Select all elements on the page
    // const allElements = document.querySelectorAll('*');
    let foundMatchElement = null; //Initialise variable to store the cookie banner if found

    //parse through the consent-o-matic selectors list to find a match
    for (let attrKey in websites_id_attributes) {
        try {
        if (document.querySelector(websites_id_attributes[attrKey])) {
            let element = document.querySelector(websites_id_attributes[attrKey]);
            isBannerFound = true;
            console.log(`Banner ID Match found: ${element.id}`);
            foundMatchElement = element; //Store the matched element
            break; //Break from the loop once a match is found
        }
        } catch (err){
        }
    }
    //parse through the i don't care about cookies selectors list to find a match
    if (isBannerFound===false) {
        for (let attrKey in id_attributes) {
            try {
                if (document.querySelector(id_attributes[attrKey])) {
                    let element = document.querySelector(id_attributes[attrKey]);
                    console.log("element: ", element);
                    isBannerFound = true;
                    console.log(`Banner ID Match found: ${element.id}`);
                    foundMatchElement = element; //Store the matched element
                    break; //Break from the loop once a match is found
                }
            } catch (err) {}
        }
    }

    if (foundMatchElement === null) { //If no match was found
        console.log('No Banner ID Match Found');
        // if (showPopUpMessage) {
        //     showMessage("No Banner ID Match", "B5535B");
        // }
    }
    //Return the matched element, this could also remain null which is important for the next function
    return foundMatchElement;
}

//Function to find and click the reject all button
function clickRejectButton(cookieBanner) {
    //Variable to track if any button has been clicked (initially set to false)
    /* Conditional expression:
    If cookieBanner is truthy, then only select all buttons within that HTML snippet
    If cookieBanner is falsy, no banner was detected so scan the entire page as a last resort
    */
    const buttons = cookieBanner ? cookieBanner.querySelectorAll("button") : (document.querySelectorAll("button"));
    const btnSelectedUsingRole = cookieBanner ? cookieBanner.querySelectorAll('[role="button"]') : (document.querySelectorAll('[role="button"]'));
    const btnSelectedUsingClassBtn = cookieBanner ? cookieBanner.querySelectorAll(".button") : document.querySelectorAll(".button");
    const btnSelectedUsingType = cookieBanner ? cookieBanner.querySelectorAll("input[type=button]") : document.querySelectorAll("input[type=button]");

    //Loop through all buttons on the page
    function checkIfRejectButton(buttons) {
        buttons.forEach((button) => {
            const content = button.innerHTML.trim().toLowerCase(); //Get the button's inner HTML, trim any whitespace, and convert to lowercase
            //const id = button.id.toLowerCase();  //Get the button's ID and also convert it to lowercase
            // Loop through each option in the rejOpts dictionary
            rejOpts.forEach((opt) => {
                const lowerOpt = opt.toLowerCase(); // Convert the current option to lowercase
                //If the button's innerHTML or ID matches the current option, click the button and set clicked to true
                //if (content === lowerOpt || id === lowerOpt) {
                //if (content.indexOf(lowerOpt) !== -1 || id.indexOf(lowerOpt) !== -1) {
                if (content.indexOf(lowerOpt) !== -1) { //-1 being returned means there was no match
                    isRejected = true;
                    button.click(); //Click the reject button
                    console.log("The button was:", button);
                    console.log("The dict was:", lowerOpt);
                }
            });
        }); return isRejected;
    }
    if (!checkIfRejectButton(buttons)) {
        if (!checkIfRejectButton(btnSelectedUsingRole)) {
            if (!checkIfRejectButton(btnSelectedUsingClassBtn)) {
                checkIfRejectButton(btnSelectedUsingType);
            }
        }
    }
    if (showPopUpMessage) {
         if (isRejected) {
        showMessage("Cookies Rejected!", "#12b641");
         }
    }
    return isRejected;
}

function clickMoreOptionsButton(cookieBanner) {
    console.log("Checking for more options button")
    let clicked = false;

    const buttons = cookieBanner ? cookieBanner.querySelectorAll("button") : document.querySelectorAll("button");
    const btnSelectedUsingRole = cookieBanner ? cookieBanner.querySelectorAll('[role="button"]') : (document.querySelectorAll('[role="button"]'));
    const btnSelectedUsingClassBtn = cookieBanner ? cookieBanner.querySelectorAll(".button") : document.querySelectorAll(".button");
    const btnSelectedUsingType = cookieBanner ? cookieBanner.querySelectorAll("input[type=button]") : document.querySelectorAll("input[type=button]");

    function checkIfMoreOptsBtn(button) {
        buttons.forEach((button) => {
            const content = button.innerHTML.trim().toLowerCase();

            options.forEach((opt) => {
                const lowerOpt = opt.toLowerCase();

                if (content.indexOf(lowerOpt) !== -1) {
                    hasMoreOptions = true;
                    console.log("the match was"+content);
                    button.click();
                    clicked = true;
                }
            });
        }); return hasMoreOptions;
    }

    if (!checkIfMoreOptsBtn(buttons)) {
        if (!checkIfMoreOptsBtn(btnSelectedUsingRole)) {
            if (!checkIfMoreOptsBtn(btnSelectedUsingClassBtn)) {
                checkIfMoreOptsBtn(btnSelectedUsingType);
            }
        }
    }
    // if (clicked) {
        // if (hasMoreOptions) {
        //     showMessage("More Options Button Found!", "green");
        // }
        // Return the updated cookieBanner after the button has been clicked
        //return document.querySelector("#" + cookieBanner.id);
    // } else {
        // if (showPopUpMessage) {
        //     showMessage("More Options Button Not Found/Incompatible Banner", "red");
        // }
        // If the button is not found or clicked, return null
        // return null;
    // }
    return null;
}

//executed when the boxed are already deselected
function confirmChoices(cookieBanner) {
    const buttons = cookieBanner ? cookieBanner.querySelectorAll("button") : document.querySelectorAll("button");
    const btnSelectedUsingRole = cookieBanner ? cookieBanner.querySelectorAll('[role="button"]') : (document.querySelectorAll('[role="button"]'));
    // const btnSelectedUsingClassBtn = cookieBanner ? cookieBanner.querySelectorAll(".button") : document.querySelectorAll(".button");
    // const btnSelectedUsingType = cookieBanner ? cookieBanner.querySelectorAll("input[type=button]") : document.querySelectorAll("input[type=button]");

    function checkIfConfirmBtn(buttons) {
    outer: for (let btnKey in buttons) {
        let btn = buttons[btnKey];
        const content = btn.innerHTML.trim().toLowerCase();

        //everything between >< should be taken as a whole string, for websites like github just save is dangerous because it is a widespread word and </> is important as well
        for (let optKey in confirmOpts) {
            const lowerOpt = confirmOpts[optKey].toLowerCase();
            if (content.indexOf(lowerOpt) !== -1) {
                console.log("the match was" + content);
                //if button is disabled and requires click options then reject all;
                if (btn.disabled) {
                    btn.disabled = false;
                }
                // try {
                btn.click();
                    console.log("The button was:", btn);
                    console.log("choices confirmed")
                    isRejected = true;
                    break outer;
                // } catch (e) {
                //     console.error(e);
                // }
            }
        }
    } return isRejected;
    }
    if (checkIfConfirmBtn(buttons)=== false) {
        if (checkIfConfirmBtn(btnSelectedUsingRole) === false) {
        }
    } if (showPopUpMessage) {
        if (isRejected) {
            showMessage("Cookies Rejected!", "#12b641");
        } else {
            showMessage("No Reject Option Found!", "red");
        }
    }
}


//so after finding the banner has managerial options - has checkboxes and cannot work by simply rejecting all
// then next step is disable all preticked boxes
// most of them would be input type=""
// extract all the interactive elements from the banner
// type of boxes could be = checkbox, sliders, switch, inputs, forms
//classnames = checkbox, sliders, switch, etc
function disableCookies(cookieBanner) {

    // let interactiveElementsSelectors = [];
    // find all interactive elements on the banner
    //first found all the buttons, yet to know how to find if the element is not a button but a checkbox, slider, etc
    const buttons = cookieBanner ? cookieBanner.querySelectorAll("button") : document.querySelectorAll("button");
    const inputs = cookieBanner ? cookieBanner.querySelectorAll("input") : document.querySelectorAll("input");
    const checkboxes = cookieBanner ? cookieBanner.querySelectorAll("checkbox") : document.querySelectorAll("checkbox");


    function testInteractiveElements(interactiveElements) {
        //parse through each found button
        let i = 0;
        interactiveElements.forEach((interactiveElement) => {
            i += 1;
            //     console.log(button.nodeName);
            //skip disabled button ifs essential cookies are already on and cannot be turned off
            if (!interactiveElement.disabled) {

                if (interactiveElement.pressed || interactiveElement.checked || interactiveElement.getAttribute("aria-pressed") === "true" || interactiveElement.getAttribute("aria-checked") === "true") {
                    // console.log(i+" "+button.nodeName);
                    interactiveElement.click();
                    console.log("cookies rejected, mangerial success!")
                }
            }
        });
    } testInteractiveElements(inputs);
    testInteractiveElements(buttons);
    testInteractiveElements(checkboxes);
    return isRejected;
}




function allSteps() {
        const cookieBanner = checkForCookieBanner(); // Call checkForCookieBanner() and store the returned value in cookieBanner
        if (cookieBanner) {
            if (clickRejectButton(cookieBanner) === false) {// Call clickRejectButton() and pass the found cookie banner element or null if not found
                console.log("checking if has more options")
                setTimeout(() => {
                    clickMoreOptionsButton(cookieBanner);
                    if (hasMoreOptions) {
                        console.log("has more options")
                    }
                }, 100);
            }
            setTimeout(() => {
                if (!isRejected) {
                    console.log("working on rejecting")
                    clickRejectButton(null);
                    if (!isRejected) {
                        console.log("working on deselection")
                        disableCookies(null);
                        console.log("Confirming choices now!")
                        confirmChoices(null);
                    }
                }
            }, 100);
            console.log(isRejected);
        }
}


//Wait for the page to fully load before running
window.onload = () => {
    console.log("enforce consent", enforceConsent);
    if (enforceConsent || enforceConsent===undefined) {
        setTimeout(() => {
            allSteps();
        }, 500); //Wait some amount of ms
    }
}


// function isVisited(hostname) {
//     chrome.storage.session.get({sites: {visited: {}}},(data) => {
//         let visitedSites = data.sites;
//         console.log('storage.get', data);
//         for (let site in visitedSites) {
//             if (hostname === site) {
//                 console.log("Site is already visited. ")
//             } return true;
//         }
//     }); return false;
//
// }

// let visited = {};
// let numberOfSites = {numberOfSites, };
//
// async function setVisited() {
//     if (!numberOfSites) {
//         numberOfSites = {numberOfSites: 0};
//     }
//     chrome.storage.sync.set({visited: {}}, (data) => {
//         let site = data.visited;
//         chrome.storage.sync.set({visited: {{numberOfSites: hostname}}});
//
//         });
// }