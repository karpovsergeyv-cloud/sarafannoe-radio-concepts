(() => {
  "use strict";

  const body = document.body;
  const header = document.querySelector("[data-header]");
  const navToggle = document.querySelector(".nav-toggle");
  const primaryNav = document.querySelector("#primary-nav");

  const closeMenu = (returnFocus = false) => {
    if (!header || !navToggle) return;
    header.dataset.open = "false";
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.setAttribute("aria-label", "Открыть меню");
    if (returnFocus) navToggle.focus();
  };

  if (header && navToggle && primaryNav) {
    navToggle.addEventListener("click", () => {
      const isOpen = navToggle.getAttribute("aria-expanded") === "true";
      header.dataset.open = String(!isOpen);
      navToggle.setAttribute("aria-expanded", String(!isOpen));
      navToggle.setAttribute("aria-label", isOpen ? "Открыть меню" : "Закрыть меню");
    });

    primaryNav.addEventListener("click", (event) => {
      if (event.target.closest("a")) closeMenu();
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && header.dataset.open === "true") {
        closeMenu(true);
      }
    });

    const desktopQuery = window.matchMedia("(min-width: 1161px)");
    desktopQuery.addEventListener("change", (event) => {
      if (event.matches) closeMenu();
    });
  }

  document.querySelectorAll("[data-accordion] button[aria-controls]").forEach((button) => {
    button.addEventListener("click", () => {
      const accordion = button.closest("[data-accordion]");
      const targetId = button.getAttribute("aria-controls");
      const panel = document.getElementById(targetId);
      const willOpen = button.getAttribute("aria-expanded") !== "true";

      if (!accordion || !panel) return;

      accordion.querySelectorAll("button[aria-controls]").forEach((otherButton) => {
        const otherPanel = document.getElementById(otherButton.getAttribute("aria-controls"));
        otherButton.setAttribute("aria-expanded", "false");
        if (otherPanel) otherPanel.hidden = true;
      });

      button.setAttribute("aria-expanded", String(willOpen));
      panel.hidden = !willOpen;
    });
  });

  const form = document.querySelector("[data-request-form]");
  const phoneInput = document.querySelector("#request-phone");

  const formatPhone = (value) => {
    let digits = value.replace(/\D/g, "");
    if (digits.startsWith("7") || digits.startsWith("8")) digits = digits.slice(1);
    digits = digits.slice(0, 10);
    if (!digits.length) return "";

    let result = "+7 (" + digits.slice(0, 3);
    if (digits.length >= 3) result += ") " + digits.slice(3, 6);
    if (digits.length >= 6) result += "-" + digits.slice(6, 8);
    if (digits.length >= 8) result += "-" + digits.slice(8, 10);
    return result;
  };

  if (phoneInput) {
    phoneInput.addEventListener("input", () => {
      phoneInput.value = formatPhone(phoneInput.value);
      if (phoneInput.getAttribute("aria-invalid") === "true") validateField(phoneInput);
    });
  }

  const errorMessages = {
    "request-name": "Введите имя, минимум два символа.",
    "request-phone": "Введите телефон в формате +7 (999) 123-45-67.",
    "request-role": "Выберите категорию специалиста.",
    "request-consent": "Подтвердите согласие, чтобы продолжить."
  };

  function isFieldValid(field) {
    if (field.id === "request-name") return field.value.trim().length >= 2;
    if (field.id === "request-phone") return /^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/.test(field.value);
    if (field.id === "request-role") return field.value !== "";
    if (field.id === "request-consent") return field.checked;
    return field.checkValidity();
  }

  function validateField(field) {
    const valid = isFieldValid(field);
    const wrapper = field.closest(".form-field, .form-consent");
    const error = document.querySelector(`[data-error-for="${field.id}"]`);

    field.setAttribute("aria-invalid", String(!valid));
    if (wrapper) wrapper.classList.toggle("is-invalid", !valid);
    if (error) error.textContent = valid ? "" : errorMessages[field.id] || "Проверьте это поле.";
    return valid;
  }

  if (form) {
    const fields = Array.from(form.querySelectorAll("input[required], select[required]"));
    const submitButton = form.querySelector("button[type='submit']");
    const status = form.querySelector("[data-form-status]");
    let stateTimers = [];

    const clearStateTimers = () => {
      stateTimers.forEach((timer) => window.clearTimeout(timer));
      stateTimers = [];
    };

    fields.forEach((field) => {
      field.addEventListener("blur", () => {
        if (field.value || field.checked) validateField(field);
      });

      field.addEventListener("change", () => {
        if (field.getAttribute("aria-invalid") === "true") validateField(field);
      });
    });

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      clearStateTimers();

      const validationResults = fields.map((field) => ({
        field,
        valid: validateField(field)
      }));
      const invalidField = validationResults.find((result) => !result.valid)?.field;
      if (invalidField) {
        if (status) {
          status.className = "form-status is-error";
          status.textContent = "Проверьте отмеченные поля.";
        }
        invalidField.focus();
        return;
      }

      form.classList.add("is-loading");
      form.setAttribute("aria-busy", "true");
      if (submitButton) submitButton.disabled = true;
      if (status) {
        status.className = "form-status is-loading";
        status.textContent = "Проверяем заполнение формы.";
      }

      stateTimers.push(window.setTimeout(() => {
        if (status) {
          status.className = "form-status is-success";
          status.textContent = "Поля заполнены корректно.";
        }
      }, 650));

      stateTimers.push(window.setTimeout(() => {
        form.classList.remove("is-loading");
        form.setAttribute("aria-busy", "false");
        if (submitButton) submitButton.disabled = false;
        if (status) {
          status.className = "form-status is-error";
          status.textContent = "Прототип: заявка не отправлена. Форма будет подключена перед запуском.";
        }
      }, 1350));
    });
  }

  window.requestAnimationFrame(() => {
    body.classList.add("motion-ready");
  });
})();
