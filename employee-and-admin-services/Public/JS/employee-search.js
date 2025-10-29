// Search for products in employee page
function searchProducts() {
    const searchInput = document.querySelector('.table-options input[type="search"]');
    const keyword = searchInput ? searchInput.value.trim().toLowerCase() : '';
    const rows = document.querySelectorAll('#carList tr');
    
    rows.forEach(row => {
        const name = row.cells[1]?.textContent.toLowerCase() || '';
        const brand = row.cells[2]?.textContent.toLowerCase() || '';
        const type = row.cells[4]?.textContent.toLowerCase() || '';
        
        if (name.includes(keyword) || brand.includes(keyword) || type.includes(keyword)) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}

// Search for news in employee page
function searchNews() {
    const searchInput = document.querySelector('.table-options input[type="search"]');
    const keyword = searchInput ? searchInput.value.trim().toLowerCase() : '';
    const rows = document.querySelectorAll('table tbody tr');
    
    rows.forEach(row => {
        const title = row.cells[1]?.textContent.toLowerCase() || '';
        const content = row.cells[2]?.textContent.toLowerCase() || '';
        
        if (title.includes(keyword) || content.includes(keyword)) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}

// Initialize search on page load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSearch);
} else {
    initSearch();
}

function initSearch() {
    const searchForm = document.querySelector('.table-options form');
    const searchInput = document.querySelector('.table-options input[type="search"]');
    
    if (searchForm && searchInput) {
        searchForm.addEventListener('submit', (e) => {
            e.preventDefault();
            if (window.location.pathname.includes('san-pham')) {
                searchProducts();
            } else if (window.location.pathname.includes('tin-tuc')) {
                searchNews();
            }
        });
        
        searchInput.addEventListener('input', () => {
            if (window.location.pathname.includes('san-pham')) {
                searchProducts();
            } else if (window.location.pathname.includes('tin-tuc')) {
                searchNews();
            }
        });
    }
}
