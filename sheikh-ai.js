/**
 * المساعد الذكي — دليل تفاعلي عن الشيخ حمد بن علي الغافري
 * (يعتمد على محتوى الموقع؛ ليس نموذجاً مدرباً على شخصيته)
 */
(function () {
    const STORAGE_CHAT = 'sheikhAiChatHistory';

    const KNOWLEDGE = [
        {
            keys: ['من هو', 'تعريف', 'هوية', 'اسمه', 'الغافري', 'عرفني', 'من حمد'],
            answer: 'الشيخ حمد بن علي بن سعيد الغافري شخصية عُمانية بارزة، شاعر شعبي وفارس ومن رواد فن الميدان في سلطنة عُمان. يُعرف بإسهاماته في الشعر والفروسية والرماية والعمل الإداري. رحمه الله تعالى.',
            link: { href: 'biography.html', text: 'اقرأ السيرة الذاتية' }
        },
        {
            keys: ['ولد', 'ولادة', 'نشأ', 'دريز', 'عبري', 'الظاهرة', 'مولده', 'ترعرض'],
            answer: 'وُلد في قرية الدريز بولاية عبري بمحافظة الظاهرة، ونشأ في بيئة عُمانية أصيلة متشبّعاً بالقرآن الكريم والتراث العُماني، في كنف والده الشيخ علي بن سعيد الغافري.',
            link: { href: 'biography.html', text: 'محطات السيرة' }
        },
        {
            keys: ['توفي', 'وفاة', 'وفاته', 'رحمه', '2021', 'يناير', 'انتقل'],
            answer: 'تُوفي رحمه الله تعالى في السادس عشر من يناير عام 2021م، تاركاً إرثاً ثقافياً وأدبياً بارزاً في ذاكرة الوطن.',
            link: { href: 'prayers.html', text: 'صفحة الدعاء' }
        },
        {
            keys: ['شعر', 'دواوين', 'ديوان', 'قصائد', 'شاعر', 'رواحل', 'نواعم', 'ميدان', 'جناح'],
            answer: 'بدأ الشعر في سن الثانية عشرة، ويُعد من مؤسسي الحركة الشعرية الشعبية في السلطنة. من أبرز دواوينه: على جناح الميدان، ورواحل، ونواعم. حصل على المركز الأول في المنتدى الأدبي للشعر الشعبي عام 1989م.',
            link: { href: 'poetry.html', text: 'ديوان الشعر' }
        },
        {
            keys: ['منصب', 'عمل', 'حكوم', 'والي', 'نائب', 'دبي', 'ظفار', 'قبائل', 'مجلس الدولة', 'مرسوم'],
            answer: 'شغل مناصب منها: نائب الولاية، والياً، مدير عام شؤون القبائل، رئيس مكتب السلطنة في دبي، نائب محافظ ظفار، ومستشاراً في الدولة وعضواً في مجلس الدولة. وثائق بعض التعيينات في قسم المراسيم السلطانية.',
            link: { href: 'testimonials.html', text: 'المراسيم السلطانية' }
        },
        {
            keys: ['خيل', 'فروس', 'رماية', 'رما', 'عبية', 'هوايات', 'خيول'],
            answer: 'برع منذ صغره في الفروسية والرماية، ومن أشهر قصصه هدية السلطان وفرس العبية، وإصابته دلة من مسافة بعيدة. كان شغوفاً بالخيول العربية الأصيلة طوال حياته.',
            link: { href: 'stories.html', text: 'القصص' }
        },
        {
            keys: ['صور', 'معرض', 'فيديو', 'صورة'],
            answer: 'يتضمن الموقع معرض صور وفيديوهات من حياة الشيخ، منها لقطات شخصية ومناسبات وفروسية ورماية.',
            link: { href: 'gallery.html', text: 'معرض الصور' }
        },
        {
            keys: ['قصص', 'حكايات', 'مواقف', 'قصة'],
            answer: 'قسم القصص يضم مواقف وحكايات من سيرة الشيخ، منها قصص الفروسية والرماية وغيرها، مع إمكانية البحث والتصنيف.',
            link: { href: 'stories.html', text: 'صفحة القصص' }
        },
        {
            keys: ['انجاز', 'إنجاز', 'جائزة', '1989', 'منتدى', 'تراث', '1991'],
            answer: 'من إنجازاته: المركز الأول في المنتدى الأدبي للشعر الشعبي 1989م، إصدار على جناح الميدان 1991م ضمن سلسلة الفنون الشعبية العمانية، ومشاركات شعرية وإعلامية محلية وخليجية.',
            link: { href: 'achievements.html', text: 'صفحة الإنجازات' }
        },
        {
            keys: ['دعاء', 'ادع', 'دعوات', 'رحمة'],
            answer: 'تجدون في صفحة الدعاء مساحة للدعاء للشيخ حمد بن علي الغافري رحمه الله.',
            link: { href: 'prayers.html', text: 'صفحة الدعاء' }
        },
        {
            keys: ['موقع', 'اقسام', 'أقسام', 'صفحات', 'تصفح', 'اين', 'أين', 'كيف'],
            answer: 'أقسام الموقع: السيرة الذاتية، الإنجازات، ديوان الشعر، القصص، معرض الصور، المراسيم السلطانية، وصفحة الدعاء. يمكنكم استخدام القائمة العلوية أو الروابط السريعة في الرئيسية.',
            link: { href: 'index.html', text: 'الرئيسية' }
        },
        {
            keys: ['صوت', 'ترحيب', 'استمع', 'متحدث'],
            answer: 'يمكنكم الاستماع إلى ترحيب صوتي عن سيرة الشيخ من الزر الذهبي أسفل يمين الشاشة (أيقونة الصوت).',
            link: null
        },
        {
            keys: ['سلام', 'مرحبا', 'مرحباً', 'اهلا', 'أهلا', 'هلا', 'صباح', 'مساء'],
            answer: 'مرحباً بكم في الموقع التذكاري للشيخ حمد بن علي الغافري. أنا مساعد ذكي للإرشاد داخل الموقع — اسألوني عن سيرته أو شعره أو أقسام الموقع.',
            link: null
        },
        {
            keys: ['شكر', 'جزاك', 'ممتاز', 'احسنت'],
            answer: 'العفو. نسأل الله أن ينفع بهذا الموقع في حفظ ذكرى الشيخ حمد بن علي الغافري رحمه الله.',
            link: null
        }
    ];

    const FALLBACK =
        'لم أجد إجابة دقيقة لسؤالكم في قاعدة معرفة الموقع. جرّبوا صياغة السؤال بكلمات مثل: السيرة، الشعر، المناصب، القصص، المعرض، أو الإنجازات. ويمكنكم تصفح الأقسام من القائمة العلوية.';

    const SUGGESTIONS = [
        'من هو الشيخ حمد؟',
        'ما دواوينه الشعرية؟',
        'متى تُوفي رحمه الله؟',
        'ما أقسام الموقع؟'
    ];

    let panelEl = null;
    let fabEl = null;
    let messagesEl = null;
    let inputEl = null;

    function normalizeAr(text) {
        return text
            .replace(/[\u064B-\u065F\u0670]/g, '')
            .replace(/[أإآٱ]/g, 'ا')
            .replace(/ى/g, 'ي')
            .replace(/ة/g, 'ه')
            .replace(/[^\u0600-\u06FFa-zA-Z0-9\s]/g, ' ')
            .replace(/\s+/g, ' ')
            .trim()
            .toLowerCase();
    }

    function findAnswer(question) {
        const q = normalizeAr(question);
        if (!q) return { answer: 'اكتبوا سؤالكم من فضلكم.', link: null };

        let best = null;
        let bestScore = 0;

        KNOWLEDGE.forEach((entry) => {
            let score = 0;
            entry.keys.forEach((key) => {
                const k = normalizeAr(key);
                if (q.includes(k) || k.includes(q)) score += k.length > 3 ? 2 : 1;
            });
            if (score > bestScore) {
                bestScore = score;
                best = entry;
            }
        });

        if (best && bestScore > 0) {
            return { answer: best.answer, link: best.link || null };
        }
        return { answer: FALLBACK, link: { href: 'biography.html', text: 'ابدأوا من السيرة' } };
    }

    function escapeHtml(str) {
        const d = document.createElement('div');
        d.textContent = str;
        return d.innerHTML;
    }

    function appendMessage(role, text, link) {
        if (!messagesEl) return;
        const row = document.createElement('div');
        row.className = `sheikh-ai-msg sheikh-ai-msg--${role}`;

        let html = `<div class="sheikh-ai-bubble">${escapeHtml(text)}</div>`;
        if (link && role === 'bot') {
            html += `<a href="${link.href}" class="sheikh-ai-link">${escapeHtml(link.text)} <i class="fas fa-arrow-left" aria-hidden="true"></i></a>`;
        }
        row.innerHTML = html;
        messagesEl.appendChild(row);
        messagesEl.scrollTop = messagesEl.scrollHeight;
        saveHistory();
    }

    function saveHistory() {
        if (!messagesEl) return;
        const items = [...messagesEl.querySelectorAll('.sheikh-ai-msg')].slice(-12).map((el) => ({
            role: el.classList.contains('sheikh-ai-msg--user') ? 'user' : 'bot',
            html: el.innerHTML
        }));
        try {
            sessionStorage.setItem(STORAGE_CHAT, JSON.stringify(items));
        } catch {
            /* ignore */
        }
    }

    function loadHistory() {
        try {
            const raw = sessionStorage.getItem(STORAGE_CHAT);
            if (!raw || !messagesEl) return;
            const items = JSON.parse(raw);
            if (!items.length) return;
            messagesEl.innerHTML = '';
            items.forEach((item) => {
                const row = document.createElement('div');
                row.className = `sheikh-ai-msg sheikh-ai-msg--${item.role}`;
                row.innerHTML = item.html;
                messagesEl.appendChild(row);
            });
        } catch {
            /* ignore */
        }
    }

    function sendQuestion(text) {
        const q = text.trim();
        if (!q) return;
        appendMessage('user', q);
        if (inputEl) inputEl.value = '';

        window.setTimeout(() => {
            const { answer, link } = findAnswer(q);
            appendMessage('bot', answer, link);
        }, 350);
    }

    function buildPanel() {
        const wrap = document.createElement('div');
        wrap.className = 'sheikh-ai-panel';
        wrap.setAttribute('role', 'dialog');
        wrap.setAttribute('aria-labelledby', 'sheikh-ai-title');
        wrap.setAttribute('aria-hidden', 'true');

        const chips = SUGGESTIONS.map(
            (s) => `<button type="button" class="sheikh-ai-chip" data-q="${escapeHtml(s)}">${escapeHtml(s)}</button>`
        ).join('');

        wrap.innerHTML = `
            <div class="sheikh-ai-inner">
                <header class="sheikh-ai-header">
                    <div class="sheikh-ai-header-text">
                        <h2 id="sheikh-ai-title">المساعد الذكي</h2>
                        <p>دليل عن الشيخ حمد بن علي الغافري</p>
                    </div>
                    <div class="sheikh-ai-header-actions">
                        <button type="button" class="sheikh-ai-expand" aria-label="تكبير النافذة" title="تكبير">
                            <i class="fas fa-expand" aria-hidden="true"></i>
                        </button>
                        <button type="button" class="sheikh-ai-close" aria-label="إغلاق" title="إغلاق">&times;</button>
                    </div>
                </header>
                <p class="sheikh-ai-disclaimer">مساعد معلوماتي من محتوى الموقع — لا يمثّل الشيخ شخصياً.</p>
                <div class="sheikh-ai-suggestions" aria-label="أسئلة مقترحة">${chips}</div>
                <div class="sheikh-ai-messages" role="log" aria-live="polite"></div>
                <form class="sheikh-ai-form">
                    <input type="text" class="sheikh-ai-input" placeholder="اسأل عن السيرة، الشعر، القصص..." autocomplete="off" maxlength="300">
                    <button type="submit" class="sheikh-ai-send" aria-label="إرسال"><i class="fas fa-paper-plane" aria-hidden="true"></i></button>
                </form>
            </div>
        `;

        messagesEl = wrap.querySelector('.sheikh-ai-messages');
        inputEl = wrap.querySelector('.sheikh-ai-input');
        const form = wrap.querySelector('.sheikh-ai-form');

        wrap.querySelector('.sheikh-ai-close')?.addEventListener('click', closePanel);
        wrap.querySelector('.sheikh-ai-expand')?.addEventListener('click', toggleExpand);
        wrap.addEventListener('click', (e) => {
            if (panelEl?.classList.contains('is-expanded') && e.target === wrap) {
                closePanel();
            }
        });
        form?.addEventListener('submit', (e) => {
            e.preventDefault();
            sendQuestion(inputEl?.value || '');
        });

        wrap.querySelectorAll('.sheikh-ai-chip').forEach((chip) => {
            chip.addEventListener('click', () => {
                sendQuestion(chip.getAttribute('data-q') || '');
            });
        });

        document.body.appendChild(wrap);
        return wrap;
    }

    function buildFab() {
        const fab = document.createElement('button');
        fab.type = 'button';
        fab.className = 'sheikh-ai-fab';
        fab.setAttribute('aria-label', 'فتح المساعد الذكي');
        fab.setAttribute('title', 'اسأل عن الشيخ حمد');
        fab.innerHTML = '<i class="fas fa-comments" aria-hidden="true"></i>';
        fab.addEventListener('click', togglePanel);
        document.body.appendChild(fab);
        return fab;
    }

    function openPanel() {
        if (!panelEl) return;
        panelEl.classList.add('is-open');
        panelEl.setAttribute('aria-hidden', 'false');
        inputEl?.focus();

        if (!messagesEl?.children.length) {
            appendMessage(
                'bot',
                'مرحباً. أنا المساعد الذكي للموقع التذكاري للشيخ حمد بن علي الغافري. يمكنني الإجابة عن أسئلة تتعلق بسيرته وشعره وإنجازاته وأقسام الموقع.',
                { href: 'biography.html', text: 'السيرة الذاتية' }
            );
        }
    }

    function updateExpandButton() {
        const btn = panelEl?.querySelector('.sheikh-ai-expand');
        const icon = btn?.querySelector('i');
        const expanded = panelEl?.classList.contains('is-expanded');
        if (!btn || !icon) return;
        if (expanded) {
            icon.className = 'fas fa-compress';
            btn.setAttribute('aria-label', 'تصغير النافذة');
            btn.setAttribute('title', 'تصغير');
        } else {
            icon.className = 'fas fa-expand';
            btn.setAttribute('aria-label', 'تكبير النافذة');
            btn.setAttribute('title', 'تكبير');
        }
    }

    function toggleExpand() {
        if (!panelEl) return;
        panelEl.classList.toggle('is-expanded');
        updateExpandButton();
        if (messagesEl) {
            requestAnimationFrame(() => {
                messagesEl.scrollTop = messagesEl.scrollHeight;
            });
        }
    }

    function closePanel() {
        if (!panelEl) return;
        panelEl.classList.remove('is-expanded');
        panelEl.classList.remove('is-open');
        panelEl.setAttribute('aria-hidden', 'true');
        updateExpandButton();
    }

    function togglePanel() {
        if (panelEl?.classList.contains('is-open')) closePanel();
        else openPanel();
    }

    function init() {
        panelEl = buildPanel();
        fabEl = buildFab();
        loadHistory();

        if (!messagesEl?.children.length) {
            /* welcome on first open only */
        }

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && panelEl?.classList.contains('is-open')) closePanel();
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
