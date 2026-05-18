/**
 * المتحدث الترحيبي — صوت عصري (ذكاء اصطناعي) عن الشيخ حمد بن علي الغافري
 */
(function () {
    const STORAGE_NEVER = 'siteSpeakerNeverShow';
    const STORAGE_SESSION = 'siteSpeakerPlayedSession';
    const STORAGE_PLAYBACK = 'siteSpeakerPlayback';
    const STORAGE_CONTINUE = 'siteSpeakerContinue';
    const AI_VOICE_LABEL = 'حامد — عربية فصحى';

    const WELCOME_SPEECH = [
        'مرحباً بكم في الموقع التذكاري للشيخ حمد بن علي بن سعيد الغافري، رحمه الله تعالى، أحد أبرز رواد الشعر الشعبي وفن الميدان في سلطنة عُمان.',
        'وُلِدَ في قرية الدريز بولاية عبري بمحافظة الظاهرة، ونشأ في بيئة عُمانية أصيلة متشبّعاً بالتراث العُماني العريق.',
        'وبرزت موهبته منذ الصغر في الشعر والفروسية والرماية، ليصبح لاحقاً من الأسماء البارزة في الساحة الأدبية والثقافية العُمانية.',
        'ومن أبرز دواوينه الشعرية: على جناح الميدان، ورواحل، ونواعم، والتي جسّدت حضوره الأدبي وتميّزه في الشعر الشعبي وفن الميدان.',
        'كما شغل عدداً من المناصب الحكومية الرفيعة، من بينها: مدير عام شؤون القبائل، ورئيس مكتب السلطنة في دبي، ونائب محافظ ظفار.',
        'وفي عام ألف وتسعمائة وتسعة وثمانين ميلادية، حقق المركز الأول في مسابقة المنتدى الأدبي للشعر الشعبي، تقديراً لمكانته وإبداعه الشعري.',
        'وعُرف رحمه الله بشغفه الكبير بالخيول العربية الأصيلة، وبراعته في الرماية والفروسية منذ سنواته الأولى.',
        'وقد انتقل إلى رحمة الله تعالى في السادس عشر من يناير عام ألفين وواحد وعشرين ميلادية، تاركاً إرثاً ثقافياً وأدبياً بارزاً في ذاكرة الوطن.',
        'ندعوكم لاستكشاف السيرة الذاتية، والدواوين الشعرية، والقصص والمواقف، ومعرض الصور، والمراسيم السلطانية، عبر أقسام هذا الموقع.'
    ].join(' ');

    function resolveAssetUrl(relativePath) {
        const script = document.querySelector('script[src*="site-speaker"]');
        if (script) {
            try {
                return new URL(relativePath, script.src).href;
            } catch {
                /* fallback */
            }
        }
        return relativePath;
    }

    const AI_AUDIO_URL = resolveAssetUrl('audio/welcome-ai.mp3');
    const AVATAR_URL = resolveAssetUrl('imige/hamed bin ali 1.jpeg');

    let panelEl = null;
    let fabEl = null;
    let isSpeaking = false;
    let aiAudio = null;
    let useBrowserTts = false;
    let utterance = null;
    let arabicVoice = null;
    let navResumeDone = false;

    function prefersReducedMotion() {
        return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }

    function isPanelVisible() {
        return panelEl?.classList.contains('is-visible');
    }

    function pickArabicVoice() {
        const voices = window.speechSynthesis.getVoices();
        const arVoices = voices.filter(v => v.lang && v.lang.startsWith('ar'));
        return (
            arVoices.find(v => /saudi|ar-sa/i.test(v.lang + v.name)) ||
            arVoices.find(v => /google.*arabic/i.test(v.name)) ||
            arVoices.find(v => /microsoft.*arabic/i.test(v.name)) ||
            arVoices[0] ||
            null
        );
    }

    function isAudioInProgress() {
        return isSpeaking;
    }

    function hasPausedProgress() {
        return aiAudio && aiAudio.currentTime > 0 && !aiAudio.ended;
    }

    function savePlaybackState(forcePlaying) {
        if (!aiAudio) return;
        const playing = forcePlaying === true ? true : isSpeaking;
        sessionStorage.setItem(STORAGE_PLAYBACK, JSON.stringify({
            playing,
            time: aiAudio.currentTime,
            at: Date.now()
        }));
    }

    function clearPlaybackState() {
        sessionStorage.removeItem(STORAGE_PLAYBACK);
    }

    function restorePlaybackState() {
        const raw = sessionStorage.getItem(STORAGE_PLAYBACK);
        if (!raw || useBrowserTts || !aiAudio) return;

        try {
            const { playing, time, at } = JSON.parse(raw);
            const shouldContinue = sessionStorage.getItem(STORAGE_CONTINUE) === '1';

            if (Date.now() - at > 10 * 60 * 1000) {
                clearPlaybackState();
                sessionStorage.removeItem(STORAGE_CONTINUE);
                return;
            }

            if (time > 0) {
                aiAudio.currentTime = Math.min(time, aiAudio.duration || time);
            }

            if ((playing || shouldContinue) && !navResumeDone) {
                navResumeDone = true;
                sessionStorage.removeItem(STORAGE_CONTINUE);
                hidePanel();
                aiAudio.play()
                    .then(() => setSpeakingState(true))
                    .catch(() => {});
            }
        } catch {
            clearPlaybackState();
            sessionStorage.removeItem(STORAGE_CONTINUE);
        }
    }

    function markContinueOnNavigation() {
        if (!isSpeaking && !hasPausedProgress()) return;
        sessionStorage.setItem(STORAGE_CONTINUE, '1');
        savePlaybackState(isSpeaking);
    }

    function shouldPreserveAudioNav() {
        if (!canUseSoftNavigation()) return false;
        if (isSpeaking || hasPausedProgress()) return true;
        return sessionStorage.getItem(STORAGE_CONTINUE) === '1';
    }

    function initAiAudio() {
        aiAudio = new Audio(AI_AUDIO_URL);
        aiAudio.preload = 'auto';

        let lastSave = 0;
        aiAudio.addEventListener('timeupdate', () => {
            if (!isSpeaking && !hasPausedProgress()) return;
            const now = Date.now();
            if (now - lastSave > 400) {
                lastSave = now;
                savePlaybackState();
            }
        });

        aiAudio.addEventListener('loadedmetadata', restorePlaybackState);
        aiAudio.addEventListener('canplay', restorePlaybackState);

        aiAudio.addEventListener('canplaythrough', () => updateVoiceBadge(), { once: true });

        aiAudio.addEventListener('error', () => {
            useBrowserTts = true;
            updateVoiceBadge();
        });

        aiAudio.addEventListener('ended', onSpeechEnd);
        aiAudio.addEventListener('play', () => {
            setSpeakingState(true);
            savePlaybackState();
        });
        aiAudio.addEventListener('pause', () => {
            if (aiAudio && !aiAudio.ended) {
                setSpeakingState(false);
                savePlaybackState();
            }
        });
    }

    function updateVoiceBadge() {
        const badge = panelEl?.querySelector('.site-speaker-ai-badge');
        if (!badge) return;
        if (useBrowserTts) {
            badge.textContent = 'صوت المتصفح (احتياطي)';
            badge.classList.add('is-fallback');
        } else {
            badge.textContent = 'صوت ذكاء اصطناعي · ' + AI_VOICE_LABEL;
            badge.classList.remove('is-fallback');
        }
    }

    function updateFabUi() {
        if (!fabEl) return;
        fabEl.classList.toggle('is-speaking', isSpeaking);
        const icon = fabEl.querySelector('i');
        if (!icon) return;
        if (isSpeaking) {
            icon.className = 'fas fa-pause';
            fabEl.setAttribute('aria-label', 'إيقاف الترحيب الصوتي');
            fabEl.setAttribute('title', 'إيقاف · نقرة مزدوجة لفتح اللوح');
        } else {
            icon.className = 'fas fa-volume-up';
            fabEl.setAttribute('aria-label', 'تشغيل الترحيب الصوتي');
            fabEl.setAttribute('title', 'استمع للترحيب · نقرة مزدوجة لفتح اللوح');
        }
    }

    function setSpeakingState(active) {
        isSpeaking = active;

        if (panelEl) {
            panelEl.classList.toggle('is-speaking', active);
            panelEl.classList.toggle('is-loading', false);

            const playBtn = panelEl.querySelector('.site-speaker-play');
            const icon = playBtn?.querySelector('i');
            const label = playBtn?.querySelector('span');
            if (playBtn && icon && label) {
                if (active) {
                    icon.className = 'fas fa-pause';
                    label.textContent = 'إيقاف';
                    playBtn.setAttribute('aria-label', 'إيقاف الصوت');
                } else {
                    icon.className = 'fas fa-volume-up';
                    label.textContent = 'استمع للترحيب';
                    playBtn.setAttribute('aria-label', 'تشغيل الترحيب الصوتي');
                }
            }
        }

        updateFabUi();
    }

    function setLoadingState(loading) {
        if (!panelEl) return;
        panelEl.classList.toggle('is-loading', loading);
        const label = panelEl.querySelector('.site-speaker-play span');
        if (loading && label) label.textContent = 'جاري التحميل...';
    }

    function onSpeechEnd() {
        setSpeakingState(false);
        clearPlaybackState();
        sessionStorage.setItem(STORAGE_SESSION, '1');
    }

    function stopSpeech() {
        if (aiAudio) {
            aiAudio.pause();
            aiAudio.currentTime = 0;
        }
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
        }
        clearPlaybackState();
        setSpeakingState(false);
    }

    function pauseSpeech() {
        if (aiAudio && !aiAudio.paused) {
            aiAudio.pause();
        }
        if ('speechSynthesis' in window && window.speechSynthesis.speaking) {
            window.speechSynthesis.pause();
        }
        savePlaybackState();
        setSpeakingState(false);
    }

    function resumeSpeech() {
        if (!useBrowserTts && aiAudio && aiAudio.paused && aiAudio.currentTime > 0 && !aiAudio.ended) {
            aiAudio.play().catch(() => speakWelcome());
            return;
        }
        if ('speechSynthesis' in window && window.speechSynthesis.paused) {
            window.speechSynthesis.resume();
            setSpeakingState(true);
            return;
        }
        speakWelcome();
    }

    function toggleSpeech() {
        if (isSpeaking) {
            pauseSpeech();
            return;
        }
        if (hasPausedProgress()) {
            resumeSpeech();
            return;
        }
        speakWelcome();
    }

    function speakWithBrowserTts() {
        if (!('speechSynthesis' in window)) {
            showUnsupported();
            return;
        }

        arabicVoice = pickArabicVoice();
        utterance = new SpeechSynthesisUtterance(WELCOME_SPEECH);
        utterance.lang = 'ar';
        utterance.rate = 0.92;
        if (arabicVoice) utterance.voice = arabicVoice;

        utterance.onstart = () => setSpeakingState(true);
        utterance.onend = onSpeechEnd;
        utterance.onerror = () => setSpeakingState(false);

        window.speechSynthesis.speak(utterance);
    }

    function speakWelcome() {
        if (!useBrowserTts && aiAudio) {
            if (isPanelVisible()) setLoadingState(true);

            const playPromise = aiAudio.play();
            if (playPromise && typeof playPromise.then === 'function') {
                playPromise
                    .then(() => {
                        setLoadingState(false);
                        setSpeakingState(true);
                    })
                    .catch(() => {
                        setLoadingState(false);
                        useBrowserTts = true;
                        updateVoiceBadge();
                        speakWithBrowserTts();
                    });
            }
            return;
        }

        speakWithBrowserTts();
    }

    function showUnsupported() {
        const msg = panelEl?.querySelector('.site-speaker-msg');
        if (msg) {
            msg.textContent = 'تعذّر تشغيل الصوت. يمكنك قراءة النص أدناه.';
        }
    }

    function hidePanel() {
        if (panelEl) panelEl.classList.remove('is-visible');
        if (fabEl) {
            fabEl.classList.remove('is-hidden');
            fabEl.classList.add('is-visible');
            if (!sessionStorage.getItem(STORAGE_SESSION) && !prefersReducedMotion()) {
                fabEl.classList.add('is-pulse');
            }
        }
        updateFabUi();
    }

    function showPanel() {
        const panel = ensurePanel();
        if (!panel) return;
        panel.classList.add('is-visible');
        if (fabEl) {
            fabEl.classList.add('is-hidden');
            fabEl.classList.remove('is-pulse');
        }
    }

    function dismissForever() {
        localStorage.setItem(STORAGE_NEVER, '1');
        stopSpeech();
        if (panelEl) {
            panelEl.remove();
            panelEl = null;
        }
        hidePanel();
    }

    function ensurePanel() {
        if (!panelEl && !localStorage.getItem(STORAGE_NEVER)) {
            panelEl = buildPanel();
        }
        return panelEl;
    }

    function buildPanel() {
        const wrap = document.createElement('div');
        wrap.className = 'site-speaker-panel';
        wrap.setAttribute('role', 'dialog');
        wrap.setAttribute('aria-labelledby', 'site-speaker-title');
        wrap.setAttribute('aria-describedby', 'site-speaker-msg');
        wrap.innerHTML = `
            <div class="site-speaker-inner">
                <button type="button" class="site-speaker-close" aria-label="إغلاق اللوح">&times;</button>
                <div class="site-speaker-avatar-wrap">
                    <div class="site-speaker-avatar-ring"></div>
                    <img src="${AVATAR_URL}" alt="" class="site-speaker-avatar" width="72" height="72">
                    <span class="site-speaker-waves" aria-hidden="true">
                        <span></span><span></span><span></span>
                    </span>
                </div>
                <p class="site-speaker-ai-badge" aria-live="polite">صوت ذكاء اصطناعي · ${AI_VOICE_LABEL}</p>
                <h2 id="site-speaker-title" class="site-speaker-title">مرحباً بكم</h2>
                <p id="site-speaker-msg" class="site-speaker-msg">${WELCOME_SPEECH}</p>
                <div class="site-speaker-actions">
                    <button type="button" class="site-speaker-play site-speaker-btn-primary">
                        <i class="fas fa-volume-up" aria-hidden="true"></i>
                        <span>استمع للترحيب</span>
                    </button>
                    <button type="button" class="site-speaker-minimize site-speaker-btn-ghost">تصغير</button>
                </div>
                <button type="button" class="site-speaker-never">إخفاء لوح الترحيب</button>
            </div>
        `;

        wrap.querySelector('.site-speaker-close')?.addEventListener('click', hidePanel);

        wrap.querySelector('.site-speaker-minimize')?.addEventListener('click', hidePanel);

        wrap.querySelector('.site-speaker-never')?.addEventListener('click', dismissForever);

        wrap.querySelector('.site-speaker-play')?.addEventListener('click', toggleSpeech);

        document.body.appendChild(wrap);
        return wrap;
    }

    function buildFab() {
        const fab = document.createElement('button');
        fab.type = 'button';
        fab.className = 'site-speaker-fab';
        fab.setAttribute('aria-label', 'تشغيل الترحيب الصوتي');
        fab.setAttribute('title', 'استمع للترحيب · نقرة مزدوجة لفتح اللوح');
        fab.innerHTML = '<i class="fas fa-volume-up" aria-hidden="true"></i><span class="site-speaker-fab-waves" aria-hidden="true"><span></span><span></span><span></span></span>';

        let clickTimer = null;

        fab.addEventListener('click', (e) => {
            if (e.detail === 1) {
                clickTimer = window.setTimeout(() => {
                    clickTimer = null;
                    toggleSpeech();
                }, 220);
            }
        });

        fab.addEventListener('dblclick', (e) => {
            e.preventDefault();
            if (clickTimer) {
                clearTimeout(clickTimer);
                clickTimer = null;
            }
            showPanel();
        });

        fab.classList.add('is-visible');
        document.body.appendChild(fab);
        return fab;
    }

    function isInternalPageLink(anchor) {
        const href = anchor.getAttribute('href');
        if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) {
            return false;
        }
        if (anchor.target === '_blank' || anchor.hasAttribute('download')) return false;
        if (/\.(jpe?g|png|gif|webp|pdf|mp3|mp4)(\?|#|$)/i.test(href)) return false;

        try {
            const url = new URL(anchor.href, location.href);
            if (url.origin !== location.origin) return false;
            return url.pathname.endsWith('.html') || /\/index\.html?$/.test(url.pathname) || url.pathname === '/';
        } catch {
            return href.endsWith('.html');
        }
    }

    async function softNavigate(url) {
        savePlaybackState();
        try {
            const response = await fetch(url, { credentials: 'same-origin' });
            if (!response.ok) throw new Error('fetch failed');
            const html = await response.text();
            const doc = new DOMParser().parseFromString(html, 'text/html');
            const newMain = doc.querySelector('main');
            const currentMain = document.querySelector('main');
            if (!newMain || !currentMain) {
                window.location.href = url;
                return;
            }

            currentMain.replaceWith(newMain);
            if (doc.title) document.title = doc.title;

            const newMeta = doc.querySelector('meta[name="description"]');
            const currentMeta = document.querySelector('meta[name="description"]');
            if (newMeta && currentMeta) {
                currentMeta.setAttribute('content', newMeta.getAttribute('content') || '');
            }

            history.pushState({ softNav: true }, '', url);
            window.scrollTo(0, 0);
            document.dispatchEvent(new CustomEvent('site:page-changed'));
        } catch {
            window.location.href = url;
        }
    }

    function canUseSoftNavigation() {
        return location.protocol === 'http:' || location.protocol === 'https:';
    }

    function setupContinuousNavigation() {
        document.addEventListener('click', (e) => {
            const anchor = e.target.closest('a[href]');
            if (!anchor || !isInternalPageLink(anchor)) return;

            const url = new URL(anchor.href, location.href).href;
            if (url === location.href) {
                e.preventDefault();
                return;
            }

            if (isSpeaking || hasPausedProgress()) {
                markContinueOnNavigation();
            }

            if (!shouldPreserveAudioNav()) return;

            if (!canUseSoftNavigation()) return;

            e.preventDefault();
            softNavigate(url);
        }, true);

        window.addEventListener('popstate', () => {
            if (!shouldPreserveAudioNav() || !canUseSoftNavigation()) return;
            markContinueOnNavigation();
            softNavigate(location.href);
        });

        window.addEventListener('pagehide', () => {
            if (isSpeaking || hasPausedProgress()) {
                markContinueOnNavigation();
            } else {
                savePlaybackState();
            }
        });

        window.addEventListener('beforeunload', () => {
            if (isSpeaking) markContinueOnNavigation();
        });
    }

    function init() {
        initAiAudio();
        fabEl = buildFab();

        if (!localStorage.getItem(STORAGE_NEVER)) {
            panelEl = buildPanel();
        }

        if ('speechSynthesis' in window) {
            window.speechSynthesis.onvoiceschanged = () => {
                arabicVoice = pickArabicVoice();
            };
        }

        setupContinuousNavigation();

        const played = sessionStorage.getItem(STORAGE_SESSION);

        requestAnimationFrame(() => {
            hidePanel();
            if (!played && !prefersReducedMotion()) {
                fabEl?.classList.add('is-pulse');
            }
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
