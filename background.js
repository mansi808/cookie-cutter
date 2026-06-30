//Message Listener
// let data = {
//     "event" : "checked/uncheck",
//     prefs : {
//        "popUp" : "true/false",
// }
// }

chrome.runtime.onMessage.addListener(data => {
    const {event, prefs} = data;
    switch (event) {
        case 'checked':
            console.log('prefs recieved', prefs);
            handleOnClick(prefs);
            break;
        case 'unchecked':
            console.log('prefs recieved', prefs);
            handleOnClick(prefs);
            break;
        default:
            break;
    }
})

const handleOnClick = (prefs) => {
    if (prefs.popUp===true) {
        console.log('prefs recieved'+"prefs value set to", prefs.popUp);
        chrome.storage.local.set(prefs)
    } else {
        console.log('prefs recieved'+" value set to", prefs.popUp);
        chrome.storage.local.set(prefs)
    }
}


let initialized = false;
let lastDeclarativeNetRuleId = 1;
let settings = { statusIndicators: true, whitelistedDomains: {} };


function updateSettings() {
    return new Promise((resolve) => {
        lastDeclarativeNetRuleId = 1;
        chrome.storage.local.get(
            { settings: { whitelistedDomains: {}, statusIndicators: true } },
            async ({ settings: storedSettings }) => {
                settings = storedSettings;

                await updateWhitelistRules();
                resolve();
            }
        );    console.log(settings.statusIndicators);

    });
}

async function updateWhitelistRules() {
    const previousRules = (
        await chrome.declarativeNetRequest.getDynamicRules()
    ).map((v) => {
        return v.id;
    });
    const addRules = Object.entries(settings.whitelistedDomains)
        .filter((element) => element[1])
        .map((v) => {
            return {
                id: lastDeclarativeNetRuleId++,
                priority: 1,
                action: { type: "allow" },
                condition: {
                    urlFilter: "*",
                    resourceTypes: ["script", "stylesheet", "xmlhttprequest", "image"],
                    initiatorDomains: [v[0]],
                },
            };
        });

    chrome.declarativeNetRequest.updateDynamicRules({
        addRules,
        removeRuleIds: previousRules,
    });
}

async function initialize(checkInitialized, magic) {
    if (checkInitialized && initialized) {
        return;
    }
    await updateSettings();
    initialized = true;
}

initialize();
