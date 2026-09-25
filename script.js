const USERS_KEY = "ds_users_v1";
const SESSION_KEY = "ds_session_v1";

const $ = (s) => document.querySelector(s); const $$ = (s) => document.querySelectorAll(s);

// Variabel utama untuk katalog, pagination, dan pencarian
let DONGHUA_LIST = []; 
let currentPage = 1;
const itemsPerPage = 2; // Ubah angka ini jika ingin menampilkan lebih banyak item per halaman
let searchQuery = ""; 

// Fungsi untuk memuat data dari file data.json secara asinkron
async function loadDonghuaData() {
  try {
    const response = await fetch("data.json");
    if (!response.ok) throw new Error("Gagal memuat file data.json");
    DONGHUA_LIST = await response.json();
    renderCatalog(); // Render katalog setelah data berhasil ditarik
  } catch (error) {
    console.error("Error:", error);
    toast("Gagal memuat katalog donghua.");
  }
}

// Fungsi Keamanan untuk Mencegah XSS
function escapeHTML(str) {
  if (!str) return "";
  return str.replace(/[&<>'"]/g, 
    tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
  );
}

// Sistem Manajemen Sesi & Akun Pengguna
function getUsers() {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY)) || [];
  } catch {
    return [];
  }
}

function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function currentSession() {
  try {
    return JSON.parse(localStorage.getItem(SESSION_KEY)) || null;
  } catch {
    return null;
  }
}

function setSession(user) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(user));
  updateAccountUI();
}

function clearSession() {
  localStorage.removeItem(SESSION_KEY);
  updateAccountUI();
}

function toast(message) {
  let t = $("#toast");
  if (!t) {
    t = document.createElement("div");
    t.id = "toast";
    t.style.cssText = "position:fixed; bottom:20px; right:20px; background:#1e293b; color:#fff; padding:10px 20px; border-radius:8px; z-index:9999; border:1px solid rgba(255,255,255,0.1); box-shadow:0 4px 12px rgba(0,0,0,0.3); transition:opacity 0.3s ease;";
    document.body.appendChild(t);
  }
  t.textContent = message;
  t.style.opacity = "1";
  setTimeout(() => { t.style.opacity = "0"; }, 3000);
}

function updateAccountUI() {
  const user = currentSession();
  const btn = $("#accountBtn");
  if (!btn) return;
  if (user) {
    btn.innerHTML = `<i class="fa-solid fa-user-check"></i> ${escapeHTML(user.name)}`;
  } else {
    btn.innerHTML = `<i class="fa-solid fa-user"></i> Akun`;
  }
}

window.openAccountModal = function() {
  const user = currentSession();
  const content = $("#accountContent");
  if (!content) return;

  if (!user) {
    content.innerHTML = `
      <div style="text-align: center; padding: 20px;">
        <h3 style="margin-bottom: 15px; color: #fff;">Belum Masuk</h3>
        <p class="muted" style="margin-bottom: 20px;">Silakan login atau daftar terlebih dahulu.</p>
        <button onclick="switchTab('login')" class="btn btn-primary" style="padding: 8px 20px;">Login / Register</button>
      </div>
    `;
  } else {
    content.innerHTML = `
      <div style="text-align: center; padding: 20px;">
        <div style="font-size: 3rem; color: var(--gold); margin-bottom: 10px;">
          <i class="fa-solid fa-user-circle"></i>
        </div>
        <h3 style="margin-bottom: 5px; color: #fff;">${escapeHTML(user.name)}</h3>
        <p class="muted" style="margin-bottom: 15px;">${escapeHTML(user.email)}</p>
        <div style="display: inline-block; background: rgba(255,255,255,0.08); padding: 6px 15px; border-radius: 20px; font-weight: 600; margin-bottom: 20px; color: #fff;">
          Status: ${user.plan === "vip" ? "👑 VIP Premium" : "Non-VIP"}
        </div>
        <div>
          <button onclick="logoutUser()" class="btn" style="background: #ef4444; color: #fff; padding: 6px 15px; border-radius: 6px;">Keluar</button>
        </div>
      </div>
    `;
  }
  
  const modal = $("#accountModal");
  if (modal) modal.classList.add("show");
};

window.logoutUser = function() {
  clearSession();
  const modal = $("#accountModal");
  if (modal) modal.classList.remove("show");
  toast("Berhasil keluar akun.");
};

window.switchTab = function(tabName) {
  $$(".tab-content").forEach(el => el.classList.remove("active"));   const target = document.getElementById(tabName);   if (target) target.classList.add("active"); };  // Event Listener Saat Dokumen Siap document.addEventListener("DOMContentLoaded", () => {   $$
(".tab").forEach(btn => btn.addEventListener("click", () => switchTab(btn.dataset.tab)));
  $$("[data-switch]").forEach(btn => btn.addEventListener("click", () => switchTab(btn.dataset.switch)));      $$
(".eye").forEach(btn => {
    btn.addEventListener("click", () => {
      const input = document.getElementById(btn.dataset.target);
      if (!input) return;
      input.type = input.type === "password" ? "text" : "password";
      btn.innerHTML = input.type === "password"
        ? '<i class="fa-solid fa-eye"></i>'
        : '<i class="fa-solid fa-eye-slash"></i>';
    });
  });

  const searchInput = $("#searchInput");
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      searchQuery = e.target.value.trim().toLowerCase();
      currentPage = 1;
      renderCatalog();
    });
  }

  updateAccountUI();
  loadDonghuaData(); // Mulai mengambil data dari data.json
});

// Fungsi Rendering Katalog Donghua
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
  const endIndex = startIndex + itemsPerPage;
  const paginatedItems = filteredItems.slice(startIndex, endIndex);

  if (paginatedItems.length === 0) {
    grid.innerHTML = `
      <div style="text-align: center; padding: 30px; color: #94a3b8; grid-column: 1 / -1;">
        <i class="fa-solid fa-face-frown" style="font-size: 2rem; margin-bottom: 8px;"></i>
        <p>Donghua yang kamu cari tidak ditemukan.</p>
      </div>
    `;
    if (paginationNav) paginationNav.innerHTML = "";
    return;
  }

  grid.innerHTML = paginatedItems.map(item => `
    <div class="donghua-card" style="display: flex; flex-direction: column; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 15px; gap: 10px;">
      <div style="display: flex; gap: 15px;">
        <div class="poster-wrap" style="position:relative; width: 110px; aspect-ratio:2/3; border-radius:8px; overflow:hidden; background:#111; flex-shrink: 0;">
          <img src="${escapeHTML(item.poster)}" alt="${escapeHTML(item.title)}" loading="lazy" style="width:100%; height:100%; object-fit:cover;" onerror="this.src='https://placehold.co/300x450/1a1a2e/ffffff?text=No+Poster';">
          <span class="donghua-badge ${escapeHTML(item.type)}" style="position:absolute; top:5px; left:5px; font-size:0.6rem; padding:2px 6px; background:var(--primary); color:#fff; border-radius:4px;">${escapeHTML(item.type.toUpperCase())}</span>
        </div>
        <div style="flex-grow: 1;">
          <div class="donghua-meta" style="display: flex; gap: 10px; font-size: 0.85rem; margin-bottom: 4px; color: #cbd5e1;">
            <span><i class="fa-solid fa-star" style="color:var(--gold)"></i> ${escapeHTML(String(item.rating))}</span>
            <span class="muted">Ep ${item.episodes ? item.episodes.length : 0}</span>
            <span style="font-size: 0.75rem; color: ${item.status === 'Completed' ? '#34d399' : '#fbbf24'};">${escapeHTML(item.status)}</span>
          </div>
          <h3 style="font-size: 1.1rem; color: #fff; margin-bottom: 2px;">${escapeHTML(item.title)}</h3>
          <span class="donghua-sub" style="font-size: 0.85rem; color: var(--gold); display: block; margin-bottom: 6px;">${escapeHTML(item.chineseTitle)}</span>
          <div class="genre-tags" style="display:flex; flex-wrap:wrap; gap:4px; margin-bottom: 6px;">
            ${item.genre.map(g => `<span style="font-size:0.55rem; background:rgba(255,255,255,0.08); padding:2px 6px; border-radius:4px; color:#cbd5e1;">${escapeHTML(g)}</span>`).join('')}
          </div>
          <p class="donghua-desc" style="font-size: 0.8rem; color: #94a3b8; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">${escapeHTML(item.description || '')}</p>
        </div>
      </div>

      <div style="margin-top: 5px; border-top: 1px solid rgba(255,255,255,0.08); padding-top: 10px;">
        <details style="cursor: pointer;">
          <summary style="font-size: 0.85rem; font-weight: 600; color: #fff; display: flex; justify-content: space-between; align-items: center; list-style: none; padding: 5px 0;">
            <span><i class="fa-solid fa-list" style="color: var(--gold); margin-right: 5px;"></i> Daftar Episode Terbaru</span>
            <i class="fa-solid fa-chevron-down" style="font-size: 0.75rem; color: #94a3b8;"></i>
          </summary>
          <div style="display: flex; flex-direction: column; gap: 6px; margin-top: 10px; max-height: 200px; overflow-y: auto; padding-right: 5px;">
            ${item.episodes && item.episodes.length > 0 
              ? item.episodes.map(ep => `
                  <div style="display: flex; justify-content: space-between; align-items: center; background: rgba(255,255,255,0.04); padding: 6px 10px; border-radius: 6px;">
                    <span style="font-size: 0.85rem; color: #e2e8f0;">${escapeHTML(ep.title)}</span>
                    <a href="${escapeHTML(ep.video_url)}" target="_blank" class="btn btn-primary" style="padding: 4px 10px; font-size: 0.75rem; text-decoration: none; border-radius: 4px; display: inline-flex; align-items: center; gap: 4px;">
                      <i class="fa-solid fa-play"></i> Putar
                    </a>
                  </div>
                `).join('')
              : '<span style="font-size: 0.8rem; color: #94a3b8;" class="muted">Belum ada episode.</span>'
            }
          </div>
        </details>
      </div>
    </div>
  `).join("");

  if (paginationNav) {
    let paginationHTML = "";
    for (let i = 1; i <= totalPages; i++) {
      const isActive = i === currentPage;
      paginationHTML += `
        <button onclick="changePage(${i})" class="btn" style="min-width: 40px; padding: 8px 14px; font-weight: bold; ${isActive ? 'background: var(--primary); color: #fff;' : 'background: rgba(255,255,255,0.05); color: #fff; border: 1px solid rgba(255,255,255,0.1);'}">
          ${i}
        </button>
      `;
    }
    paginationNav.innerHTML = paginationHTML;
  }
}

window.changePage = function(page) {
  currentPage = page;
  renderCatalog();
  window.scrollTo({ top: 0, behavior: 'smooth' });
};
