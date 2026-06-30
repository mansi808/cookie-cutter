function saveOptions() {
    console.log("save button clicked");

    //separate each whitelist volues by a new line
    const whitelist = document.getElementById("whitelist").value.split("\n");

    const settings = {
        whitelistedDomains: {},
        statusIndicators: document.getElementById("status_indicators").checked,
    };
    //for each link in the whitelist trim new spaces
    //replace any links starting with any words and continued by // one or many time with node
    //replace links starting with w followed by decimals and .
    // /i means case insensitive
    //after removing https and www, followed by /, split the substring by / and get the domain name
    whitelist.forEach((line) => {
        line = line
            .trim()
            .replace(/^\w*:?\/+/i, "")
            .replace(/^w{2,3}\d*\./i, "")
            .split("/")[0]
            .split(":")[0];

        if (line.length > 0 && line.length < 100) {
            settings.whitelistedDomains[line] = true;
        }
    });

    chrome.storage.local.set({ settings }, () => {
        document.getElementById("status_saved").style.display = "inline";
        console.log(settings.statusIndicators);

        setTimeout(function () {
            document.getElementById("status_saved").style.display = "none";
        }, 2000);
        chrome.runtime.sendMessage("update_settings");
    });
}



function restoreOptions() {
    chrome.storage.local.get(
        { settings: { whitelistedDomains: {}, statusIndicators: true } },
        ({ settings }) => {
            document.getElementById("whitelist").value = Object.keys(
                settings.whitelistedDomains
            )
                .sort()
                .join("\n");
            document.getElementById("status_indicators").checked =
                settings.statusIndicators;
        }
    );
}

document.getElementById("status_saved").textContent =
    chrome.i18n.getMessage("optionsSaved");

document.addEventListener("DOMContentLoaded", restoreOptions);
document.getElementById("save").addEventListener("click", saveOptions);


