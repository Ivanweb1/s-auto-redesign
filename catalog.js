const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav');
const modal = document.querySelector('#request-modal');
const requestForm = document.querySelector('#request-form');
const filterForm = document.querySelector('#catalog-filter');
const brandSelect = document.querySelector('#car-brand');
const modelSelect = document.querySelector('#car-model');
const yearFrom = document.querySelector('#year-from');
const yearTo = document.querySelector('#year-to');
const priceFrom = document.querySelector('#price-from');
const priceTo = document.querySelector('#price-to');
const emptyState = document.querySelector('#catalog-empty');
const pagination = document.querySelector('#catalog-pagination');
const carCards = [...document.querySelectorAll('.catalog-page-list .car-card')];

const money = new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 0 });
const defaultPriceFrom = 350000;
const defaultPriceTo = 5000000;
const modelsByBrand = carCards.reduce((brands, card) => {
  const { brand, model } = card.dataset;
  if (!brands[brand]) brands[brand] = [];
  if (!brands[brand].includes(model)) brands[brand].push(model);
  return brands;
}, {});

function parseMoney(value) {
  return Number(String(value).replace(/\D/g, '')) || 0;
}

function formatMoneyInput(input) {
  const value = parseMoney(input.value);
  input.value = value ? money.format(value) : '';
  return value;
}

function fillModels(selectedModel = '') {
  const brand = brandSelect.value;
  const models = modelsByBrand[brand] || [];
  modelSelect.replaceChildren(new Option(brand ? 'Все модели' : 'Сначала выберите марку', ''));
  models.forEach((model) => modelSelect.add(new Option(model, model)));
  modelSelect.disabled = !brand;
  if (models.includes(selectedModel)) modelSelect.value = selectedModel;
}

function fillYears() {
  const currentYear = new Date().getFullYear();
  for (let year = currentYear; year >= 1990; year -= 1) {
    yearFrom.add(new Option(String(year), String(year)));
    yearTo.add(new Option(String(year), String(year)));
  }
}

function currentFilters() {
  return {
    priceFrom: Math.max(parseMoney(priceFrom.value), defaultPriceFrom),
    priceTo: Math.max(parseMoney(priceTo.value), defaultPriceFrom),
    brand: brandSelect.value,
    model: modelSelect.value,
    yearFrom: Number(yearFrom.value) || 0,
    yearTo: Number(yearTo.value) || Infinity
  };
}

function applyFilters() {
  const filters = currentFilters();
  let visible = 0;
  carCards.forEach((card) => {
    const price = Number(card.dataset.price);
    const year = Number(card.dataset.year);
    const matches = price >= filters.priceFrom && price <= filters.priceTo
      && (!filters.brand || card.dataset.brand === filters.brand)
      && (!filters.model || card.dataset.model === filters.model)
      && year >= filters.yearFrom && year <= filters.yearTo;
    card.hidden = !matches;
    if (matches) visible += 1;
  });
  emptyState.hidden = visible !== 0;
  pagination.hidden = visible === 0;
  return filters;
}

function pageUrl(page) {
  const params = new URLSearchParams(window.location.search);
  params.set('page', String(page));
  return `${window.location.pathname}?${params.toString()}#catalog-results`;
}

function renderPagination() {
  const totalPages = Number(pagination.dataset.totalPages) || 1;
  const requestedPage = Number(new URLSearchParams(window.location.search).get('page')) || 1;
  const currentPage = Math.min(Math.max(requestedPage, 1), totalPages);
  const pages = currentPage <= 3
    ? [1, 2, 3, 4, 5, 'ellipsis', totalPages]
    : currentPage >= totalPages - 2
      ? [1, 'ellipsis', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages]
      : [1, 'ellipsis-start', currentPage - 1, currentPage, currentPage + 1, 'ellipsis-end', totalPages];

  pagination.replaceChildren();
  const addLink = (label, page, className = '') => {
    const link = document.createElement('a');
    link.className = `pagination-link ${className}`.trim();
    link.href = pageUrl(page);
    link.setAttribute('aria-label', label);
    link.textContent = className ? '' : String(page);
    if (page === currentPage && !className) {
      link.classList.add('is-active');
      link.setAttribute('aria-current', 'page');
    }
    if (className) {
      link.innerHTML = className.includes('prev') ? '<span>←</span><b>Назад</b>' : '<b>Вперёд</b><span>→</span>';
    }
    pagination.append(link);
  };

  if (currentPage > 1) addLink('Предыдущая страница', currentPage - 1, 'pagination-prev');
  else {
    const disabled = document.createElement('span');
    disabled.className = 'pagination-link pagination-prev is-disabled';
    disabled.innerHTML = '<span>←</span><b>Назад</b>';
    pagination.append(disabled);
  }

  const numbers = document.createElement('div');
  numbers.className = 'pagination-numbers';
  pages.forEach((page) => {
    if (String(page).startsWith('ellipsis')) {
      const ellipsis = document.createElement('span');
      ellipsis.className = 'pagination-ellipsis';
      ellipsis.textContent = '…';
      numbers.append(ellipsis);
      return;
    }
    const link = document.createElement('a');
    link.className = 'pagination-number';
    link.href = pageUrl(page);
    link.textContent = String(page).padStart(2, '0');
    link.setAttribute('aria-label', `Страница ${page}`);
    if (page === currentPage) {
      link.classList.add('is-active');
      link.setAttribute('aria-current', 'page');
    }
    numbers.append(link);
  });
  pagination.append(numbers);

  if (currentPage < totalPages) addLink('Следующая страница', currentPage + 1, 'pagination-next');
  else {
    const disabled = document.createElement('span');
    disabled.className = 'pagination-link pagination-next is-disabled';
    disabled.innerHTML = '<b>Вперёд</b><span>→</span>';
    pagination.append(disabled);
  }
}

function setUrl(filters) {
  const params = new URLSearchParams();
  if (filters.priceFrom !== defaultPriceFrom) params.set('price_from', String(filters.priceFrom));
  if (filters.priceTo !== defaultPriceTo) params.set('price_to', String(filters.priceTo));
  if (filters.brand) params.set('brand', filters.brand);
  if (filters.model) params.set('model', filters.model);
  if (filters.yearFrom) params.set('year_from', String(filters.yearFrom));
  if (Number.isFinite(filters.yearTo)) params.set('year_to', String(filters.yearTo));
  const query = params.toString();
  window.history.replaceState({}, '', `${window.location.pathname}${query ? `?${query}` : ''}#catalog-results`);
  window.dispatchEvent(new CustomEvent('catalog-filter-applied', { detail: Object.fromEntries(params) }));
}

function applyUrlParameters() {
  const params = new URLSearchParams(window.location.search);
  const brand = params.get('brand') || '';
  if ([...brandSelect.options].some((option) => option.value === brand)) brandSelect.value = brand;
  fillModels(params.get('model') || '');
  if (params.get('year_from')) yearFrom.value = params.get('year_from');
  if (params.get('year_to')) yearTo.value = params.get('year_to');
  const from = Number(params.get('price_from')) || defaultPriceFrom;
  const to = Number(params.get('price_to')) || defaultPriceTo;
  priceFrom.value = money.format(from);
  priceTo.value = money.format(to);
  applyFilters();
}

menuButton?.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!open));
  nav.classList.toggle('open', !open);
});

nav?.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
  nav.classList.remove('open');
  menuButton?.setAttribute('aria-expanded', 'false');
}));

document.querySelectorAll('.js-open-modal').forEach((button) => button.addEventListener('click', () => modal?.showModal()));
document.querySelector('.modal-close')?.addEventListener('click', () => modal?.close());
modal?.addEventListener('click', (event) => { if (event.target === modal) modal.close(); });
requestForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  requestForm.hidden = true;
  modal.querySelector('.success').hidden = false;
});

fillYears();
brandSelect.addEventListener('change', () => fillModels());
yearFrom.addEventListener('change', () => {
  if (yearTo.value && Number(yearFrom.value) > Number(yearTo.value)) yearTo.value = yearFrom.value;
});
yearTo.addEventListener('change', () => {
  if (yearFrom.value && Number(yearTo.value) < Number(yearFrom.value)) yearFrom.value = yearTo.value;
});

[priceFrom, priceTo].forEach((input) => {
  input.addEventListener('focus', () => input.select());
  input.addEventListener('blur', () => {
    formatMoneyInput(input);
    const from = Math.max(parseMoney(priceFrom.value), defaultPriceFrom);
    const to = Math.max(parseMoney(priceTo.value), from);
    priceFrom.value = money.format(from);
    priceTo.value = money.format(to);
  });
});

filterForm.addEventListener('reset', () => {
  window.setTimeout(() => {
    priceFrom.value = money.format(defaultPriceFrom);
    priceTo.value = money.format(defaultPriceTo);
    fillModels();
    applyFilters();
    window.history.replaceState({}, '', window.location.pathname);
  });
});

filterForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const filters = applyFilters();
  setUrl(filters);
  document.querySelector('#catalog-results').scrollIntoView({ behavior: 'smooth', block: 'start' });
});

carCards.forEach((card) => {
  const price = Number(card.dataset.price);
  const downPayment = Number(card.dataset.downPayment);
  const output = card.querySelector('[data-payment]');
  const buttons = [...card.querySelectorAll('[data-term]')];
  const updatePayment = (term) => {
    output.textContent = `${money.format(Math.ceil((price - downPayment) / term))} ₽`;
    buttons.forEach((button) => {
      const active = Number(button.dataset.term) === term;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-pressed', String(active));
    });
  };
  buttons.forEach((button) => button.addEventListener('click', () => updatePayment(Number(button.dataset.term))));
  updatePayment(24);
});

applyUrlParameters();
renderPagination();
