(() => {
  const form = document.getElementById('booking-form');
  if (!form) return;
  const button = form.querySelector('button[type="submit"]');
  const status = form.querySelector('.form-status');
  const endpoint = form.dataset.endpoint || '';
  const configured = /^https:\/\/formspree\.io\/f\/[a-zA-Z0-9]+$/.test(endpoint);
  if (configured) {
    form.action = endpoint;
    button.disabled = false;
    status.textContent = '';
  }
  let sending = false;
  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (!configured || sending || !form.reportValidity()) return;
    sending = true;
    button.disabled = true;
    status.textContent = 'Sending your inquiry…';
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30000);
    try {
      const response = await fetch(endpoint, {
        method: 'POST', body: new FormData(form),
        headers: { Accept: 'application/json' }, signal: controller.signal
      });
      if (!response.ok) throw new Error('Submission failed');
      form.reset();
      status.textContent = 'Thank you! Your inquiry has been sent. SoulTime will be in touch to discuss your event.';
    } catch (error) {
      status.textContent = error.name === 'AbortError'
        ? 'We couldn’t confirm whether your inquiry arrived. Please wait a few minutes before trying again.'
        : 'Your inquiry could not be sent. Your details are still here. Please try again in a few minutes.';
    } finally {
      clearTimeout(timeout);
      sending = false;
      button.disabled = false;
    }
  });
})();
