// ═══════════════════════════════════════════════════════════
// Telegram Redirect – Frontend Logic
// ═══════════════════════════════════════════════════════════

(function () {
    'use strict';

    // ─────────────────────────────────────────────────────
    // 1. Read injected config
    // ─────────────────────────────────────────────────────
    const config = window.APP_CONFIG || {};
    const TELEGRAM_URL     = config.telegramUrl || '';
    const REDIRECT_SECONDS = config.redirectSeconds || 5;

    // ─────────────────────────────────────────────────────
    // 2. DOM refs
    // ─────────────────────────────────────────────────────
    const countdownNum    = document.getElementById('countdownNum');
    const countdownCircle = document.getElementById('countdownCircle');
    const countdownLabel  = document.getElementById('countdownLabel');
    const telegramBtn     = document.getElementById('telegramBtn');
    const configWarning   = document.getElementById('configWarning');

    // ─────────────────────────────────────────────────────
    // 3. State
    // ─────────────────────────────────────────────────────
    let secondsLeft = REDIRECT_SECONDS;
    let redirected  = false;
    let timer       = null;

    // ─────────────────────────────────────────────────────
    // 4. Validate the injected URL
    // ─────────────────────────────────────────────────────
    const isConfigured =
        TELEGRAM_URL &&
        TELEGRAM_URL !== '%%TELEGRAM_URL%%' &&
        /^https?:\/\//i.test(TELEGRAM_URL.trim());

    // ─────────────────────────────────────────────────────
    // 5. Boot
    // ─────────────────────────────────────────────────────
    if (!isConfigured) {
        showConfigWarning();
    } else {
        telegramBtn.href = TELEGRAM_URL;
        telegramBtn.addEventListener('click', function (e) {
            e.preventDefault();
            redirectNow();
        });

        countdownNum.textContent = secondsLeft;
        updateCircle();
        startCountdown();
    }

    // ─────────────────────────────────────────────────────
    // 6. Countdown loop
    // ─────────────────────────────────────────────────────
    function startCountdown() {
        timer = setInterval(function () {
            secondsLeft--;
            countdownNum.textContent = secondsLeft;
            updateCircle();

            if (secondsLeft <= 0) {
                clearInterval(timer);
                redirectNow();
            }
        }, 1000);
    }

    function updateCircle() {
        const progress = (REDIRECT_SECONDS - secondsLeft) / REDIRECT_SECONDS;
        countdownCircle.style.strokeDashoffset = (283 * progress).toString();
    }

    // ─────────────────────────────────────────────────────
    // 7. Redirect
    // ─────────────────────────────────────────────────────
    function redirectNow() {
        if (redirected || !isConfigured) return;
        redirected = true;
        clearInterval(timer);
        countdownLabel.textContent = 'Redirecting now…';
        window.location.href = TELEGRAM_URL;
    }

    // ─────────────────────────────────────────────────────
    // 8. Missing config UI
    // ─────────────────────────────────────────────────────
    function showConfigWarning() {
        configWarning.classList.add('show');
        telegramBtn.setAttribute('aria-disabled', 'true');
        telegramBtn.style.opacity = '0.5';
        telegramBtn.style.pointerEvents = 'none';
        countdownNum.textContent = '—';
        countdownLabel.textContent = 'Waiting for configuration…';
    }
})();
