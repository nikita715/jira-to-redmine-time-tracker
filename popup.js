document.addEventListener('DOMContentLoaded', function () {
    const jiraUrlInput = document.getElementById('jiraUrl');
    const jiraApiKeyInput = document.getElementById('jiraApiKey');
    const redmineUrlInput = document.getElementById('redmineUrl');
    const redmineApiKeyInput = document.getElementById('redmineApiKey');
    const redmineIssueIdInput = document.getElementById('redmineIssueId');
    const status = document.getElementById('status');

    // Load stored variables from local storage
    chrome.storage.local.get(['jiraUrl', 'jiraApiKey', 'redmineUrl', 'redmineApiKey', 'redmineIssueId'], function (data) {
        jiraUrlInput.value = data.jiraUrl || '';
        jiraApiKeyInput.value = data.jiraApiKey || '';
        redmineUrlInput.value = data.redmineUrl || '';
        redmineApiKeyInput.value = data.redmineApiKey || '';
        redmineIssueIdInput.value = data.redmineIssueId || '';
    });

    // Function to validate URLs
    function isValidURL(url) {
        // Regular expression pattern to match URLs with http or https
        const urlPattern = /^https?:\/\/([a-z0-9-]+(\.[a-z0-9-]+)*)(:\d+)?$/i;
        return urlPattern.test(url);
    }

    // Update and save variables to local storage as the user types
    jiraUrlInput.addEventListener('input', function () {
        const jiraUrl = jiraUrlInput.value;
        if (isValidURL(jiraUrl)) {
            chrome.storage.local.set({'jiraUrl': jiraUrl}, function () {
                status.textContent = 'Jira URL saved!';
            });
        } else {
            status.textContent = 'Invalid Jira URL format';
        }
    });

    jiraApiKeyInput.addEventListener('input', function () {
        const jiraApiKey = jiraApiKeyInput.value;
        chrome.storage.local.set({'jiraApiKey': jiraApiKey}, function () {
            status.textContent = 'Jira API key saved!';
        });
    });

    redmineUrlInput.addEventListener('input', function () {
        const redmineUrl = redmineUrlInput.value;
        if (isValidURL(redmineUrl)) {
            chrome.storage.local.set({'redmineUrl': redmineUrl}, function () {
                status.textContent = 'Redmine URL saved!';
            });
        } else {
            status.textContent = 'Invalid Redmine URL format';
        }
    });

    redmineApiKeyInput.addEventListener('input', function () {
        const redmineApiKey = redmineApiKeyInput.value;
        chrome.storage.local.set({'redmineApiKey': redmineApiKey}, function () {
            status.textContent = 'Redmine API key saved!';
        });
    });

    redmineIssueIdInput.addEventListener('input', function () {
        const redmineIssueId = redmineIssueIdInput.value;
        chrome.storage.local.set({'redmineIssueId': redmineIssueId}, function () {
            status.textContent = 'Redmine Issue ID saved!';
        });
    });
});
