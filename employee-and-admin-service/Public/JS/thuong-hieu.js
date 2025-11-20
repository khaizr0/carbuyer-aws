let allData = [];
const prefix = window.location.pathname.startsWith('/admin') ? '/admin' : '/employee';

document.addEventListener("DOMContentLoaded", loadData);

async function loadData() {
    const res = await fetch(prefix + '/category/thuong-hieu');
    allData = await res.json();
    renderData(allData);
}

function renderData(data) {
    const tbody = document.querySelector("table tbody");
    tbody.innerHTML = data.map(item => `
        <tr>
            <td>${item.id}</td>
            <td>${item.TenTH}</td>
            <td>${item.idPhanLoaiTH === 0 ? 'Xe' : 'Phụ kiện'}</td>
            <td>
                <button class="btn btn-sm btn-warning edit-btn" data-id="${item.id}" data-name="${item.TenTH}" data-type="${item.idPhanLoaiTH}"><i class="fas fa-edit"></i></button>
                <button class="btn btn-sm btn-danger delete-btn" data-id="${item.id}"><i class="fas fa-trash"></i></button>
            </td>
        </tr>
    `).join("");
}

function searchData() {
    const keyword = document.querySelector('.table-options input[type="search"]').value.toLowerCase();
    const filtered = allData.filter(item => 
        item.id.toLowerCase().includes(keyword) || 
        item.TenTH.toLowerCase().includes(keyword)
    );
    renderData(filtered);
}

document.querySelector('.table-options form').addEventListener('submit', (e) => {
    e.preventDefault();
    searchData();
});

document.querySelector('.table-options input[type="search"]').addEventListener('input', searchData);

document.getElementById("createForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const res = await fetch(prefix + '/category/thuong-hieu', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(Object.fromEntries(formData))
    });
    if (res.ok) {
        alert("Thêm thành công!");
        bootstrap.Modal.getInstance(document.getElementById('createModal')).hide();
        e.target.reset();
        loadData();
    }
});

document.addEventListener("click", async (e) => {
    if (e.target.closest(".edit-btn")) {
        const btn = e.target.closest(".edit-btn");
        const form = document.getElementById("editForm");
        form.id.value = btn.dataset.id;
        form.TenTH.value = btn.dataset.name;
        form.idPhanLoaiTH.value = btn.dataset.type;
        new bootstrap.Modal(document.getElementById("editModal")).show();
    }
    if (e.target.closest(".delete-btn")) {
        if (confirm("Xóa thương hiệu này?")) {
            const id = e.target.closest(".delete-btn").dataset.id;
            const res = await fetch(`${prefix}/category/thuong-hieu/${id}`, { method: 'DELETE' });
            if (res.ok) {
                alert("Xóa thành công!");
                loadData();
            }
        }
    }
});

document.getElementById("editForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const id = formData.get('id');
    const res = await fetch(`${prefix}/category/thuong-hieu/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(Object.fromEntries(formData))
    });
    if (res.ok) {
        alert("Cập nhật thành công!");
        bootstrap.Modal.getInstance(document.getElementById('editModal')).hide();
        loadData();
    }
});
