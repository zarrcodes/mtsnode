async function apiGet(path) {
    const res = await fetch(API_BASE + path);
    const json = await res.json();
    if (json.error) throw new Error(json.error);
    return json;
}

document.addEventListener("DOMContentLoaded", async function() {



    // ==========================================
    // 2. MOBILE MENU TOGGLE
    // ==========================================
    const menuToggle = document.getElementById("menuToggle");
    const navMenu = document.getElementById("navMenu");
    if (menuToggle && navMenu) {
        menuToggle.addEventListener("click", function() {
            navMenu.classList.toggle("show");
        });
    }

    // ==========================================
    // 3. BANNER SWIPER SLIDER
    // ==========================================
    if (document.querySelector(".mySwiper")) {
        try {
            new Swiper(".mySwiper", {
                slidesPerView: 1,
                spaceBetween: 0,
                loop: true,
                grabCursor: true,
                autoplay: {
                    delay: 3500,
                    disableOnInteraction: false,
                },
                pagination: {
                    el: ".swiper-pagination",
                    clickable: true,
                },
                navigation: {
                    nextEl: ".swiper-button-next",
                    prevEl: ".swiper-button-prev",
                },
            });
        } catch(e) { console.log("Swiper load error:", e); }
    }

    // ELEMEN DOM
    const artikelGridIndex = document.getElementById("artikelGrid");
    const artikelFullContentCheck = document.getElementById("artikelFullContent");

    // ==========================================
    // 4. LOGIKA UNTUK INDEX.HTML (TAMPIL 5 ARTIKEL TERBARU)
    // ==========================================
    if (artikelGridIndex && !artikelFullContentCheck) {
        try {
            const json = await apiGet('/api/berita?limit=5&page=1');
            const beritaList = json.data;

            artikelGridIndex.innerHTML = "";

            if (!beritaList || beritaList.length === 0) {
                artikelGridIndex.innerHTML = "<p style='grid-column: 1 / -1; text-align:center;'>Belum ada artikel diterbitkan.</p>";
            } else {
                beritaList.forEach(post => {
                    const card = document.createElement("a");
                    card.href = "artikel.html?id=" + post.id; 
                    card.className = "artikel-card";

                    let imgSrc = post.gambar_url && post.gambar_url.trim() !== "" 
                                 ? post.gambar_url 
                                 : "assets/banner.png";

                    card.innerHTML = `
                        <div class="artikel-img-box">
                            <img src="${imgSrc}" alt="${post.judul}" class="artikel-img">
                        </div>
                        <div class="artikel-content">
                            <div class="artikel-meta-box">${post.tanggal}</div>
                            <h3 class="artikel-judul">${post.judul}</h3>
                        </div>
                    `;
                    artikelGridIndex.appendChild(card);
                });

                const existingBtn = document.querySelector(".btn-lihat-semua-container");
                if (!existingBtn) {
                    const btnBox = document.createElement("div");
                    btnBox.className = "btn-lihat-semua-container";
                    btnBox.style.gridColumn = "1 / -1"; 
                    btnBox.style.textAlign = "center";
                    btnBox.style.marginTop = "20px";
                    btnBox.innerHTML = `
                        <a href="artikel.html" class="btn-lihat-semua" style="display:inline-block; padding:12px 25px; background: #0b3663; color:#fff; text-decoration:none; border-radius:8px; font-weight:700;">Lihat Semua Artikel &rarr;</a>
                    `;
                    artikelGridIndex.after(btnBox);
                }
            }
        } catch (err) {
            console.error("Gagal memuat berita:", err);
            artikelGridIndex.innerHTML = "<p style='color:red; grid-column: 1 / -1; text-align:center;'>Gagal memuat artikel dari database.</p>";
        }
    }

    // ==========================================
    // 5. LOGIKA UNTUK ARTIKEL.HTML (DETAIL / ALL + PAGINATION 5)
    // ==========================================
    if (artikelFullContentCheck) {
        const urlParams = new URLSearchParams(window.location.search);
        const artikelId = urlParams.get('id');
        const currentPage = parseInt(urlParams.get('page')) || 1;
        const itemsPerPage = 5;

        if (artikelId) {
            try {
                const json = await apiGet('/api/berita/' + artikelId);
                const post = json.data;

                if (!post) {
                    artikelFullContentCheck.innerHTML = "<p style='text-align:center; color:red; padding: 50px 0;'>Artikel tidak ditemukan atau telah dihapus.</p>";
                    return;
                }

                let gambarHTML = "";
                if (post.gambar_url && post.gambar_url.trim() !== "") {
                    gambarHTML = `<img src="${post.gambar_url}" alt="${post.judul}" class="artikel-detail-img">`;
                }

                artikelFullContentCheck.innerHTML = `
                    <div class="artikel-header-box">
                        <h1 class="artikel-detail-judul">${post.judul}</h1>
                        <div class="artikel-detail-meta">
                            Diposting pada: ${post.tanggal} | Oleh: ${post.penulis || 'MTs Muhammadiyah Martapura'}
                        </div>
                    </div>
                    ${gambarHTML}
                    <div class="artikel-detail-isi">${post.isi}</div>
                `;
                document.title = post.judul + " - MTs Muhammadiyah Martapura";

                const artikelGridLainnya = document.getElementById("artikelGrid");
                if (artikelGridLainnya) {
                    const jsonLain = await apiGet('/api/berita?limit=6&page=1');
                    const beritaLain = jsonLain.data.filter(item => String(item.id) !== String(artikelId)).slice(0, 5);

                    if (beritaLain && beritaLain.length > 0) {
                        artikelGridLainnya.innerHTML = "";
                        beritaLain.forEach(item => {
                            const card = document.createElement("a");
                            card.href = "artikel.html?id=" + item.id;
                            card.className = "artikel-card";
                            let imgSrc = item.gambar_url && item.gambar_url.trim() !== "" ? item.gambar_url : "assets/banner.png";

                            card.innerHTML = `
                                <div class="artikel-img-box"><img src="${imgSrc}" class="artikel-img"></div>
                                <div class="artikel-content">
                                    <div class="artikel-meta-box">${item.tanggal}</div>
                                    <h3 class="artikel-judul">${item.judul}</h3>
                                </div>
                            `;
                            artikelGridLainnya.appendChild(card);
                        });
                    }
                }
            } catch (err) {
                console.error("Error detail artikel:", err);
            }
        } else {
            artikelFullContentCheck.style.display = "none";
            
            const sectionLainnya = document.querySelector(".post-lainnya-section");
            if (sectionLainnya) {
                const heading = sectionLainnya.querySelector(".section-heading-news");
                if (heading) heading.innerText = "SEMUA ARTIKEL";
            }

            const artikelGridAll = document.getElementById("artikelGrid");
            if (artikelGridAll) {
                try {
                    const json = await apiGet('/api/berita?limit=' + itemsPerPage + '&page=' + currentPage);
                    const semuaBerita = json.data;
                    const count = json.total;

                    artikelGridAll.innerHTML = "";

                    if (!semuaBerita || semuaBerita.length === 0) {
                        artikelGridAll.innerHTML = "<p style='grid-column: 1 / -1; text-align:center; padding:50px 0;'>Belum ada artikel diterbitkan.</p>";
                    } else {
                        semuaBerita.forEach(item => {
                            const card = document.createElement("a");
                            card.href = "artikel.html?id=" + item.id;
                            card.className = "artikel-card";
                            let imgSrc = item.gambar_url && item.gambar_url.trim() !== "" ? item.gambar_url : "assets/banner.png";

                            card.innerHTML = `
                                <div class="artikel-img-box"><img src="${imgSrc}" class="artikel-img"></div>
                                <div class="artikel-content">
                                    <div class="artikel-meta-box">${item.tanggal}</div>
                                    <h3 class="artikel-judul">${item.judul}</h3>
                                </div>
                            `;
                            artikelGridAll.appendChild(card);
                        });

                        const totalPages = Math.ceil(count / itemsPerPage);
                        if (totalPages > 1) {
                            let paginationBox = document.getElementById("paginationBox");
                            if (!paginationBox) {
                                paginationBox = document.createElement("div");
                                paginationBox.id = "paginationBox";
                                paginationBox.className = "pagination-container";
                                paginationBox.style.gridColumn = "1 / -1";
                                paginationBox.style.display = "flex";
                                paginationBox.style.justifyContent = "center";
                                paginationBox.style.gap = "10px";
                                paginationBox.style.marginTop = "30px";
                                artikelGridAll.after(paginationBox);
                            }

                            paginationBox.innerHTML = "";
                            for (let i = 1; i <= totalPages; i++) {
                                const pageBtn = document.createElement("a");
                                pageBtn.href = "artikel.html?page=" + i;
                                pageBtn.innerText = i;
                                
                                pageBtn.style.padding = "8px 16px";
                                pageBtn.style.borderRadius = "6px";
                                pageBtn.style.textDecoration = "none";
                                pageBtn.style.fontWeight = "700";
                                
                                if (i === currentPage) {
                                    pageBtn.style.background = "#0b3663";
                                    pageBtn.style.color = "#ffffff";
                                } else {
                                    pageBtn.style.background = "#f1f5f9";
                                    pageBtn.style.color = "#334155";
                                    pageBtn.style.border = "1px solid #cbd5e1";
                                }
                                paginationBox.appendChild(pageBtn);
                            }
                        }
                    }
                } catch (err) {
                    console.error("Gagal memuat semua artikel:", err);
                    artikelGridAll.innerHTML = "<p style='color:red; grid-column: 1 / -1; text-align:center;'>Gagal memuat daftar artikel.</p>";
                }
            }
        }
    }
});
