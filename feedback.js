const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav');
const feedbackForm = document.querySelector('#feedback-form');
const application = document.querySelector('#application');
const money = new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 0 });

menuButton?.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!open));
  nav?.classList.toggle('open', !open);
});

nav?.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
  nav.classList.remove('open');
  menuButton?.setAttribute('aria-expanded', 'false');
}));

document.querySelectorAll('.js-focus-form').forEach((button) => button.addEventListener('click', () => {
  application?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  window.setTimeout(() => feedbackForm?.querySelector('select, input')?.focus(), 500);
}));

const extraToggle = document.querySelector('.additional-files-toggle');
const extraFiles = document.querySelector('.additional-files');

extraToggle?.addEventListener('click', () => {
  const open = extraToggle.getAttribute('aria-expanded') === 'true';
  extraToggle.setAttribute('aria-expanded', String(!open));
  extraToggle.textContent = open ? '+ Прикрепить дополнительные фото' : '− Скрыть дополнительные фото';
  extraFiles.hidden = open;
});

document.querySelectorAll('.document-card input[type="file"]').forEach((input) => {
  input.addEventListener('change', () => {
    const card = input.closest('.document-card');
    const action = card.querySelector('em');
    const file = input.files[0];
    card.classList.toggle('has-file', Boolean(file));
    action.textContent = file ? file.name : 'Выбрать файл +';
  });
});

const phoneInput = feedbackForm?.elements.phone;
phoneInput?.addEventListener('input', () => {
  let digits = phoneInput.value.replace(/\D/g, '');
  if (digits.startsWith('8')) digits = `7${digits.slice(1)}`;
  if (!digits.startsWith('7')) digits = `7${digits}`;
  digits = digits.slice(0, 11);
  const parts = ['+7'];
  if (digits.length > 1) parts.push(` ${digits.slice(1, 4)}`);
  if (digits.length >= 4) parts.push(` ${digits.slice(4, 7)}`);
  if (digits.length >= 7) parts.push(`-${digits.slice(7, 9)}`);
  if (digits.length >= 9) parts.push(`-${digits.slice(9, 11)}`);
  phoneInput.value = parts.join('');
});

['income', 'car_price'].forEach((name) => {
  const input = feedbackForm?.elements[name];
  input?.addEventListener('input', () => {
    const value = Number(input.value.replace(/\D/g, '')) || 0;
    input.value = value ? money.format(value) : '';
  });
});

try {
  const saved = JSON.parse(localStorage.getItem('s-auto-calculator'));
  if (saved?.price && feedbackForm?.elements.car_price) {
    feedbackForm.elements.car_price.value = money.format(saved.price);
  }
} catch (error) {
  // A missing or malformed saved calculation should not block the form.
}

feedbackForm?.querySelectorAll('[required]').forEach((field) => {
  const clearError = () => {
    field.closest('.feedback-field')?.classList.remove('is-invalid');
    field.closest('.document-card')?.classList.remove('is-invalid');
  };
  field.addEventListener('input', clearError);
  field.addEventListener('change', clearError);
});

feedbackForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  let firstInvalid;

  feedbackForm.querySelectorAll('[required]').forEach((field) => {
    const valid = field.type === 'checkbox' ? field.checked : field.type === 'file' ? field.files.length > 0 : field.value.trim() !== '';
    field.closest('.feedback-field')?.classList.toggle('is-invalid', !valid);
    field.closest('.document-card')?.classList.toggle('is-invalid', !valid);
    field.closest('.human-check, .agreement-check')?.classList.toggle('is-invalid', !valid);
    if (!valid && !firstInvalid) firstInvalid = field;
  });

  if (firstInvalid) {
    firstInvalid.closest('.feedback-field, .document-card, label')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    firstInvalid.focus({ preventScroll: true });
    return;
  }

  feedbackForm.querySelectorAll(':scope > :not(.feedback-success)').forEach((element) => { element.hidden = true; });
  const success = feedbackForm.querySelector('.feedback-success');
  success.hidden = false;
  success.scrollIntoView({ behavior: 'smooth', block: 'center' });
});
