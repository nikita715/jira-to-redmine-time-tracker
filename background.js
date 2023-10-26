function formatRedmineDate(jiraStartDate) {
    let dateComponents = jiraStartDate.substring(0, 8).split('.');
    let day = dateComponents[0];
    let month = dateComponents[1];

    let year;
    if (dateComponents[2].length === 2) {
        year = "20" + dateComponents[2];
    } else {
        year = dateComponents[2];
    }

    return `${year}-${month}-${day}`;
}

function sendSuccessNotification(redmineResponseBody) {
    let hours = redmineResponseBody.time_entry.hours;
    let date = redmineResponseBody.time_entry.spent_on;
    let issueName = redmineResponseBody.time_entry.comments;

    chrome.notifications.create(
        "Redmine tracker",
        {
            type: "basic",
            iconUrl: "icons/icon128.png",
            title: 'Redmine tracker',
            message: `Tracked ${hours} hours for ${date} on task ${issueName}`
        }
    );
}

function sendFailureNotification(error) {
    chrome.notifications.create(
        "Redmine tracker",
        {
            type: "basic",
            iconUrl: "icons/icon128.png",
            title: 'Redmine tracker',
            message: `Failed to track time due to ${error}`
        }
    );
}

function createRedmineTimeEntry(redmineUrl, redmineApiKey, redmineIssueId, jiraIssueUrl, date, hours, activityId) {
    fetch(redmineUrl + '/time_entries.json', {
        method: 'POST',
        body: '{"issue_id":' + redmineIssueId + ',"time_entry":{"spent_on":"' + date + '","hours":"' + hours + '","comments":"' + jiraIssueUrl + '","activity_id":' + activityId + '}}',
        headers: {
            'Content-Type': 'application/json',
            'X-Redmine-API-Key': redmineApiKey,
        },
    }).then(response => response.json().then((json) => sendSuccessNotification(json)))
        .catch(e => sendFailureNotification(e));
}

function trackTime(jiraTimeTrackRequest, params) {
    let jiraIssueId = jiraTimeTrackRequest.requestBody.formData.id;
    let jiraHours = jiraTimeTrackRequest.requestBody.formData.timeLogged[0];
    let jiraDate = jiraTimeTrackRequest.requestBody.formData.startDate[0];
    let redmineDate = formatRedmineDate(jiraDate);

    getJiraIssueInfo(params.jiraUrl, params.jiraApiKey, jiraIssueId, jiraIssueInfoResponseBody => {
        let jiraIssueName = jiraIssueInfoResponseBody.key;
        let jiraIssueUrl = params.jiraUrl + '/browse/' + jiraIssueName;
        createRedmineTimeEntry(
            params.redmineUrl,
            params.redmineApiKey,
            params.redmineIssueId,
            jiraIssueUrl,
            redmineDate,
            jiraHours,
            params.redmineActivityId
        );
    });
}

function getJiraIssueInfo(jiraUrl, jiraApiKey, jiraIssueId, callback) {
    fetch(jiraUrl + "/rest/api/2/issue/" + jiraIssueId, {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + jiraApiKey,
        },
    }).then(response => response.json().then((json) => callback(json)))
        .catch(e => sendFailureNotification(e));
}

chrome.storage.local.get(['jiraUrl'], function (jiraUrlParams) {
    let jiraUrl = jiraUrlParams.jiraUrl;

    chrome.webRequest.onBeforeRequest.addListener(
        function (jiraRequest, tab) {
            chrome.storage.local.get(['jiraUrl', 'jiraApiKey', 'redmineUrl', 'redmineApiKey', 'redmineIssueId', 'redmineActivityId', 'isTrackingEnabled'], function (extensionParams) {
                let isTrackingEnabled = extensionParams.isTrackingEnabled;
                if (isTrackingEnabled) {
                    trackTime(jiraRequest, extensionParams);
                }
            });
        },
        {urls: [jiraUrl + "/secure/CreateWorklog.jspa"]},
        ["requestBody"]
    );
});

async function createOffscreen() {
    await chrome.offscreen.createDocument({
        url: 'offscreen/offscreen.html',
        reasons: ['BLOBS'],
        justification: 'keep service worker running',
    }).catch(() => {
    });
}

chrome.runtime.onStartup.addListener(createOffscreen);
self.onmessage = e => {
}; // keepAlive
createOffscreen();