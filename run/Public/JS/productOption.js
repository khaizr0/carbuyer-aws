
// Đảm bảo nội dung được ẩn khi tải trang
document.addEventListener("DOMContentLoaded", function() {
    document.querySelectorAll('.filter-content').forEach(function(content) {
        content.style.display = "none"; // Ẩn tất cả nội dung
    });
});

let currentPage = 1;
const itemsPerPage = 18; // Số sản phẩm hiển thị trên mỗi trang
const totalItems = 10; // Tổng số sản phẩm (cần cập nhật tùy theo số lượng sản phẩm thực tế)
const totalPages = Math.ceil(totalItems / itemsPerPage);

function changePage(direction) {
    if (direction === 1 && currentPage < totalPages) {
        currentPage++;
    } else if (direction === -1 && currentPage > 1) {
        currentPage--;
    }

    document.getElementById("current-page").textContent = currentPage;
    // Ẩn/hiện sản phẩm dựa trên trang hiện tại
    updateProductsDisplay();
}

function updateProductsDisplay() {
    const productCards = document.querySelectorAll(".product-card");
    productCards.forEach((card, index) => {
        if (index >= (currentPage - 1) * itemsPerPage && index < currentPage * itemsPerPage) {
            card.style.display = "block"; // Hiển thị sản phẩm
        } else {
            card.style.display = "none"; // Ẩn sản phẩm
        }
    });

    // Cập nhật trạng thái nút
    document.getElementById("prev").disabled = currentPage === 1;
    document.getElementById("next").disabled = currentPage === totalPages;
}

// Đảm bảo nội dung được ẩn khi tải trang
document.addEventListener("DOMContentLoaded", function() {
    updateProductsDisplay(); // Cập nhật hiển thị sản phẩm khi trang tải
});

// Toggle cho phần bên trái
function toggleSection(button) {
    const filterContent = button.parentElement.nextElementSibling;
    filterContent.style.display = filterContent.style.display === "block" ? "none" : "block";
}
