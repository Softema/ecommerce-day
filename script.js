(function () {
  const form = document.getElementById('lead-form');
  const btn = document.getElementById('submit-btn');
  if (!form) return;

  // TODO: Davide, sem doplň endpoint ClicqSales (nebo Zapier/Make webhook)
  // který uloží lead. Pokud je prázdný, data se jen zalogují do konzole.
  const ENDPOINT = 'https://formspree.io/f/mgorkepk';

  form.addEventListener('submit', async function (e) {
    e.preventDefault();

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const data = {
      name: form.name.value.trim(),
      email: form.email.value.trim(),
      phone: form.phone.value.trim(),
      position: form.position.value.trim(),
      website: form.website.value.trim(),
      corks: Number(form.corks.value),
      consent: form.consent.checked,
      source: 'Ecommerce Day 2025 – stánek Softema',
      submitted_at: new Date().toISOString()
    };

    btn.disabled = true;
    btn.querySelector('.cta__label').textContent = 'Odesílám…';

    try {
      if (ENDPOINT) {
        const res = await fetch(ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
        if (!res.ok) throw new Error('Request failed');
      } else {
        console.log('[lead]', data);
        await new Promise(r => setTimeout(r, 400));
      }

      try { sessionStorage.setItem('softema_lead_name', data.name.split(' ')[0] || ''); } catch (_) {}
      window.location.href = 'dekujeme.html';
    } catch (err) {
      btn.disabled = false;
      btn.querySelector('.cta__label').textContent = 'Tipuji a chci vyhrát!';
      alert('Jejda, něco se pokazilo. Zkus to prosím ještě jednou, nebo zajdi za námi na stánek.');
    }
  });
})();
