document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("menu-toggle").addEventListener("click", function (event) {
        event.preventDefault();
        const submenu = document.getElementById("submenu");
        submenu.classList.toggle("active");
        event.stopPropagation();
    });

    document.addEventListener("click", function () {
        const submenu = document.getElementById("submenu");
        if (submenu.classList.contains("active")) {
            submenu.classList.remove("active");
        }
    });
});

function toggleActiveOnListHead() {
    // Xử lý sự kiện click trên document
    document.addEventListener('click', function(event) {
        // Kiểm tra xem phần tử được nhấp có phải là .list_head không
        const isListHead = event.target.classList.contains('list_head');

        // Nếu không, xóa lớp 'active' khỏi tất cả các phần tử .list_head
        if (!isListHead) {
            document.querySelectorAll('.list_head').forEach((el) => {
                el.classList.remove('active');
            });
        }
    });

    // Thêm sự kiện click cho mỗi phần tử .list_head
    document.querySelectorAll('.list_head').forEach((element) => {
        element.addEventListener('click', function(event) {
            // Xóa lớp 'active' khỏi tất cả các phần tử .list_head
            document.querySelectorAll('.list_head').forEach((el) => {
                el.classList.remove('active');
            });

            // Thêm lớp 'active' vào phần tử được nhấp
            this.classList.add('active');

            // Ngăn chặn sự kiện click lan ra ngoài
            event.stopPropagation();
        });
    });
}

// Gọi hàm để kích hoạt chức năng
toggleActiveOnListHead();
