(function () {
    'use strict';

    const config = window.APP_CONFIG || {};
    const TELEGRAM_URL     = (config.telegramUrl || '').trim();
    const REDIRECT_SECONDS = config.redirectSeconds || 5;

    const countdownNum    = document.getElementById('countdownNum');
    const countdownCircle = document.getElementById('countdownCircle');
    const countdownLabel  = document.getElementById('countdownLabel');
    const telegramBtn     = document.getElementById('telegramBtn');
    const configWarning   = document.getElementById('configWarning');

    let secondsLeft = REDIRECT_SECONDS;
    let redirected  = false;
    let timer       = null;

    const isConfigured =
        TELEGRAM_URL &&
        TELEGRAM_URL !== '%%TELEGRAM_URL%%' &&
        /^https?:\/\//i.test(TELEGRAM_URL);

    if (!isConfigured) {
        showConfigWarning();
    } else {
        telegramBtn.href = TELEGRAM_URL;
        telegramBtn.addEventListener('click', (e) => {
            e.preventDefault();
            redirectNow();
        });
        countdownNum.textContent = secondsLeft;
        updateCircle();
        startCountdown();
    }

    function startCountdown() {
        timer = setInterval(() => {
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

    function redirectNow() {
        if (redirected || !isConfigured) return;
        redirected = true;
        clearInterval(timer);
        countdownLabel.textContent = 'Redirecting now…';
        window.location.href = TELEGRAM_URL;
    }

    function showConfigWarning() {
        configWarning.classList.add('show');
        telegramBtn.setAttribute('aria-disabled', 'true');
        telegramBtn.style.opacity = '0.5';
        telegramBtn.style.pointerEvents = 'none';
        countdownNum.textContent = '—';
        countdownLabel.textContent = 'Waiting for configuration…';
    }
})();
