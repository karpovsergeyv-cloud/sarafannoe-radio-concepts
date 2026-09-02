(() => {
  "use strict";

  const openers = document.querySelectorAll("[data-open-applicant-form]");
  if (!openers.length || typeof HTMLDialogElement === "undefined") return;

  const dialog = document.createElement("dialog");
  dialog.className = "applicant-dialog";
  dialog.id = "applicant-dialog";
  dialog.setAttribute("aria-labelledby", "applicant-dialog-title");
  dialog.setAttribute("aria-describedby", "applicant-dialog-description");
  dialog.dataset.applicantDialog = "";
  dialog.innerHTML = `
    <div class="applicant-modal">
      <header class="applicant-modal__header">
        <div>
          <h2 id="applicant-dialog-title" tabindex="-1">Анкета соискателя</h2>
          <p id="applicant-dialog-description">Расскажите о себе, опыте и предпочтительном формате работы. Анкету можно заполнить по шагам. Поля со звёздочкой обязательны.</p>
        </div>
        <button class="applicant-modal__close" type="button" aria-label="Закрыть анкету" data-close-applicant-form>
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 5l14 14M19 5 5 19"></path></svg>
        </button>
      </header>

      <form class="applicant-form" data-applicant-form novalidate>
        <div class="applicant-progress">
          <p aria-live="polite" data-step-caption>Шаг 1 из 6</p>
          <ol aria-label="Этапы заполнения анкеты">
            <li data-step-marker data-number="1" aria-current="step">О вас</li>
            <li data-step-marker data-number="2">Адрес</li>
            <li data-step-marker data-number="3">Документы</li>
            <li data-step-marker data-number="4">Опыт</li>
            <li data-step-marker data-number="5">Семьи</li>
            <li data-step-marker data-number="6">Файлы</li>
          </ol>
        </div>

        <div class="applicant-error-summary" role="alert" tabindex="-1" hidden data-applicant-errors>
          <h3>Проверьте обязательные поля</h3>
          <ul></ul>
        </div>

        <section class="applicant-step" aria-labelledby="applicant-step-1-title" data-applicant-step>
          <h3 id="applicant-step-1-title">Основные данные</h3>
          <p>Контакты и базовые сведения нужны, чтобы сопоставить анкету с подходящими вакансиями.</p>
          <div class="applicant-grid">
            <div class="applicant-field applicant-field--wide">
              <label for="applicant-full-name">ФИО *</label>
              <input id="applicant-full-name" name="full_name" type="text" autocomplete="name" minlength="5" required>
            </div>
            <div class="applicant-field">
              <label for="applicant-birth-date">Полная дата рождения *</label>
              <input id="applicant-birth-date" name="birth_date" type="date" autocomplete="bday" required data-birth-date>
            </div>
            <div class="applicant-field">
              <label for="applicant-age">Полных лет</label>
              <input id="applicant-age" name="age" type="number" readonly tabindex="-1" data-age>
            </div>
            <div class="applicant-field">
              <label for="applicant-zodiac">Знак зодиака</label>
              <input id="applicant-zodiac" name="zodiac" type="text" readonly tabindex="-1" data-zodiac>
            </div>
            <div class="applicant-field">
              <label for="applicant-phone">Номер телефона *</label>
              <input id="applicant-phone" name="phone" type="tel" autocomplete="tel" minlength="7" required>
            </div>
            <div class="applicant-field">
              <label for="applicant-email">Электронная почта *</label>
              <input id="applicant-email" name="email" type="email" autocomplete="email" required>
            </div>
            <div class="applicant-field">
              <label for="applicant-height">Рост, см *</label>
              <input id="applicant-height" name="height_cm" type="number" inputmode="numeric" min="1" required>
            </div>
            <div class="applicant-field">
              <label for="applicant-weight">Вес, кг *</label>
              <input id="applicant-weight" name="weight_kg" type="number" inputmode="numeric" min="1" required>
            </div>
            <div class="applicant-field applicant-field--wide">
              <label for="applicant-religion">Вероисповедание <span>необязательно</span></label>
              <input id="applicant-religion" name="religion" type="text" autocomplete="off" aria-describedby="applicant-religion-help">
              <small class="applicant-sensitive-note" id="applicant-religion-help">Это поле можно оставить пустым.</small>
            </div>
          </div>
        </section>

        <section class="applicant-step" aria-labelledby="applicant-step-2-title" data-applicant-step hidden>
          <h3 id="applicant-step-2-title">Гражданство и место проживания</h3>
          <p>Укажите актуальные сведения о документах и месте, откуда вам удобно добираться на работу.</p>
          <div class="applicant-grid">
            <div class="applicant-field">
              <label for="applicant-citizenship">Гражданство *</label>
              <input id="applicant-citizenship" name="citizenship" type="text" required>
            </div>
            <div class="applicant-field">
              <label for="applicant-second-citizenship">Второе гражданство <span>необязательно</span></label>
              <input id="applicant-second-citizenship" name="second_citizenship" type="text">
            </div>
            <div class="applicant-field">
              <label for="applicant-foreign-passport">Загранпаспорт *</label>
              <select id="applicant-foreign-passport" name="foreign_passport" required>
                <option value="">Выберите вариант</option>
                <option value="yes">Есть</option>
                <option value="none">Нет</option>
                <option value="pending">В процессе оформления</option>
              </select>
            </div>
            <div class="applicant-field">
              <label for="applicant-visas">Действующие визы <span>необязательно</span></label>
              <textarea id="applicant-visas" name="visas" rows="3" placeholder="Укажите страны и сроки действия"></textarea>
            </div>
            <div class="applicant-field">
              <label for="applicant-marital-status">Семейное положение *</label>
              <select id="applicant-marital-status" name="marital_status" required>
                <option value="">Выберите вариант</option>
                <option>Не состою в браке</option>
                <option>Состою в браке</option>
                <option>Разведён(а)</option>
                <option>Вдовец или вдова</option>
              </select>
            </div>
            <div class="applicant-field">
              <label for="applicant-children">Дети *</label>
              <textarea id="applicant-children" name="children" rows="3" placeholder="Возраст детей или «Нет»" required></textarea>
            </div>
            <div class="applicant-field applicant-field--wide">
              <label for="applicant-registration">Постоянная регистрация *</label>
              <input id="applicant-registration" name="permanent_registration" type="text" required>
            </div>
            <div class="applicant-field">
              <label for="applicant-metro">Ближайшее метро *</label>
              <input id="applicant-metro" name="nearest_metro" type="text" required>
            </div>
            <div class="applicant-field">
              <label for="applicant-residence">Место фактического проживания *</label>
              <input id="applicant-residence" name="actual_residence" type="text" required>
            </div>
          </div>
        </section>

        <section class="applicant-step" aria-labelledby="applicant-step-3-title" data-applicant-step hidden>
          <h3 id="applicant-step-3-title">Образование и документы</h3>
          <p>Добавьте профильное и дополнительное образование, а также сведения, важные для отдельных вакансий.</p>
          <div class="applicant-grid">
            <div class="applicant-field">
              <label for="applicant-education-years">Образование и годы обучения *</label>
              <input id="applicant-education-years" name="education_years" type="text" placeholder="Учебное заведение, годы" required>
            </div>
            <div class="applicant-field">
              <label for="applicant-specialty">Специальность по образованию *</label>
              <input id="applicant-specialty" name="education_specialty" type="text" required>
            </div>
            <div class="applicant-field applicant-field--wide">
              <label for="applicant-additional-education">Дополнительное образование и курсы <span>необязательно</span></label>
              <textarea id="applicant-additional-education" name="additional_education" rows="4"></textarea>
            </div>
            <div class="applicant-field">
              <label for="applicant-driving-license">Водительские права *</label>
              <select id="applicant-driving-license" name="driving_license" required>
                <option value="">Выберите вариант</option>
                <option value="none">Нет</option>
                <option value="b">Категория B</option>
                <option value="other">Другие категории</option>
              </select>
            </div>
            <div class="applicant-field">
              <label for="applicant-driving-experience">Стаж вождения, лет</label>
              <input id="applicant-driving-experience" name="driving_experience_years" type="number" inputmode="numeric" min="0">
            </div>
            <div class="applicant-field">
              <label for="applicant-car">Наличие автомобиля *</label>
              <select id="applicant-car" name="own_car" required>
                <option value="">Выберите вариант</option>
                <option value="yes">Есть</option>
                <option value="none">Нет</option>
              </select>
            </div>
            <div class="applicant-field">
              <label for="applicant-military-service">Служба в армии *</label>
              <select id="applicant-military-service" name="military_service" required>
                <option value="">Выберите вариант</option>
                <option value="yes">Проходил(а)</option>
                <option value="none">Не проходил(а)</option>
                <option value="na">Не применимо</option>
              </select>
            </div>
            <div class="applicant-field applicant-field--wide">
              <label for="applicant-weapons-permit">Разрешение на ношение оружия *</label>
              <select id="applicant-weapons-permit" name="weapons_permit" required>
                <option value="">Выберите вариант</option>
                <option value="yes">Есть</option>
                <option value="none">Нет</option>
                <option value="expired">Было, срок действия истёк</option>
              </select>
            </div>
          </div>
        </section>

        <section class="applicant-step" aria-labelledby="applicant-step-4-title" data-applicant-step hidden>
          <h3 id="applicant-step-4-title">Профессиональный опыт</h3>
          <p>Опишите общий стаж и сильные стороны, которые особенно полезны в работе с семьёй.</p>
          <div class="applicant-grid">
            <div class="applicant-field">
              <label for="applicant-professional-experience">Стаж по специальности, лет *</label>
              <input id="applicant-professional-experience" name="professional_experience_years" type="number" inputmode="decimal" min="0" step="0.5" required>
            </div>
            <div class="applicant-field">
              <label for="applicant-family-experience">Стаж работы в семьях, лет *</label>
              <input id="applicant-family-experience" name="family_experience_years" type="number" inputmode="decimal" min="0" step="0.5" required>
            </div>
            <div class="applicant-field applicant-field--wide">
              <label for="applicant-self-description">Охарактеризуйте себя *</label>
              <textarea id="applicant-self-description" name="self_description" rows="7" placeholder="Расскажите о подходе к работе, сильных сторонах и предпочтительном формате" required></textarea>
            </div>
          </div>
        </section>

        <section class="applicant-step" aria-labelledby="applicant-step-5-title" data-applicant-step hidden>
          <h3 id="applicant-step-5-title">Опыт работы в семьях</h3>
          <p>Заполните отдельную карточку для каждого места работы. Если такого опыта ещё не было, оставьте карточки пустыми.</p>
          <div class="family-list" data-family-list></div>
        </section>

        <section class="applicant-step" aria-labelledby="applicant-step-6-title" data-applicant-step hidden>
          <h3 id="applicant-step-6-title">Готовность и файлы</h3>
          <p>Эти сведения помогают заранее сопоставить условия вакансии и вашу готовность к ним.</p>
          <div class="applicant-grid">
            <fieldset class="applicant-choice applicant-field--wide">
              <legend>Готовы работать под камерами? *</legend>
              <div>
                <label><input id="applicant-cameras-yes" type="radio" name="ready_for_cameras" value="yes" required> Да</label>
                <label><input id="applicant-cameras-no" type="radio" name="ready_for_cameras" value="no"> Нет</label>
              </div>
            </fieldset>
            <fieldset class="applicant-choice applicant-field--wide">
              <legend>Готовы пройти проверку службы безопасности? *</legend>
              <div>
                <label><input id="applicant-security-yes" type="radio" name="ready_for_security_check" value="yes" required> Да</label>
                <label><input id="applicant-security-no" type="radio" name="ready_for_security_check" value="no"> Нет</label>
              </div>
            </fieldset>
            <div class="applicant-field applicant-field--wide">
              <label for="applicant-medical-book">Медицинская книжка *</label>
              <select id="applicant-medical-book" name="medical_book" required>
                <option value="">Выберите вариант</option>
                <option value="valid">Есть, действующая</option>
                <option value="renew">Есть, требуется обновить</option>
                <option value="none">Нет</option>
              </select>
            </div>
            <div class="applicant-upload">
              <label for="applicant-photo">Фото в полный рост *</label>
              <input id="applicant-photo" name="full_length_photo" type="file" accept="image/jpeg,image/png,image/webp" data-max-size="10485760" aria-describedby="applicant-photo-help" required>
              <small id="applicant-photo-help">Снимок не старше шести месяцев. JPG, PNG или WEBP, до 10 МБ.</small>
            </div>
            <div class="applicant-upload">
              <label for="applicant-video">Видео-визитка *</label>
              <input id="applicant-video" name="video_introduction" type="file" accept="video/mp4,video/quicktime,video/webm" data-max-size="104857600" aria-describedby="applicant-video-help" required>
              <small id="applicant-video-help">MP4, MOV или WEBM, до 100 МБ.</small>
            </div>
            <div class="applicant-consent applicant-field--wide">
              <label for="applicant-personal-data-consent">
                <input id="applicant-personal-data-consent" name="personal_data_consent" type="checkbox" required>
                <span>Я согласен или согласна на обработку персональных данных для рассмотрения анкеты.</span>
              </label>
            </div>
            <p class="applicant-sensitive-note applicant-field--wide">Перед продолжением проверьте контактные данные и выбранные файлы.</p>
          </div>
        </section>

        <footer class="applicant-modal__footer">
          <button class="button button-secondary" type="button" data-applicant-prev hidden>Назад</button>
          <p class="applicant-form__status" role="status" aria-live="polite" data-applicant-status></p>
          <button class="button button-primary" type="button" data-applicant-next>Продолжить</button>
          <button class="button button-primary" type="button" data-applicant-check hidden>Проверить анкету</button>
        </footer>
      </form>
    </div>
  `;

  const familyTemplate = `
    <details class="family-record" data-family-record="__I__" __OPEN__>
      <summary><span>Семья __I__</span><small>Место работы __I__</small></summary>
      <div class="applicant-grid">
        <div class="applicant-field">
          <label for="family-__I__-from">С какого года</label>
          <input id="family-__I__-from" name="families[__I__][from_year]" type="number" inputmode="numeric" min="1950" max="2100" data-family-core>
        </div>
        <div class="applicant-field">
          <label for="family-__I__-to">По какой год</label>
          <input id="family-__I__-to" name="families[__I__][to_year]" type="text" placeholder="2024 или настоящее время" data-family-core>
        </div>
        <div class="applicant-field applicant-field--wide">
          <label for="family-__I__-location">Локация</label>
          <input id="family-__I__-location" name="families[__I__][location]" type="text" data-family-core>
        </div>
        <div class="applicant-field">
          <label for="family-__I__-plot">Площадь участка, соток <span>необязательно</span></label>
          <input id="family-__I__-plot" name="families[__I__][plot_area]" type="number" inputmode="decimal" min="0">
        </div>
        <div class="applicant-field">
          <label for="family-__I__-house">Площадь дома, м² <span>необязательно</span></label>
          <input id="family-__I__-house" name="families[__I__][house_area]" type="number" inputmode="decimal" min="0">
        </div>
        <div class="applicant-field applicant-field--wide">
          <label for="family-__I__-position">Должность</label>
          <input id="family-__I__-position" name="families[__I__][position]" type="text" data-family-core>
        </div>
        <div class="applicant-field applicant-field--wide">
          <label for="family-__I__-duties">Функционал</label>
          <textarea id="family-__I__-duties" name="families[__I__][duties]" rows="4" data-family-core></textarea>
        </div>
        <div class="applicant-field applicant-field--wide">
          <label for="family-__I__-composition">Состав семьи</label>
          <textarea id="family-__I__-composition" name="families[__I__][family_composition]" rows="3" data-family-core></textarea>
        </div>
        <div class="applicant-field applicant-field--wide">
          <label for="family-__I__-leaving">Причина ухода</label>
          <textarea id="family-__I__-leaving" name="families[__I__][leaving_reason]" rows="3" data-family-core></textarea>
        </div>
        <div class="applicant-field applicant-field--wide">
          <label for="family-__I__-reference">Работодатель или человек, который может дать рекомендацию</label>
          <input id="family-__I__-reference" name="families[__I__][reference_contact]" type="text" placeholder="Имя и номер телефона" data-family-core>
        </div>
      </div>
    </details>
  `;

  document.body.append(dialog);
  const familyList = dialog.querySelector("[data-family-list]");
  [1, 2, 3].forEach((index) => {
    familyList.insertAdjacentHTML(
      "beforeend",
      familyTemplate
        .replaceAll("__I__", String(index))
        .replace("__OPEN__", index === 1 ? "open" : "")
    );
  });

  const form = dialog.querySelector("[data-applicant-form]");
  const closeButton = dialog.querySelector("[data-close-applicant-form]");
  const steps = Array.from(dialog.querySelectorAll("[data-applicant-step]"));
  const markers = Array.from(dialog.querySelectorAll("[data-step-marker]"));
  const previousButton = dialog.querySelector("[data-applicant-prev]");
  const nextButton = dialog.querySelector("[data-applicant-next]");
  const checkButton = dialog.querySelector("[data-applicant-check]");
  const stepCaption = dialog.querySelector("[data-step-caption]");
  const errorSummary = dialog.querySelector("[data-applicant-errors]");
  const errorList = errorSummary.querySelector("ul");
  const status = dialog.querySelector("[data-applicant-status]");
  const birthDate = dialog.querySelector("[data-birth-date]");
  const ageOutput = dialog.querySelector("[data-age]");
  const zodiacOutput = dialog.querySelector("[data-zodiac]");
  let currentStep = 0;
  let returnFocus = null;

  const showStep = (index, focusHeading = true) => {
    currentStep = Math.max(0, Math.min(index, steps.length - 1));
    steps.forEach((step, stepIndex) => {
      step.hidden = stepIndex !== currentStep;
    });
    markers.forEach((marker, markerIndex) => {
      if (markerIndex === currentStep) marker.setAttribute("aria-current", "step");
      else marker.removeAttribute("aria-current");
    });
    stepCaption.textContent = "Шаг " + (currentStep + 1) + " из " + steps.length;
    previousButton.hidden = currentStep === 0;
    nextButton.hidden = currentStep === steps.length - 1;
    checkButton.hidden = currentStep !== steps.length - 1;
    status.textContent = "";
    if (focusHeading) {
      const heading = steps[currentStep].querySelector("h3");
      heading?.setAttribute("tabindex", "-1");
      heading?.focus();
    }
  };

  const openDialog = (opener) => {
    returnFocus = opener;
    document.body.classList.add("applicant-dialog-open");
    dialog.showModal();
    window.requestAnimationFrame(() => dialog.querySelector("#applicant-dialog-title")?.focus());
  };

  const closeDialog = () => dialog.close();

  openers.forEach((opener) => opener.addEventListener("click", () => openDialog(opener)));
  closeButton.addEventListener("click", closeDialog);
  dialog.addEventListener("cancel", (event) => {
    event.preventDefault();
    closeDialog();
  });
  dialog.addEventListener("close", () => {
    document.body.classList.remove("applicant-dialog-open");
    returnFocus?.focus();
  });
  dialog.addEventListener("click", (event) => {
    const rect = dialog.getBoundingClientRect();
    const outside =
      event.clientX < rect.left ||
      event.clientX > rect.right ||
      event.clientY < rect.top ||
      event.clientY > rect.bottom;
    if (outside) closeDialog();
  });
  form.addEventListener("submit", (event) => event.preventDefault());

  const fieldLabel = (field) => {
    const explicitLabel = field.id ? dialog.querySelector('label[for="' + field.id + '"]') : null;
    return (
      explicitLabel?.textContent.trim() ||
      field.closest("label")?.textContent.trim() ||
      field.closest("fieldset")?.querySelector("legend")?.textContent.trim() ||
      "Обязательное поле"
    );
  };

  const errorElement = (field) => {
    const host = field.closest(".applicant-field, .applicant-upload, .applicant-choice, .applicant-consent");
    let error = host?.querySelector("[data-field-error]");
    if (!error && host) {
      error = document.createElement("p");
      error.className = "applicant-field__error";
      error.dataset.fieldError = "";
      const safeName = (field.id || field.name || "field").replace(/[^a-z0-9]/gi, "-");
      error.id = safeName + "-error";
      error.setAttribute("aria-live", "polite");
      host.append(error);
      const descriptions = new Set(
        (field.getAttribute("aria-describedby") || "").split(/\s+/).filter(Boolean)
      );
      descriptions.add(error.id);
      field.setAttribute("aria-describedby", Array.from(descriptions).join(" "));
    }
    return error;
  };

  const validationMessage = (field) => {
    const label = fieldLabel(field).replace(/\s*\*$/, "");
    if (field.validity.valueMissing) return "Заполните поле «" + label + "».";
    if (field.validity.typeMismatch) return "Проверьте формат поля «" + label + "».";
    if (field.validity.tooShort) return "Дополните поле «" + label + "».";
    if (field.validity.customError) return field.validationMessage;
    return "Проверьте введённое значение.";
  };

  const validateField = (field) => {
    if (field.disabled || field.readOnly) return true;
    const valid = field.checkValidity();
    field.setAttribute("aria-invalid", String(!valid));
    const host = field.closest(".applicant-choice");
    if (host) host.setAttribute("aria-invalid", String(!valid));
    const error = errorElement(field);
    if (error) error.textContent = valid ? "" : validationMessage(field);
    return valid;
  };

  const controlsIn = (container) => {
    const controls = Array.from(container.querySelectorAll("input, select, textarea"));
    const radioGroups = new Set();
    return controls.filter((field) => {
      if (field.type !== "radio") return true;
      if (radioGroups.has(field.name)) return false;
      radioGroups.add(field.name);
      return true;
    });
  };

  const prepareConditionalFields = () => {
    const familyExperience = Number(form.elements.family_experience_years?.value || 0);
    dialog.querySelectorAll("[data-family-record]").forEach((record, index) => {
      const fields = Array.from(record.querySelectorAll("input, textarea"));
      const started = fields.some((field) => field.value.trim());
      const requireCore = started || (index === 0 && familyExperience > 0);
      record.querySelectorAll("[data-family-core]").forEach((field) => {
        field.required = requireCore;
      });
    });
    const drivingLicense = form.elements.driving_license?.value;
    const drivingExperience = form.elements.driving_experience_years;
    if (drivingExperience) drivingExperience.required = Boolean(drivingLicense) && drivingLicense !== "none";
  };

  const showErrors = (invalidFields) => {
    errorList.replaceChildren();
    invalidFields.forEach((field) => {
      const item = document.createElement("li");
      const link = document.createElement("a");
      link.href = "#" + field.id;
      link.textContent = validationMessage(field);
      link.addEventListener("click", (event) => {
        event.preventDefault();
        const stepIndex = steps.findIndex((step) => step.contains(field));
        if (stepIndex >= 0) showStep(stepIndex, false);
        const details = field.closest("details");
        if (details) details.open = true;
        field.focus();
      });
      item.append(link);
      errorList.append(item);
    });
    errorSummary.hidden = invalidFields.length === 0;
    if (invalidFields.length) errorSummary.focus();
  };

  const validateContainer = (container) => {
    prepareConditionalFields();
    const invalidFields = controlsIn(container).filter((field) => !validateField(field));
    showErrors(invalidFields);
    return invalidFields.length === 0;
  };

  form.querySelectorAll("input, select, textarea").forEach((field) => {
    field.addEventListener("blur", () => {
      if (field.value || field.getAttribute("aria-invalid") === "true") validateField(field);
    });
    field.addEventListener("input", () => {
      if (field.getAttribute("aria-invalid") === "true") validateField(field);
    });
  });

  nextButton.addEventListener("click", () => {
    if (validateContainer(steps[currentStep])) {
      showErrors([]);
      showStep(currentStep + 1);
    }
  });
  previousButton.addEventListener("click", () => {
    showErrors([]);
    showStep(currentStep - 1);
  });
  checkButton.addEventListener("click", () => {
    prepareConditionalFields();
    const invalidFields = controlsIn(form).filter((field) => !validateField(field));
    if (invalidFields.length) {
      const firstField = invalidFields[0];
      const stepIndex = steps.findIndex((step) => step.contains(firstField));
      if (stepIndex >= 0) showStep(stepIndex, false);
      const details = firstField.closest("details");
      if (details) details.open = true;
      showErrors(invalidFields);
      return;
    }
    showErrors([]);
    status.textContent = "Все обязательные поля заполнены.";
  });

  dialog.querySelectorAll('input[type="file"][data-max-size]').forEach((field) => {
    field.addEventListener("change", () => {
      const file = field.files?.[0];
      const maximum = Number(field.dataset.maxSize);
      field.setCustomValidity(file && file.size > maximum ? "Размер файла превышает допустимый." : "");
      validateField(field);
    });
  });

  const zodiacFor = (month, day) => {
    const limits = [
      [1, 20, "Козерог", "Водолей"], [2, 19, "Водолей", "Рыбы"],
      [3, 21, "Рыбы", "Овен"], [4, 20, "Овен", "Телец"],
      [5, 21, "Телец", "Близнецы"], [6, 21, "Близнецы", "Рак"],
      [7, 23, "Рак", "Лев"], [8, 23, "Лев", "Дева"],
      [9, 23, "Дева", "Весы"], [10, 23, "Весы", "Скорпион"],
      [11, 22, "Скорпион", "Стрелец"], [12, 22, "Стрелец", "Козерог"]
    ];
    const limit = limits[month - 1];
    return day < limit[1] ? limit[2] : limit[3];
  };

  birthDate.addEventListener("change", () => {
    if (!birthDate.value) {
      ageOutput.value = "";
      zodiacOutput.value = "";
      return;
    }
    const parts = birthDate.value.split("-").map(Number);
    const year = parts[0];
    const month = parts[1];
    const day = parts[2];
    const today = new Date();
    let age = today.getFullYear() - year;
    if (
      today.getMonth() + 1 < month ||
      (today.getMonth() + 1 === month && today.getDate() < day)
    ) age -= 1;
    ageOutput.value = Math.max(age, 0);
    zodiacOutput.value = zodiacFor(month, day);
  });

  birthDate.max = new Date().toISOString().slice(0, 10);
  showStep(0, false);
})();
