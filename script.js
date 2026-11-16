    const hotels = [
      { id: "babylon", name: "فندق بابل روتانا", area: "الجادرية", category: "فخم", rating: 4.8, reviews: 286, price: 285000, description: "إقامة راقية بإطلالات جميلة على نهر دجلة وخيارات متنوعة للطعام.", image: "photo-1564501049412-61c2a3083791", imagePosition: "center 55%", amenities: ["مسبح", "مطعم", "واي فاي"], query: "Babylon Rotana Baghdad" },
      { id: "baron", name: "فندق البارون", area: "الجادرية", category: "فاخر", rating: 4.7, reviews: 193, price: 265000, description: "أجواء أنيقة وخدمة ضيافة مميزة بالقرب من ضفاف دجلة.", image: "photo-1571896349842-33c89424de2d", imagePosition: "center 55%", amenities: ["سبا", "مطعم", "واي فاي"], query: "The Baron Hotel Baghdad" },
      { id: "mansour", name: "فندق المنصور", area: "المنصور", category: "أعمال", rating: 4.4, reviews: 174, price: 195000, description: "خيار عملي يجمع الراحة والموقع الحيوي في قلب منطقة المنصور.", image: "photo-1542314831-068cd1dbfeeb", imagePosition: "center 55%", amenities: ["مسبح", "مطعم", "مواقف"], query: "Al Mansour Hotel Baghdad" },
      { id: "baghdad-international", name: "فندق بغداد الدولي", area: "السعدون", category: "مدينة", rating: 4.3, reviews: 221, price: 175000, description: "فندق عريق بموقع مركزي قريب من معالم المدينة وأعمالها.", image: "photo-1566073771259-6a8506099945", imagePosition: "center 60%", amenities: ["مسبح", "مطعم", "واي فاي"], query: "Baghdad International Hotel" },
      { id: "noor-land", name: "فندق نور لاند", area: "زيونة", category: "عائلي", rating: 4.6, reviews: 138, price: 145000, description: "غرف مريحة وأجواء هادئة تناسب رحلات العائلة والعمل.", image: "photo-1611892440504-42a792e24d32", imagePosition: "center 55%", amenities: ["مطعم", "واي فاي", "مواقف"], query: "Noor Land Hotel Baghdad" },
      { id: "coral", name: "فندق كورال بغداد", area: "الجادرية", category: "أعمال", rating: 4.5, reviews: 157, price: 210000, description: "إقامة عصرية وخدمات متكاملة في موقع هادئ قريب من دجلة.", image: "photo-1578683010236-d716f9a3f461", imagePosition: "center 54%", amenities: ["سبا", "مطعم", "واي فاي"], query: "Coral Baghdad Hotel" }
    ];

    const grid = document.getElementById("hotel-grid");
    const filters = document.getElementById("area-filters");
    const searchInput = document.getElementById("hotel-search");
    const ratingInput = document.getElementById("min-rating");
    const sortInput = document.getElementById("sort-hotels");
    const favoritesOnly = document.getElementById("favorites-toggle");
    const savedHotels = new Set();
    let activeArea = "الكل";
    let showFavorites = false;
    let selectedHotel = null;

    const pinIcon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/></svg>';
    const starIcon = '<svg viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.4"><path d="m12 3 2.7 5.5 6.1.9-4.4 4.3 1 6.1-5.4-2.9-5.4 2.9 1-6.1-4.4-4.3 6.1-.9L12 3Z"/></svg>';
    const amenitiesIcons = {
      "مسبح": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 16c2.2 0 2.2 2 4.5 2s2.3-2 4.5-2 2.3 2 4.5 2 2.3-2 4.5-2M3 21c2.2 0 2.2-2 4.5-2s2.3 2 4.5 2 2.3-2 4.5-2 2.3 2 4.5 2M8 14V5a2 2 0 0 1 4 0v9m-4-5h4m4 5V8h4v6"/></svg>',
      "مطعم": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M7 3v7m-3-7v4a3 3 0 0 0 6 0V3m-3 7v11m10-18v18m0-18c3 2 3 5 0 8"/></svg>',
      "واي فاي": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 9a14 14 0 0 1 18 0M6 12a9 9 0 0 1 12 0m-9 3a4 4 0 0 1 6 0m-3 4h.01"/></svg>',
      "سبا": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 21c-4-3-7-6-7-10a4 4 0 0 1 7-2 4 4 0 0 1 7 2c0 4-3 7-7 10ZM12 3v3m-7 1-2-2m16 2 2-2"/></svg>',
      "مواقف": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M5 21V3h8a5 5 0 0 1 0 10H5m0-5h8"/></svg>'
    };

    function renderFilters() {
      const areas = ["الكل", ...new Set(hotels.map(hotel => hotel.area))];
      filters.innerHTML = areas.map(area => `<button class="chip${activeArea === area ? " active" : ""}" type="button" data-area="${area}" aria-pressed="${activeArea === area}">${area}</button>`).join("");
    }

    function renderHotels() {
      let results = hotels.filter(hotel => {
        const query = searchInput.value.trim().toLocaleLowerCase("ar");
        const matchesQuery = !query || `${hotel.name} ${hotel.area} ${hotel.category}`.toLocaleLowerCase("ar").includes(query);
        return matchesQuery && (activeArea === "الكل" || hotel.area === activeArea)
          && hotel.rating >= Number(ratingInput.value)
          && (!showFavorites || savedHotels.has(hotel.id));
      });

      if (sortInput.value === "rating") results.sort((a, b) => b.rating - a.rating);
      if (sortInput.value === "price") results.sort((a, b) => a.price - b.price);

      if (!results.length) {
        grid.innerHTML = `<div class="empty-state"><strong>${showFavorites ? "لا توجد فنادق في مفضلتك بعد" : "لم نعثر على إقامة مطابقة"}</strong><span>${showFavorites ? "أضف فندقاً إلى قائمتك بالضغط على رمز القلب." : "جرّب تغيير كلمات البحث أو خيارات التصفية."}</span></div>`;
        return;
      }

      grid.innerHTML = results.map(hotel => `
        <article class="hotel-card">
          <div class="hotel-photo">
            <img src="https://images.unsplash.com/${hotel.image}?auto=format&fit=crop&w=900&q=82" alt="إقامة فندقية في ${hotel.name}" style="object-position:${hotel.imagePosition}" loading="lazy">
            <span class="photo-tag">${hotel.category}</span>
            <button class="favorite${savedHotels.has(hotel.id) ? " is-saved" : ""}" type="button" data-favorite="${hotel.id}" aria-label="${savedHotels.has(hotel.id) ? "إزالة من" : "إضافة إلى"} المفضلة" aria-pressed="${savedHotels.has(hotel.id)}"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M20.8 8.8c0 5.2-8.8 10.1-8.8 10.1S3.2 14 3.2 8.8A4.4 4.4 0 0 1 12 6.7a4.4 4.4 0 0 1 8.8 2.1Z"/></svg></button>
          </div>
          <div class="hotel-info">
            <div class="location-line">${pinIcon}<span>بغداد، ${hotel.area}</span></div>
            <div class="hotel-title-line"><h3>${hotel.name}</h3><span class="rating">${starIcon}${hotel.rating.toFixed(1)} <span style="color:#90948e;font-weight:400">(${hotel.reviews})</span></span></div>
            <p class="hotel-description">${hotel.description}</p>
            <div class="amenities">${hotel.amenities.map(item => `<span class="amenity">${amenitiesIcons[item]}${item}</span>`).join("")}</div>
            <div class="card-bottom">
              <span class="price">السعر لليلة الواحدة<strong>${hotel.price.toLocaleString("en-US")} <span>د.ع</span></strong></span>
              <div class="card-actions">
                <a class="map-link" href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(hotel.query)}" target="_blank" rel="noopener noreferrer">الموقع</a>
                <button class="book-button" type="button" data-book="${hotel.id}">احجز الآن</button>
              </div>
            </div>
          </div>
        </article>`).join("");
    }

    filters.addEventListener("click", event => {
      const button = event.target.closest("[data-area]");
      if (!button) return;
      activeArea = button.dataset.area;
      renderFilters();
      renderHotels();
    });

    grid.addEventListener("click", event => {
      const favoriteButton = event.target.closest("[data-favorite]");
      if (favoriteButton) {
        const id = favoriteButton.dataset.favorite;
        if (savedHotels.has(id)) savedHotels.delete(id);
        else savedHotels.add(id);
        renderHotels();
        return;
      }
      const bookButton = event.target.closest("[data-book]");
      if (bookButton) openBooking(bookButton.dataset.book);
    });

    document.getElementById("search-form").addEventListener("submit", event => {
      event.preventDefault();
      renderHotels();
      document.getElementById("hotels").scrollIntoView({ behavior: "smooth" });
    });
    searchInput.addEventListener("input", renderHotels);
    ratingInput.addEventListener("change", renderHotels);
    sortInput.addEventListener("change", renderHotels);
    favoritesOnly.addEventListener("click", () => {
      showFavorites = !showFavorites;
      favoritesOnly.setAttribute("aria-pressed", String(showFavorites));
      favoritesOnly.querySelector("span").textContent = showFavorites ? "كل الفنادق" : "المفضلة";
      renderHotels();
      document.getElementById("hotels").scrollIntoView({ behavior: "smooth" });
    });

    const backdrop = document.getElementById("booking-backdrop");
    const bookingForm = document.getElementById("booking-form");
    const bookingMessage = document.getElementById("booking-message");
    function openBooking(id) {
      selectedHotel = hotels.find(hotel => hotel.id === id);
      document.getElementById("booking-hotel-name").textContent = selectedHotel.name;
      document.getElementById("booking-title").textContent = "اطلب حجزك";
      document.getElementById("booking-arrival").value = document.getElementById("checkin").value;
      bookingMessage.classList.remove("visible");
      backdrop.classList.add("open");
      document.querySelector(".booking-form input[name='name']").focus();
    }
    function closeBooking() {
      backdrop.classList.remove("open");
      selectedHotel = null;
    }
    document.getElementById("modal-close").addEventListener("click", closeBooking);
    backdrop.addEventListener("click", event => {
      if (event.target === backdrop) closeBooking();
    });
    document.addEventListener("keydown", event => {
      if (event.key === "Escape" && backdrop.classList.contains("open")) closeBooking();
    });
    bookingForm.addEventListener("submit", event => {
      event.preventDefault();
      if (!bookingForm.reportValidity() || !selectedHotel) return;
      const name = new FormData(bookingForm).get("name");
      bookingMessage.textContent = `شكراً ${name}، استلمنا طلبك لفندق ${selectedHotel.name}. هذا نموذج تجريبي؛ يرجى التواصل مع الفندق لتأكيد الحجز.`;
      bookingMessage.classList.add("visible");
      document.getElementById("booking-title").textContent = "تم استلام طلبك";
    });

    const today = new Date();
    const localDate = new Date(today.getTime() - today.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
    document.getElementById("checkin").min = localDate;
    document.getElementById("booking-arrival").min = localDate;
    renderFilters();
    renderHotels();
