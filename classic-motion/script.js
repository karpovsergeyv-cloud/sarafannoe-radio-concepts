(() => {
  "use strict";

  const navToggle = document.querySelector(".nav-toggle");
  const mobileMenu = document.querySelector("#mobile-menu");

  const closeMenu = () => {
    if (!navToggle || !mobileMenu) return;
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.setAttribute("aria-label", "Открыть меню");
    mobileMenu.hidden = true;
    document.body.classList.remove("nav-open");
  };

  if (navToggle && mobileMenu) {
    navToggle.addEventListener("click", () => {
      const willOpen = navToggle.getAttribute("aria-expanded") !== "true";
      navToggle.setAttribute("aria-expanded", String(willOpen));
      navToggle.setAttribute("aria-label", willOpen ? "Закрыть меню" : "Открыть меню");
      mobileMenu.hidden = !willOpen;
      document.body.classList.toggle("nav-open", willOpen);
    });

    mobileMenu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", closeMenu);
    });

    window.matchMedia("(min-width: 1281px)").addEventListener("change", (event) => {
      if (event.matches) closeMenu();
    });
  }

  const motionPage = document.querySelector("[data-motion-page]");

  if (motionPage) {
    const reduceMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const siteHeader = document.querySelector("[data-site-header]");
    const headerSentinel = document.querySelector("[data-header-sentinel]");

    if (siteHeader && headerSentinel && "IntersectionObserver" in window) {
      const headerObserver = new IntersectionObserver(([entry]) => {
        siteHeader.classList.toggle("is-compact", !entry.isIntersecting);
      });

      headerObserver.observe(headerSentinel);
    }

    const heroGallery = document.querySelector("[data-hero-gallery]");

    if (heroGallery) {
      const slides = Array.from(heroGallery.querySelectorAll("[data-hero-slide]"));
      const toggle = heroGallery.querySelector("[data-hero-motion-toggle]");
      const toggleLabel = heroGallery.querySelector("[data-hero-motion-label]");
      let activeIndex = Math.max(0, slides.findIndex((slide) => slide.classList.contains("is-active")));
      let timerId = 0;
      let userPaused = false;
      let pointerPaused = false;
      let focusPaused = false;

      const activateSlide = (nextIndex) => {
        slides.forEach((slide, index) => {
          const active = index === nextIndex;
          slide.classList.toggle("is-active", active);
          slide.setAttribute("aria-hidden", String(!active));
        });
        activeIndex = nextIndex;
      };

      const syncGallery = () => {
        window.clearTimeout(timerId);
        const paused = reduceMotionQuery.matches || userPaused || pointerPaused || focusPaused || document.hidden;
        heroGallery.classList.toggle("is-paused", paused);

        if (toggle) {
          toggle.hidden = reduceMotionQuery.matches;
          toggle.setAttribute("aria-pressed", String(userPaused));
        }
        if (toggleLabel) toggleLabel.textContent = userPaused ? "Продолжить" : "Пауза";

        if (!paused && slides.length > 1) {
          timerId = window.setTimeout(() => {
            activateSlide((activeIndex + 1) % slides.length);
            syncGallery();
          }, 8500);
        }
      };

      activateSlide(activeIndex);
      syncGallery();

      toggle?.addEventListener("click", () => {
        userPaused = !userPaused;
        syncGallery();
      });

      heroGallery.addEventListener("pointerenter", () => {
        pointerPaused = true;
        syncGallery();
      });

      heroGallery.addEventListener("pointerleave", () => {
        pointerPaused = false;
        syncGallery();
      });

      heroGallery.addEventListener("focusin", () => {
        focusPaused = true;
        syncGallery();
      });

      heroGallery.addEventListener("focusout", (event) => {
        if (event.relatedTarget && heroGallery.contains(event.relatedTarget)) return;
        focusPaused = false;
        syncGallery();
      });

      document.addEventListener("visibilitychange", syncGallery);
      reduceMotionQuery.addEventListener?.("change", () => {
        if (reduceMotionQuery.matches) activateSlide(0);
        syncGallery();
      });
    }

    const revealTargets = [
      [".facts-grid", "motion-reveal--sequence"],
      [".services-grid", "motion-reveal--mask"],
      [".process-board", "motion-reveal--sequence"],
      [".difference-media", "motion-reveal--media"],
      [".about-mosaic", "motion-reveal--media"],
      [".referral-grid", "motion-reveal--mask"]
    ]
      .map(([selector, variant]) => {
        const element = document.querySelector(selector);
        if (!element) return null;
        element.classList.add("motion-reveal", variant);
        return element;
      })
      .filter(Boolean);

    revealTargets.forEach((element) => {
      const bounds = element.getBoundingClientRect();
      if (bounds.top < window.innerHeight * 0.92 && bounds.bottom > 0) {
        element.classList.add("is-visible");
      }
    });

    motionPage.classList.add("motion-enhanced");

    if ("IntersectionObserver" in window) {
      const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      }, {
        rootMargin: "0px 0px -10% 0px",
        threshold: 0.12
      });

      revealTargets.forEach((element) => revealObserver.observe(element));
    } else {
      revealTargets.forEach((element) => element.classList.add("is-visible"));
    }
  }

  const accordion = document.querySelector("[data-accordion]");

  if (accordion) {
    const triggers = Array.from(accordion.querySelectorAll(".faq-trigger"));

    const setExpanded = (trigger, expanded) => {
      const panelId = trigger.getAttribute("aria-controls");
      const panel = panelId ? document.getElementById(panelId) : null;
      trigger.setAttribute("aria-expanded", String(expanded));
      if (panel) panel.hidden = !expanded;
    };

    triggers.forEach((trigger, index) => {
      trigger.addEventListener("click", () => {
        const isExpanded = trigger.getAttribute("aria-expanded") === "true";
        setExpanded(trigger, !isExpanded);
      });

      trigger.addEventListener("keydown", (event) => {
        let nextIndex = null;

        if (event.key === "ArrowDown") nextIndex = (index + 1) % triggers.length;
        if (event.key === "ArrowUp") nextIndex = (index - 1 + triggers.length) % triggers.length;
        if (event.key === "Home") nextIndex = 0;
        if (event.key === "End") nextIndex = triggers.length - 1;

        if (nextIndex !== null) {
          event.preventDefault();
          triggers[nextIndex].focus();
        }
      });
    });
  }

  const requestForm = document.querySelector("[data-request-form]");

  if (!requestForm) return;

  const nameInput = requestForm.querySelector("#request-name");
  const phoneInput = requestForm.querySelector("#request-phone");
  const roleSelect = requestForm.querySelector("#request-role");
  const consentInput = requestForm.querySelector("#request-consent");
  const phoneError = requestForm.querySelector("#phone-error");
  const formStatus = requestForm.querySelector("[data-form-status]");
  const submitButton = requestForm.querySelector("[data-submit-button]");
  const submitLabel = requestForm.querySelector("[data-submit-label]");

  const formatPhone = (value) => {
    let digits = value.replace(/\D/g, "");

    if (digits.startsWith("8")) digits = `7${digits.slice(1)}`;
    if (digits && !digits.startsWith("7")) digits = `7${digits}`;
    digits = digits.slice(0, 11);

    if (!digits) return "";

    const rest = digits.slice(1);
    let formatted = "+7";

    if (rest.length > 0) formatted += ` (${rest.slice(0, 3)}`;
    if (rest.length >= 3) formatted += ")";
    if (rest.length > 3) formatted += ` ${rest.slice(3, 6)}`;
    if (rest.length > 6) formatted += `-${rest.slice(6, 8)}`;
    if (rest.length > 8) formatted += `-${rest.slice(8, 10)}`;

    return formatted;
  };

  const setPhoneValidity = () => {
    if (!phoneInput || !phoneError) return true;
    const digits = phoneInput.value.replace(/\D/g, "");
    const isValid = digits.length === 11 && digits.startsWith("7");
    phoneInput.setAttribute("aria-invalid", String(!isValid));
    phoneError.textContent = isValid ? "" : "Введите номер полностью: +7 и 10 цифр.";
    return isValid;
  };

  const clearFieldInvalid = (field) => {
    if (field) field.removeAttribute("aria-invalid");
  };

  const setStatus = (message, state = "") => {
    if (!formStatus) return;
    formStatus.className = "form-status";
    if (state) formStatus.classList.add(`is-${state}`);
    formStatus.textContent = message;
  };

  if (phoneInput) {
    phoneInput.addEventListener("input", () => {
      phoneInput.value = formatPhone(phoneInput.value);
      if (phoneInput.getAttribute("aria-invalid") === "true") setPhoneValidity();
    });

    phoneInput.addEventListener("blur", () => {
      if (phoneInput.value === "+7") phoneInput.value = "";
      if (phoneInput.value) setPhoneValidity();
    });
  }

  [nameInput, roleSelect, consentInput].forEach((field) => {
    field?.addEventListener("input", () => clearFieldInvalid(field));
    field?.addEventListener("change", () => clearFieldInvalid(field));
  });

  requestForm.addEventListener("submit", (event) => {
    event.preventDefault();
    setStatus("");

    let firstInvalid = null;
    const errors = [];

    if (!nameInput?.value.trim()) {
      nameInput?.setAttribute("aria-invalid", "true");
      firstInvalid = nameInput;
      errors.push("Укажите имя.");
    }

    if (!setPhoneValidity()) {
      firstInvalid ||= phoneInput;
      errors.push("Проверьте номер телефона.");
    }

    if (!roleSelect?.value) {
      roleSelect?.setAttribute("aria-invalid", "true");
      firstInvalid ||= roleSelect;
      errors.push("Выберите, кого нужно подобрать.");
    }

    if (!consentInput?.checked) {
      consentInput?.setAttribute("aria-invalid", "true");
      firstInvalid ||= consentInput;
      errors.push("Подтвердите согласие на обработку персональных данных.");
    }

    if (firstInvalid) {
      setStatus(errors[0], "error");
      firstInvalid.focus();
      return;
    }

    requestForm.setAttribute("aria-busy", "true");
    if (submitButton) submitButton.disabled = true;
    if (submitLabel) submitLabel.textContent = "Отправка...";
    setStatus("Проверяем данные формы...", "loading");

    window.setTimeout(() => {
      requestForm.removeAttribute("aria-busy");
      requestForm.reset();
      if (phoneInput) phoneInput.removeAttribute("aria-invalid");
      if (submitButton) submitButton.disabled = false;
      if (submitLabel) submitLabel.textContent = "Подобрать персонал";
      setStatus("Спасибо! Заявка заполнена. Мы свяжемся с вами по указанному номеру.", "success");
    }, 850);
  });
})();
