/* ================================================================
   script.js — bütün üç dizayn üçün ümumi skript (index1/2/3)
   Səhifələr eyni data-atributlardan istifadə edir, ona görə
   bir fayl istənilən maketə xidmət edir.
   Valyuta: manat (₼) · Telefon formatı: +994 (XX) XXX-XX-XX
   ================================================================ */
(function () {
  'use strict';

  const $  = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

  /* ---------------------------------------------------------------
     1. Хедер: класс при скролле
  --------------------------------------------------------------- */
  const header = $('#header');
  if (header) {
    const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ---------------------------------------------------------------
     2. Мобильное меню
  --------------------------------------------------------------- */
  const burger = $('#burger');
  const nav = $('#nav');
  if (burger && nav) {
    burger.addEventListener('click', () => {
      const isOpen = burger.classList.toggle('is-open');
      nav.classList.toggle('is-open', isOpen);
      document.body.classList.toggle('nav-open', isOpen);
    });
    // закрываем меню после клика по ссылке
    $$('a', nav).forEach(link => link.addEventListener('click', () => {
      burger.classList.remove('is-open');
      nav.classList.remove('is-open');
      document.body.classList.remove('nav-open');
    }));
  }

  /* ---------------------------------------------------------------
     3. Появление блоков при скролле (reveal)
  --------------------------------------------------------------- */
  const revealItems = $$('[data-reveal]');
  if (revealItems.length) {
    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver((entries) => {
        entries.forEach((entry, i) => {
          if (!entry.isIntersecting) return;
          // лёгкая каскадная задержка для соседних элементов
          setTimeout(() => entry.target.classList.add('is-visible'), i * 80);
          io.unobserve(entry.target);
        });
      }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
      revealItems.forEach(el => io.observe(el));
    } else {
      revealItems.forEach(el => el.classList.add('is-visible'));
    }
  }

  /* ---------------------------------------------------------------
     4. Счётчики (340 домов, 16 лет и т.д.)
  --------------------------------------------------------------- */
  const counters = $$('[data-count]');
  if (counters.length && 'IntersectionObserver' in window) {
    const animate = (el) => {
      const target = parseInt(el.dataset.count, 10) || 0;
      const duration = 1400;
      const start = performance.now();
      const tick = (now) => {
        const p = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - p, 3);      // easeOutCubic
        el.textContent = Math.round(target * eased);
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        animate(e.target);
        io.unobserve(e.target);
      });
    }, { threshold: 0.5 });
    counters.forEach(el => io.observe(el));
  } else {
    counters.forEach(el => (el.textContent = el.dataset.count));
  }

  /* ---------------------------------------------------------------
     5. Фильтр проектов домов
  --------------------------------------------------------------- */
  const filterBar = $('[data-filters]');
  const grid = $('[data-grid]');
  if (filterBar && grid) {
    const houses = $$('[data-cat]', grid);
    filterBar.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-filter]');
      if (!btn) return;

      $$('[data-filter]', filterBar).forEach(b => b.classList.toggle('is-active', b === btn));

      const cat = btn.dataset.filter;
      houses.forEach(house => {
        const match = cat === 'all' || house.dataset.cat === cat;
        house.classList.toggle('is-hidden', !match);
        if (match) {
          // перезапуск анимации появления
          house.classList.remove('is-visible');
          requestAnimationFrame(() => house.classList.add('is-visible'));
        }
      });
    });
  }

  /* ---------------------------------------------------------------
     6. Balakən Park Səfər Büdcəsi Hesablayıcı
  --------------------------------------------------------------- */
  const calcAdults = $('#calcAdults');
  if (calcAdults) {
    const adultsOut = $('#calcAdultsOut');
    const kidsEl    = $('#calcKids');
    const kidsOut   = $('#calcKidsOut');
    const packEl    = $('#calcPack');
    const lunchEl   = $('#calcLunch');
    const totalEl   = $('#calcTotal');

    const fmt = new Intl.NumberFormat('az-AZ');

    let shown = 0;
    let raf;

    const render = (value) => {
      cancelAnimationFrame(raf);
      const from = shown, delta = value - from, start = performance.now();
      const step = (now) => {
        const p = Math.min((now - start) / 450, 1);
        shown = Math.round(from + delta * (1 - Math.pow(1 - p, 3)));
        totalEl.textContent = fmt.format(shown) + ' ₼';
        if (p < 1) raf = requestAnimationFrame(step);
      };
      raf = requestAnimationFrame(step);
    };

    const recalc = () => {
      const adults = +calcAdults.value;
      const kids = +kidsEl.value;
      const packPrice = +packEl.value;

      adultsOut.textContent = adults;
      kidsOut.textContent = kids;

      let total = (adults * packPrice) + (kids * Math.round(packPrice * 0.7));
      if (lunchEl.checked) {
        total += (adults + kids) * 15;
      }
      render(total);
    };

    [calcAdults, kidsEl, packEl, lunchEl].forEach(el => {
      if (el) el.addEventListener('input', recalc);
    });
    recalc();
  }

  /* ---------------------------------------------------------------
     7. Модальное окно
  --------------------------------------------------------------- */
  const modal = $('#modal');
  if (modal) {
    const open = () => {
      modal.hidden = false;
      document.body.style.overflow = 'hidden';
      const first = $('input', modal);
      if (first) setTimeout(() => first.focus(), 60);
    };
    const close = () => {
      modal.hidden = true;
      document.body.style.overflow = '';
    };

    document.addEventListener('click', (e) => {
      if (e.target.closest('[data-modal-open]'))  { e.preventDefault(); open(); }
      if (e.target.closest('[data-modal-close]')) { close(); }
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !modal.hidden) close();
    });
  }

  /* ---------------------------------------------------------------
     8. Всплывающее уведомление (toast)
  --------------------------------------------------------------- */
  const toastEl = $('#toast');
  let toastTimer;
  const toast = (text) => {
    if (!toastEl) return;
    toastEl.textContent = text;
    toastEl.classList.add('is-visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove('is-visible'), 3200);
  };

  /* ---------------------------------------------------------------
     9. Telefon maskası: +994 (50) 555-05-05
        Ölkə kodu 994, sonra 9 rəqəm (operator kodu + nömrə)
  --------------------------------------------------------------- */
  $$('[data-phone]').forEach(input => {
    input.addEventListener('input', () => {
      let d = input.value.replace(/\D/g, '');

      // ölkə kodunu və yerli "0" prefiksini kəsirik
      if (d.startsWith('994')) d = d.slice(3);
      else if (d.startsWith('0')) d = d.slice(1);
      d = d.slice(0, 9);

      let out = '+994';
      if (d.length) out += ' (' + d.slice(0, 2);
      if (d.length >= 3) out += ') ' + d.slice(2, 5);
      if (d.length >= 6) out += '-' + d.slice(5, 7);
      if (d.length >= 8) out += '-' + d.slice(7, 9);
      input.value = out;
    });

    // boş sahəyə fokus zamanı dərhal +994 qoyuruq
    input.addEventListener('focus', () => {
      if (!input.value) input.value = '+994 ';
    });
  });

  /* ---------------------------------------------------------------
     10. Direct WhatsApp Submissions (050 123 30 30)
  --------------------------------------------------------------- */
  const TARGET_WA = '994501233030';

  // Modal WhatsApp form
  const modalWaForm = $('#modalWaForm');
  if (modalWaForm) {
    modalWaForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = $('#modalName')?.value.trim() || '';
      const phone = $('#modalPhone')?.value.trim() || '';
      const msg = $('#modalMsg')?.value.trim() || '';
      const ticketType = modalWaForm.dataset.selectedTicket || 'Bilet / Masa Bronu';

      if (!name || name.length < 2) {
        toast('Lütfən adınızı daxil edin');
        return;
      }

      const text = encodeURIComponent(
        `Salam! Balakən Park-da bilet/masa bron etmək istəyirəm.\n` +
        `👤 Adım: ${name}\n` +
        `📞 Telefon: ${phone}\n` +
        `🎟️ Mövzu: ${ticketType}\n` +
        `💬 Qeyd: ${msg || 'Ətraflı məlumat almaq istəyirəm.'}`
      );

      toast('WhatsApp-a yönləndirilirsiniz...');
      setTimeout(() => {
        window.open(`https://wa.me/${TARGET_WA}?text=${text}`, '_blank');
        if (modal) {
          modal.hidden = true;
          document.body.style.overflow = '';
        }
      }, 500);
    });
  }

  // Contact Page WhatsApp form
  const contactWaForm = $('#contactWaForm');
  if (contactWaForm) {
    contactWaForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = $('#waName')?.value.trim() || '';
      const phone = $('#waPhone')?.value.trim() || '';
      const service = $('#waService')?.value || 'Kanat Yolu və Attraksion Biletləri';
      const msg = $('#waMsg')?.value.trim() || '';

      if (!name || name.length < 2) {
        toast('Lütfən adınızı daxil edin');
        return;
      }

      const text = encodeURIComponent(
        `✨ Balakən Park Bron Sorğusu\n` +
        `👤 Ad və Soyad: ${name}\n` +
        `📞 Telefon: ${phone}\n` +
        `🎯 Xidmət: ${service}\n` +
        `📝 Qeydlər: ${msg || 'Bilet/masa bronu etmək istəyirəm.'}`
      );

      toast('WhatsApp-a yönləndirilirsiniz...');
      setTimeout(() => {
        window.open(`https://wa.me/${TARGET_WA}?text=${text}`, '_blank');
      }, 500);
    });
  }

  // Calculator WhatsApp Button
  const calcWaBtn = $('#calcWaBtn');
  if (calcWaBtn) {
    calcWaBtn.addEventListener('click', () => {
      const adults = $('#calcAdults')?.value || '2';
      const kids = $('#calcKids')?.value || '0';
      const packEl = $('#calcPack');
      const packText = packEl ? packEl.options[packEl.selectedIndex].text : '';
      const lunchChecked = $('#calcLunch')?.checked;
      const totalText = $('#calcTotal')?.textContent || '0 ₼';

      const text = encodeURIComponent(
        `🧮 Balakən Park Səfər Hesablanması:\n` +
        `👨‍👩‍👧‍👦 Böyük: ${adults} nəfər, Uşaq: ${kids} nəfər\n` +
        `🎟️ Paket: ${packText}\n` +
        `☕ Samovar Çayı & Menyu: ${lunchChecked ? 'Bəli (+15₼/nəfər)' : 'Xeyr'}\n` +
        `💰 Təxmini Məbləğ: ${totalText}\n` +
        `Sən də bu hekayənin bir hissəsi ol — biletlərimi bron etmək istəyirəm!`
      );

      toast('WhatsApp hesablamanız açılır...');
      setTimeout(() => {
        window.open(`https://wa.me/${TARGET_WA}?text=${text}`, '_blank');
      }, 500);
    });
  }

  // Handle data-ticket attributes on modal triggers
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-modal-open]');
    if (btn) {
      const ticketName = btn.dataset.ticket;
      if (ticketName) {
        const modalTitle = $('#modalTitle');
        if (modalTitle) modalTitle.textContent = `📩 ${ticketName} — WhatsApp Bronu`;
        if (modalWaForm) modalWaForm.dataset.selectedTicket = ticketName;
      }
    }
  });

  /* ---------------------------------------------------------------
     11. Telefon maskası: +994 (50) 555-05-05
  --------------------------------------------------------------- */

  $$('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const id = link.getAttribute('href');
      if (id === '#' || id.length < 2) return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const offset = header ? header.offsetHeight + 14 : 0;
      window.scrollTo({
        top: target.getBoundingClientRect().top + window.scrollY - offset,
        behavior: 'smooth'
      });
    });
  });

})();
