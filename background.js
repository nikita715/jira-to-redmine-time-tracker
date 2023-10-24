chrome.webRequest.onBeforeRequest.addListener(
    function (details) {
        // Extract parameters from chrome.storage.local
        chrome.storage.local.get(['jiraUrl', 'jiraApiKey', 'redmineUrl', 'redmineApiKey', 'redmineIssueId'], function (data) {
            const jiraUrl = data.jiraUrl;
            const jiraApiKey = data.jiraApiKey;
            const redmineUrl = data.redmineUrl;
            const redmineApiKey = data.redmineApiKey;
            const redmineIssueId = data.redmineIssueId;


        });
    },
    {urls: ["<all_urls>"]}
);