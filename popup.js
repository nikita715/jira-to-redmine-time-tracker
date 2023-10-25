document.addEventListener('DOMContentLoaded', function () {
    const jiraUrlInput = document.getElementById('jiraUrl');
    const jiraApiKeyInput = document.getElementById('jiraApiKey');
    const redmineUrlInput = document.getElementById('redmineUrl');
    const redmineApiKeyInput = document.getElementById('redmineApiKey');
    const redmineIssueIdInput = document.getElementById('redmineIssueId');
    const redmineActivityIdInput = document.getElementById('redmineActivityId');
    const status = document.getElementById('status');

    // Load stored variables from local storage
    chrome.storage.local.get(['jiraUrl', 'jiraApiKey', 'redmineUrl', 'redmineApiKey', 'redmineIssueId', 'redmineActivityId'], function (data) {
        jiraUrlInput.value = data.jiraUrl || '';
        jiraApiKeyInput.value = data.jiraApiKey || '';
        redmineUrlInput.value = data.redmineUrl || '';
        redmineApiKeyInput.value = data.redmineApiKey || '';
        redmineIssueIdInput.value = data.redmineIssueId || '';
        redmineActivityIdInput.value = data.redmineActivityId || '';
    });

    // Function to validate URLs
    function isValidURL(url) {
        // Regular expression pattern to match URLs with http or https
        const urlPattern = /^https?:\/\/([a-z0-9-]+(\.[a-z0-9-]+)*)(:\d+)?$/i;
        return urlPattern.test(url);
    }

    // Function to validate numbers
    function isValidNumber(issueId) {
        // Regular expression pattern to match numeric values
        const numericPattern = /^\d+$/;
        return numericPattern.test(issueId);
    }

    const toggleTrackingButton = document.getElementById('toggleTrackingButton');

    // Function to toggle isTrackingEnabled and update button state
    function toggleTrackingState() {
        chrome.storage.local.get('isTrackingEnabled', function (data) {
            const isTrackingEnabled = data.isTrackingEnabled;

            // Toggle the boolean value
            const updatedValue = !isTrackingEnabled;

            // Update the storage with the new value
            chrome.storage.local.set({'isTrackingEnabled': updatedValue}, function () {
                // Update the button appearance and text
                updateButtonState(updatedValue);
            });
        });
    }

    // Function to update button appearance and text based on the tracking state
    function updateButtonState(isTrackingEnabled) {
        toggleTrackingButton.classList.toggle('enabled', isTrackingEnabled);
        toggleTrackingButton.classList.toggle('disabled', !isTrackingEnabled);
        toggleTrackingButton.textContent = isTrackingEnabled ? 'Tracking enabled' : 'Tracking disabled';
    }

    // Add a click event listener to the button
    toggleTrackingButton.addEventListener('click', toggleTrackingState);

    // Initialize the button state based on the stored value
    chrome.storage.local.get('isTrackingEnabled', function (data) {
        const isTrackingEnabled = data.isTrackingEnabled;
        updateButtonState(isTrackingEnabled);
    });

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
        const issueId = redmineIssueIdInput.value;
        if (isValidNumber(issueId)) {
            chrome.storage.local.set({'redmineIssueId': issueId}, function () {
                status.textContent = 'Redmine Issue ID saved!';
            });
        } else {
            status.textContent = 'Invalid Redmine Issue ID (must be numeric)';
        }
    });

    redmineActivityIdInput.addEventListener('input', function () {
        const activityId = redmineActivityIdInput.value;
        if (isValidNumber(activityId)) {
            chrome.storage.local.set({'redmineActivityId': activityId}, function () {
                status.textContent = 'Redmine Activity ID saved!';
            });
        } else {
            status.textContent = 'Invalid Redmine Activity ID (must be numeric)';
        }
    });
});
