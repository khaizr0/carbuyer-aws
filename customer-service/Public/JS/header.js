document.addEventListener("DOMContentLoaded", function() {
    const headerHTML = `
         <div class="header">
        <div class="menu">
            <img src="/Public/images/CarLogo.png" alt="Logo" class="logo">
            <a href="/">Trang chủ</a>
            <a href="/xedangban">Xe đang bán</a>
            <a href="/phukien">Phụ Kiện</a>
            <a href="/tintuc">Tin Tức</a>
        </div>
        <div class="search-container" style="position: relative;">
            <input type="text" id="headerSearchBox" class="search-box" placeholder="Tìm kiếm xe ở đây" autocomplete="off">
            <button class="search-button" id="headerSearchBtn"><i class="fa-solid fa-magnifying-glass"></i></button>
            <div id="searchDropdown" style="display: none; position: absolute; top: 100%; left: 0; width: 500px; background: white; border: 1px solid #ddd; border-radius: 5px; max-height: 400px; overflow-y: auto; z-index: 1000; box-shadow: 0 4px 6px rgba(0,0,0,0.1);"></div>
            <div class="hotline-container">
                    <span class="hotline-title">Hotline</span><br>
                    <a href="tel:0123456789" class="hotline-link">0123456789</a>
            </div>
        </div>
    </div>
    `;

    document.body.insertAdjacentHTML('afterbegin', headerHTML);
    
    const searchBox = document.getElementById('headerSearchBox');
    const searchBtn = document.getElementById('headerSearchBtn');
    const dropdown = document.getElementById('searchDropdown');
    let debounceTimer;
    
    function performSearch() {
        const keyword = searchBox.value.trim();
        if (keyword) {
            dropdown.style.display = 'none';
            window.location.href = `/xedangban?keyword=${encodeURIComponent(keyword)}`;
        }
    }
    
    async function showSuggestions(keyword) {
        if (!keyword || keyword.length < 2) {
            dropdown.style.display = 'none';
            return;
        }
        
        try {
            const response = await fetch(`/product/search?type=car&keyword=${encodeURIComponent(keyword)}`);
            const products = await response.json();
            
            if (products.length === 0) {
                dropdown.style.display = 'none';
                return;
            }
            
            dropdown.innerHTML = products.slice(0, 5).map(p => `
                <div style="display: flex; align-items: center; padding: 10px; cursor: pointer; border-bottom: 1px solid #eee;" 
                     onmouseover="this.style.background='#f5f5f5'" 
                     onmouseout="this.style.background='white'"
                     onclick="window.location.href='/chitietsanpham?id=${p.id}'">
                    <img src="${p.imageUrl || '/Public/images/no-image-found.jpg'}" alt="${p.name}" 
                         style="width: 60px; height: 45px; object-fit: cover; border-radius: 4px; margin-right: 10px;"
                         onerror="this.src='/Public/images/no-image-found.jpg'">
                    <div style="flex: 1;">
                        <div style="font-weight: 500; color: #333;">${p.name}</div>
                        <div style="font-size: 12px; color: #666;">${p.price}</div>
                    </div>
                </div>
            `).join('');
            
            dropdown.style.display = 'block';
        } catch (error) {
            console.error('Error fetching suggestions:', error);
        }
    }
    
    searchBox.addEventListener('input', (e) => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => showSuggestions(e.target.value), 300);
    });
    
    searchBox.addEventListener('focus', (e) => {
        if (e.target.value.length >= 2) showSuggestions(e.target.value);
    });
    
    document.addEventListener('click', (e) => {
        if (!searchBox.contains(e.target) && !dropdown.contains(e.target)) {
            dropdown.style.display = 'none';
        }
    });
    
    searchBtn.addEventListener('click', performSearch);
    searchBox.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') performSearch();
    });
});
