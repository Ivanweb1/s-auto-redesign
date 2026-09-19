const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav');
const modal = document.querySelector('#request-modal');
const requestForm = document.querySelector('#request-form');

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
