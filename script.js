const USERS_KEY = "ds_users_v1";
const SESSION_KEY = "ds_session_v1";

const $ = (s) => document.querySelector(s); const $$ = (s) => document.querySelectorAll(s);

let DONGHUA_LIST = []; 
let currentPage = 1;
const itemsPerPage = 2;
let searchQuery = ""; 

async function loadDonghuaData() {
  try {
    const response = await fetch("data.json");
    if (!response.ok) throw new Error("Gagal memuat file data.json");
    DONGHUA_LIST = await response.json();
    renderCatalog();
  } catch (error) {
    console.error("Error:", error);
    toast("Gagal memuat katalog donghua.");
  }
}

function escapeHTML(str) {
  if (!str) return "";
  return str.replace(/[&<>'"]/g, 
    tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
  );
}

function currentSession() {
  try {
    return JSON.parse(localStorage.getItem(SESSION_KEY)) || null;
  } catch {
    return null;
  }
}

function toast(message) {
  let t = $("#toast");
  if (!t) {
    t = document.createElement("div");
    t.id = "toast";
    t.style.cssText = "position:fixed; bottom:20px; right:20px; background:#1e293b; color:#fff; padding:10px 20px; border-radius:8px; z-index:9999;";
    document.body.appendChild(t);
  }
  t.textContent = message;
  t.style.opacity = "1";
  setTimeout(() => { t.style.opacity = "0"; }, 3000);
}

document.addEventListener("DOMContentLoaded", () => {
  const searchInput = $("#searchInput");
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      searchQuery = e.target.value.trim().toLowerCase();
      currentPage = 1;
      renderCatalog();
    });
  }
  loadDonghuaData();
});

function renderCatalog() {
  const grid = $("#donghuaGrid");
  const paginationNav = $("#paginationNav");
  if (!grid) return;
  
  const filteredItems = DONGHUA_LIST.filter(item => 
    item.title.toLowerCase().includes(searchQuery) || 
    (item.chineseTitle && item.chineseTitle.toLowerCase().includes(searchQuery))
  );

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage) || 1;
  if (currentPage > totalPages) currentPage = 1;

  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedItems = filteredItems.slice(startIndex, startIndex + itemsPerPage);

  if (paginatedItems.length === 0) {
    grid.innerHTML = `<div style="text-align: center; padding: 30px; color: #94a3b8; grid-column: 1 / -1;"><p>Donghua tidak ditemukan.</p></div>`;
    if (paginationNav) paginationNav.innerHTML = "";
    return;
  }

  grid.innerHTML = paginatedItems.map(item => `
    <div class="donghua-card" style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 15px; margin-bottom: 10px;">
      <h3 style="color: #fff;">${escapeHTML(item.title)}</h3>
      <p style="color: #94a3b8;">${escapeHTML(item.description || '')}</p>
    </div>
  `).join("");
}
