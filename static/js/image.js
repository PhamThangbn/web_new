// Hiển thị hình ảnh đã tải lên
function previewImage() {
    const files = document.getElementById('imageUpload').files; // Lấy tất cả các file đã chọn
    const preview = document.getElementById('imageExtraction');
    preview.innerHTML = ''; // Xóa nội dung trước đó

    if (files.length > 0) {
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const reader = new FileReader();
            reader.onload = function (e) {
                preview.innerHTML += `<img src="${e.target.result}" alt="Hình ảnh tải lên" width="200px" style="margin: 5px;">`; // Hiển thị hình ảnh với khoảng cách
            };
            reader.readAsDataURL(file);
        }
    }
}

function uploadImage() {
    alert("Chức năng tải folder lên đang được phát triển.");
}


// Hàm kiểm tra hình ảnh
function checkImages() {
    const files = document.getElementById('imageUpload').files;
    const loadingElement = document.getElementById('loading');
    const resultContainer = document.getElementById('result');
    const imageIdentificationContainer = document.getElementById('imageIdentification');

    if (files.length > 0) {
        loadingElement.style.display = 'block'; // Hiển thị hiệu ứng loading

        const formData = new FormData();
        for (let i = 0; i < files.length; i++) {
            formData.append('images[]', files[i]);
        }

        fetch('/check-image', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            // Hiển thị số liệu nhận diện
            resultContainer.innerText =
                `Tổng số khuôn mặt đã nhận diện: ${data.detected_emotions.total}\n` +
                `Bình thường: ${data.detected_emotions.binh_thuong}\n` +
                `Buồn: ${data.detected_emotions.buon}\n` +
                `Cười: ${data.detected_emotions.cuoi}\n` +
                `Ngạc nhiên: ${data.detected_emotions.ngac_nhien}\n` +
                `Sợ hãi: ${data.detected_emotions.so_hai}\n` +
                `Tức giận: ${data.detected_emotions.tuc_gian}`;

            // Hiển thị hình ảnh đã nhận diện
            imageIdentificationContainer.innerHTML = ''; // Xóa nội dung cũ
            data.images.forEach(imgData => {
                const imgElement = document.createElement('img');
                imgElement.src = `data:image/jpeg;base64,${imgData.image}`;
                imgElement.alt = 'Hình ảnh đã nhận diện';

                  // Cấu hình chiều rộng và chiều cao
                imgElement.style.width = '300px'; // Thay đổi chiều rộng theo ý muốn
                imgElement.style.height = 'auto';  // Giữ tỉ lệ khung hình

                imageIdentificationContainer.appendChild(imgElement);
            });
        })
        .catch(error => console.error('Lỗi:', error))
        .finally(() => {
            loadingElement.style.display = 'none'; // Ẩn hiệu ứng loading khi hoàn thành
        });
    } else {
        alert("Vui lòng tải ảnh lên trước khi kiểm tra!");
    }
}

function stopFunction() {
    alert("Chức năng Stop đang được phát triển.");
}
