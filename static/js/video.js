document.addEventListener("DOMContentLoaded", () => {
    const uploadForm = document.getElementById("upload-form");
    const videoPlayer = document.getElementById("video_player");
    const videoPlayerIdentification = document.getElementById("video_player_identification");
    const btnCheckVideo = document.getElementById("btn_check_video");
    const placeholderVideoPlayer = document.getElementById("placeholder_video_player");
    const placeholderVideoIdentification = document.getElementById("placeholder_video_identification");

    uploadForm.onsubmit = async (event) => {
        event.preventDefault();

        const fileInput = document.getElementById("video_profile");
        if (fileInput.files.length === 0) return;

        const formData = new FormData();
        formData.append("video_profile", fileInput.files[0]);

        const response = await fetch("/video/upload", {
            method: "POST",
            body: formData,
        });

        if (response.ok) {
            const data = await response.json();
            const videoUrl = data.file_url;

            // Load uploaded video
            videoPlayer.src = videoUrl;
            videoPlayer.classList.remove("empty_video");
            placeholderVideoPlayer.style.display = "none";

            // Show button to process video
            btnCheckVideo.style.display = "inline-block";

            btnCheckVideo.onclick = async () => {
                btnCheckVideo.disabled = true;

                const processResponse = await fetch("/video/process", {
                    method: "POST",
                    body: JSON.stringify({ video_url: videoUrl }),
                    headers: {
                        "Content-Type": "application/json",
                    },
                });

                if (processResponse.ok) {
                    const processData = await processResponse.json();
                    const processedVideoUrl = processData.processed_file_url;

                    // Load processed video
                    videoPlayerIdentification.src = processedVideoUrl;
                    videoPlayerIdentification.classList.remove("empty_video");
                    placeholderVideoIdentification.style.display = "none";
                } else {
                    console.error("Video processing failed.");
                    btnCheckVideo.disabled = false;
                }
            };
        } else {
            console.error("Video upload failed.");
        }
    };
});
