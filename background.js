chrome.webRequest.onCompleted.addListener(
    function (details) {
        // Check if the request is from the specific website you're interested in
        if (details.url.includes('example.com')) {
            // Send your own HTTP request here
            fetch('https://yourserver.com/api', {
                method: 'POST',
                body: JSON.stringify({data: 'your_data'}),
                headers: {
                    'Content-Type': 'application/json',
                },
            })
                .then(response => {
                    // Handle the response
                })
                .catch(error => {
                    // Handle errors
                });
        }
    },
    {urls: ["<all_urls>"]}
);