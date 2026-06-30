

var popUpEl;
popUpEl = document.getElementById("banner-preferences");
var options = document.getElementById("options");


// function updateBackendBannerPreferences() {
//
//     //Want to Pass this variable.
//     let update = getPopUpPreferences();
//     chrome.storage.local.set({ popUp: update }).then(() => {
//         console.log("Pop Up updated");
//         chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
//             let activeTab = tabs[0];
//             browser.tabs.sendMessage(activeTab.id, {"showPopUpMessage":update} );
//         });
//     });
//     // Initialize the form with the user's option settings
//     // const data = chrome.storage.local.get(['popUp']);
//     // Object.assign(showPopUpMessage, data.popUp);
// }



if (popUpEl) {
    console.log("hello");
    popUpEl.onclick = () => {
        const prefs = {
            popUp: popUpEl.value,
        };
        if (popUpEl.checked) {
            chrome.runtime.sendMessage({event:'checked', prefs});
            console.log("BannerShown");
        } else {
            chrome.runtime.sendMessage({event:'unchecked', prefs});
            console.log("BannerNotShown");
        }
    };
}

chrome.storage.local.get(["popUp"], (result) => {
    const { popUp } = result;
    if (popUp) {
        popUpEl.value = popUp;
    }
})

if (options) {

    options.addEventListener("click", function () {
        chrome.runtime.sendMessage({
                command: "open_options_page",
            },
            () => window.close()
        );
    });
}

options.addEventListener('click', function() {
    if (chrome.runtime.openOptionsPage) {
        chrome.runtime.openOptionsPage();
    } else {
        window.open(chrome.runtime.getURL('options.html'));
    }
});
