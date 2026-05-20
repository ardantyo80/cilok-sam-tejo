// ========== MOBILE MENU ==========
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

if (hamburger) {
    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });
}

document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
    });
});

// ========== SMOOTH SCROLL ==========
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// ========== CEK RADIUS ==========
const checkRadiusBtn = document.getElementById('checkRadiusBtn');
if (checkRadiusBtn) {
    checkRadiusBtn.addEventListener('click', () => {
        let distance = prompt('Masukkan perkiraan jarak dari stand (dalam KM):');
        if (distance === null) return;
        distance = parseFloat(distance);
        if (isNaN(distance)) {
            alert('Masukkan angka yang valid!');
            return;
        }
        if (distance <= 4) {
            alert('✅ Masih masuk radius antar (3-4 KM)! Lanjutkan order via WhatsApp ya!');
        } else {
            alert('❌ Maaf, jarak Anda di luar radius antar (maksimal 4 KM). Anda bisa ambil langsung di stand atau order via Gojek/Grab.');
        }
    });
}

// ========== TESTIMONIAL SLIDER ==========
const track = document.getElementById('testiTrack');
const slides = document.querySelectorAll('.testi-card');
const prevBtn = document.getElementById('prevTesti');
const nextBtn = document.getElementById('nextTesti');
const dotsContainer = document.getElementById('testiDots');

let testiCurrentIndex = 0;  // ← UBAH: pakai nama beda biar ga konflik
let slideInterval;

function updateSlider() {
    track.style.transform = `translateX(-${testiCurrentIndex * 100}%)`;
    document.querySelectorAll('.dot').forEach((dot, i) => {
        dot.classList.toggle('active', i === testiCurrentIndex);
    });
}

function nextSlide() {
    testiCurrentIndex = (testiCurrentIndex + 1) % slides.length;
    updateSlider();
}

function prevSlide() {
    testiCurrentIndex = (testiCurrentIndex - 1 + slides.length) % slides.length;
    updateSlider();
}

if (slides.length > 0 && dotsContainer) {
    slides.forEach((_, i) => {
        const dot = document.createElement('div');
        dot.classList.add('dot');
        if (i === 0) dot.classList.add('active');
        dot.addEventListener('click', () => {
            testiCurrentIndex = i;
            updateSlider();
            resetInterval();
        });
        dotsContainer.appendChild(dot);
    });

    if (prevBtn) prevBtn.addEventListener('click', () => { prevSlide(); resetInterval(); });
    if (nextBtn) nextBtn.addEventListener('click', () => { nextSlide(); resetInterval(); });

    function startAutoSlide() {
        slideInterval = setInterval(nextSlide, 5000);
    }
    function resetInterval() {
        clearInterval(slideInterval);
        startAutoSlide();
    }
    startAutoSlide();
}

// ========== NAVBAR SHADOW ==========
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.boxShadow = '0 4px 20px rgba(0,0,0,0.1)';
    } else {
        navbar.style.boxShadow = '0 2px 10px rgba(0,0,0,0.05)';
    }
});

// ========== PAPAN PESAN SAM TEJO (SheetDB) ==========
// GANTI DENGAN API URL DARI SHEETDB!
const SHEETDB_API = 'https://sheetdb.io/api/v1/fkq9q7934hka9'; 

// Ambil 5 pesan terbaru
async function fetchMessages() {
    try {
        const response = await fetch(`${SHEETDB_API}?sort=timestamp&order=desc&limit=5`);
        const messages = await response.json();
        
        if (messages && messages.length > 0) {
            displayMessages(messages);
            startVerticalSlider(messages);
        } else {
            const slideContainer = document.getElementById('messageSlide');
            if (slideContainer) slideContainer.innerHTML = '<div class="message-item">✨ Belum ada pesan. Jadilah yang pertama!</div>';
        }
    } catch (error) {
        console.error('Gagal mengambil pesan:', error);
        const slideContainer = document.getElementById('messageSlide');
        if (slideContainer) slideContainer.innerHTML = '<div class="message-item">⚠️ Gagal memuat pesan. Coba lagi nanti.</div>';
    }
}

// Tampilkan pesan di running text
function displayMessages(messages) {
    const container = document.getElementById('messageSlide');
    if (!container) return;
    
    let html = '';
    messages.forEach(msg => {
        const nama = msg.nama || 'Anonymous';
        const pesan = msg.pesan || '';
        const waktu = msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) : '';
        
        html += `
            <div class="message-item">
                <strong>${escapeHtml(nama)}</strong> <span>• ${waktu}</span><br>
                ${escapeHtml(pesan)}
            </div>
        `;
    });
    container.innerHTML = html;
}

// Vertical slider (ganti pesan otomatis tiap 5 detik)
let pesanCurrentIndex = 0;  // ← UBAH: pakai nama beda
let pesanSlideInterval;

function startVerticalSlider(messages) {
    if (pesanSlideInterval) clearInterval(pesanSlideInterval);
    
    const container = document.getElementById('messageSlide');
    if (!container || messages.length <= 1) return;
    
    const items = document.querySelectorAll('.message-item');
    if (items.length === 0) return;
    
    const itemHeight = items[0]?.offsetHeight || 100;
    let index = 0;
    
    pesanSlideInterval = setInterval(() => {
        index = (index + 1) % items.length;
        container.style.transform = `translateY(-${index * itemHeight}px)`;
        container.style.transition = 'transform 0.5s ease-in-out';
    }, 5000);
}

// Kirim pesan baru ke SheetDB
async function submitMessage(nama, pesan) {
    const data = {
        timestamp: new Date().toISOString(),
        nama: nama,
        pesan: pesan
    };
    
    try {
        const response = await fetch(SHEETDB_API, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        
        if (response.ok) {
            return { success: true };
        } else {
            return { success: false, error: 'Gagal mengirim pesan' };
        }
    } catch (error) {
        return { success: false, error: error.message };
    }
}

// Helper: Escape HTML biar aman dari XSS
function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Event listener form pesan
const messageForm = document.getElementById('messageForm');
if (messageForm) {
    messageForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const namaInput = document.getElementById('namaPesan');
        const pesanInput = document.getElementById('isiPesan');
        const statusDiv = document.getElementById('formStatus');
        
        const nama = namaInput.value.trim();
        const pesan = pesanInput.value.trim();
        
        if (!nama || !pesan) {
            statusDiv.innerHTML = '<span class="error">❌ Nama dan pesan tidak boleh kosong!</span>';
            return;
        }
        
        // Disable tombol sambil mengirim
        const submitBtn = messageForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Mengirim...';
        submitBtn.disabled = true;
        
        const result = await submitMessage(nama, pesan);
        
        if (result.success) {
            statusDiv.innerHTML = '<span class="success">✅ Pesan terkirim! Terima kasih sudah berbagi 🙌</span>';
            namaInput.value = '';
            pesanInput.value = '';
            // Refresh pesan setelah 2 detik
            setTimeout(() => {
                fetchMessages();
                statusDiv.innerHTML = '';
            }, 2000);
        } else {
            statusDiv.innerHTML = `<span class="error">❌ Gagal mengirim: ${result.error}</span>`;
        }
        
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        
        // Hilangkan status setelah 5 detik
        setTimeout(() => {
            if (statusDiv.innerHTML !== '') statusDiv.innerHTML = '';
        }, 5000);
    });
}

// Load pesan saat halaman dimuat
fetchMessages();
// Refresh pesan setiap 10 detik
setInterval(fetchMessages, 10000);

console.log('SUKSES');