// Mở modal
function openModal() {
    document.getElementById("registerModal").style.display = "block";
}

// Đóng modal
function closeModal() {
    document.getElementById("registerModal").style.display = "none";
}

// Đóng modal khi click ngoài modal
window.onclick = function(event) {
    let modal = document.getElementById("registerModal");
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

function showContent(id, content, element) {
    // Ẩn tất cả các phần nội dung
    const sections = document.getElementsByClassName("noidung");
    for (let i = 0; i < sections.length; i++) {
        sections[i].style.display = "none";
    }
    // Hiển thị phần nội dung được chọn
    const selectedSection = document.getElementById(id);
    selectedSection.style.display = "block";

    // Xóa lớp 'active' khỏi tất cả các thẻ <li> và thêm lớp 'active' vào thẻ được chọn
    const listItems = document.querySelectorAll('.box-tongquan-tskt li');
    listItems.forEach(item => item.classList.remove('active'));
    element.parentElement.classList.add('active');
}

// Gọi hiển thị mặc định
document.addEventListener("DOMContentLoaded", function() {
    showContent('TQ', 'TQ', document.querySelector('.box-tongquan-tskt li.active a'));
});
