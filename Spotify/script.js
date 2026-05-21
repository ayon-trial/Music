const body = document.body;
const root = document.documentElement;
const searchInput = document.getElementById('search');
const suggestions = document.getElementById('suggestions');
const albumGrid = document.getElementById('albumGrid');
const cards = Array.from(document.querySelectorAll('.album-card'));
const songItems = Array.from(document.querySelectorAll('.song'));
const recentItems = Array.from(document.querySelectorAll('.recent-item'));
const emptyState = document.querySelector('.empty-state');
const themeToggle = document.getElementById('themeToggle');
const transition = document.querySelector('.page-transition');
const nowPlayingLabel = document.querySelector('.now-playing');
const player = document.getElementById('player');
const statCards = Array.from(document.querySelectorAll('.stat-card span'));
const previewAudio = new Audio();
let selectedVisibleIndex = 0;
let currentPreview = null;
let previewTimer;
let hasInteracted = false;

previewAudio.volume = 0.16;
previewAudio.loop = true;
previewAudio.muted = true;

function hexToRgba(hex, alpha = 0.16) {
  const cleaned = hex.replace('#', '');
  const bigint = parseInt(cleaned, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function applyTheme(theme) {
  body.dataset.theme = theme;
  if (themeToggle) {
    themeToggle.textContent = theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode';
  }
  localStorage.setItem('musicTheme', theme);
}

function setAccent(color) {
  root.style.setProperty('--accent', color);
  root.style.setProperty('--accent-soft', hexToRgba(color, 0.16));
}

function updateArtistStats(card) {
  if (!card || !statCards.length) return;
  statCards[0].textContent = card.dataset.listeners || statCards[0].textContent;
  statCards[1].textContent = `${card.dataset.albums || '0'} Albums`;
  statCards[2].textContent = `${card.dataset.songs || '0'} Songs`;
}

function setNowPlaying(text) {
  if (!nowPlayingLabel) return;
  nowPlayingLabel.textContent = `Now Playing: ${text}`;
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function escapeHtml(text) {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function highlightText(text, query) {
  if (!query) return escapeHtml(text);
  const regex = new RegExp(`(${escapeRegExp(query)})`, 'gi');
  return escapeHtml(text).replace(regex, '<strong>$1</strong>');
}

function resetHighlight(card) {
  const title = card.querySelector('b');
  title.textContent = card.dataset.search;
}

function renderSuggestions(matches, query) {
  if (!suggestions) return;
  if (!query || !matches.length) {
    suggestions.classList.remove('active');
    suggestions.innerHTML = '';
    return;
  }

  suggestions.classList.add('active');
  suggestions.innerHTML = matches.slice(0, 5).map((card) => {
    const textValue = card.dataset.search || card.textContent.trim();
    const label = highlightText(textValue, query);
    return `<button type="button" class="suggestion" data-search="${textValue}">${label}</button>`;
  }).join('');
}

function getVisibleCards() {
  return cards.filter((card) => !card.classList.contains('hidden'));
}

function selectVisibleCard(index) {
  const visible = getVisibleCards();
  if (!visible.length) return;
  selectedVisibleIndex = ((index % visible.length) + visible.length) % visible.length;

  visible.forEach((card, cardIndex) => {
    card.classList.toggle('selected', cardIndex === selectedVisibleIndex);
  });

  visible[selectedVisibleIndex].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
}

function updateSearch() {
  if (!searchInput) return;
  const query = searchInput.value.trim().toLowerCase();
  const matches = [];

  if (cards.length) {
    cards.forEach((card) => {
      const title = card.dataset.search;
      const matched = title.toLowerCase().includes(query);
      const titleElement = card.querySelector('b');

      if (query) {
        titleElement.innerHTML = highlightText(title, query);
      } else {
        titleElement.textContent = title;
      }

      if (query && !matched) {
        card.classList.add('hidden');
      } else {
        card.classList.remove('hidden');
        matches.push(card);
      }
    });
  } else if (songItems.length) {
    songItems.forEach((song) => {
      const title = song.textContent.trim();
      const matched = title.toLowerCase().includes(query);

      if (query && !matched) {
        song.classList.add('hidden');
      } else {
        song.classList.remove('hidden');
        matches.push(song);
      }
    });
  }

  if (emptyState) {
    if (!matches.length) {
      emptyState.classList.remove('hidden');
    } else {
      emptyState.classList.add('hidden');
    }
  }

  renderSuggestions(matches, query);
  selectVisibleCard(0);
}

function startPreview(src, label) {
  if (!src) return;
  if (currentPreview === src) return;
  currentPreview = src;
  previewAudio.src = src;
  if (hasInteracted) {
    previewAudio.muted = false;
  }

  previewAudio.play().catch(() => {
    previewAudio.muted = true;
    previewAudio.play().catch(() => {});
  });
  setNowPlaying(`Preview ${label}`);
}

function stopPreview() {
  previewAudio.pause();
  previewAudio.currentTime = 0;
  currentPreview = null;
  setNowPlaying('Nothing');
}

function handleLinkNavigation(link) {
  if (!link || !link.href) return;
  if (transition) {
    transition.classList.add('active');
    setTimeout(() => {
      window.location.href = link.href;
    }, 240);
  } else {
    window.location.href = link.href;
  }
}

function highlightCard(card) {
  cards.forEach((item) => item.classList.toggle('selected', item === card));
}

function attachHoverEffects() {
  cards.forEach((card) => {
    card.addEventListener('mouseenter', () => {
      setAccent(card.dataset.bg || '#1db954');
      updateArtistStats(card);
      highlightCard(card);
    });

    card.addEventListener('mouseleave', () => {
      window.clearTimeout(previewTimer);
    });
  });

  recentItems.forEach((item) => {
    item.addEventListener('mouseenter', () => {
      setAccent(item.dataset.bg || '#1db954');
      setNowPlaying(`Preview ${item.textContent}`);
      previewTimer = window.setTimeout(() => {
        startPreview(item.dataset.preview, item.textContent.trim());
      }, 180);
    });

    item.addEventListener('mouseleave', () => {
      window.clearTimeout(previewTimer);
      stopPreview();
    });
  });
}

function attachLinkTransitions() {
  const links = [...cards, ...recentItems];
  links.forEach((link) => {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      handleLinkNavigation(link);
    });
  });

  if (transition) {
    window.addEventListener('pageshow', () => {
      transition.classList.remove('active');
    });
  }
}

function attachSuggestionActions() {
  if (!suggestions) return;
  suggestions.addEventListener('click', (event) => {
    const button = event.target.closest('.suggestion');
    if (!button) return;
    const searchValue = button.dataset.search || '';
    if (searchInput) {
      searchInput.value = searchValue;
      updateSearch();
    }

    const card = cards.find((item) => item.dataset.search === searchValue);
    if (card) {
      handleLinkNavigation(card);
    }
  });
}

function handleKeyboardNavigation(event) {
  if (document.activeElement === searchInput) {
    return;
  }

  if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
    event.preventDefault();
    selectVisibleCard(selectedVisibleIndex + 1);
  }

  if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
    event.preventDefault();
    selectVisibleCard(selectedVisibleIndex - 1);
  }

  if (event.key === 'Enter') {
    const visible = getVisibleCards();
    if (!visible.length) return;
    event.preventDefault();
    handleLinkNavigation(visible[selectedVisibleIndex]);
  }
}

function initTheme() {
  const stored = localStorage.getItem('musicTheme');
  const theme = stored === 'light' ? 'light' : 'dark';
  applyTheme(theme);
}

function initControls() {
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const nextTheme = body.dataset.theme === 'dark' ? 'light' : 'dark';
      applyTheme(nextTheme);
    });
  }

  if (searchInput) {
    searchInput.addEventListener('input', (event) => {
      searchInput.classList.toggle('typing', event.target.value.trim().length > 0);
      updateSearch();
    });

    searchInput.addEventListener('focus', () => {
      searchInput.classList.toggle('typing', searchInput.value.trim().length > 0);
    });

    searchInput.addEventListener('blur', () => {
      searchInput.classList.remove('typing');
    });
  }
  document.addEventListener('keydown', handleKeyboardNavigation);

  const navButtons = Array.from(document.querySelectorAll('.nav-btn'));
  navButtons.forEach((button) => {
    button.addEventListener('click', () => {
      navButtons.forEach((btn) => btn.classList.remove('active'));
      button.classList.add('active');
    });
  });
}

function init() {
  initTheme();
  attachHoverEffects();
  attachLinkTransitions();
  attachSuggestionActions();
  initControls();
  if (searchInput) {
    updateSearch();
  }
  selectVisibleCard(0);

  document.addEventListener('click', () => {
    if (!hasInteracted) {
      hasInteracted = true;
      previewAudio.muted = false;
    }
  }, { once: true });
}

init();
