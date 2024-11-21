document.addEventListener('DOMContentLoaded', () => {
    const emotionLabels = {
        'binh_thuong': 'Bình thường',
        'buon': 'Buồn',
        'cuoi': 'Cười',
        'ngac_nhien': 'Ngạc nhiên',
        'so_hai': 'Sợ hãi',
        'tuc_gian': 'Tức giận'
    };

    const uploadForm = document.getElementById("upload_form");
    const videoPlayer = document.getElementById("video_fast_player");
    const videoImageIdentificationContainer = document.getElementById("video_fast_player_identification");
    const placeholderVideoPlayer = document.getElementById("placeholder_video_fast_player");
    const placeholderVideoImageIdentification = document.getElementById("placeholder_video_fast_identification");
    const btnCheckVideo = document.getElementById("btn_check_video_fast");

    const inputMinutes = document.getElementById("input_minutes");
    const inputSeconds = document.getElementById("input_seconds");
    const alertMessage = document.getElementById("alert_message");
    const alertZeroMessage = document.createElement("div");
    alertZeroMessage.style.color = "red";
    alertZeroMessage.style.display = "none";
    alertZeroMessage.innerHTML = "Vui lòng nhập ít nhất một trường phút hoặc giây khác 0!";

    document.querySelector(".video_box_fast").appendChild(alertZeroMessage);

    btnCheckVideo.style.display = "none";  // Ban đầu ẩn nút

    // Chức năng kiểm tra các trường đầu vào
    function checkInput() {
        const minutes = inputMinutes.value;
        const seconds = inputSeconds.value;

        if (minutes && seconds && !isNaN(minutes) && !isNaN(seconds) && seconds >= 0 && seconds < 60) {
            btnCheckVideo.disabled = false;
            alertMessage.style.display = "none";  // Ẩn thông báo lỗi khi đầu vào hợp lệ
            alertZeroMessage.style.display = "none";  // Ẩn tin nhắn bằng không
        } else {
            btnCheckVideo.disabled = true;  // Nút tắt khi đầu vào không hợp lệ
            if (!minutes || !seconds || isNaN(minutes) || isNaN(seconds) || seconds < 0 || seconds >= 60) {
                alertMessage.style.display = "block";  // Hiển thị thông báo lỗi khi thông tin nhập vào không đầy đủ hoặc không hợp lệ
            } else {
                alertMessage.style.display = "none";  // Ẩn thông báo lỗi chung
            }

            // Hiển thị thông báo khi cả hai trường đều bằng 0
            if (minutes == 0 && seconds == 0) {
                alertZeroMessage.style.display = "block";  // Hiển thị thông báo đầu vào bằng 0
            }
        }
    }

    // Trình xử lý sự kiện cho các trường đầu vào
    inputMinutes.addEventListener("input", checkInput);
    inputSeconds.addEventListener("input", checkInput);

    uploadForm.onsubmit = async function(event) {
        event.preventDefault();
        const fileInput = document.getElementById("video_profile");
        if (fileInput.files.length === 0) return;

        const formData = new FormData();
        formData.append("video_profile", fileInput.files[0]);

        try {
            const response = await fetch("/video/upload", { method: "POST", body: formData });
            if (response.ok) {
                const data = await response.json();
                videoPlayer.src = data.file_url;

                // Ẩn lớp phủ khi video được tải lên
                placeholderVideoPlayer.style.display = "none";
                checkInput();  // Kiểm tra lại đầu vào sau khi tải video lên
                btnCheckVideo.style.display = "inline-block";  // Hiển thị nút sau khi video được tải lên
            } else console.error("Tải video không thành công.");
        } catch (error) { console.error("Lỗi khi tải video:", error); }
    };

    btnCheckVideo.onclick = async function() {
        const minutes = inputMinutes.value;
        const seconds = inputSeconds.value;
        
        if (!minutes || !seconds || isNaN(minutes) || isNaN(seconds) || seconds < 0 || seconds >= 60 || (minutes == 0 && seconds == 0)) {
            alertMessage.style.display = "none";
            alertZeroMessage.style.display = "block";
            return;
        }
    
        btnCheckVideo.disabled = true;
        try {
            const processResponse = await fetch("/process-video", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    video_url: videoPlayer.src,
                    minutes: minutes,
                    seconds: seconds,
                }),
            });
    
            if (processResponse.ok) {
                const data = await processResponse.json();
    
                // Display the emotion statistics table
                const emotionStatistics = document.getElementById("emotion_statistics");
                emotionStatistics.style.display = "block"; // Show the stats container
    
                const emotionTableBody = document.querySelector("#emotion_table tbody");
                emotionTableBody.innerHTML = ""; // Clear old data
    
                let totalEmotions = 0; // Initialize total emotion count
    
                for (const [emotion, count] of Object.entries(data.emotion_counts)) {
                    const row = document.createElement("tr");
                    const emotionName = emotionLabels[emotion] || emotion;  // Map emotion to Vietnamese
                    row.innerHTML = `<td>${emotionName}</td><td>${count}</td>`;
                    emotionTableBody.appendChild(row);
    
                    // Sum up the counts
                    totalEmotions += count;
                }
    
                // Add total row
                const totalRow = document.createElement("tr");
                totalRow.innerHTML = `<td><strong>Tổng cộng</strong></td><td><strong>${totalEmotions}</strong></td>`;
                emotionTableBody.appendChild(totalRow);
    
                // Display processed images
                videoImageIdentificationContainer.innerHTML = ""; // Clear old images
                data.processed_images.forEach(imageData => {
                    const imgElement = document.createElement("img");
                    imgElement.src = imageData.image_url;
                    imgElement.alt = `Frame ${imageData.frame_position}`;
                    videoImageIdentificationContainer.appendChild(imgElement);
                });
    
                placeholderVideoImageIdentification.style.display = "none";
            } else {
                console.error("Video processing failed.");
            }
        } catch (error) {
            console.error("Error processing video:", error);
        } finally {
            btnCheckVideo.disabled = false;
        }
    };
    
});
