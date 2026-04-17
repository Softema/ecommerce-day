(function () {
  const form = document.getElementById('lead-form');
  const btn = document.getElementById('submit-btn');
  if (!form) return;

  // Hlavní CRM – ClicqSales (GoHighLevel) inbound webhook
  const CLICQSALES_WEBHOOK = 'https://services.leadconnectorhq.com/hooks/exLKIh7Z447f34opkeMo/webhook-trigger/0b6bf8cc-c0c5-4cb3-92da-ed9943b28265';

  // Záloha + e-mail notifikace
  const FORMSPREE_ENDPOINT = 'https://formspree.io/f/mgorkepk';

  form.addEventListener('submit', async function (e) {
    e.preventDefault();

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const fullName = form.name.value.trim();
    const [firstName, ...rest] = fullName.split(/\s+/);
    const lastName = rest.join(' ');

    const data = {
      name: fullName,
      first_name: firstName || '',
      last_name: lastName || '',
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

    const send = (url) => fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    try {
      const results = await Promise.allSettled([
        send(CLICQSALES_WEBHOOK),
        send(FORMSPREE_ENDPOINT)
      ]);

      const anyOk = results.some(r => r.status === 'fulfilled' && r.value.ok);
      if (!anyOk) throw new Error('Both endpoints failed');

      try { sessionStorage.setItem('softema_lead_name', firstName || ''); } catch (_) {}
      window.location.href = 'dekujeme.html';
    } catch (err) {
      btn.disabled = false;
      btn.querySelector('.cta__label').textContent = 'Tipuji a chci vyhrát!';
      alert('Jejda, něco se pokazilo. Zkus to prosím ještě jednou, nebo zajdi za námi na stánek.');
    }
  });
})();
