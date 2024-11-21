function startDetection() {
    fetch('/start_webcam', { method: 'POST' })
        .then(response => response.json())
        .then(data => {
            if (data.status === "webcam started") {
                const videoStreamUrl = document.getElementById("videoStream").getAttribute("data-url");
                document.getElementById("videoStream").src = videoStreamUrl;
            }
        })
        .catch(error => console.error("Error:", error));
}

function stopDetection() {
    fetch('/stop_webcam', { method: 'POST' })
        .then(response => response.json())
        .then(data => {
            if (data.status === "webcam stopped") {
                document.getElementById("videoStream").src = ""; // Stop video stream
            }
        })
        .catch(error => console.error("Error:", error));
}

