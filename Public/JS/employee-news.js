// Load news
document.addEventListener("DOMContentLoaded", async () => {
    const tableBody = document.querySelector("table tbody");
    try {
        const response = await fetch('/news');
        const newsData = await response.json();
        tableBody.innerHTML = newsData.map(news => `
            <tr>
                <td><input type="checkbox" class="row-checkbox" data-id="${news.id}"></td>
                <td>${news.tenTT}</td>
                <td>${news.chiTietBaiViet.substring(0, 100)}...</td>
                <td>${new Date(news.ngayDang).toLocaleDateString()}</td>
                <td>
                    <button class="btn btn-sm btn-warning edit-news" data-id="${news.id}"><i class="fas fa-edit"></i></button>
                    <button class="btn btn-sm btn-danger delete-news" data-id="${news.id}"><i class="fas fa-trash"></i></button>
                </td>
            </tr>
        `).join("");
    } catch (error) {
        console.error("Error fetching news:", error);
    }
});

// Summernote editors
$(document).ready(function() {
    $('#editor').summernote({
        height: 200,
        maxTextLength: 10000000,
        callbacks: {
            onPaste: function (e) {
                var bufferText = ((e.originalEvent || e).clipboardData || window.clipboardData).getData('Text');
                if (bufferText.length > 10000000) {
                    e.preventDefault();
                    alert('Nội dung quá dài! Giới hạn 10 triệu ký tự.');
                }
            }
        }
    });
    
    $('#editEditor').summernote({
        height: 200,
        maxTextLength: 10000000,
        callbacks: {
            onPaste: function (e) {
                var bufferText = ((e.originalEvent || e).clipboardData || window.clipboardData).getData('Text');
                if (bufferText.length > 10000000) {
                    e.preventDefault();
                    alert('Nội dung quá dài! Giới hạn 10 triệu ký tự.');
                }
            }
        }
    });
});

// Create news
document.getElementById("createNewsForm").addEventListener("submit", async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    formData.set('chiTietBaiViet', $('#editor').summernote('code'));
    try {
        const response = await fetch('/news/create', { method: 'POST', body: formData });
        if (response.ok) {
            alert("Thêm tin tức mới thành công!");
            location.reload();
        } else {
            alert("Thêm tin tức thất bại.");
        }
    } catch (error) {
        console.error("Error submitting form:", error);
        alert("Có lỗi xảy ra khi gửi yêu cầu.");
    }
});

// Edit news
document.addEventListener("click", async (event) => {
    if (event.target.closest(".edit-news")) {
        const id = event.target.closest(".edit-news").dataset.id;
        try {
            const response = await fetch(`/news/${id}`);
            const news = await response.json();
            document.getElementById('editTenTT').value = news.tenTT;
            document.getElementById('editTrangThai').value = news.trangThai ? "1" : "0";
            $('#editEditor').summernote('code', news.chiTietBaiViet);
            document.getElementById('editNewsId').value = news.id;
            new bootstrap.Modal(document.getElementById("editTinTucModal")).show();
        } catch (error) {
            console.error("Error fetching news:", error);
        }
    }
});

// Update news
document.getElementById("editNewsForm").addEventListener("submit", async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    formData.set('chiTietBaiViet', $('#editEditor').summernote('code'));
    const id = formData.get('id');
    try {
        const response = await fetch(`/news/${id}`, { method: 'PUT', body: formData });
        if (response.ok) {
            alert("Cập nhật tin tức thành công!");
            location.reload();
        } else {
            alert("Cập nhật tin tức thất bại.");
        }
    } catch (error) {
        console.error("Error submitting form:", error);
        alert("Có lỗi xảy ra khi gửi yêu cầu.");
    }
});

// Delete news
document.addEventListener("click", async (event) => {
    if (event.target.closest(".delete-news")) {
        const id = event.target.closest(".delete-news").dataset.id;
        if (confirm("Bạn có chắc chắn muốn xóa?")) {
            try {
                const response = await fetch(`/news/${id}`, { method: 'DELETE' });
                if (response.ok) {
                    alert("Xóa tin tức thành công!");
                    location.reload();
                } else {
                    alert("Xóa tin tức thất bại.");
                }
            } catch (error) {
                console.error("Error deleting news:", error);
                alert("Có lỗi xảy ra khi xóa tin tức.");
            }
        }
    }
});
