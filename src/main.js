document.querySelector('#year').textContent = new Date().getFullYear();

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

for (const form of document.querySelectorAll('.waitlist-form')) {
  const input = form.querySelector('input[name="email"]');
  const button = form.querySelector('button');
  const message = form.querySelector('.form-message');
  const buttonLabel = button.innerHTML;

  const showMessage = (text, state) => {
    message.textContent = text;
    message.dataset.state = state;
    input.setAttribute('aria-invalid', state === 'error' ? 'true' : 'false');
  };

  input.addEventListener('input', () => {
    if (message.dataset.state === 'error') showMessage('', '');
  });

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const email = input.value.trim();
    if (!email || email.length > 254 || !emailPattern.test(email) || !input.checkValidity()) {
      showMessage('Please enter a valid email address.', 'error');
      input.focus();
      return;
    }

    button.disabled = true;
    button.textContent = 'Saving…';
    showMessage('', '');
    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (!response.ok) throw new Error('Waitlist unavailable');
      const data = await response.json();
      if (data.saved !== true) throw new Error('Waitlist unavailable');
      showMessage('You’re on the list! Your email has been saved for Step updates.', 'success');
      input.value = '';
    } catch {
      showMessage('Waitlist isn’t connected right now. Your email was not saved. Please try again later.', 'error');
    } finally {
      button.disabled = false;
      button.innerHTML = buttonLabel;
    }
  });
}
