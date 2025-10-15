// news.js
let currentPage = 1;
const itemsPerPage = 4; // Số bài viết hiển thị trên mỗi trang
const totalItems = 4; // Tổng số bài viết (cần cập nhật tùy theo số lượng bài viết thực tế)
const totalPages = Math.ceil(totalItems / itemsPerPage);

function changePage(direction) {
    if (direction === 1 && currentPage < totalPages) {
        currentPage++;
    } else if (direction === -1 && currentPage > 1) {
        currentPage--;
    }

    document.getElementById("current-page").textContent = currentPage;
    updateArticlesDisplay();
}

function updateArticlesDisplay() {
    const articles = document.querySelectorAll(".article");
    articles.forEach((article, index) => {
        if (index >= (currentPage - 1) * itemsPerPage && index < currentPage * itemsPerPage) {
            article.style.display = "flex"; // Hiển thị bài viết
        } else {
            article.style.display = "none"; // Ẩn bài viết
        }
    });

    // Cập nhật trạng thái nút
    document.getElementById("prev").disabled = currentPage === 1;
    document.getElementById("next").disabled = currentPage === totalPages;
}

// Đảm bảo nội dung được ẩn khi tải trang
document.addEventListener("DOMContentLoaded", function() {
    updateArticlesDisplay(); // Cập nhật hiển thị bài viết khi trang tải
    document.getElementById("total-pages").textContent = totalPages; // Hiển thị tổng số trang
});

document.addEventListener("DOMContentLoaded", function() {
    fetchNews();
});

async function fetchNews() {
    try {
        const response = await fetch('/news/api/all');
        const newsList = await response.json();
        
        const otherArticlesContainer = document.querySelector('.other-articles');
        otherArticlesContainer.innerHTML = ''; // Xóa nội dung cũ

        newsList.forEach((news, index) => {
            if (index === 0) {
                // Cập nhật bài viết nổi bật
                updateFeaturedArticle(news);
            } else {
                // Tạo các bài viết nhỏ
                createArticleElement(news);
            }
        });

        // Cập nhật phân trang
        const totalItems = newsList.length;
        const itemsPerPage = 4;
        const totalPages = Math.ceil(totalItems / itemsPerPage);

        document.getElementById("total-pages").textContent = totalPages;
        updateArticlesDisplay();
    } catch (error) {
        console.error('Lỗi khi lấy tin tức:', error);
    }
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return date.toLocaleDateString('en-GB', options).replace(/\//g, '-');
}

function truncateText(text, wordLimit) {
    if (!text) return '';
    const words = text.trim().split(/\s+/);
    if (words.length <= wordLimit) return text;
    return words.slice(0, wordLimit).join(' ') + '...';
}

function updateFeaturedArticle(news) {
    const featuredArticle = document.querySelector('.featured-article');
    const imgSrc = news.anhDaiDien ? `/Public/images/Database/tintuc/${news.anhDaiDien}` : '/Public/images/no-image-found.jpg';
    const shortContent = truncateText(news.chiTietBaiViet, 15);
    featuredArticle.innerHTML = `
        <img src="${imgSrc}" alt="${news.tenTT}" onerror="this.src='/Public/images/no-image-found.jpg'">
        <div class="featured-content">
            <h3>${formatDate(news.ngayDang)}</h3>
            <h2>${news.tenTT}</h2>
            <p>${shortContent}</p>
        </div>
    `;
    featuredArticle.style.cursor = 'pointer';
    featuredArticle.onclick = () => window.location.href = `/news/detail/${news.id}`;
}

function createArticleElement(news) {
    const otherArticlesContainer = document.querySelector('.other-articles');
    const articleDiv = document.createElement('div');
    articleDiv.classList.add('article');
    articleDiv.style.cursor = 'pointer';
    articleDiv.onclick = () => window.location.href = `/news/detail/${news.id}`;

    const imgSrc = news.anhDaiDien ? `/Public/images/Database/tintuc/${news.anhDaiDien}` : '/Public/images/no-image-found.jpg';
    const shortContent = truncateText(news.chiTietBaiViet, 15);
    articleDiv.innerHTML = `
        <img src="${imgSrc}" alt="${news.tenTT}" onerror="this.src='/Public/images/no-image-found.jpg'">
        <div class="article-content">
            <h3>${formatDate(news.ngayDang)}</h3>
            <h4>${news.tenTT}</h4>
            <p>${shortContent}</p>
        </div>
    `;

    otherArticlesContainer.appendChild(articleDiv);
}
