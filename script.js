document.addEventListener('DOMContentLoaded', () => {
    // تمرير سلس للروابط الداخلية
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const target = document.querySelector(this.getAttribute('href'));
            if (!target) return;
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    });

    initActiveNav();
    initBackToTop();
    initInteractiveTimeline();

    // تغيير الصورة تلقائياً في البطاقة الرئيسية
    const heroImage = document.querySelector('.hero-image img');
    if (heroImage) {
        const galleryImages = [
            'imige/hamed bin ali.jpeg',
            'imige/hamed bin ali 2.jpg',
            'https://img.youtube.com/vi/0GFoyEXJVps/hqdefault.jpg'
        ];
        
        let currentImageIndex = 0;
        
        // تغيير الصورة كل 5 ثواني
        setInterval(() => {
            currentImageIndex = (currentImageIndex + 1) % galleryImages.length;
            
            // إضافة تأثير التلاشي عند تغيير الصورة
            heroImage.style.opacity = '0';
            
            setTimeout(() => {
                heroImage.src = galleryImages[currentImageIndex];
                heroImage.style.opacity = '1';
            }, 500);
        }, 5000);

        // إضافة تأثير انتقالي للصورة
        heroImage.style.transition = 'opacity 0.5s ease-in-out';
    }

    // تحريك القائمة عند التمرير
    let lastScroll = 0;
    const header = document.querySelector('.main-header');
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll <= 0) {
            header.classList.remove('scroll-up');
            return;
        }
        
        if (currentScroll > lastScroll && !header.classList.contains('scroll-down')) {
            header.classList.remove('scroll-up');
            header.classList.add('scroll-down');
        } else if (currentScroll < lastScroll && header.classList.contains('scroll-down')) {
            header.classList.remove('scroll-down');
            header.classList.add('scroll-up');
        }
        lastScroll = currentScroll;
    });

    // تحميل الاقتباسات بشكل عشوائي
    const quotes = [
        "مـن سـناء الـبرق اكـتبـها الـقصـيده ومـن بحور الشعر تخرج جوهره",
        "ومـن خـيوط الـليـل انـسجـها فـريده وأعــجن الــكلـمه بـماء الـكوثـره",
        "والـقمـر قـرطـاسـتى البيضا الوحيده وريشتى طرف العوالى السمهره",
        "يــا جـمال الـكون وصـفى لـك اكـيده انــته نــبراس الــجمـال ومـنبـره",
        "يا راكب الخيل العتاق الأصيلة في ميدان المجد والبطولة",
        "أنت الفارس الشجاع المقدام في كل معركة وأنت قوام",
        "الحكمة نور يضيء الطريق والعقل رائد في كل شيء",
        "عمان الحبيبة أرض الأجداد فيها العز والفخر والاعتزاز"
    ];

    const quoteElement = document.querySelector('.poetry-quote blockquote');
    if (quoteElement) {
        const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
        quoteElement.textContent = randomQuote;
    }

    // إضافة وظائف القائمة المنسدلة
    const navToggle = document.querySelector('.nav-toggle');
    const mainHeader = document.querySelector('.main-header');
    const navLinks = document.querySelectorAll('.nav-menu a');

    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        mainHeader.classList.toggle('active');
    });

    // إغلاق القائمة عند النقر على أي رابط
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            mainHeader.classList.remove('active');
        });
    });

    // إغلاق القائمة عند النقر خارجها
    document.addEventListener('click', (e) => {
        if (!mainHeader.contains(e.target) && !navToggle.contains(e.target) && mainHeader.classList.contains('active')) {
            navToggle.classList.remove('active');
            mainHeader.classList.remove('active');
        }
    });
});

// تفعيل معرض الصور
document.addEventListener('DOMContentLoaded', function() {
    const galleryPage = document.querySelector('.gallery-page');
    if (!galleryPage) return;

    const galleryItems = galleryPage.querySelectorAll('.gallery-item');
    const lightbox = galleryPage.querySelector('.gallery-lightbox');
    if (!galleryItems.length || !lightbox) return;

    const lightboxImage = lightbox.querySelector('.lightbox-image');
    const lightboxCaption = lightbox.querySelector('.lightbox-caption');
    const closeLightbox = lightbox.querySelector('.close-lightbox');
    const prevButton = lightbox.querySelector('.prev-image');
    const nextButton = lightbox.querySelector('.next-image');
    let currentImageIndex = 0;

    function getVisibleItems() {
        return Array.from(galleryItems).filter(item => {
            const style = window.getComputedStyle(item);
            return style.display !== 'none' && item.offsetParent !== null;
        });
    }

    function openLightbox(item) {
        const visible = getVisibleItems();
        currentImageIndex = Math.max(0, visible.indexOf(item));
        if (currentImageIndex < 0) currentImageIndex = 0;
        updateLightboxImage();
        lightbox.classList.add('active');
        lightbox.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }

    function closeLightboxFn() {
        lightbox.classList.remove('active');
        lightbox.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }

    function updateLightboxImage() {
        const visible = getVisibleItems();
        if (!visible.length) return;

        if (currentImageIndex >= visible.length) currentImageIndex = 0;
        if (currentImageIndex < 0) currentImageIndex = visible.length - 1;

        const currentItem = visible[currentImageIndex];
        const image = currentItem.querySelector('img');
        const title = currentItem.querySelector('.image-title')?.textContent || '';
        const description = currentItem.querySelector('.image-description')?.textContent || '';

        lightboxImage.src = image.currentSrc || image.src;
        lightboxImage.alt = image.alt || title;
        lightboxCaption.textContent = description ? `${title} - ${description}` : title;
    }

    galleryItems.forEach((item) => {
        item.addEventListener('click', () => openLightbox(item));
        item.setAttribute('role', 'button');
        item.setAttribute('tabindex', '0');
        item.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                openLightbox(item);
            }
        });
    });

    if (closeLightbox) {
        closeLightbox.addEventListener('click', (e) => {
            e.stopPropagation();
            closeLightboxFn();
        });
    }

    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightboxFn();
    });

    if (prevButton) {
        prevButton.addEventListener('click', (e) => {
            e.stopPropagation();
            const visible = getVisibleItems();
            if (!visible.length) return;
            currentImageIndex = (currentImageIndex - 1 + visible.length) % visible.length;
            updateLightboxImage();
        });
    }

    if (nextButton) {
        nextButton.addEventListener('click', (e) => {
            e.stopPropagation();
            const visible = getVisibleItems();
            if (!visible.length) return;
            currentImageIndex = (currentImageIndex + 1) % visible.length;
            updateLightboxImage();
        });
    }

    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;
        if (e.key === 'Escape') closeLightboxFn();
        if (e.key === 'ArrowLeft') prevButton?.click();
        if (e.key === 'ArrowRight') nextButton?.click();
    });
});

// تفعيل البحث وفلترة القصص
document.addEventListener('DOMContentLoaded', function() {
    const storiesPage = document.querySelector('.stories-page');
    if (!storiesPage) return;

    const categoryButtons = storiesPage.querySelectorAll('.category-btn');
    const storyCards = storiesPage.querySelectorAll('.story-card');
    const searchInput = storiesPage.querySelector('#stories-search-input');
    const clearBtn = storiesPage.querySelector('.search-clear-btn');
    const resultsCount = storiesPage.querySelector('#stories-search-count');
    const noResults = storiesPage.querySelector('#stories-no-results');

    let activeCategory = 'all';

    const categoryLabels = {
        all: 'الكل',
        horsemanship: 'الفروسية',
        archery: 'الرماية'
    };

    function normalizeArabic(text) {
        return text
            .replace(/[\u064B-\u065F\u0670]/g, '')
            .replace(/[إأآٱا]/g, 'ا')
            .replace(/ى/g, 'ي')
            .replace(/ة/g, 'ه')
            .replace(/\s+/g, ' ')
            .trim()
            .toLowerCase();
    }

    function getStorySearchText(card) {
        const title = card.querySelector('.story-header h3')?.textContent || '';
        const content = card.querySelector('.story-content')?.textContent || '';
        const category = card.querySelector('.story-category')?.textContent || '';
        const date = card.querySelector('.story-date')?.textContent || '';
        return normalizeArabic(`${title} ${content} ${category} ${date}`);
    }

    function storyMatchesSearch(card, query) {
        if (!query) return true;
        const terms = normalizeArabic(query).split(/\s+/).filter(Boolean);
        const haystack = getStorySearchText(card);
        return terms.every(term => haystack.includes(term));
    }

    function updateStoriesView() {
        const query = searchInput?.value.trim() || '';
        let visibleCount = 0;

        storyCards.forEach(card => {
            const categoryMatch = activeCategory === 'all' || card.getAttribute('data-category') === activeCategory;
            const searchMatch = storyMatchesSearch(card, query);
            const show = categoryMatch && searchMatch;

            card.style.display = show ? '' : 'none';
            if (show) visibleCount += 1;
        });

        if (clearBtn) {
            clearBtn.hidden = !query;
        }

        if (resultsCount) {
            const hasFilter = query || activeCategory !== 'all';
            if (hasFilter) {
                const categoryText = activeCategory !== 'all'
                    ? ` — تصنيف: ${categoryLabels[activeCategory] || ''}`
                    : '';
                resultsCount.textContent = visibleCount
                    ? `عُثر على ${visibleCount} ${visibleCount === 1 ? 'قصة' : 'قصص'}${categoryText}`
                    : `لا توجد نتائج مطابقة${categoryText}`;
            } else {
                resultsCount.textContent = '';
            }
        }

        if (noResults) {
            noResults.hidden = visibleCount > 0;
        }
    }

    categoryButtons.forEach(button => {
        button.addEventListener('click', () => {
            activeCategory = button.getAttribute('data-filter') || 'all';

            categoryButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            updateStoriesView();
        });
    });

    if (searchInput) {
        searchInput.addEventListener('input', updateStoriesView);
    }

    if (clearBtn && searchInput) {
        clearBtn.addEventListener('click', () => {
            searchInput.value = '';
            searchInput.focus();
            updateStoriesView();
        });
    }

    updateStoriesView();
});

// تفعيل فلترة الصور
document.addEventListener('DOMContentLoaded', function() {
    const galleryPage = document.querySelector('.gallery-page');
    if (!galleryPage) return;

    const filterButtons = galleryPage.querySelectorAll('.filter-btn');
    const galleryItems = galleryPage.querySelectorAll('.gallery-item');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const filter = button.getAttribute('data-filter');
            
            // تحديث الزر النشط
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            // فلترة الصور
            galleryItems.forEach(item => {
                if (filter === 'all' || item.getAttribute('data-category') === filter) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });
});

// وظيفة تحديث عداد المشاركين
function updateParticipantsCounter(count) {
    const counterElement = document.querySelector('.counter-number');
    if (counterElement) {
        // تحويل الرقم إلى النظام العربي
        const arabicNumber = count.toLocaleString('ar-SA');
        counterElement.textContent = arabicNumber;
        
        // تخزين العدد في localStorage
        localStorage.setItem('participantsCount', count.toString());
        
        // إضافة تأثير حركي
        counterElement.classList.add('counter-animation');
        setTimeout(() => {
            counterElement.classList.remove('counter-animation');
        }, 1000);
    }
}

// تفعيل مشاركة الدعاء
document.addEventListener('DOMContentLoaded', function() {
    const sharePrayer = document.querySelector('.share-prayer');
    const joinPrayer = document.querySelector('.join-prayer');
    
    // تهيئة عداد المشاركين ليبدأ من 8
    let participantsCount = 8;
    updateParticipantsCounter(participantsCount);

    if (sharePrayer) {
        sharePrayer.addEventListener('click', async () => {
            try {
                await navigator.share({
                    title: 'دعاء للشيخ حمد بن علي الغافري',
                    text: document.querySelector('.prayer-text').textContent
                });
            } catch (err) {
                console.log('Error sharing:', err);
            }
        });
    }

    if (joinPrayer) {
        joinPrayer.addEventListener('click', () => {
            participantsCount++;
            updateParticipantsCounter(participantsCount);
        });
    }
});

// تفعيل نموذج الدعاء
document.addEventListener('DOMContentLoaded', function() {
    const prayerForm = document.querySelector('.prayer-form');
    const prayersGrid = document.querySelector('.prayers-grid');

    if (prayerForm) {
        prayerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const name = document.getElementById('name').value || 'زائر كريم';
            const prayer = document.getElementById('prayer').value;
            
            if (prayer.trim()) {
                // إنشاء معرف فريد للدعاء
                const prayerId = Date.now();
                
                // إنشاء بطاقة دعاء جديدة
                const newPrayer = document.createElement('div');
                newPrayer.className = 'recent-prayer-card';
                newPrayer.dataset.prayerId = prayerId;
                newPrayer.innerHTML = `
                    <div class="prayer-meta">
                        <span><i class="fas fa-user"></i> ${name}</span>
                        <span><i class="far fa-clock"></i> الآن</span>
                    </div>
                    <div class="prayer-message">
                        ${prayer}
                    </div>
                    <div class="prayer-actions">
                        <button><i class="fas fa-heart"></i> آمين</button>
                        <button><i class="fas fa-share"></i> مشاركة</button>
                    </div>
                `;
                
                // إضافة البطاقة إلى بداية القائمة
                if (prayersGrid.firstChild) {
                    prayersGrid.insertBefore(newPrayer, prayersGrid.firstChild);
                } else {
                    prayersGrid.appendChild(newPrayer);
                }
                
                // زيادة عدد المشاركين
                let currentCount = parseInt(localStorage.getItem('participantsCount') || '8');
                currentCount++;
                updateParticipantsCounter(currentCount);
                
                // مسح النموذج
                prayerForm.reset();

                // إضافة مستمعي الأحداث للأزرار الجديدة
                attachButtonListeners(newPrayer);
            }
        });
    }
});

// إضافة مستمعي الأحداث للأزرار
function attachButtonListeners(prayerCard) {
    // زر آمين
    const ameenButton = prayerCard.querySelector('.prayer-actions button:first-child');
    ameenButton.addEventListener('click', function() {
        if (!this.classList.contains('active')) {
            this.classList.add('active');
            this.innerHTML = '<i class="fas fa-heart"></i> تم قول آمين';

            const heart = document.createElement('span');
            heart.className = 'floating-heart';
            heart.innerHTML = '❤️';
            prayerCard.appendChild(heart);

            setTimeout(() => {
                heart.remove();
            }, 1000);
        }
    });

    // زر المشاركة
    const shareButton = prayerCard.querySelector('.prayer-actions button:last-child');
    shareButton.addEventListener('click', async function() {
        const prayerText = prayerCard.querySelector('.prayer-message').textContent;
        const shareText = `دعاء للشيخ حمد بن علي الغافري:\n${prayerText}\n\nموقع الشيخ حمد بن علي الغافري`;

        try {
            if (navigator.share) {
                await navigator.share({
                    title: 'دعاء للشيخ حمد بن علي الغافري',
                    text: shareText
                });
            } else {
                await navigator.clipboard.writeText(shareText);
                const originalText = this.innerHTML;
                this.innerHTML = '<i class="fas fa-check"></i> تم النسخ';
                setTimeout(() => {
                    this.innerHTML = originalText;
                }, 2000);
            }
        } catch (err) {
            console.log('Error sharing:', err);
        }
    });
}

// إضافة أنماط للتأثير الحركي للعداد
const counterStyles = document.createElement('style');
counterStyles.textContent = `
    .counter-animation {
        animation: counterPulse 1s ease-out;
    }

    @keyframes counterPulse {
        0% {
            transform: scale(1);
        }
        50% {
            transform: scale(1.2);
            color: var(--color-gold);
        }
        100% {
            transform: scale(1);
        }
    }
`;
document.head.appendChild(counterStyles);

// تفعيل عرض القصائد
function showPoems(collectionId) {
    const collections = {
        'collection1': {
            name: 'رواحل',
            poems: []
        },
        'collection2': {
            name: 'نواعم',
            poems: []
        },
        'collection3': {
            name: 'على جناح الميدان',
            poems: []
        }
    };

    const collection = collections[collectionId];
    if (collection) {
        // إذا كانت القصائد فارغة، عرض رسالة
        if (collection.poems.length === 0) {
            showEmptyCollectionMessage(collection.name);
        } else {
            showPoemsModal(collection);
        }
    }
}

// عرض رسالة عند عدم وجود قصائد
function showEmptyCollectionMessage(collectionName) {
    const modal = document.createElement('div');
    modal.className = 'poems-modal';
    modal.innerHTML = `
        <div class="poems-modal-content">
            <div class="poems-modal-header">
                <h2>ديوان ${collectionName}</h2>
                <button class="close-modal">&times;</button>
            </div>
            <div class="poems-modal-body">
                <div style="text-align: center; padding: 3rem 2rem;">
                    <i class="fas fa-book-open" style="font-size: 3rem; color: var(--color-gold); margin-bottom: 1rem; opacity: 0.7;"></i>
                    <h3 style="color: var(--color-brown); margin-bottom: 1rem;">لا توجد قصائد متاحة حالياً</h3>
                    <p style="color: var(--color-accent);">سيتم إضافة القصائد قريباً</p>
                </div>
            </div>
        </div>
    `;

    // إضافة الأنماط
    const style = document.createElement('style');
    style.textContent = `
        .poems-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1000;
            animation: fadeIn 0.3s ease;
        }

        .poems-modal-content {
            background: white;
            border-radius: 15px;
            max-width: 500px;
            position: relative;
            animation: slideIn 0.3s ease;
        }

        .poems-modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 2rem;
            border-bottom: 2px solid var(--color-sand);
            background: var(--gradient-gold);
            border-radius: 15px 15px 0 0;
        }

        .poems-modal-header h2 {
            color: var(--color-dark);
            margin: 0;
        }

        .close-modal {
            background: none;
            border: none;
            font-size: 2rem;
            cursor: pointer;
            color: var(--color-dark);
            transition: var(--transition-smooth);
        }

        .close-modal:hover {
            color: var(--color-brown);
            transform: scale(1.1);
        }

        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }

        @keyframes slideIn {
            from { transform: translateY(-50px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
        }
    `;

    document.head.appendChild(style);
    document.body.appendChild(modal);

    // إغلاق النافذة المنبثقة
    const closeBtn = modal.querySelector('.close-modal');
    closeBtn.addEventListener('click', () => {
        modal.remove();
        style.remove();
    });

    // إغلاق النافذة عند النقر خارجها
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
            style.remove();
        }
    });
}

// عرض القصائد في نافذة منبثقة
function showPoemsModal(collection) {
    // إنشاء النافذة المنبثقة
    const modal = document.createElement('div');
    modal.className = 'poems-modal';
    modal.innerHTML = `
        <div class="poems-modal-content">
            <div class="poems-modal-header">
                <h2>ديوان ${collection.name}</h2>
                <button class="close-modal">&times;</button>
            </div>
            <div class="poems-modal-body">
                ${collection.poems.map((poem, index) => `
                    <div class="modal-poem-item">
                        <h3>${poem.title}</h3>
                        <div class="poem-content">
                            ${poem.content.split('\n').map(line => `<p>${line}</p>`).join('')}
                        </div>
                        <div class="poem-actions">
                            <button class="share-poem-btn" onclick="sharePoem('${poem.title}', \`${poem.content}\`)">
                                <i class="fas fa-share-alt"></i> مشاركة
                            </button>
                            <button class="copy-poem-btn" onclick="copyPoem(\`${poem.content}\`)">
                                <i class="fas fa-copy"></i> نسخ
                            </button>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;

    // إضافة الأنماط
    const style = document.createElement('style');
    style.textContent = `
        .poems-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1000;
            animation: fadeIn 0.3s ease;
        }

        .poems-modal-content {
            background: white;
            border-radius: 15px;
            max-width: 800px;
            max-height: 80vh;
            overflow-y: auto;
            position: relative;
            animation: slideIn 0.3s ease;
        }

        .poems-modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 2rem;
            border-bottom: 2px solid var(--color-sand);
            background: var(--gradient-gold);
            border-radius: 15px 15px 0 0;
        }

        .poems-modal-header h2 {
            color: var(--color-dark);
            margin: 0;
        }

        .close-modal {
            background: none;
            border: none;
            font-size: 2rem;
            cursor: pointer;
            color: var(--color-dark);
            transition: var(--transition-smooth);
        }

        .close-modal:hover {
            color: var(--color-brown);
            transform: scale(1.1);
        }

        .poems-modal-body {
            padding: 2rem;
        }

        .modal-poem-item {
            margin-bottom: 3rem;
            padding-bottom: 2rem;
            border-bottom: 1px solid var(--color-sand);
        }

        .modal-poem-item:last-child {
            border-bottom: none;
            margin-bottom: 0;
        }

        .modal-poem-item h3 {
            color: var(--color-brown);
            margin-bottom: 1rem;
            font-size: 1.5rem;
        }

        .poem-content {
            margin-bottom: 1.5rem;
        }

        .poem-content p {
            color: var(--color-gold);
            line-height: 2;
            margin-bottom: 1rem;
            text-align: center;
            font-size: 1.1rem;
            font-weight: 500;
        }

        .poem-content p:empty {
            margin-bottom: 2rem;
            display: block;
        }

        .poem-actions {
            display: flex;
            gap: 1rem;
            justify-content: center;
        }

        .poem-actions button {
            background: var(--gradient-dark);
            color: white;
            border: none;
            padding: 0.8rem 1.5rem;
            border-radius: 25px;
            cursor: pointer;
            font-size: 0.9rem;
            font-weight: 600;
            transition: var(--transition-smooth);
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }

        .poem-actions button:hover {
            background: var(--gradient-gold);
            color: var(--color-dark);
            transform: translateY(-2px);
        }

        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }

        @keyframes slideIn {
            from { transform: translateY(-50px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
        }

        @media (max-width: 768px) {
            .poems-modal-content {
                margin: 1rem;
                max-height: 90vh;
            }

            .poems-modal-header {
                padding: 1.5rem;
            }

            .poems-modal-body {
                padding: 1.5rem;
            }

            .poem-actions {
                flex-direction: column;
            }
        }
    `;

    document.head.appendChild(style);
    document.body.appendChild(modal);

    // إغلاق النافذة المنبثقة
    const closeBtn = modal.querySelector('.close-modal');
    closeBtn.addEventListener('click', () => {
        modal.remove();
    });

    // إغلاق النافذة عند النقر خارجها
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

// عرض القصيدة كاملة
function showFullPoem(poemId) {
    const poems = {
        'poem1': {
            title: 'إلى القمر',
            content: `مـن سـناء الـبرق اكـتبـها الـقصـيده ومـن بحور الشعر تخرج جوهره

ومـن خـيوط الـليـل انـسجـها فـريده وأعــجن الــكلـمه بـماء الـكوثـره

ومن سيوف الهند حرفي اللي اريده ومـن ورود الـحب اصـنع محبره

والـقمـر قـرطـاسـتى البيضا الوحيده وريشتى طرف العوالى السمهره

يــا جـمال الـكون وصـفى لـك اكـيده انــته نــبراس الــجمـال ومـنبـره`
        }
    };

    const poem = poems[poemId];
    if (poem) {
        showPoemModal(poem);
    }
}

// عرض قصيدة واحدة في نافذة منبثقة
function showPoemModal(poem) {
    const modal = document.createElement('div');
    modal.className = 'poem-modal';
    modal.innerHTML = `
        <div class="poem-modal-content">
            <div class="poem-modal-header">
                <h2>${poem.title}</h2>
                <button class="close-poem-modal">&times;</button>
            </div>
            <div class="poem-modal-body">
                <div class="poem-full-content">
                    ${poem.content.split('\n').map(line => `<p>${line}</p>`).join('')}
                </div>
                <div class="poem-modal-actions">
                    <button class="share-full-poem" onclick="sharePoem('${poem.title}', \`${poem.content}\`)">
                        <i class="fas fa-share-alt"></i> مشاركة القصيدة
                    </button>
                    <button class="copy-full-poem" onclick="copyPoem(\`${poem.content}\`)">
                        <i class="fas fa-copy"></i> نسخ القصيدة
                    </button>
                </div>
            </div>
        </div>
    `;

    // إضافة الأنماط
    const style = document.createElement('style');
    style.textContent = `
        .poem-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1000;
            animation: fadeIn 0.3s ease;
        }

        .poem-modal-content {
            background: white;
            border-radius: 15px;
            max-width: 600px;
            max-height: 80vh;
            overflow-y: auto;
            position: relative;
            animation: slideIn 0.3s ease;
        }

        .poem-modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 2rem;
            border-bottom: 2px solid var(--color-sand);
            background: var(--gradient-gold);
            border-radius: 15px 15px 0 0;
        }

        .poem-modal-header h2 {
            color: var(--color-dark);
            margin: 0;
        }

        .close-poem-modal {
            background: none;
            border: none;
            font-size: 2rem;
            cursor: pointer;
            color: var(--color-dark);
            transition: var(--transition-smooth);
        }

        .close-poem-modal:hover {
            color: var(--color-brown);
            transform: scale(1.1);
        }

        .poem-modal-body {
            padding: 2rem;
        }

        .poem-full-content {
            margin-bottom: 2rem;
        }

        .poem-full-content p {
            color: var(--color-gold);
            line-height: 2.2;
            margin-bottom: 1.5rem;
            text-align: center;
            font-size: 1.2rem;
            font-weight: 500;
        }

        .poem-full-content p:empty {
            margin-bottom: 2.5rem;
            display: block;
        }

        .poem-modal-actions {
            display: flex;
            gap: 1rem;
            justify-content: center;
        }

        .poem-modal-actions button {
            background: var(--gradient-dark);
            color: white;
            border: none;
            padding: 1rem 2rem;
            border-radius: 25px;
            cursor: pointer;
            font-size: 1rem;
            font-weight: 600;
            transition: var(--transition-smooth);
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }

        .poem-modal-actions button:hover {
            background: var(--gradient-gold);
            color: var(--color-dark);
            transform: translateY(-2px);
        }

        @media (max-width: 768px) {
            .poem-modal-content {
                margin: 1rem;
                max-height: 90vh;
            }

            .poem-modal-header {
                padding: 1.5rem;
            }

            .poem-modal-body {
                padding: 1.5rem;
            }

            .poem-modal-actions {
                flex-direction: column;
            }
        }
    `;

    document.head.appendChild(style);
    document.body.appendChild(modal);

    // إغلاق النافذة المنبثقة
    const closeBtn = modal.querySelector('.close-poem-modal');
    closeBtn.addEventListener('click', () => {
        modal.remove();
    });

    // إغلاق النافذة عند النقر خارجها
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

// مشاركة القصيدة
function sharePoem(title, content) {
    const shareText = `${title}\n\n${content}\n\nقصيدة للشيخ حمد بن علي الغافري\nموقع الشيخ حمد بن علي الغافري`;
    
    if (navigator.share) {
        navigator.share({
            title: `قصيدة ${title} - الشيخ حمد بن علي الغافري`,
            text: shareText
        });
    } else {
        navigator.clipboard.writeText(shareText).then(() => {
            alert('تم نسخ القصيدة إلى الحافظة');
        });
    }
}

// نسخ القصيدة
function copyPoem(content) {
    navigator.clipboard.writeText(content).then(() => {
        // إظهار رسالة نجاح
        const notification = document.createElement('div');
        notification.className = 'copy-notification';
        notification.textContent = 'تم نسخ القصيدة بنجاح';
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--gradient-gold);
            color: var(--color-dark);
            padding: 1rem 2rem;
            border-radius: 25px;
            box-shadow: var(--shadow-strong);
            z-index: 1001;
            animation: slideInRight 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    });
}

// تفعيل نسخ ومشاركة القصائد
document.addEventListener('DOMContentLoaded', function() {
    const shareButtons = document.querySelectorAll('.share-poem');
    const copyButtons = document.querySelectorAll('.copy-poem');

    shareButtons.forEach(button => {
        button.addEventListener('click', async () => {
            const poemText = button.closest('.poem-card').querySelector('.poem-text').textContent;
            try {
                await navigator.share({
                    title: 'قصيدة للشيخ حمد بن علي الغافري',
                    text: poemText
                });
            } catch (err) {
                console.log('Error sharing:', err);
            }
        });
    });

    copyButtons.forEach(button => {
        button.addEventListener('click', () => {
            const poemText = button.closest('.poem-card').querySelector('.poem-text').textContent;
            navigator.clipboard.writeText(poemText).then(() => {
                // إظهار رسالة نجاح
                const originalText = button.innerHTML;
                button.innerHTML = '<i class="fas fa-check"></i> تم النسخ';
                setTimeout(() => {
                    button.innerHTML = originalText;
                }, 2000);
            });
        });
    });
});

// وظيفة التفاعل مع زر آمين
document.addEventListener('DOMContentLoaded', function() {
    // تحديث عداد الأدعية
    let prayerCounter = localStorage.getItem('prayerCounter') || 0;
    updatePrayerCounter(prayerCounter);

    // إضافة مستمعي الأحداث لجميع أزرار آمين
    document.querySelectorAll('.prayer-actions button:first-child').forEach(button => {
        // التحقق من حالة الزر المحفوظة
        const prayerId = button.closest('.recent-prayer-card').dataset.prayerId;
        if (localStorage.getItem(`prayer_${prayerId}_ameen`)) {
            button.classList.add('active');
            button.innerHTML = '<i class="fas fa-heart"></i> تم قول آمين';
        }

        button.addEventListener('click', function() {
            const card = this.closest('.recent-prayer-card');
            
            if (!this.classList.contains('active')) {
                // تحديث شكل الزر
                this.classList.add('active');
                this.innerHTML = '<i class="fas fa-heart"></i> تم قول آمين';

                // تحريك القلب
                const heart = document.createElement('span');
                heart.className = 'floating-heart';
                heart.innerHTML = '❤️';
                card.appendChild(heart);

                // حفظ الحالة
                localStorage.setItem(`prayer_${prayerId}_ameen`, 'true');

                // تحديث العداد
                prayerCounter++;
                localStorage.setItem('prayerCounter', prayerCounter);
                updatePrayerCounter(prayerCounter);

                // إزالة القلب بعد الانتهاء من الحركة
                setTimeout(() => {
                    heart.remove();
                }, 1000);
            }
        });
    });
});

// وظيفة مشاركة الدعاء
document.addEventListener('DOMContentLoaded', function() {
    // إضافة مستمعي الأحداث لجميع أزرار المشاركة
    document.querySelectorAll('.prayer-actions button:last-child').forEach(button => {
        button.addEventListener('click', async function() {
            const card = this.closest('.recent-prayer-card');
            const prayerText = card.querySelector('.prayer-message').textContent;
            const shareText = `دعاء للشيخ حمد بن علي الغافري:\n${prayerText}\n\nموقع الشيخ حمد بن علي الغافري`;

            try {
                // محاولة استخدام Web Share API
                if (navigator.share) {
                    await navigator.share({
                        title: 'دعاء للشيخ حمد بن علي الغافري',
                        text: shareText
                    });
                } else {
                    // إذا لم يكن Web Share API متوفراً، نقوم بنسخ النص
                    await navigator.clipboard.writeText(shareText);
                    
                    // إظهار رسالة نجاح
                    const originalText = this.innerHTML;
                    this.innerHTML = '<i class="fas fa-check"></i> تم النسخ';
                    
                    // إعادة النص الأصلي بعد ثانيتين
                    setTimeout(() => {
                        this.innerHTML = originalText;
                    }, 2000);
                }
            } catch (err) {
                console.log('Error sharing:', err);
            }
        });
    });
});

// تحديث عداد الأدعية
function updatePrayerCounter(count) {
    const counterElement = document.querySelector('.counter-number');
    if (counterElement) {
        counterElement.textContent = count;
    }
}

// إضافة الأنماط للقلب المتحرك
const style = document.createElement('style');
style.textContent = `
    .floating-heart {
        position: absolute;
        font-size: 1.5rem;
        pointer-events: none;
        animation: floatHeart 1s ease-out forwards;
    }

    @keyframes floatHeart {
        0% {
            transform: translate(-50%, 0) scale(0);
            opacity: 0;
        }
        50% {
            transform: translate(-50%, -50px) scale(1.5);
            opacity: 1;
        }
        100% {
            transform: translate(-50%, -100px) scale(1);
            opacity: 0;
        }
    }

    .prayer-actions button.active {
        background-color: var(--color-gold);
        color: white;
        border-color: var(--color-gold);
    }

    .prayer-actions button {
        transition: all 0.3s ease;
    }

    .prayer-actions button:hover {
        transform: scale(1.05);
    }
`;
document.head.appendChild(style);

// تحسين أنماط أزرار المشاركة
const shareStyles = document.createElement('style');
shareStyles.textContent = `
    .prayer-actions button {
        position: relative;
        overflow: hidden;
    }

    .prayer-actions button::before {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        width: 0;
        height: 0;
        background: rgba(255, 255, 255, 0.2);
        border-radius: 50%;
        transform: translate(-50%, -50%);
        transition: width 0.6s ease, height 0.6s ease;
    }

    .prayer-actions button:active::before {
        width: 200px;
        height: 200px;
    }

    .prayer-actions button i {
        margin-left: 5px;
        transition: transform 0.3s ease;
    }

    .prayer-actions button:hover i {
        transform: scale(1.2);
    }

    @media (hover: none) {
        .prayer-actions button:active {
            transform: scale(0.95);
        }
    }
`;
document.head.appendChild(shareStyles);

// Circular Slider
document.addEventListener('DOMContentLoaded', function() {
    const slides = document.querySelectorAll('.slide');
    let currentSlide = 0;

    function showSlide(index) {
        // Hide all slides
        slides.forEach(slide => slide.classList.remove('active'));
        // Show the current slide
        slides[index].classList.add('active');
    }

    function nextSlide() {
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
    }

    // Show first slide
    showSlide(0);

    // Change slide every 3 seconds
    setInterval(nextSlide, 3000);
}); 



// وظائف تفاعلية جديدة لصفحة الدعاء
document.addEventListener('DOMContentLoaded', function() {
    // تهيئة عداد المشاركين
    let participantsCount = parseInt(localStorage.getItem('participantsCount')) || 8;
    updateParticipantsCounter(participantsCount);

    // تفعيل نموذج إضافة الدعاء
    const prayerForm = document.querySelector('.prayer-form');
    if (prayerForm) {
        prayerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const nameInput = document.getElementById('name');
            const prayerInput = document.getElementById('prayer');
            
            const name = nameInput.value.trim() || 'زائر كريم';
            const prayer = prayerInput.value.trim();
            
            if (prayer) {
                // إنشاء دعاء جديد
                addNewPrayer(name, prayer);
                
                // مسح النموذج
                prayerForm.reset();
                
                // زيادة العداد
                participantsCount++;
                updateParticipantsCounter(participantsCount);
                
                // إظهار رسالة نجاح
                showSuccessMessage('تم إرسال دعاءك بنجاح');
            }
        });
    }

    // تفعيل أزرار الأدعية الموجودة
    attachPrayerButtonListeners();
});

// إضافة دعاء جديد
function addNewPrayer(name, prayer) {
    const prayersGrid = document.querySelector('.prayers-grid');
    if (!prayersGrid) return;

    const prayerId = Date.now();
    const newPrayerCard = document.createElement('div');
    newPrayerCard.className = 'recent-prayer-card';
    newPrayerCard.dataset.prayerId = prayerId;
    
    newPrayerCard.innerHTML = `
        <div class="prayer-meta">
            <span><i class="fas fa-user"></i> ${name}</span>
            <span><i class="far fa-clock"></i> الآن</span>
        </div>
        <div class="prayer-message">
            ${prayer}
        </div>
        <div class="prayer-actions">
            <button class="ameen-btn"><i class="fas fa-heart"></i> آمين</button>
            <button class="share-btn"><i class="fas fa-share"></i> مشاركة</button>
        </div>
    `;

    // إضافة البطاقة في بداية القائمة
    prayersGrid.insertBefore(newPrayerCard, prayersGrid.firstChild);
    
    // تفعيل أزرار البطاقة الجديدة
    attachPrayerButtonListeners(newPrayerCard);
    
    // إضافة تأثير ظهور
    newPrayerCard.style.opacity = '0';
    newPrayerCard.style.transform = 'translateY(20px)';
    
    setTimeout(() => {
        newPrayerCard.style.transition = 'all 0.5s ease';
        newPrayerCard.style.opacity = '1';
        newPrayerCard.style.transform = 'translateY(0)';
    }, 100);
}

// تفعيل أزرار الأدعية
function attachPrayerButtonListeners(container = document) {
    // أزرار آمين
    const ameenButtons = container.querySelectorAll('.ameen-btn, .prayer-actions button:first-child');
    ameenButtons.forEach(button => {
        if (!button.hasAttribute('data-listener-attached')) {
            button.setAttribute('data-listener-attached', 'true');
            
            button.addEventListener('click', function() {
                const card = this.closest('.recent-prayer-card');
                const prayerId = card.dataset.prayerId;
                
                if (!this.classList.contains('active')) {
                    // تحديث الزر
                    this.classList.add('active');
                    this.innerHTML = '<i class="fas fa-heart"></i> تم قول آمين';
                    
                    // إضافة تأثير القلب المتحرك
                    createFloatingHeart(card);
                    
                    // حفظ الحالة
                    localStorage.setItem(`prayer_${prayerId}_ameen`, 'true');
                    
                    // تحديث العداد
                    let ameenCount = parseInt(localStorage.getItem('ameenCount')) || 0;
                    ameenCount++;
                    localStorage.setItem('ameenCount', ameenCount);
                    
                    // إظهار رسالة
                    showSuccessMessage('بارك الله فيك');
                }
            });
        }
    });

    // أزرار المشاركة
    const shareButtons = container.querySelectorAll('.share-btn, .prayer-actions button:last-child');
    shareButtons.forEach(button => {
        if (!button.hasAttribute('data-listener-attached')) {
            button.setAttribute('data-listener-attached', 'true');
            
            button.addEventListener('click', async function() {
                const card = this.closest('.recent-prayer-card');
                const prayerText = card.querySelector('.prayer-message').textContent;
                const shareText = `دعاء للشيخ حمد بن علي الغافري:\n\n${prayerText}\n\nموقع الشيخ حمد بن علي الغافري`;

                try {
                    if (navigator.share) {
                        await navigator.share({
                            title: 'دعاء للشيخ حمد بن علي الغافري',
                            text: shareText
                        });
                    } else {
                        await navigator.clipboard.writeText(shareText);
                        
                        // إظهار رسالة نجاح
                        const originalText = this.innerHTML;
                        this.innerHTML = '<i class="fas fa-check"></i> تم النسخ';
                        this.style.background = 'var(--color-gold)';
                        this.style.color = 'var(--color-dark)';
                        
                        setTimeout(() => {
                            this.innerHTML = originalText;
                            this.style.background = '';
                            this.style.color = '';
                        }, 2000);
                    }
                } catch (err) {
                    console.log('Error sharing:', err);
                }
            });
        }
    });
}

// إنشاء قلب متحرك
function createFloatingHeart(container) {
    const heart = document.createElement('div');
    heart.className = 'floating-heart';
    heart.innerHTML = '❤️';
    heart.style.cssText = `
        position: absolute;
        font-size: 1.5rem;
        pointer-events: none;
        z-index: 1000;
        animation: floatHeart 1.5s ease-out forwards;
    `;
    
    // تحديد موقع القلب
    const rect = container.getBoundingClientRect();
    heart.style.left = rect.left + rect.width / 2 + 'px';
    heart.style.top = rect.top + rect.height / 2 + 'px';
    
    document.body.appendChild(heart);
    
    // إزالة القلب بعد الانتهاء من الحركة
    setTimeout(() => {
        heart.remove();
    }, 1500);
}

// تحديث عداد المشاركين
function updateParticipantsCounter(count) {
    const counterElement = document.querySelector('.counter-number');
    if (counterElement) {
        // تحويل الرقم إلى النظام العربي
        const arabicNumber = count.toLocaleString('ar-SA');
        counterElement.textContent = arabicNumber;
        
        // حفظ العدد
        localStorage.setItem('participantsCount', count.toString());
        
        // إضافة تأثير حركي
        counterElement.classList.add('counter-animation');
        setTimeout(() => {
            counterElement.classList.remove('counter-animation');
        }, 1000);
    }
}

// إظهار رسالة نجاح
function showSuccessMessage(message) {
    const notification = document.createElement('div');
    notification.className = 'success-notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--gradient-gold);
        color: var(--color-dark);
        padding: 1rem 2rem;
        border-radius: 25px;
        box-shadow: var(--shadow-strong);
        z-index: 1001;
        font-weight: 600;
        animation: slideInRight 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// إضافة أنماط CSS للتفاعلات
const prayerStyles = document.createElement('style');
prayerStyles.textContent = `
    @keyframes floatHeart {
        0% {
            transform: translate(-50%, 0) scale(0);
            opacity: 0;
        }
        20% {
            transform: translate(-50%, -20px) scale(1.2);
            opacity: 1;
        }
        100% {
            transform: translate(-50%, -100px) scale(0.8);
            opacity: 0;
        }
    }

    @keyframes counterPulse {
        0% {
            transform: scale(1);
        }
        50% {
            transform: scale(1.2);
            color: var(--color-gold);
        }
        100% {
            transform: scale(1);
        }
    }

    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }

    .counter-animation {
        animation: counterPulse 1s ease-out;
    }

    .prayer-actions button.active {
        background: var(--color-gold) !important;
        color: var(--color-dark) !important;
        border-color: var(--color-gold) !important;
        transform: scale(1.05);
    }

    .prayer-actions button {
        transition: all 0.3s ease;
        position: relative;
        overflow: hidden;
    }

    .prayer-actions button::before {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        width: 0;
        height: 0;
        background: rgba(255, 255, 255, 0.2);
        border-radius: 50%;
        transform: translate(-50%, -50%);
        transition: width 0.6s ease, height 0.6s ease;
    }

    .prayer-actions button:active::before {
        width: 200px;
        height: 200px;
    }

    .prayer-actions button:hover {
        transform: translateY(-2px);
        box-shadow: 0 5px 15px rgba(74, 55, 40, 0.3);
    }

    .prayer-actions button i {
        transition: transform 0.3s ease;
    }

    .prayer-actions button:hover i {
        transform: scale(1.2);
    }

    .form-group input:focus,
    .form-group textarea:focus {
        transform: scale(1.02);
        box-shadow: 0 0 0 3px rgba(196, 169, 98, 0.2);
    }

    .submit-prayer:active {
        transform: translateY(-1px) scale(0.98);
    }

    @media (hover: none) {
        .prayer-actions button:active {
            transform: scale(0.95);
        }
    }
`;

document.head.appendChild(prayerStyles);

// تحسينات خاصة للهواتف المحمولة
document.addEventListener('DOMContentLoaded', function() {
    // تحسينات للهواتف المحمولة
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (isMobile) {
        // إضافة كلاس للهواتف
        document.body.classList.add('mobile-device');
        
        // تحسينات للقائمة على الهواتف
        const navToggle = document.querySelector('.nav-toggle');
        const mainHeader = document.querySelector('.main-header');
        
        if (navToggle && mainHeader) {
            // إضافة تأثيرات لمس محسنة
            navToggle.addEventListener('touchstart', function(e) {
                e.preventDefault();
                this.style.transform = 'scale(0.95)';
            });
            
            navToggle.addEventListener('touchend', function(e) {
                e.preventDefault();
                this.style.transform = 'scale(1)';
                this.classList.toggle('active');
                mainHeader.classList.toggle('active');
            });
            
            // إغلاق القائمة عند النقر خارجها على الهواتف
            document.addEventListener('touchstart', function(e) {
                if (!mainHeader.contains(e.target) && !navToggle.contains(e.target) && mainHeader.classList.contains('active')) {
                    navToggle.classList.remove('active');
                    mainHeader.classList.remove('active');
                }
            });
        }
        
        // تحسينات للأزرار على الهواتف
        const buttons = document.querySelectorAll('button, .feature-link, .quick-link');
        buttons.forEach(button => {
            button.addEventListener('touchstart', function(e) {
                this.style.transform = 'scale(0.98)';
                this.style.transition = 'transform 0.1s ease';
            });
            
            button.addEventListener('touchend', function(e) {
                setTimeout(() => {
                    this.style.transform = 'scale(1)';
                }, 100);
            });
        });
        
        // تحسينات للنماذج على الهواتف
        const inputs = document.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('focus', function() {
                // منع التكبير التلقائي على iOS
                if (this.type === 'text' || this.type === 'email' || this.tagName === 'TEXTAREA') {
                    const viewport = document.querySelector('meta[name="viewport"]');
                    if (viewport) {
                        viewport.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
                    }
                }
            });
            
            input.addEventListener('blur', function() {
                // إعادة تفعيل التكبير
                const viewport = document.querySelector('meta[name="viewport"]');
                if (viewport) {
                    viewport.content = 'width=device-width, initial-scale=1.0';
                }
            });
        });
        
        // تحسينات للصور على الهواتف
        const images = document.querySelectorAll('img');
        images.forEach(img => {
            img.addEventListener('load', function() {
                this.style.opacity = '1';
            });
            
            // تحسين تحميل الصور
            if (img.complete) {
                img.style.opacity = '1';
            } else {
                img.style.opacity = '0';
                img.style.transition = 'opacity 0.3s ease';
            }
        });
        
        // تحسينات للتمرير على الهواتف
        let isScrolling = false;
        window.addEventListener('scroll', function() {
            if (!isScrolling) {
                window.requestAnimationFrame(function() {
                    // إخفاء القائمة عند التمرير لأسفل
                    const currentScroll = window.pageYOffset;
                    const header = document.querySelector('.main-header');
                    
                    if (currentScroll > 100 && header && header.classList.contains('active')) {
                        const navToggle = document.querySelector('.nav-toggle');
                        if (navToggle) {
                            navToggle.classList.remove('active');
                            header.classList.remove('active');
                        }
                    }
                    
                    isScrolling = false;
                });
                isScrolling = true;
            }
        });
        
        // تحسينات للأداء على الهواتف
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('loaded');
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '50px'
        });
        
        // مراقبة العناصر للتحميل التدريجي
        const elementsToObserve = document.querySelectorAll('.feature-card, .testimonial-card, .story-card, .prayer-card, .gallery-item');
        elementsToObserve.forEach(el => {
            el.classList.add('loading');
            observer.observe(el);
        });
    }
    
    // تحسينات للشاشات الصغيرة
    function handleResize() {
        const width = window.innerWidth;
        
        if (width <= 768) {
            document.body.classList.add('mobile-layout');
            document.body.classList.remove('desktop-layout');
        } else {
            document.body.classList.add('desktop-layout');
            document.body.classList.remove('mobile-layout');
        }
        
        // إغلاق القائمة عند تغيير حجم الشاشة
        const mainHeader = document.querySelector('.main-header');
        const navToggle = document.querySelector('.nav-toggle');
        if (width > 768 && mainHeader && mainHeader.classList.contains('active')) {
            navToggle.classList.remove('active');
            mainHeader.classList.remove('active');
        }
    }
    
    // تشغيل التحقق من الحجم عند التحميل وعند تغيير الحجم
    handleResize();
    window.addEventListener('resize', handleResize);
    
    // تحسينات للوضع الأفقي على الهواتف
    function handleOrientationChange() {
        setTimeout(() => {
            const height = window.innerHeight;
            const width = window.innerWidth;
            
            if (height < 500 && width > height) {
                // الوضع الأفقي
                document.body.classList.add('landscape-mode');
                document.body.classList.remove('portrait-mode');
    } else {
                // الوضع العمودي
                document.body.classList.add('portrait-mode');
                document.body.classList.remove('landscape-mode');
            }
        }, 100);
    }
    
    window.addEventListener('orientationchange', handleOrientationChange);
    window.addEventListener('resize', handleOrientationChange);
    
    // تشغيل التحقق من الاتجاه عند التحميل
    handleOrientationChange();
});

// عرض المراسيم السلطانية (Lightbox)
document.addEventListener('DOMContentLoaded', function() {
    const decreeCards = document.querySelectorAll('.decree-card');
    const decreeLightbox = document.querySelector('.decree-lightbox');

    if (!decreeCards.length || !decreeLightbox) return;

    const lightboxImage = decreeLightbox.querySelector('.lightbox-image');
    const lightboxCaption = decreeLightbox.querySelector('.lightbox-caption');
    const closeBtn = decreeLightbox.querySelector('.close-lightbox');

    function openDecree(imgSrc, title) {
        lightboxImage.src = decodeURIComponent(imgSrc);
        lightboxImage.alt = title;
        lightboxCaption.textContent = title;
        decreeLightbox.classList.add('active');
        decreeLightbox.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }

    function closeDecree() {
        decreeLightbox.classList.remove('active');
        decreeLightbox.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }

    decreeCards.forEach(card => {
        card.addEventListener('click', (e) => {
            if (e.target.closest('.decree-open')) return;
            const img = card.dataset.decreeImg;
            const title = card.dataset.decreeTitle;
            if (img && title) openDecree(img, title);
        });
    });

    if (closeBtn) closeBtn.addEventListener('click', closeDecree);

    decreeLightbox.addEventListener('click', (e) => {
        if (e.target === decreeLightbox) closeDecree();
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && decreeLightbox.classList.contains('active')) {
            closeDecree();
        }
    });
});

// عرض مخطوطات الأشعار في صفحة الشعر
document.addEventListener('DOMContentLoaded', function() {
    const lightbox = document.querySelector('.poem-manuscript-lightbox');
    if (!lightbox) return;

    const lightboxImage = lightbox.querySelector('.poem-lightbox-image');
    const closeBtn = lightbox.querySelector('.poem-lightbox-close');

    const openLightbox = (src) => {
        lightboxImage.src = src;
        lightboxImage.alt = '';
        lightbox.classList.add('active');
        lightbox.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    };

    const closeLightbox = () => {
        lightbox.classList.remove('active');
        lightbox.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        lightboxImage.src = '';
    };

    document.querySelectorAll('.manuscript-view').forEach(btn => {
        btn.addEventListener('click', () => {
            openLightbox(btn.getAttribute('data-img'));
        });
    });

    closeBtn?.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox.classList.contains('active')) closeLightbox();
    });
});

function initActiveNav() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-menu a').forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage || (currentPage === '' && href === 'index.html')) {
            link.classList.add('active');
        }
    });
}

function initBackToTop() {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'back-to-top';
    btn.setAttribute('aria-label', 'العودة للأعلى');
    btn.innerHTML = '<i class="fas fa-chevron-up" aria-hidden="true"></i>';
    document.body.appendChild(btn);

    window.addEventListener('scroll', () => {
        btn.classList.toggle('is-visible', window.pageYOffset > 400);
    }, { passive: true });

    btn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

function initInteractiveTimeline() {
    const section = document.querySelector('.interactive-timeline');
    if (!section) return;

    const navButtons = section.querySelectorAll('.timeline-nav-btn');
    const items = section.querySelectorAll('.timeline-item');
    const progressFill = section.querySelector('.timeline-progress-fill');
    if (!items.length) return;

    const activateItem = (id) => {
        items.forEach(item => {
            item.classList.toggle('is-active', item.id === id);
        });
        navButtons.forEach(btn => {
            btn.classList.toggle('active', btn.getAttribute('data-target') === id);
        });
        const index = Array.from(items).findIndex(item => item.id === id);
        if (progressFill && index >= 0) {
            const percent = ((index + 1) / items.length) * 100;
            progressFill.style.width = `${percent}%`;
        }
    };

    navButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetId = btn.getAttribute('data-target');
            const target = document.getElementById(targetId);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'center' });
                activateItem(targetId);
            }
        });
    });

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                activateItem(entry.target.id);
            }
        });
    }, { root: null, rootMargin: '-30% 0px -30% 0px', threshold: 0.2 });

    items.forEach(item => observer.observe(item));
    activateItem(items[0].id);
}

document.addEventListener('site:page-changed', () => {
    document.querySelectorAll('.nav-menu a').forEach(link => link.classList.remove('active'));
    initActiveNav();
    initInteractiveTimeline();
}); 