document.addEventListener('DOMContentLoaded', loadData);

async function loadData() {
    const res = await fetch('/private/nguyen-lieu');
    const data = await res.json();
    const tbody = document.querySelector('tbody');
    tbody.innerHTML = data.map(item => `
        <tr>
            <td>${item.id}</td>
            <td>${item.tenNguyenLieu}</td>
            <td>
                <button class="btn btn-sm btn-warning" onclick='editItem(${JSON.stringify(item)})'><i class="fas fa-edit"></i></button>
                <button class="btn btn-sm btn-danger" onclick="deleteItem('${item.id}')"><i class="fas fa-trash"></i></button>
            </td>
        </tr>
    `).join('');
}

document.getElementById('createForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    await fetch('/private/nguyen-lieu', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(Object.fromEntries(formData))
    });
    bootstrap.Modal.getInstance(document.getElementById('createModal')).hide();
    e.target.reset();
    loadData();
});

document.getElementById('editForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const id = formData.get('id');
    await fetch(`/private/nguyen-lieu/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(Object.fromEntries(formData))
    });
    bootstrap.Modal.getInstance(document.getElementById('editModal')).hide();
    loadData();
});

function editItem(item) {
    document.querySelector('#editForm [name="id"]').value = item.id;
    document.querySelector('#editForm [name="tenNguyenLieu"]').value = item.tenNguyenLieu;
    new bootstrap.Modal(document.getElementById('editModal')).show();
}

async function deleteItem(id) {
    if (confirm('Xóa nguyên liệu này?')) {
        await fetch(`/private/nguyen-lieu/${id}`, { method: 'DELETE' });
        loadData();
    }
}

document.querySelector('.input-group input').addEventListener('input', (e) => {
    const search = e.target.value.toLowerCase();
    document.querySelectorAll('tbody tr').forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(search) ? '' : 'none';
    });
});

document.querySelector('.input-group').addEventListener('submit', (e) => e.preventDefault());
