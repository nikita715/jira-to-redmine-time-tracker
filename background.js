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

function sendSuccessNotification(jiraTimeLogged, formattedDate, jiraIssueName) {
    chrome.notifications.create(
        "Redmine tracker",
        {
            type: "basic",
            iconUrl: "icons/icon128.png",
            title: 'Redmine tracker',
            message: `Tracked ${jiraTimeLogged} hours for ${formattedDate} on task ${jiraIssueName}`
        }
    );
}

function trackTime(jiraTimeTrackRequest, extensionParams) {
    let jiraUrl = extensionParams.jiraUrl;
    let jiraApiKey = extensionParams.jiraApiKey;
    let redmineUrl = extensionParams.redmineUrl;
    let redmineApiKey = extensionParams.redmineApiKey;
    let redmineIssueId = extensionParams.redmineIssueId;
    let redmineActivityId = extensionParams.redmineActivityId;

    let jiraIssueId = jiraTimeTrackRequest.requestBody.formData.id;
    let jiraTimeLogged = jiraTimeTrackRequest.requestBody.formData.timeLogged[0];
    let jiraStartDate = jiraTimeTrackRequest.requestBody.formData.startDate[0];
    let formattedDate = formatRedmineDate(jiraStartDate);

    fetch(jiraUrl + "/rest/api/2/issue/" + jiraIssueId, {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + jiraApiKey,
        },
    }).then(response => {
        response.json().then((json) => {
            let jiraIssueName = json.key;
            let jiraIssueUrl = jiraUrl + '/browse/' + jiraIssueName;

            fetch(redmineUrl + '/time_entries.json', {
                method: 'POST',
                body: '{"issue_id":' + redmineIssueId + ',"time_entry":{"spent_on":"' + formattedDate + '","hours":"' + jiraTimeLogged + '","comments":"' + jiraIssueUrl + '","activity_id":' + redmineActivityId + '}}',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Redmine-API-Key': redmineApiKey,
                },
            }).then(response => response.json()
                .then(() => sendSuccessNotification(jiraTimeLogged, formattedDate, jiraIssueName))
            );
        });
    });
}

chrome.webRequest.onBeforeRequest.addListener(
    function (jiraRequest, tab) {
        chrome.storage.local.get(['jiraUrl', 'jiraApiKey', 'redmineUrl', 'redmineApiKey', 'redmineIssueId', 'redmineActivityId', 'isTrackingEnabled'], function (extensionParams) {
            let isTrackingEnabled = extensionParams.isTrackingEnabled;
            if (isTrackingEnabled) {
                trackTime(jiraRequest, extensionParams);
            }
        });
    },
    {urls: ["https://jira.app.local/secure/CreateWorklog.jspa"]},
    ["requestBody"]
);