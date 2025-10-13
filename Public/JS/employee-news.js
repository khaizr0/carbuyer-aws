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
                    <button class="btn btn-trans edit-news" data-id="${news.id}"><i class="fas fa-edit"></i></button>
                    <button class="btn btn-trans delete-news" data-id="${news.id}"><i class="fas fa-trash"></i></button>
                </td>
            </tr>
        `).join("");
    } catch (error) {
        console.error("Error fetching news:", error);
    }
});

// Quill editors
const quill = new Quill('#editor', { theme: 'snow' });
const editQuill = new Quill('#editEditor', { theme: 'snow' });

// Create news
document.getElementById("createNewsForm").addEventListener("submit", async (event) => {
    event.preventDefault();
    document.getElementById('chiTietBaiViet').value = quill.root.innerHTML;
    const formData = new FormData(event.target);
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
            editQuill.root.innerHTML = news.chiTietBaiViet;
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
    document.getElementById('editChiTietBaiViet').value = editQuill.root.innerHTML;
    const formData = new FormData(event.target);
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
