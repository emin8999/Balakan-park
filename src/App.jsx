import React, { useState, useEffect, useRef } from 'react';

// Import image assets to ensure Vite bundles and hashes them correctly for production
import avatarImg from './assets/images/balaken_avatar_1785100153474.jpg';
import heroImg from './assets/images/balaken_park_hero_1785100077280.jpg';
import cableCarImg from './assets/images/balaken_cable_car_1785100090355.jpg';
import ferrisWheelImg from './assets/images/balaken_ferris_wheel_1785100101067.jpg';
import kidsZoneImg from './assets/images/balaken_kids_zone_1785100139917.jpg';
import lakeBoatsImg from './assets/images/balaken_lake_boats_1785100114112.jpg';
import restaurantImg from './assets/images/balaken_restaurant_1785100128556.jpg';
import nightImg from './assets/images/balaken_park_night_1785100164253.jpg';

const TARGET_WA = '994501233030';

export default function App() {
  // Navigation & Scroll states
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // Filters state
  const [filterCategory, setFilterCategory] = useState('all');

  // Modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTicket, setModalTicket] = useState('Bilet / Masa Bronu');
  const [modalName, setModalName] = useState('');
  const [modalPhone, setModalPhone] = useState('');
  const [modalMsg, setModalMsg] = useState('');

  // Calculator states
  const [adults, setAdults] = useState(2);
  const [kids, setKids] = useState(0);
  const [packagePrice, setPackagePrice] = useState(5); // Default to Yalnız Kanat Yolu
  const [packageText, setPackageText] = useState('🚡 Yalnız Kanat Yolu (5 ₼)');
  const [lunchChecked, setLunchChecked] = useState(false);
  const [calculatedTotal, setCalculatedTotal] = useState(10);

  // Contact form states
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactService, setContactService] = useState('Kanat Yolu & Attraksion Biletləri');
  const [contactMsg, setContactMsg] = useState('');

  // Toast notification states
  const [toastState, setToastState] = useState({ text: '', visible: false });

  // References
  const packagesRef = useRef([
    { text: '🚡 Yalnız Kanat Yolu (5 ₼)', price: 5 },
    { text: '🎡 Standart Paket (15 ₼)', price: 15 },
    { text: '🎢 Super Paket (25 ₼)', price: 25 },
    { text: '👑 VIP Paket (40 ₼)', price: 40 },
  ]);

  // Toast trigger helper
  const triggerToast = (text) => {
    setToastState({ text, visible: true });
  };

  // Close toast automatically
  useEffect(() => {
    if (toastState.visible) {
      const timer = setTimeout(() => {
        setToastState((prev) => ({ ...prev, visible: false }));
      }, 3200);
      return () => clearTimeout(timer);
    }
  }, [toastState.visible]);

  // Monitor window scroll to apply header styling
  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Update body scroll bar when mobile navigation overlay is open
  useEffect(() => {
    document.body.classList.toggle('nav-open', menuOpen);
  }, [menuOpen]);

  // IntersectionObserver for Scroll Reveal animations
  useEffect(() => {
    const revealItems = document.querySelectorAll('[data-reveal]');
    if (!revealItems.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, i) => {
          if (!entry.isIntersecting) return;
          setTimeout(() => {
            entry.target.classList.add('is-visible');
          }, i * 80);
          io.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
    );

    revealItems.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  // Stats count up animation
  useEffect(() => {
    const counters = document.querySelectorAll('[data-count]');
    if (!counters.length) return;

    const animateCounter = (el) => {
      const target = parseInt(el.getAttribute('data-count'), 10) || 0;
      const duration = 1400;
      const start = performance.now();

      const tick = (now) => {
        const p = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - p, 3); // easeOutCubic
        el.textContent = Math.round(target * eased);
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          animateCounter(e.target);
          io.unobserve(e.target);
        });
      },
      { threshold: 0.5 }
    );

    counters.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  // Recalculate trip budget
  useEffect(() => {
    // Adults: full price. Kids: 70% of package price. Lunch: +15 AZN per person.
    const adultCost = adults * packagePrice;
    const kidsCost = kids * Math.round(packagePrice * 0.7);
    let total = adultCost + kidsCost;
    if (lunchChecked) {
      total += (adults + kids) * 15;
    }
    setCalculatedTotal(total);
  }, [adults, kids, packagePrice, lunchChecked]);

  // Smooth scroll for anchor links
  const handleAnchorClick = (e, id) => {
    e.preventDefault();
    const target = document.querySelector(id);
    if (!target) return;
    const headerEl = document.querySelector('#header');
    const offset = headerEl ? headerEl.offsetHeight + 14 : 0;
    window.scrollTo({
      top: target.getBoundingClientRect().top + window.scrollY - offset,
      behavior: 'smooth',
    });
    setMenuOpen(false);
  };

  // Handle phone input formatting: +994 (XX) XXX-XX-XX
  const handlePhoneInput = (val) => {
    let d = val.replace(/\D/g, '');
    if (d.startsWith('994')) d = d.slice(3);
    else if (d.startsWith('0')) d = d.slice(1);
    d = d.slice(0, 9);

    let out = '+994';
    if (d.length) out += ' (' + d.slice(0, 2);
    if (d.length >= 3) out += ') ' + d.slice(2, 5);
    if (d.length >= 6) out += '-' + d.slice(5, 7);
    if (d.length >= 8) out += '-' + d.slice(7, 9);
    return out;
  };

  // Open booking modal with customized ticket selection
  const openBookingModal = (ticketName) => {
    setModalTicket(ticketName);
    setModalOpen(true);
  };

  // Modal Submit
  const handleModalSubmit = (e) => {
    e.preventDefault();
    if (!modalName.trim() || modalName.length < 2) {
      triggerToast('Lütfən adınızı daxil edin');
      return;
    }

    const text = encodeURIComponent(
      `Salam! Balakən Park-da bilet/masa bron etmək istəyirəm.\n` +
        `👤 Adım: ${modalName}\n` +
        `📞 Telefon: ${modalPhone}\n` +
        `🎟️ Mövzu: ${modalTicket}\n` +
        `💬 Qeyd: ${modalMsg || 'Ətraflı məlumat almaq istəyirəm.'}`
    );

    triggerToast('WhatsApp-a yönləndirilirsiniz...');
    setTimeout(() => {
      window.open(`https://wa.me/${TARGET_WA}?text=${text}`, '_blank');
      setModalOpen(false);
      setModalName('');
      setModalPhone('');
      setModalMsg('');
    }, 500);
  };

  // Contact form submit
  const handleContactSubmit = (e) => {
    e.preventDefault();
    if (!contactName.trim() || contactName.length < 2) {
      triggerToast('Lütfən adınızı daxil edin');
      return;
    }

    const text = encodeURIComponent(
      `✨ Balakən Park Bron Sorğusu\n` +
        `👤 Ad və Soyad: ${contactName}\n` +
        `📞 Telefon: ${contactPhone}\n` +
        `🎯 Xidmət: ${contactService}\n` +
        `📝 Qeydlər: ${contactMsg || 'Bilet/masa bronu etmək istəyirəm.'}`
    );

    triggerToast('WhatsApp-a yönləndirilirsiniz...');
    setTimeout(() => {
      window.open(`https://wa.me/${TARGET_WA}?text=${text}`, '_blank');
      setContactName('');
      setContactPhone('');
      setContactMsg('');
    }, 500);
  };

  // Calculator submit
  const handleCalcWaSubmit = () => {
    const text = encodeURIComponent(
      `🧮 Balakən Park Səfər Hesablanması:\n` +
        `👨‍👩‍👧‍👦 Böyük: ${adults} nəfər, Uşaq: ${kids} nəfər\n` +
        `🎟️ Paket: ${packageText}\n` +
        `☕ Samovar Çayı & Menyu: ${lunchChecked ? 'Bəli (+15₼/nəfər)' : 'Xeyr'}\n` +
        `💰 Təxmini Məbləğ: ${calculatedTotal} ₼\n` +
        `Sən də bu hekayənin bir hissəsi ol — biletlərimi bron etmək istəyirəm!`
    );

    triggerToast('WhatsApp hesablamanız açılır...');
    setTimeout(() => {
      window.open(`https://wa.me/${TARGET_WA}?text=${text}`, '_blank');
    }, 500);
  };

  // Tickets data
  const tickets = [
    {
      id: 1,
      category: 'kanat',
      title: 'Kanat Yolu (Gediş-Gəliş)',
      image: cableCarImg,
      badge: 'Top Tələb',
      tag: null,
      specs: ['1200 Metr', 'Panoramik', 'Ailəvi'],
      price: '5 ₼ (Uşaq 3 ₼)',
      ticketName: 'Kanat Yolu',
    },
    {
      id: 2,
      category: 'rides',
      title: 'Şeytan Çarxı (Ferris Wheel)',
      image: ferrisWheelImg,
      badge: null,
      tag: 'Panoram',
      specs: ['35m hündürlük', 'Ailəvi', '10 dəq'],
      price: '3 ₼',
      ticketName: 'Şeytan Çarxı',
    },
    {
      id: 3,
      category: 'rides',
      title: 'Avtodrom Bamper Maşınlar',
      image: ferrisWheelImg, // Utilizes CSS shift
      badge: null,
      tag: null,
      specs: ['2 nəfərlik', 'Şən yarış', '5 dəq'],
      price: '3 ₼',
      ticketName: 'Avtodrom Bamper Maşınlar',
      style: { objectPosition: 'right' },
    },
    {
      id: 4,
      category: 'kids',
      title: 'Nağıl Karuseli & Batut',
      image: kidsZoneImg,
      badge: 'Uşaq Sevgisi',
      tag: null,
      specs: ['2-12 yaş', 'Musiqili', 'Təhlükəsiz'],
      price: '2 ₼',
      ticketName: 'Nağıl Karuseli',
    },
    {
      id: 5,
      category: 'cafe',
      title: 'Süni Göldə Qayıq Səyahəti',
      image: lakeBoatsImg,
      badge: null,
      tag: null,
      specs: ['4 nəfərlik qayıq', '15 dəqiqə', 'Sakitlik'],
      price: '6 ₼',
      ticketName: 'Göldə Qayıq Səyahəti',
    },
    {
      id: 6,
      category: 'cafe',
      title: 'Balakən Maxarası & Samovar Çayı',
      image: restaurantImg,
      badge: null,
      tag: 'Milli Mətbəx',
      specs: ['Milli resept', 'Açıq hava', 'Ailəvi masalar'],
      price: '12 ₼-dən',
      ticketName: 'Masa və Samovar Bronu',
      btnText: 'Masa Bron Et',
    },
  ];

  return (
    <>
      {/* HEADER */}
      <header className={`header ${scrolled ? 'is-scrolled' : ''}`} id="header">
        <div className="container header__inner">
          <a href="#" className="logo" onClick={(e) => handleAnchorClick(e, '#header')}>
            <img src={avatarImg} alt="Balakən Park" className="logo__img" />
            Balakən<span>Park</span>
          </a>

          <nav className={`nav ${menuOpen ? 'is-open' : ''}`} id="nav">
            <div className="nav__links">
              <a href="#about" onClick={(e) => handleAnchorClick(e, '#about')}>
                Haqqımızda
              </a>
              <a href="#instagram" onClick={(e) => handleAnchorClick(e, '#instagram')}>
                Instagram Qalereya
              </a>
              <a href="#contact" onClick={(e) => handleAnchorClick(e, '#contact')}>
                Əlaqə və Ünvan
              </a>
            </div>
            <div className="nav__mobile-footer">
              <a
                href="https://wa.me/994501233030?text=Salam!%20Balakən%20Park-da%20bilet%20bron%20etmək%20istəyirəm."
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn--wa btn--full"
              >
                💬 WhatsApp ilə Bron (050 123 30 30)
              </a>
              <div style={{ fontSize: '13px', color: 'var(--muted)', textAlign: 'center' }}>
                📍 Gənclik 19 küçəsi, Balakən
              </div>
            </div>
          </nav>

          <div className="header__actions">
            <a
              href="https://www.instagram.com/balaken.park?igsh=Nzl2dmtsNGdoY2Fv"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn--insta"
              title="@balaken.park Instagram"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
              </svg>
              <span className="btn-text" style={{ marginLeft: '6px' }}>
                @balaken.park
              </span>
            </a>
            <button className="btn btn--dark" onClick={() => openBookingModal('Ümumi Rezervasiya')}>
              Bilet Bron et
            </button>
            <button
              className={`burger ${menuOpen ? 'is-open' : ''}`}
              id="burger"
              aria-label="Menyu"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="hero" id="about">
        <div className="container">
          <div className="hero__top" data-reveal>
            <h1>
              Təbiət qoynunda
              <br />
              <em>unudulmaz</em>
              <br />
              əyləncə dünyası
            </h1>
          </div>

          <div className="hero__visual" data-reveal>
            <img src={heroImg} alt="Balakən Park Hero Mənzərəsi" className="hero__photo-img" />
            <div className="hero__note">
              <span className="hero__note-num">1200m</span>
              <span className="hero__note-txt">
                Kanat Yolu
                <br />
                Panoramik
                <br />
                Dağ Mənzərəsi
              </span>
            </div>
          </div>

          <div className="hero__bottom">
            <div className="hero__desc-box" data-reveal>
              <p className="hero__desc">
                ✨ <strong>Balakənin yeni siması — Balakən Park!</strong> Azərbaycanın ən füsunkar təbiət guşələrindən
                birində yerləşən müasir kanat yolu, attraksionlar, süni göl, uşaq oyun dünyası və milli mətbəximizin ləziz
                təamları sizi gözləyir.
              </p>
              <div className="hero__info-pills">
                <span>📍 Ünvan: Gənclik 19 küçəsi</span>
                <span>📞 Əlaqə: 050 123 30 30</span>
              </div>
            </div>
            <div className="hero__cta" data-reveal>
              <button className="btn btn--dark btn--lg" onClick={() => openBookingModal('WhatsApp Paket Bronu')}>
                📩 WhatsApp ilə Bilet Bron Et
              </button>
              <a
                href="https://www.instagram.com/balaken.park?igsh=Nzl2dmtsNGdoY2Fv"
                target="_blank"
                rel="noopener noreferrer"
                className="link-arrow"
              >
                Instagram Səhifəsi
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* MARQUEE */}
      <div className="marquee">
        <div className="marquee__track">
          <span>🚡 Kanat Yolu</span>
          <span>•</span>
          <span>🎡 Şeytan Çarxı</span>
          <span>•</span>
          <span>🚗 Avtodrom Maşınları</span>
          <span>•</span>
          <span>🎢 Attraksionlar</span>
          <span>•</span>
          <span>🛶 Süni Göl & Qayıqlar</span>
          <span>•</span>
          <span>☕ Milli Restoran & Samovar Çayı</span>
          <span>•</span>
          <span>🌳 Təbiət Parkı & Fəvvarələr</span>
          <span>•</span>
          <span>📸 Instagram Foto Zonalar</span>
          <span>•</span>
          <span>🚡 Kanat Yolu</span>
          <span>•</span>
          <span>🎡 Şeytan Çarxı</span>
          <span>•</span>
          <span>🚗 Avtodrom Maşınları</span>
          <span>•</span>
          <span>🎢 Attraksionlar</span>
          <span>•</span>
          <span>🛶 Süni Göl & Qayıqlar</span>
          <span>•</span>
          <span>☕ Milli Restoran & Samovar Çayı</span>
        </div>
      </div>

      {/* INSTAGRAM PROFILE WIDGET */}
      <section className="insta-bar">
        <div className="container">
          <div className="insta-bar__card" data-reveal>
            <div className="insta-bar__avatar">
              <img src={avatarImg} alt="balaken.park avatar" className="insta-bar__avatar-img" />
            </div>
            <div className="insta-bar__info">
              <div className="insta-bar__header">
                <h3>balaken.park</h3>
                <span className="insta-bar__badge">✓ Rəsmi Instagram</span>
              </div>
              <p className="insta-bar__bio">
                ✨ <strong>Balakənin yeni siması - Balakən Park</strong>
                <br />
                📍 Ünvan : Gənclik 19 küçəsi, Balakən
                <br />
                📞 Ətraflı məlumat üçün : 050 123 30 30
                <br />
                📩 Sən də bu hekayənin bir hissəsi ol — bilet bron etmək üçün adı ilə birlikdə WhatsApp-a yaz!
              </p>
              <div className="insta-bar__stats">
                <span>
                  <b>25+</b> Attraksion
                </span>
                <span>
                  <b>1200m</b> Kanat Yolu
                </span>
                <span>
                  <b>100%</b> Ailəvi İstirahət
                </span>
              </div>
            </div>
            <a
              href="https://www.instagram.com/balaken.park?igsh=Nzl2dmtsNGdoY2Fv"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn--insta btn--lg"
            >
              İzləyin @balaken.park
            </a>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="section" id="services">
        <div className="container">
          <div className="head" data-reveal>
            <span className="eyebrow">01 — Parkın Əyləncə Zirvələri</span>
            <h2>Əsas Məkanlar və Xidmətlərimiz</h2>
          </div>

          <div className="list">
            <article className="row" data-reveal>
              <span className="row__num">01</span>
              <h3>Kanat Yolu (Cable Car)</h3>
              <p>Balakənin füsunkar dağ panoramasına açılan 1200 metrlik kanat xətti. Təmiz dağ havası və bənzərsiz foto zonaları.</p>
              <span className="row__meta">Hər gün açıq</span>
            </article>
            <article className="row" data-reveal>
              <span className="row__num">02</span>
              <h3>Attraksion Parkı və Şeytan Çarxı</h3>
              <p>Uşaqlar və böyüklər üçün karusellər, avtodrom bamper maşınları, həyəcanlı oyunlar və panoramik Şeytan Çarxı.</p>
              <span className="row__meta">25+ Attraksion</span>
            </article>
            <article className="row" data-reveal>
              <span className="row__num">03</span>
              <h3>Süni Göl və Qayıq Səyahəti</h3>
              <p>Sakit göl sularında pedallı qayıqlar ilə ailəvi gəzinti, fəvvarələr şousu və romantik mənzərələr.</p>
              <span className="row__meta">Su əyləncəsi</span>
            </article>
            <article className="row" data-reveal>
              <span className="row__num">04</span>
              <h3>Milli Restoran & Samovar Çay Evi</h3>
              <p>Balakənin məşhur maxarası, kabablar, təzə kənd məhsulları, samovar çayı və dağ mənzərəli açıq hava masaları.</p>
              <span className="row__meta">Ləziz Mətbəx</span>
            </article>
            <article className="row" data-reveal>
              <span className="row__num">05</span>
              <h3>Uşaq Oyun Meydançası və Batutlar</h3>
              <p>Təhlükəsiz yumşaq örtüklü uşaq zonasında şən karusellər, tramplinlər, batutlar və nağıl qəhrəmanları.</p>
              <span className="row__meta">Uşaqlar üçün</span>
            </article>
          </div>
        </div>
      </section>

      {/* ATTRACTIONS & TICKETS */}
      <section className="section section--paper" id="attractions">
        <div className="container">
          <div className="head head--row" data-reveal>
            <div>
              <span className="eyebrow">02 — Biletlər və Attraksionlar</span>
              <h2>Qiymətlər və Paketlər</h2>
            </div>
            <div className="filters">
              <button
                className={`chip ${filterCategory === 'all' ? 'is-active' : ''}`}
                onClick={() => setFilterCategory('all')}
              >
                Hamısı
              </button>
              <button
                className={`chip ${filterCategory === 'kanat' ? 'is-active' : ''}`}
                onClick={() => setFilterCategory('kanat')}
              >
                Kanat Yolu
              </button>
              <button
                className={`chip ${filterCategory === 'rides' ? 'is-active' : ''}`}
                onClick={() => setFilterCategory('rides')}
              >
                Attraksionlar
              </button>
              <button
                className={`chip ${filterCategory === 'kids' ? 'is-active' : ''}`}
                onClick={() => setFilterCategory('kids')}
              >
                Uşaq Zonası
              </button>
              <button
                className={`chip ${filterCategory === 'cafe' ? 'is-active' : ''}`}
                onClick={() => setFilterCategory('cafe')}
              >
                Restoran & Göl
              </button>
            </div>
          </div>

          <div className="grid">
            {tickets
              .filter((ticket) => filterCategory === 'all' || ticket.category === filterCategory)
              .map((ticket) => (
                <article key={ticket.id} className="house" data-reveal>
                  <div className="house__img-wrap">
                    <img
                      src={ticket.image}
                      alt={ticket.title}
                      className="house__img-photo"
                      style={ticket.style || {}}
                    />
                    {ticket.badge && <span className="house__badge">{ticket.badge}</span>}
                  </div>
                  <div className="house__body">
                    <div className="house__title">
                      <h3>{ticket.title}</h3>
                      {ticket.tag && <span className="house__tag">{ticket.tag}</span>}
                    </div>
                    <ul className="house__specs">
                      {ticket.specs.map((spec, i) => (
                        <li key={i}>{spec}</li>
                      ))}
                    </ul>
                    <div className="house__foot">
                      <b>{ticket.price}</b>
                      <button
                        className="btn btn--dark btn--sm"
                        onClick={() => openBookingModal(ticket.ticketName)}
                      >
                        {ticket.btnText || 'Bron Et'}
                      </button>
                    </div>
                  </div>
                </article>
              ))}
          </div>
        </div>
      </section>

      {/* TRIP CALCULATOR WITH DIRECT WHATSAPP */}
      <section className="section" id="calculator">
        <div className="container split">
          <div data-reveal>
            <span className="eyebrow">03 — Səfər və Büdcə Planlayıcısı</span>
            <h2>
              Ailəvi istirahət büdçənizi
              <br />
              dərhal hesablayın
            </h2>
            <p style={{ color: 'var(--muted)', marginBottom: '24px' }}>
              Gəlməzdən əvvəl neçə nəfərlə gələcəyinizi və istədiyiniz attraksion paketini seçib birbaşa WhatsApp ilə
              sifariş göndərin:
            </p>
            <ol className="steps">
              <li>
                <b>Böyük və uşaq sayını seçin</b>
                <span>Ailə üzvlərinizin sayını təyin edin.</span>
              </li>
              <li>
                <b>Kanat Yolu və Attraksion paketini daxil edin</b>
                <span>Panoramik gediş-gəliş və əyləncələri seçin.</span>
              </li>
              <li>
                <b>Nəticəni birbaşa WhatsApp-a göndərin</b>
                <span>Sifarişiniz adı ilə 050 123 30 30 WhatsApp-a göndəriləcək.</span>
              </li>
            </ol>
          </div>

          <div className="calc-box" data-reveal>
            <h3>🧮 Səfər Hesablayıcı</h3>
            <div className="calc">
              <label>
                <span>
                  Böyük sayı: <output>{adults}</output> nəfər
                </span>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={adults}
                  onChange={(e) => setAdults(Number(e.target.value))}
                />
              </label>

              <label>
                <span>
                  Uşaq sayı: <output>{kids}</output> nəfər
                </span>
                <input
                  type="range"
                  min="0"
                  max="10"
                  value={kids}
                  onChange={(e) => setKids(Number(e.target.value))}
                />
              </label>

              <label>
                <span>Əyləncə Paketi</span>
                <select
                  value={packagePrice}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setPackagePrice(val);
                    const found = packagesRef.current.find((p) => p.price === val);
                    if (found) setPackageText(found.text);
                  }}
                >
                  {packagesRef.current.map((p, idx) => (
                    <option key={idx} value={p.price}>
                      {p.text}
                    </option>
                  ))}
                </select>
              </label>

              <label className="calc__check">
                <input
                  type="checkbox"
                  checked={lunchChecked}
                  onChange={(e) => setLunchChecked(e.target.checked)}
                />
                <span>Samovar Çayı & Menyu (+15₼ / nəfər)</span>
              </label>

              <div className="calc__result">
                <span>Təxmini Məbləğ:</span>
                <strong>{calculatedTotal} ₼</strong>
              </div>

              <button className="btn btn--wa btn--full" onClick={handleCalcWaSubmit}>
                💬 Hesablamanı WhatsApp-a Göndər
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="stats">
        <div className="container stats__inner">
          <div className="stat" data-reveal>
            <b data-count="150000">0</b>
            <span>illik ziyarətçi</span>
          </div>
          <div className="stat" data-reveal>
            <b data-count="1200">0</b>
            <span>metr kanat xətti</span>
          </div>
          <div className="stat" data-reveal>
            <b data-count="25">0</b>
            <span>müasir attraksion</span>
          </div>
          <div className="stat" data-reveal>
            <b data-count="100">0</b>
            <span>% təhlükəsizlik</span>
          </div>
        </div>
      </section>

      {/* INSTAGRAM GALLERY SECTION */}
      <section className="section section--paper" id="instagram">
        <div className="container">
          <div className="head head--row" data-reveal>
            <div>
              <span className="eyebrow">04 — Instagram Qalereyası</span>
              <h2>@balaken.park Fotostend</h2>
            </div>
            <a
              href="https://www.instagram.com/balaken.park?igsh=Nzl2dmtsNGdoY2Fv"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn--insta"
            >
              Instagram-da İzləyin
            </a>
          </div>

          <div className="insta-grid" data-reveal>
            <div className="insta-card">
              <img src={heroImg} alt="Balakən Park Panorama" className="insta-card__img" />
              <div className="insta-card__overlay">
                <span>🚡 Kanat Yolu və Dağ Mənzərəsi</span>
              </div>
            </div>
            <div className="insta-card">
              <img src={nightImg} alt="İşıqlı Park" className="insta-card__img" />
              <div className="insta-card__overlay">
                <span>🎡 Gecə İşıqlarında Balakən Park</span>
              </div>
            </div>
            <div className="insta-card">
              <img src={lakeBoatsImg} alt="Süni Göl" className="insta-card__img" />
              <div className="insta-card__overlay">
                <span>🛶 Süni Göl və Qayıq Gəzintisi</span>
              </div>
            </div>
            <div className="insta-card">
              <img src={restaurantImg} alt="Milli Restoran" className="insta-card__img" />
              <div className="insta-card__overlay">
                <span>☕ Samovar Çayı və Balakən Maxarası</span>
              </div>
            </div>
            <div className="insta-card">
              <img src={ferrisWheelImg} alt="Attraksionlar" className="insta-card__img" />
              <div className="insta-card__overlay">
                <span>🎡 Şeytan Çarxı & Avtodrom</span>
              </div>
            </div>
            <div className="insta-card">
              <img src={kidsZoneImg} alt="Uşaq Zonası" className="insta-card__img" />
              <div className="insta-card__overlay">
                <span>✨ Uşaq Karuselləri və Batutlar</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CONTACT & DIRECT WHATSAPP */}
      <section className="cta" id="contact">
        <div className="container cta__inner" data-reveal>
          <div className="cta__text">
            <span className="eyebrow">05 — Ünvan və Əlaqə</span>
            <h2>✨ Balakənin yeni siması - Balakən Park</h2>
            <p>
              Sən də bu hekayənin bir hissəsi ol! Bilet və ya masa bron etmək üçün məlumatları daxil edib birbaşa{' '}
              <strong>050 123 30 30 WhatsApp</strong> nömrəmizə göndərə bilərsiniz.
            </p>

            <div className="contact-details">
              <div className="contact-item">
                <strong>📍 Ünvan:</strong> Gənclik 19 küçəsi, Balakən
              </div>
              <div className="contact-item">
                <strong>📞 Əlaqə nömrəsi:</strong> <a href="tel:+994501233030">050 123 30 30</a>
              </div>
              <div className="contact-item">
                <strong>🕒 İş saatları:</strong> Hər gün 09:00 - 23:00
              </div>
              <div className="contact-item">
                <strong>📸 Instagram:</strong>{' '}
                <a
                  href="https://www.instagram.com/balaken.park?igsh=Nzl2dmtsNGdoY2Fv"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  @balaken.park
                </a>
              </div>
            </div>
          </div>

          <form className="form" id="contactWaForm" onSubmit={handleContactSubmit}>
            <h3 style={{ fontSize: '22px', marginBottom: '6px' }}>📩 WhatsApp ilə Bilet / Masa Bronu</h3>
            <p style={{ fontSize: '13px', color: 'var(--muted)', marginBottom: '12px' }}>
              Məlumatı doldurun, birbaşa WhatsApp-a yönləndiriləcəksiniz:
            </p>
            <input
              type="text"
              id="waName"
              placeholder="Ad və Soyadınız"
              value={contactName}
              onChange={(e) => setContactName(e.target.value)}
              required
            />
            <input
              type="tel"
              id="waPhone"
              placeholder="+994 (50) 123-30-30"
              value={contactPhone}
              onFocus={() => {
                if (!contactPhone) setContactPhone('+994 ');
              }}
              onChange={(e) => setContactPhone(handlePhoneInput(e.target.value))}
              required
            />
            <select
              id="waService"
              style={{
                padding: '14px',
                borderRadius: '4px',
                border: '1px solid var(--line)',
                background: 'var(--bg)',
                color: 'var(--ink)',
              }}
              value={contactService}
              onChange={(e) => setContactService(e.target.value)}
            >
              <option value="Kanat Yolu & Attraksion Biletləri">🚡 Kanat Yolu & Attraksion Biletləri</option>
              <option value="Milli Restoran & Masa Bronu">☕ Milli Restoran & Masa Bronu</option>
              <option value="Süni Göl Qayıq Səyahəti">🛶 Süni Göl Qayıq Səyahəti</option>
              <option value="Kollektiv / Məktəb Qrupu Gəzintisi">🚌 Kollektiv və ya Qrup Gəzintisi</option>
            </select>
            <textarea
              id="waMsg"
              rows="3"
              placeholder="Ziyarət tarixi və ya əlavə qeydləriniz (məsələn: 4 nəfər ailəlik gəlirik)"
              value={contactMsg}
              onChange={(e) => setContactMsg(e.target.value)}
            ></textarea>

            <button className="btn btn--wa btn--full" type="submit">
              💬 WhatsApp-a Göndər (050 123 30 30)
            </button>
            <p className="form__note">Təsdiq mesajı birbaşa 050 123 30 30 WhatsApp nömrəsinə adınızla göndəriləcək.</p>
          </form>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div className="container footer__inner">
          <a href="#" className="logo" onClick={(e) => handleAnchorClick(e, '#header')}>
            <img src={avatarImg} alt="Balakən Park" className="logo__img" />
            Balakən<span>Park</span>
          </a>
          <div className="footer__links">
            <a href="tel:+994501233030">📞 050 123 30 30</a>
            <a href="https://wa.me/994501233030" target="_blank" rel="noopener noreferrer">
              💬 WhatsApp: 050 123 30 30
            </a>
            <a
              href="https://www.instagram.com/balaken.park?igsh=Nzl2dmtsNGdoY2Fv"
              target="_blank"
              rel="noopener noreferrer"
            >
              📸 @balaken.park
            </a>
            <span>📍 Gənclik 19 küçəsi, Balakən</span>
          </div>
          <p>© 2026 Balakən Park & Əyləncə Mərkəzi. ✨ Balakənin yeni siması.</p>
        </div>
      </footer>

      {/* FLOATING WHATSAPP BUTTON */}
      <a
        href="https://wa.me/994501233030?text=Salam!%20Balakən%20Park%20haqqında%20məlumat%20və%20bilet%20bron%20etmək%20istəyirəm."
        target="_blank"
        rel="noopener noreferrer"
        className="float-wa"
        title="WhatsApp 050 123 30 30"
      >
        <svg
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
        </svg>
        <span>WhatsApp: 050 123 30 30</span>
      </a>

      {/* MODAL */}
      <div className="modal" id="modal" hidden={!modalOpen}>
        <div className="modal__backdrop" onClick={() => setModalOpen(false)}></div>
        <div className="modal__box">
          <button className="modal__close" onClick={() => setModalOpen(false)} aria-label="Bağla">
            ×
          </button>
          <span className="eyebrow">Balakən Park WhatsApp Rezervasiya</span>
          <h3 id="modalTitle">📩 {modalTicket} — WhatsApp Bronu</h3>
          <p className="modal__sub">
            Məlumatlarınızı yazın, adınızla birbaşa <strong>050 123 30 30 WhatsApp</strong> xəttimizə göndəriləcək.
          </p>
          <form className="form" id="modalWaForm" onSubmit={handleModalSubmit}>
            <input
              type="text"
              id="modalName"
              placeholder="Ad və Soyadınız"
              value={modalName}
              onChange={(e) => setModalName(e.target.value)}
              required
            />
            <input
              type="tel"
              id="modalPhone"
              placeholder="+994 (50) 123-30-30"
              value={modalPhone}
              onFocus={() => {
                if (!modalPhone) setModalPhone('+994 ');
              }}
              onChange={(e) => setModalPhone(handlePhoneInput(e.target.value))}
              required
            />
            <textarea
              id="modalMsg"
              rows="3"
              placeholder="Ziyarət tarixi və ya istədiyiniz bilet/masa sayı"
              value={modalMsg}
              onChange={(e) => setModalMsg(e.target.value)}
            ></textarea>
            <button className="btn btn--wa btn--full" type="submit">
              💬 WhatsApp ilə Göndər (050 123 30 30)
            </button>
          </form>
        </div>
      </div>

      {/* TOAST */}
      <div className={`toast ${toastState.visible ? 'is-visible' : ''}`} id="toast">
        {toastState.text}
      </div>
    </>
  );
}
