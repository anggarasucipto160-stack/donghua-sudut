const USERS_KEY = "ds_users_v1";
const SESSION_KEY = "ds_session_v1";

// 1. Definisikan fungsi pembantu ($dan$$) di paling atas
const $ = (s) => document.querySelector(s);  const $$ = (s) => document.querySelectorAll(s);

// Variabel untuk sistem Pagination & Search
let currentPage = 1;
const itemsPerPage = 2; // Jumlah donghua yang tampil per halaman
let searchQuery = ""; // Menyimpan kata kunci pencarian

window.openAccountModal = function() {
  const user = currentSession();
  const content = $("#accountContent");
  if (!user || !content) return;

  content.innerHTML = `
    <div style="text-align: center; padding: 20px;">
      <div style="font-size: 3rem; color: var(--gold); margin-bottom: 10px;">
        <i class="fa-solid fa-user-circle"></i>
      </div>
      <h3 style="margin-bottom: 5px;">${escapeHTML(user.name)}</h3>
      <p class="muted" style="margin-bottom: 15px;">${escapeHTML(user.email)}</p>
      <div style="display: inline-block; background: rgba(255,255,255,0.08); padding: 6px 15px; border-radius: 20px; font-weight: 600;">
        Status: ${user.plan === "vip" ? "👑 VIP Premium" : "Non-VIP"}
      </div>
    </div>
  `;
  
  const modal = $("#accountModal");
  if (modal) modal.classList.add("show");
};

// Daftar Donghua lengkap dengan data Episodes dan poster yang disesuaikan
const DONGHUA_LIST = [
    {
        id: "renegade-immortal",
        title: "Renegade Immortal",
        chineseTitle: "仙逆",
        genre: ["Action", "Adventure", "Fantasy", "Cultivation"],
        status: "Ongoing",
        type : "free",
        rating: 8.8,
        poster: renegade-immortal.jpg",
        description: "Wang Lin memulai perjalanan kultivasinya dari seorang pemuda biasa.",
        episodes: Array.from({ length: 159 }, (_, index) => {
            const epNum = index + 1;
            let url = "https://www.youtube.com/embed/example3";
            if (epNum === 1) url = "https://ok.ru/videoembed/6985057634994";
            if (epNum === 2) url = "https://ok.ru/videoembed/6985605253810";
            if (epNum === 3) url = "https://ok.ru/videoembed/6985967143602";
            if (epNum === 4) url = "https://ok.ru/videoembed/7008755780274";
            if (epNum === 5) url = "https://ok.ru/videoembed/7031128853170";
            if (epNum === 159) url = "https://ok.ru/videoembed/15883837835954";
            return {
                episode_number: epNum,
                title: `Episode ${epNum}`,
                video_url: url
            };
        })
    },
    {
        id: "battle-through-the-heavens",
        title: "BTTH SEASON 5",
        chineseTitle: "斗破苍穹",
        genre: ["Action", "Adventure", "Fantasy", "Martial Arts"],
        status: "Ongoing",
        rating: 8.6,
        type: "free",
        poster: BTTH SESON 5.jpg",
        description: "Xiao Yan kehilangan kekuatannya secara misterius dan melanjutkan perjalanan kultivasinya di musim kelima.",
        episodes: Array.from({ length: 211 }, (_, index) => {
            const epNum = index + 1;
            let url = "https://www.youtube.com/embed/example3";
            if (epNum === 1) {
                url = "https://ok.ru/videoembed/example1";
            } else if (epNum === 211) {
                url = "https://ok.ru/video/15871586470578";
            }
            return {
                episode_number: epNum,
                title: `Episode ${epNum}`,
                video_url: url
            };
        })
    },
    {
        id: "perfect-world",
        title: "Perfect World",
        chineseTitle: "完美世界",
        genre: ["Action", "Adventure", "Fantasy", "Cultivation"],
        status: "Ongoing",
        rating: 8.5,
        type: "free",
        poster: perfect-world.jpg",
        description: "Shi Hao adalah seorang anak berbakat yang tumbuh dalam dunia penuh kekuatan.",
        episodes: Array.from({ length: 288 }, (_, index) => {
            const epNum = index + 1;
            let url = "https://www.youtube.com/embed/example4";
            if (epNum === 288) {
                url = "https://ok.ru/video/15927303408306";
            }
            return {
                episode_number: epNum,
                title: `Episode ${epNum}`,
                video_url: url
            };
        })
    },
    {
        id: "jade-dynasty",
        title: "Jade Dynasty",
        chineseTitle: "诛仙",
        genre: ["Action", "Adventure", "Fantasy", "Romance"],
        status: "Ongoing",
        rating: 8.7,
        type: "free",
        poster:jade-dynasty.jpg",
        description: "Zhang Xiaofan selamat dari pembantaian desanya dan bergabung dengan Sekte Qingyun, memulai takdirnya yang luar biasa.",
        episodes: Array.from({ length: 86 }, (_, index) => {
            const epNum = index + 1;
            let url = "https://www.youtube.com/embed/example5";
            return {
                episode_number: epNum,
                title: `Episode ${epNum}`,
                video_url: url
            };
        })
    },
    {
        id: "swallowed-star",
        title: "Swallowed Star",
        chineseTitle: "吞噬星空",
        genre: ["Action", "Sci-Fi", "Fantasy", "Adventure"],
        status: "Ongoing",
        rating: 8.7,
        type: "free",
        poster: swallowed-star.jpg",
        description: "Luo Feng berjuang di dunia masa depan yang hancur akibat virus misterius dan invasi monster raksasa.",
        episodes: Array.from({ length: 242 }, (_, index) => {
            const epNum = index + 1;
            let url = "https://www.youtube.com/embed/example6";
            return {
                episode_number: epNum,
                title: `Episode ${epNum}`,
                video_url: url
            };
        })
    },
    {
        id: "refining-qi-100000-years",
        title: "100.000 Years of Refining Qi",
        chineseTitle: "炼气十万年",
        genre: ["Action", "Adventure", "Fantasy", "Cultivation", "Comedy"],
        status: "Ongoing",
        rating: 8.4,
        type: "free",
        poster: refining-qi-100000-years.jpg",
        description: "Lu Yang telah berkultivasi dan menyempurnakan Qi selama 100.000 tahun, terjebak di tingkat Qi Refining tanpa bisa naik tingkat, namun memiliki kekuatan yang luar biasa.",
        episodes: Array.from({ length: 379 }, (_, index) => {
            const epNum = index + 1;
            let url = "https://www.youtube.com/embed/example7";
            if (epNum === 379) {
                url = "https://anichin-player.web.id/index.php?video=kI60snDXmDXuKIC66";
            }
            return {
                episode_number: epNum,
                title: `Episode ${epNum}`,
                video_url: url
            };
        })
    },
    {
        id: "shrouding-the-heavens",
        title: "Shrouding the Heavens",
        chineseTitle: "遮天",
        genre: ["Action", "Adventure", "Fantasy", "Sci-Fi", "Cultivation"],
        status: "Ongoing",
        rating: 8.8,
        type: "free",
        poster: shrouding-the-heavens.jpg",
        description: "Ye Fan dan teman-temannya terseret ke dunia lain oleh sembilan naga penarik peti mati misterius, memulai perjalanan kultivasi yang epik di alam semesta yang luas.",
        episodes: Array.from({ length: 182 }, (_, index) => {
            const epNum = index + 1;
            let url = "https://www.youtube.com/embed/example8";
            return {
                episode_number: epNum,
                title: `Episode ${epNum}`,
                video_url: url
            };
        })
    },
    {
        id: "martial-master",
        title: "Martial Master",
        chineseTitle: "武神主宰",
        genre: ["Action", "Adventure", "Fantasy", "Martial Arts", "Cultivation"],
        status: "Ongoing",
        rating: 8.6,
        type: "free",
        poster:martial-master.jpg",
        description: "Qin Chen, seorang ahli martial arts legendaris yang dikhianati dan mati, terlahir kembali di tubuh seorang pemuda untuk membalas dendam dan mencapai puncak kekuatan.",
        episodes: Array.from({ length: 694 }, (_, index) => {
            const epNum = index + 1;
            let url = "https://www.youtube.com/embed/example9";
            return {
                episode_number: epNum,
                title: `Episode ${epNum}`,
                video_url: url
            };
        })
    },
    {
        id: "beyond-times-gaze",
        title: "Beyond Time's Gaze",
        chineseTitle: "光阴之外",
        genre: ["Action", "Adventure", "Fantasy", "Cultivation"],
        status: "Ongoing",
        rating: 8.8,
        type: "free",
        poster:beyond-times-gaze.jpg",
        description: "Sebuah kisah epik kultivasi penuh misteri yang membawa penonton melintasi ruang, waktu, dan takdir dunia fantasi yang luas.",
        episodes: Array.from({ length: 40 }, (_, index) => {
            const epNum = index + 1;
            let url = "https://www.youtube.com/embed/example10";
            if (epNum === 40) {
                url = "https://ok.ru/video/15866866109106";
            }
            return {
                episode_number: epNum,
                title: `Episode ${epNum}`,
                video_url: url
            };
        })
    },
    {
        id: "azure-legacy",
        title: "Azure Legacy",
        chineseTitle: "沧元图",
        genre: ["Action", "Adventure", "Fantasy", "Martial Arts", "Cultivation"],
        status: "Ongoing",
        rating: 8.7,
        type: "free",
        poster:azure-legacy.jpg",
        description: "Meng Chuan bertekad menjadi yang terkuat untuk membalas dendam keluarganya dan melindungi umat manusia dari invasi iblis yang kejam.",
        episodes: Array.from({ length: 95 }, (_, index) => {
            const epNum = index + 1;
            let url = "https://www.youtube.com/embed/example11";
            if (epNum === 95) {
                url = "https://ok.ru/video/15854805519026";
            }
            return {
                episode_number: epNum,
                title: `Episode ${epNum}`,
                video_url: url
            };
        })
    },
    {
        id: "tomb-of-fallen-gods-s3",
        title: "Tomb of Fallen Gods Season 3",
        chineseTitle: "墓王之王 / 神墓",
        genre: ["Action", "Adventure", "Fantasy", "Cultivation"],
        status: "Completed",
        rating: 8.7,
        type: "free",
        poster:tomb-of-fallen-gods-s3.jpg",
        description: "Chen Nan bangkit kembali setelah ribuan tahun di makam para dewa. Musim ketiga ini melanjutkan pertarungan sengit penuh misteri hingga cerita akhirnya telah tamat.",
        episodes: Array.from({ length: 52 }, (_, index) => {
            const epNum = index + 1;
            let url = "https://www.youtube.com/embed/example12";
            return {
                episode_number: epNum,
                title: `Episode ${epNum}`,
                video_url: url
            };
        })
    }
];

function getUsers() {
  try { return JSON.parse(localStorage.getItem(USERS_KEY) || "[]"); }
  catch { return []; }
}
function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}
function getSession() {
  try { return JSON.parse(localStorage.getItem(SESSION_KEY) || "null"); }
  catch { return null; }
}
function setSession(user, remember = true) {
  const data = { id: user.id, name: user.name, email: user.email, plan: user.plan };
  if (remember) localStorage.setItem(SESSION_KEY, JSON.stringify(data));
  else sessionStorage.setItem(SESSION_KEY, JSON.stringify(data));
}
function clearSession() {
  localStorage.removeItem(SESSION_KEY);
  sessionStorage.removeItem(SESSION_KEY);
}
function currentSession() {
  return getSession() || (() => {
    try { return JSON.parse(sessionStorage.getItem(SESSION_KEY) || "null"); } catch { return null; }
  })();
}

function toast(message) {
  const el = $("#toast");               if (!el) return;               el.textContent = message;               el.classList.add("show");               clearTimeout(window.__toast);               window.__toast = setTimeout(() => el.classList.remove("show"), 2800);     }    function switchTab(tab) {               $$(".tab").forEach(b => b.classList.toggle("active", b.dataset.tab === tab));
  if ($("#loginPanel")) $("#loginPanel").classList.toggle("active", tab === "login");
  if ($("#registerPanel")) $("#registerPanel").classList.toggle("active", tab === "register");     }    document.addEventListener("DOMContentLoaded", () => {   $$(".tab").forEach(btn => btn.addEventListener("click", () => switchTab(btn.dataset.tab)));
  $$("[data-switch]").forEach(btn => btn.addEventListener("click", () => switchTab(btn.dataset.switch)));                            $$
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

  // Interaksi tampil/sembunyi instruksi pembayaran berdasarkan pilihan paket
  const planRadios = document.querySelectorAll('input[name="plan"]');
  const vipPaymentSection = document.getElementById('vipPaymentSection');

  planRadios.forEach(radio => {
    radio.addEventListener('change', (e) => {
      if (vipPaymentSection) {
        if (e.target.value === 'vip') {
          vipPaymentSection.classList.remove('hidden');
        } else {
          vipPaymentSection.classList.add('hidden');
        }
      }
    });
  });

  updateAccountUI();
});

// --- LOGIKA PENDAFTARAN & PEMBAYARAN VIP (BCA & GOPAY) ---
const regForm = $("#registerForm");
if (regForm) {
  regForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = $("#regName").value.trim();
    const email = $("#regEmail").value.trim().toLowerCase();
    const password = $("#regPassword").value;
    const planChecked = document.querySelector('input[name="plan"]:checked');
    const plan = planChecked ? planChecked.value : "nonvip";

    if (password.length < 6) return toast("Password minimal 6 karakter.");
    const users = getUsers();
    if (users.some(u => u.email === email)) return toast("Email sudah terdaftar.");

    const userData = {
      id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
      name, email, password, plan,
      createdAt: new Date().toISOString()
    };

    if (plan === 'vip') {
      showVipPaymentModal(userData);
    } else {
      registerUser(userData);
    }
  });
}

function showVipPaymentModal(userData) {
  const modalContent = `
    <div style="text-align: center; margin-bottom: 15px;">
      <h3 style="color: #fff;"><i class="fa-solid fa-crown" style="color: #f1c40f;"></i> Konfirmasi Pembayaran VIP</h3>
      <p class="muted">Total Tagihan: <b style="color: #fff; font-size: 1.1rem;">Rp 20.000</b></p>
    </div>
    
    <div class="payment-box">
      <p style="font-size: 0.85rem; margin-bottom: 8px;">Silakan transfer tepat <b>Rp 20.000</b> ke salah satu rekening berikut:</p>
      
      <div class="payment-channels">
        <div class="payment-channel">
          <b><i class="fa-solid fa-building-columns"></i> BCA</b>
          <span>7112713339</span>
          <small style="display:block; font-size:0.7rem; color:#94a3b8; margin-top:2px;">a.n. DonghuaSudut</small>
        </div>
        <div class="payment-channel">
          <b><i class="fa-brands fa-whatsapp"></i> GoPay</b>
          <span>085119831584</span>
          <small style="display:block; font-size:0.7rem; color:#94a3b8; margin-top:2px;">a.n. DonghuaSudut</small>
        </div>
      </div>
      
      <label style="font-size: 0.85rem; margin-top: 10px; display:block;">Catatan: Setelah transfer, klik tombol di bawah untuk menyelesaikan pendaftaran.</label>
    </div>

    <button class="btn btn-primary full" id="confirmPaymentBtn" style="margin-top: 15px;">
      <i class="fa-solid fa-check"></i> Saya Sudah Transfer Rp 20.000
    </button>
  `;

  const episodeModalContent = document.getElementById('episodeModalContent');
  const episodeModal = document.getElementById('episodeModal');
  
  if (episodeModalContent && episodeModal) {
    episodeModalContent.innerHTML = modalContent;
    episodeModal.classList.add('show');

    const confirmBtn = document.getElementById('confirmPaymentBtn');
    if (confirmBtn) {
      confirmBtn.onclick = function() {
        registerUser(userData);
        episodeModal.classList.remove('show');
        toast('Pembayaran berhasil dikonfirmasi! Akun VIP Anda aktif.');
      };
    }
  }
}

function registerUser(userData) {
  const users = getUsers();
  users.push(userData);
  saveUsers(users);
  setSession(userData, true);
  
  if (regForm) regForm.reset();
  const nonVipInput = document.querySelector('input[name="plan"][value="nonvip"]');
  if (nonVipInput) nonVipInput.checked = true;

  toast(`Akun ${userData.plan === "vip" ? "VIP" : "Non-VIP"} berhasil dibuat.`);
  updateAccountUI();
}

const loginForm = $("#loginForm");
if (loginForm) {
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = $("#loginEmail").value.trim().toLowerCase();
    const password = $("#loginPassword").value;
    const rememberEl = $("#remember");
    const user = getUsers().find(u => u.email === email && u.password === password);

    if (!user) return toast("Email atau password salah.");
    setSession(user, rememberEl ? rememberEl.checked : true);
    loginForm.reset();
    toast(`Selamat datang, ${user.name}!`);
    updateAccountUI();
  });
}

const logoutBtn = $("#logoutBtn");
if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    clearSession();
    updateAccountUI();
    toast("Kamu sudah logout.");
  });
}

// --- LOGIKA MODAL LUPA PASSWORD & VERIFIKASI ---
const forgotBtn = $("#forgotBtn");
const forgotModal = $("#forgotModal");
const forgotModalClose = $("#forgotModalClose");
const forgotStep1Form = $("#forgotStep1Form");
const forgotStep2Form = $("#forgotStep2Form");

let resetUserEmail = "";

if (forgotBtn && forgotModal) {
  forgotBtn.addEventListener("click", () => {
    forgotModal.classList.add("show");
    if (forgotStep1Form) forgotStep1Form.reset();
    if (forgotStep2Form) forgotStep2Form.reset();
    if (forgotStep1Form) forgotStep1Form.classList.remove("hidden");
    if (forgotStep2Form) forgotStep2Form.classList.add("hidden");
  });
}

if (forgotModalClose && forgotModal) {
  forgotModalClose.addEventListener("click", () => {
    forgotModal.classList.remove("show");
  });
}

if (forgotModal) {
  forgotModal.addEventListener("click", (e) => {
    if (e.target.id === "forgotModal") forgotModal.classList.remove("show");
  });
}

if (forgotStep1Form) {
  forgotStep1Form.addEventListener("submit", (e) => {
    e.preventDefault();
    const targetInput = $("#recoveryTarget").value.trim().toLowerCase();
    const verifyMethodRadio = document.querySelector('input[name="verifyMethod"]:checked');
    const method = verifyMethodRadio ? verifyMethodRadio.value : "email";
    
    const users = getUsers();
    const foundUser = users.find(u => u.email === targetInput || u.phone === targetInput || u.email.startsWith(targetInput));

    if (!foundUser) {
      return toast("Akun dengan email/nomor tersebut tidak ditemukan.");
    }

    resetUserEmail = foundUser.email;
    const randomOtp = Math.floor(100000 + Math.random() * 900000).toString();
    window.generatedOtpCache = randomOtp;

    if (method === "whatsapp") {
      toast("Membuka WhatsApp untuk mengirim OTP...");
      let phoneTarget = foundUser.phone ? foundUser.phone.replace(/[^0-9]/g, '') : "628123456789";
      if (phoneTarget.startsWith('0')) {
        phoneTarget = '62' + phoneTarget.slice(1);
      }
      const message = encodeURIComponent(`Halo ${foundUser.name}, kode OTP pemulihan akun Anda adalah: *${randomOtp}*. Berlaku 5 menit.`);
      
      setTimeout(() => {
        window.open(`https://wa.me/${phoneTarget}?text=${message}`, "_blank");
        forgotStep1Form.classList.add("hidden");
        forgotStep2Form.classList.remove("hidden");
      }, 1000);

    } else {
      toast("Mengirim OTP ke Email, mohon tunggu...");

      const templateParams = {
        to_email: foundUser.email,
        to_name: foundUser.name,
        otp_code: randomOtp
      };

      if (typeof emailjs !== 'undefined') {
        emailjs.send('Donghuasudut', 'MASUKKAN_TEMPLATE_ID_ANDA', templateParams)
          .then(() => {
             toast("OTP berhasil dikirim ke Email!");
             forgotStep1Form.classList.add("hidden");
             forgotStep2Form.classList.remove("hidden");
          }, (error) => {
             toast("Gagal mengirim email. Coba lagi.");
             console.error("EmailJS Error:", error);
          });
      } else {
        toast("EmailJS tidak terdeteksi, simulasi OTP: " + randomOtp);
        forgotStep1Form.classList.add("hidden");
        forgotStep2Form.classList.remove("hidden");
      }
    }
  });
}

if (forgotStep2Form) {
  forgotStep2Form.addEventListener("submit", (e) => {
    e.preventDefault();
    const otpVal = $("#otpInput").value.trim();
    const newPassword = $("#newPasswordInput").value;

    const validOtp = window.generatedOtpCache || "123456";
    if (otpVal !== validOtp) {
      return toast("Kode OTP salah!");
    }

    if (newPassword.length < 6) {
      return toast("Password baru minimal 6 karakter.");
    }

    let users = getUsers();
    users = users.map(u => {
      if (u.email === resetUserEmail) {
        u.password = newPassword;
      }
      return u;
    });

    saveUsers(users);
    toast("Password berhasil diubah! Silakan login.");
    
    forgotModal.classList.remove("show");
    forgotStep2Form.reset();
  });
}

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
          <img src="${escapeHTML(item.poster)}" alt="${escapeHTML(item.title)}" loading="lazy" style="width:100%; height:100%; object-fit:cover;" onerror="if(this.src.endsWith('.jpg')){this.src=this.src.replace('.jpg','.png');}else{this.src='https://placehold.co/300x450/1a1a2e/ffffff?text=No+Poster';}">
          <span class="donghua-badge ${escapeHTML(item.type)}" style="position:absolute; top:5px; left:5px; font-size:0.6rem; padding:2px 6px; background:var(--primary); color:#fff; border-radius:4px;">${escapeHTML(item.type.toUpperCase())}</span>
        </div>
        <div style="flex-grow: 1;">
          <div class="donghua-meta" style="display: flex; gap: 10px; font-size: 0.85rem; margin-bottom: 4px;">
            <span><i class="fa-solid fa-star" style="color:var(--gold)"></i> ${escapeHTML(item.rating)}</span>
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
                    <a href="${escapeHTML(ep.video_url)}" target="_blank" class="btn btn-primary" style="padding: 4px 10px; font-size: 0.75rem; text-decoration: none; border-radius: 4px;">
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

const modalClose = $("#modalClose");
if (modalClose) {
  modalClose.addEventListener("click", () => $("#accountModal").classList.remove("show"));
}

const accountModal = $("#accountModal");
if (accountModal) {
  accountModal.addEventListener("click", e => {
    if (e.target.id === "accountModal") accountModal.classList.remove("show");
  });
}

// Tombol Tutup untuk Modal Episode / Pembayaran
const episodeModalClose = $("#episodeModalClose");
if (episodeModalClose) {
  episodeModalClose.addEventListener("click", () => $("#episodeModal").classList.remove("show"));
}

const episodeModal = $("#episodeModal");
if (episodeModal) {
  episodeModal.addEventListener("click", e => {
    if (e.target.id === "episodeModal") episodeModal.classList.remove("show");
  });
}

function updateAccountUI() {
  const user = currentSession();
  const status = $("#accountStatus");
  const logout = $("#logoutBtn");
  const profileBtn = $("#profileBtn");
  const authView = $("#authView");
  const catalogView = $("#catalogView");
  const welcomeText = $("#welcomeUserText");

  if (!user) {
    if (status) status.textContent = "Belum login";
    if (logout) logout.classList.add("hidden");
    if (profileBtn) profileBtn.classList.add("hidden");
    if (authView) authView.classList.remove("hidden");
    if (catalogView) catalogView.classList.add("hidden");
    return;
  }

  if (status) {
    status.innerHTML = user.plan === "vip"
      ? `👑 VIP · ${escapeHTML(user.name)}`
      : `Non-VIP · ${escapeHTML(user.name)}`;
  }
  if (logout) logout.classList.remove("hidden");
  if (profileBtn) profileBtn.classList.remove("hidden");

  if (authView) authView.classList.add("hidden");
  if (catalogView) catalogView.classList.remove("hidden");
  if (welcomeText) {
    welcomeText.textContent = `Halo, ${escapeHTML(user.name)}! Selamat menikmati seluruh tayangan donghua.`;
  }
  
  renderCatalog();
}

function escapeHTML(value) {
  return String(value ?? "").replace(/[&<>"']/g, m => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  }[m]));
}

// Fungsi untuk menyalin teks rekening/gopay ke clipboard
function copyToClipboard(text, successMessage) {
  navigator.clipboard.writeText(text).then(() => {
    toast(successMessage);
  }).catch(err => {
    console.error('Gagal menyalin teks: ', err);
  });
}
