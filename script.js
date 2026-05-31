/* ==========================================================================
   Cute & Interactive Date Invitation JavaScript
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  
  // ==========================================================================
  // Dom Elements
  // ==========================================================================
  const firstPage = document.getElementById('first-page');
  const emailPage = document.getElementById('email-page');
  const secondPage = document.getElementById('second-page');
  const btnYes = document.getElementById('btn-yes');
  const btnNo = document.getElementById('btn-no');
  const btnSettings = document.getElementById('btn-settings');
  const settingsModal = document.getElementById('settings-modal');
  const modalClose = document.getElementById('modal-close');
  const settingsForm = document.getElementById('settings-form');
  const btnResetSettings = document.getElementById('btn-reset-settings');
  
  // Email Form inputs
  const emailForm = document.getElementById('email-form');
  const gfEmailInput = document.getElementById('gf-email-input');
  const btnSubmitEmail = document.getElementById('btn-submit-email');

  // Form settings inputs
  const inputSenderEmail = document.getElementById('sender-email');
  const inputGirlfriendEmail = document.getElementById('girlfriend-email');
  const inputDateVal = document.getElementById('date-val');
  const inputPublicKey = document.getElementById('emailjs-public-key');
  const inputServiceId = document.getElementById('emailjs-service-id');
  const inputTemplateId = document.getElementById('emailjs-template-id');
  const inputConfirmTemplateId = document.getElementById('emailjs-confirm-template-id');
  
  // View elements
  const displayDate = document.getElementById('display-date');
  const toast = document.getElementById('toast');
  const toastMessage = document.getElementById('toast-message');

  // ==========================================================================
  // Safe LocalStorage Wrapper (prevents crashes under file:// protocol or incognito modes)
  // ==========================================================================
  const safeStorage = {
    getItem(key) {
      try {
        return localStorage.getItem(key);
      } catch (e) {
        console.warn('LocalStorage is disabled or restricted in this environment.', e);
        return null;
      }
    },
    setItem(key, value) {
      try {
        localStorage.setItem(key, value);
      } catch (e) {
        console.warn('LocalStorage write failed. Configurations will only last for this session.', e);
      }
    },
    removeItem(key) {
      try {
        localStorage.removeItem(key);
      } catch (e) {
        console.warn('LocalStorage remove failed.', e);
      }
    }
  };

  const DEFAULTS = {
    senderEmail: 'asenjooo1234@gmail.com',
    girlfriendEmail: 'g.narngua@gmail.com',
    dateVal: '2026.06.02',
    publicKey: '',
    serviceId: '',
    templateId: '',
    confirmTemplateId: ''
  };

  // Load configuration
  let config = {
    senderEmail: safeStorage.getItem('inv_sender_email') || DEFAULTS.senderEmail,
    girlfriendEmail: safeStorage.getItem('inv_girlfriend_email') || DEFAULTS.girlfriendEmail,
    dateVal: safeStorage.getItem('inv_date_val') || DEFAULTS.dateVal,
    publicKey: safeStorage.getItem('inv_pub_key') || DEFAULTS.publicKey,
    serviceId: safeStorage.getItem('inv_srv_id') || DEFAULTS.serviceId,
    templateId: safeStorage.getItem('inv_tmp_id') || DEFAULTS.templateId,
    confirmTemplateId: safeStorage.getItem('inv_conf_tmp_id') || DEFAULTS.confirmTemplateId
  };

  // Pre-fill form fields and display values
  function applyConfigToUI() {
    inputSenderEmail.value = config.senderEmail;
    inputGirlfriendEmail.value = config.girlfriendEmail;
    inputDateVal.value = config.dateVal;
    inputPublicKey.value = config.publicKey;
    inputServiceId.value = config.serviceId;
    inputTemplateId.value = config.templateId;
    inputConfirmTemplateId.value = config.confirmTemplateId;
    
    // Update the second page ticket date
    displayDate.textContent = config.dateVal;

    // Auto-init EmailJS if public key is available
    if (config.publicKey && typeof emailjs !== 'undefined') {
      emailjs.init(config.publicKey);
    }
  }
  
  applyConfigToUI();

  // Save configurations
  settingsForm.addEventListener('submit', (e) => {
    e.preventDefault();
    config.senderEmail = inputSenderEmail.value.trim();
    config.girlfriendEmail = inputGirlfriendEmail.value.trim();
    config.dateVal = inputDateVal.value.trim();
    config.publicKey = inputPublicKey.value.trim();
    config.serviceId = inputServiceId.value.trim();
    config.templateId = inputTemplateId.value.trim();
    config.confirmTemplateId = inputConfirmTemplateId.value.trim();

    safeStorage.setItem('inv_sender_email', config.senderEmail);
    safeStorage.setItem('inv_girlfriend_email', config.girlfriendEmail);
    safeStorage.setItem('inv_date_val', config.dateVal);
    safeStorage.setItem('inv_pub_key', config.publicKey);
    safeStorage.setItem('inv_srv_id', config.serviceId);
    safeStorage.setItem('inv_tmp_id', config.templateId);
    safeStorage.setItem('inv_conf_tmp_id', config.confirmTemplateId);

    applyConfigToUI();
    closeModal();
    showToast('Settings saved successfully! ⚙️💖');
  });

  // Reset configurations
  btnResetSettings.addEventListener('click', () => {
    if (confirm('Are you sure you want to reset settings to default values?')) {
      safeStorage.removeItem('inv_sender_email');
      safeStorage.removeItem('inv_girlfriend_email');
      safeStorage.removeItem('inv_date_val');
      safeStorage.removeItem('inv_pub_key');
      safeStorage.removeItem('inv_srv_id');
      safeStorage.removeItem('inv_tmp_id');
      safeStorage.removeItem('inv_conf_tmp_id');
      
      config = { ...DEFAULTS };
      applyConfigToUI();
      closeModal();
      showToast('Settings reset to default! 🌸');
    }
  });

  // Modal open/close actions
  btnSettings.addEventListener('click', openModal);
  modalClose.addEventListener('click', closeModal);
  settingsModal.addEventListener('click', (e) => {
    if (e.target === settingsModal) closeModal();
  });

  function openModal() {
    settingsModal.classList.remove('hidden');
  }

  function closeModal() {
    settingsModal.classList.add('hidden');
  }

  // Helper toast notification
  function showToast(message, isError = false) {
    toastMessage.textContent = message;
    toast.classList.remove('hidden');
    if (isError) {
      toast.classList.add('error-toast');
    } else {
      toast.classList.remove('error-toast');
    }
    
    setTimeout(() => {
      toast.classList.add('hidden');
    }, 4500);
  }


  // ==========================================================================
  // No Button: Escaping Mechanism & Dialogues
  // ==========================================================================
  const persuasiveTexts = [
    "Are you sure? 🥺",
    "Think again please ❤️",
    "It will be fun, I promise 🎠",
    "One more chance? 💕",
    "Lotte World is waiting for us 🎡"
  ];
  let persuasionIndex = 0;

  function escapeNoButton() {
    // Flag the button as escaped so css absolute layout applies
    if (!btnNo.classList.contains('escaped')) {
      btnNo.classList.add('escaped');
    }

    const btnWidth = btnNo.offsetWidth;
    const btnHeight = btnNo.offsetHeight;

    // Avoid borders, leave a safe margin of 20px
    const padding = 20;
    const maxX = Math.max(window.innerWidth - btnWidth - padding, padding);
    const maxY = Math.max(window.innerHeight - btnHeight - padding, padding);

    // Calculate a location
    let newX = Math.random() * (maxX - padding) + padding;
    let newY = Math.random() * (maxY - padding) + padding;

    // Clamp coordinates to ensure the button is always fully visible on-screen
    newX = Math.max(padding, Math.min(newX, window.innerWidth - btnWidth - padding));
    newY = Math.max(padding, Math.min(newY, window.innerHeight - btnHeight - padding));

    // Set position fixed values
    btnNo.style.left = `${newX}px`;
    btnNo.style.top = `${newY}px`;

    // Swap button texts to keep it cute
    btnNo.innerHTML = persuasiveTexts[persuasionIndex] + " 😢";
    persuasionIndex = (persuasionIndex + 1) % persuasiveTexts.length;

    // Playful micro-bounce on trigger
    btnNo.style.transform = 'scale(0.85)';
    setTimeout(() => {
      btnNo.style.transform = 'scale(1)';
    }, 150);
  }

  // Escape No button on hover (desktop) and touch (mobile)
  btnNo.addEventListener('mouseover', escapeNoButton);
  btnNo.addEventListener('touchstart', (e) => {
    e.preventDefault(); // Prevents tapping/clicking behavior on mobile
    escapeNoButton();
  });
  
  // Safety: If somehow clicked, trigger the escape anyway
  btnNo.addEventListener('click', (e) => {
    e.preventDefault();
    escapeNoButton();
  });


  // ==========================================================================
  // Canvas Particles Background (Hearts, Stars & Sparkles)
  // ==========================================================================
  const bgCanvas = document.getElementById('floating-canvas');
  const bgCtx = bgCanvas.getContext('2d');
  let bgParticles = [];
  const maxBgParticles = 40;

  function resizeBgCanvas() {
    bgCanvas.width = window.innerWidth;
    bgCanvas.height = window.innerHeight;
  }
  
  window.addEventListener('resize', resizeBgCanvas);
  resizeBgCanvas();

  class BackgroundParticle {
    constructor() {
      this.reset();
      this.y = Math.random() * bgCanvas.height; // Spread initially
    }

    reset() {
      this.x = Math.random() * bgCanvas.width;
      this.y = bgCanvas.height + 20;
      this.size = Math.random() * 8 + 6;
      this.speedY = Math.random() * 0.7 + 0.3;
      this.speedX = Math.random() * 0.4 - 0.2;
      this.opacity = Math.random() * 0.4 + 0.2;
      // 0 = heart, 1 = star, 2 = glowing sparkle bubble
      this.type = Math.floor(Math.random() * 3);
      this.wobble = Math.random() * Math.PI;
      this.wobbleSpeed = Math.random() * 0.02 + 0.01;
      this.rotation = Math.random() * Math.PI;
      this.rotSpeed = Math.random() * 0.01 - 0.005;
    }

    update() {
      this.y -= this.speedY;
      this.wobble += this.wobbleSpeed;
      this.x += Math.sin(this.wobble) * 0.3 + this.speedX;
      this.rotation += this.rotSpeed;

      // Reset when particle goes off screen
      if (this.y < -20 || this.x < -20 || this.x > bgCanvas.width + 20) {
        this.reset();
      }
    }

    draw() {
      bgCtx.save();
      bgCtx.translate(this.x, this.y);
      bgCtx.rotate(this.rotation);
      bgCtx.globalAlpha = this.opacity;

      if (this.type === 0) {
        // Draw Heart
        bgCtx.fillStyle = '#FF85A1';
        bgCtx.beginPath();
        const d = this.size;
        bgCtx.moveTo(0, d / 4);
        bgCtx.bezierCurveTo(d / 2, -d / 2, d * 1.2, -d / 3, 0, d);
        bgCtx.bezierCurveTo(-d * 1.2, -d / 3, -d / 2, -d / 2, 0, d / 4);
        bgCtx.fill();
      } else if (this.type === 1) {
        // Draw Star
        bgCtx.fillStyle = '#FFF8D6';
        bgCtx.beginPath();
        const spikes = 5;
        const outerRadius = this.size;
        const innerRadius = this.size / 2;
        let cx = 0, cy = 0;
        let rot = Math.PI / 2 * 3;
        let step = Math.PI / spikes;

        bgCtx.moveTo(0, -outerRadius);
        for (let i = 0; i < spikes; i++) {
          cx = Math.cos(rot) * outerRadius;
          cy = Math.sin(rot) * outerRadius;
          bgCtx.lineTo(cx, cy);
          rot += step;

          cx = Math.cos(rot) * innerRadius;
          cy = Math.sin(rot) * innerRadius;
          bgCtx.lineTo(cx, cy);
          rot += step;
        }
        bgCtx.closePath();
        bgCtx.fill();
      } else {
        // Draw Glowing Bubble
        const gradient = bgCtx.createRadialGradient(0, 0, 0, 0, 0, this.size);
        gradient.addColorStop(0, 'rgba(255, 240, 245, 0.8)');
        gradient.addColorStop(1, 'rgba(240, 220, 255, 0)');
        bgCtx.fillStyle = gradient;
        bgCtx.beginPath();
        bgCtx.arc(0, 0, this.size, 0, Math.PI * 2);
        bgCtx.fill();
      }

      bgCtx.restore();
    }
  }

  // Populate floating particles
  for (let i = 0; i < maxBgParticles; i++) {
    bgParticles.push(new BackgroundParticle());
  }

  // Animation Loop for Background Canvas
  function animateBackground() {
    bgCtx.clearRect(0, 0, bgCanvas.width, bgCanvas.height);
    for (let p of bgParticles) {
      p.update();
      p.draw();
    }
    requestAnimationFrame(animateBackground);
  }
  
  animateBackground();


  // ==========================================================================
  // Canvas Confetti Engine (Page 2 Launch Burst)
  // ==========================================================================
  const confCanvas = document.getElementById('confetti-canvas');
  const confCtx = confCanvas.getContext('2d');
  let confParticles = [];
  let confAnimationId = null;

  function resizeConfCanvas() {
    confCanvas.width = window.innerWidth;
    confCanvas.height = window.innerHeight;
  }
  
  window.addEventListener('resize', resizeConfCanvas);
  resizeConfCanvas();

  const confettiColors = ['#FF5C8A', '#FF85A1', '#FFC2D1', '#E8DBFC', '#FFF0F2', '#27AE60', '#FFF8D6', '#E2DCF7'];

  class ConfettiFlake {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.size = Math.random() * 8 + 5;
      this.color = confettiColors[Math.floor(Math.random() * confettiColors.length)];
      this.speedX = Math.random() * 12 - 6;
      this.speedY = Math.random() * -12 - 8; // Burst upwards
      this.gravity = 0.35;
      this.drag = 0.97;
      this.opacity = 1;
      this.rotation = Math.random() * 360;
      this.rotSpeed = Math.random() * 10 - 5;
    }

    update() {
      this.speedY += this.gravity;
      this.speedX *= this.drag;
      this.speedY *= this.drag;
      this.x += this.speedX;
      this.y += this.speedY;
      this.rotation += this.rotSpeed;
      this.opacity -= 0.007;
    }

    draw() {
      confCtx.save();
      confCtx.translate(this.x, this.y);
      confCtx.rotate(this.rotation * Math.PI / 180);
      confCtx.globalAlpha = this.opacity;
      confCtx.fillStyle = this.color;
      
      // Alternate between squares and circles for confetti shapes
      if (this.size % 2 === 0) {
        confCtx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
      } else {
        confCtx.beginPath();
        confCtx.arc(0, 0, this.size / 2, 0, Math.PI * 2);
        confCtx.fill();
      }
      confCtx.restore();
    }
  }

  function triggerConfettiBurst() {
    // Generate particles from both bottom corners pointing inward/upward
    const count = 150;
    
    // Bottom left burst
    for (let i = 0; i < count / 2; i++) {
      const flake = new ConfettiFlake(50, confCanvas.height - 50);
      flake.speedX = Math.random() * 14 + 5; // Direct rightward
      confParticles.push(flake);
    }

    // Bottom right burst
    for (let i = 0; i < count / 2; i++) {
      const flake = new ConfettiFlake(confCanvas.width - 50, confCanvas.height - 50);
      flake.speedX = Math.random() * -14 - 5; // Direct leftward
      confParticles.push(flake);
    }

    // Run animation
    if (!confAnimationId) {
      animateConfetti();
    }
  }

  function animateConfetti() {
    confCtx.clearRect(0, 0, confCanvas.width, confCanvas.height);
    
    for (let i = confParticles.length - 1; i >= 0; i--) {
      const p = confParticles[i];
      p.update();
      p.draw();

      // Remove invisible particles
      if (p.opacity <= 0 || p.y > confCanvas.height + 20) {
        confParticles.splice(i, 1);
      }
    }

    if (confParticles.length > 0) {
      confAnimationId = requestAnimationFrame(animateConfetti);
    } else {
      confCtx.clearRect(0, 0, confCanvas.width, confCanvas.height);
      confAnimationId = null;
    }
  }


  // ==========================================================================
  // EmailJS Dispatches & Flows
  // ==========================================================================
  async function sendNotificationAndConfirmation(gfEmail, acceptanceTime, browserInfo) {
    // 1. Notification Email Parameters (To: asenjooo1234@gmail.com)
    const notificationParams = {
      subject: "She said yes to the Lotte World date 🎡❤️",
      message: `She accepted the Lotte World date invitation.

Date: 2026.06.02
Place: Lotte World

Acceptance Date & Time: ${acceptanceTime}
Her Email Address: ${gfEmail}
Browser Information: ${browserInfo}

A cute and happy memory is waiting for us.`,
      to_email: config.senderEmail, // Sent to you!
      gf_email: gfEmail,
      acceptance_time: acceptanceTime,
      browser_info: browserInfo,
      date_val: config.dateVal,
      place_val: "Lotte World"
    };

    // 2. Confirmation Email Parameters (To: girlfriend's email)
    const confirmationParams = {
      subject: "Lotte World Date Confirmation 🎡❤️",
      message: `Thank you for accepting the invitation.

Date: 2026.06.02
Place: Lotte World

I am looking forward to spending a wonderful day with you.

See you soon ❤️`,
      to_email: gfEmail, // Sent to her!
      date_val: config.dateVal,
      place_val: "Lotte World"
    };

    // Case A: If EmailJS is NOT configured in settings
    if (!config.publicKey || !config.serviceId || !config.templateId || !config.confirmTemplateId) {
      console.warn("EmailJS credentials are not fully configured in settings. Emulating email sending.");
      showToast("Email simulation success! Pre-fills noted successfully! 💌");

      // Print simulated payloads to developer tools
      console.log("==========================================");
      console.log("💌 [EMAIL 1: NOTIFICATION TO YOU]");
      console.log("To:", config.senderEmail);
      console.log("Subject:", notificationParams.subject);
      console.log("Body:\n", notificationParams.message);
      console.log("------------------------------------------");
      console.log("💌 [EMAIL 2: CONFIRMATION TO HER]");
      console.log("To:", gfEmail);
      console.log("Subject:", confirmationParams.subject);
      console.log("Body:\n", confirmationParams.message);
      console.log("==========================================");
      
      // Proceed directly
      proceedToSuccessPage();
      return;
    }

    // Case B: Live EmailJS dispatching
    showToast("Drafting your ticket and sending emails... 🕊️");
    btnSubmitEmail.innerHTML = 'Sending... <i class="fa-solid fa-spinner fa-spin"></i>';

    try {
      // Dispatch both emails concurrently using the saved template IDs
      await Promise.all([
        emailjs.send(config.serviceId, config.templateId, notificationParams),
        emailjs.send(config.serviceId, config.confirmTemplateId, confirmationParams)
      ]);

      console.log("Emails successfully sent via EmailJS!");
      showToast("Success! Confirmation and notifications sent! 🎟️💌");
    } catch (error) {
      console.error("EmailJS sending failed:", error);
      showToast("Verification failed. Transitioning anyway, please check API keys! 🌸", true);
    } finally {
      proceedToSuccessPage();
    }
  }

  function proceedToSuccessPage() {
    // Explode confetti
    triggerConfettiBurst();

    setTimeout(() => {
      // Transition to final page
      emailPage.classList.add('hidden');
      emailPage.classList.remove('active');
      
      secondPage.classList.remove('hidden');
      secondPage.classList.add('active');

      // Continuous bursts to celebrate!
      setTimeout(triggerConfettiBurst, 400);
      setTimeout(triggerConfettiBurst, 1000);
    }, 600);
  }

  // ==========================================================================
  // Navigation Page Event Bindings
  // ==========================================================================
  
  // Step 1: Click Yes, transition from First Page to Email Input Page
  btnYes.addEventListener('click', () => {
    btnYes.disabled = true;
    btnNo.disabled = true;

    firstPage.classList.add('hidden');
    firstPage.classList.remove('active');

    emailPage.classList.remove('hidden');
    emailPage.classList.add('active');
    
    // Auto-focus email input for ease of use
    gfEmailInput.focus();
  });

  // Step 2: Girlfriend enters her email and submits
  emailForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const gfEmail = gfEmailInput.value.trim();
    if (!gfEmail) return;

    // Disable input and button to prevent double submit
    gfEmailInput.disabled = true;
    btnSubmitEmail.disabled = true;

    // Fetch user environment metadata
    const acceptanceTime = new Date().toLocaleString();
    const browserInfo = navigator.userAgent;

    // Trigger EmailJS dispatches
    sendNotificationAndConfirmation(gfEmail, acceptanceTime, browserInfo);
  });

});
