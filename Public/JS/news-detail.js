document.addEventListener("DOMContentLoaded", function() {
    const newsId = window.location.pathname.split('/').pop();
    fetchNewsDetail(newsId);
});

async function fetchNewsDetail(newsId) {
    try {
        const response = await fetch(`/news/api/detail/${newsId}`);
        const news = await response.json();

        document.querySelector('.news-content h2').textContent = news.tenTT;
        document.querySelector('.news-date').innerHTML = `<i class="fa-solid fa-clock"></i> ${formatDate(news.ngayDang)}`;
        document.querySelector('.news-description').innerHTML = news.chiTietBaiViet;

        // Set the image source dynamically
        const newsImage = document.getElementById('news-image');
        if (news.anhDaiDien) {
            newsImage.src = `/Public/images/${news.anhDaiDien}`;
        } else {
            newsImage.style.display = 'none';
        }
    } catch (error) {
        console.error('Lỗi khi lấy chi tiết tin tức:', error);
    }
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0'); // Lấy ngày và thêm số 0 nếu cần
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Lấy tháng (tháng bắt đầu từ 0)
    const year = date.getFullYear(); // Lấy năm
    return `${day}/${month}/${year}`; // Trả về định dạng dd/mm/yyyy
}