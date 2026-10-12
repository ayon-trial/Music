const body = document.body;
const root = document.documentElement;
const searchInput = document.getElementById('search');
const suggestions = document.getElementById('suggestions');
const albumGrid = document.getElementById('albumGrid');
const catalogGrid = document.getElementById('albumGrid');
const cards = Array.from(document.querySelectorAll('.album-card'));
const songItems = Array.from(document.querySelectorAll('.song'));
const recentItems = Array.from(document.querySelectorAll('.recent-item'));
const emptyState = document.querySelector('.empty-state');
const themeToggle = document.getElementById('themeToggle');
let settingsToggle = document.getElementById('settingsToggle');
let settingsMenu = document.getElementById('settingsMenu');
let languageOptions = Array.from(document.querySelectorAll('.language-option'));
let songCards = [];
const transition = document.querySelector('.page-transition');
const nowPlayingLabel = document.querySelector('.now-playing');
const player = document.getElementById('player');
const statCards = Array.from(document.querySelectorAll('.stat-card span'));
const previewAudio = new Audio();
let selectedVisibleIndex = 0;
let currentPreview = null;
let previewTimer;
let hasInteracted = false;

const translations = {
  en: {
    library: 'Library',
    favorites: 'Favorites',
    settings: 'Settings',
    preferences: 'PREFERENCES',
    language: 'Language',
    searchSongs: 'Search songs...',
    artistPlaylist: 'Artist • Playlist',
    primaryNavigation: 'Primary navigation',
    artistAlbumGrid: 'Artist album grid',
    musicCollection: 'Music collection',
    searchPlaceholder: 'What do you want to play?',
    listenHeading: 'What do you want to listen to?',
    artist: 'Artist',
    emptyState: 'No matches found. Try another artist or song.',
    nowPlaying: 'Now Playing:',
    none: 'None',
    trackProgress: 'Track progress',
    previousSong: 'Previous song',
    playPause: 'Play or pause',
    nextSong: 'Next song',
    toggleRepeat: 'Toggle repeat',
    muteUnmute: 'Mute or unmute',
    volume: 'Volume'
  },
  ar: {
    library: 'المكتبة',
    favorites: 'المفضلة',
    settings: 'الإعدادات',
    preferences: 'التفضيلات',
    language: 'اللغة',
    searchSongs: 'ابحث عن الأغاني...',
    artistPlaylist: 'فنان • قائمة تشغيل',
    primaryNavigation: 'التنقل الرئيسي',
    artistAlbumGrid: 'قائمة الفنانين',
    musicCollection: 'مجموعة الموسيقى',
    searchPlaceholder: 'ما الذي تريد الاستماع إليه؟',
    listenHeading: 'ما الذي تريد الاستماع إليه؟',
    artist: 'فنان',
    emptyState: 'لم يتم العثور على نتائج. جرّب فنانًا أو أغنية أخرى.',
    nowPlaying: 'يُشغّل الآن:',
    none: 'لا شيء',
    trackProgress: 'تقدم المقطع',
    previousSong: 'الأغنية السابقة',
    playPause: 'تشغيل أو إيقاف مؤقت',
    nextSong: 'الأغنية التالية',
    toggleRepeat: 'تبديل التكرار',
    muteUnmute: 'كتم الصوت أو إلغاء كتمه',
    volume: 'مستوى الصوت'
  },
  bn: {
    library: 'লাইব্রেরি',
    favorites: 'পছন্দের',
    settings: 'সেটিংস',
    preferences: 'পছন্দসমূহ',
    language: 'ভাষা',
    searchSongs: 'গান খুঁজুন...',
    artistPlaylist: 'শিল্পী • প্লেলিস্ট',
    primaryNavigation: 'প্রধান নেভিগেশন',
    artistAlbumGrid: 'শিল্পীদের তালিকা',
    musicCollection: 'সঙ্গীত সংগ্রহ',
    searchPlaceholder: 'আপনি কী শুনতে চান?',
    listenHeading: 'আপনি কী শুনতে চান?',
    artist: 'শিল্পী',
    emptyState: 'কোনো ফলাফল পাওয়া যায়নি। অন্য শিল্পী বা গান খুঁজুন।',
    nowPlaying: 'এখন চলছে:',
    none: 'কিছুই নয়',
    trackProgress: 'গানের অগ্রগতি',
    previousSong: 'আগের গান',
    playPause: 'চালান বা বিরতি দিন',
    nextSong: 'পরের গান',
    toggleRepeat: 'পুনরাবৃত্তি চালু বা বন্ধ করুন',
    muteUnmute: 'শব্দ বন্ধ বা চালু করুন',
    volume: 'শব্দের মাত্রা'
  },
  el: {
    library: 'Βιβλιοθήκη',
    favorites: 'Αγαπημένα',
    settings: 'Ρυθμίσεις',
    preferences: 'ΠΡΟΤΙΜΗΣΕΙΣ',
    language: 'Γλώσσα',
    searchSongs: 'Αναζήτηση τραγουδιών...',
    artistPlaylist: 'Καλλιτέχνης • Λίστα αναπαραγωγής',
    primaryNavigation: 'Κύρια πλοήγηση',
    artistAlbumGrid: 'Λίστα καλλιτεχνών',
    musicCollection: 'Μουσική συλλογή',
    searchPlaceholder: 'Τι θέλετε να ακούσετε;',
    listenHeading: 'Τι θέλετε να ακούσετε;',
    artist: 'Καλλιτέχνης',
    emptyState: 'Δεν βρέθηκαν αποτελέσματα. Δοκιμάστε άλλον καλλιτέχνη ή τραγούδι.',
    nowPlaying: 'Αναπαραγωγή τώρα:',
    none: 'Κανένα',
    trackProgress: 'Πρόοδος κομματιού',
    previousSong: 'Προηγούμενο τραγούδι',
    playPause: 'Αναπαραγωγή ή παύση',
    nextSong: 'Επόμενο τραγούδι',
    toggleRepeat: 'Εναλλαγή επανάληψης',
    muteUnmute: 'Σίγαση ή κατάργηση σίγασης',
    volume: 'Ένταση'
  },
  hi: {
    library: 'लाइब्रेरी',
    favorites: 'पसंदीदा',
    settings: 'सेटिंग',
    preferences: 'प्राथमिकताएँ',
    language: 'भाषा',
    searchSongs: 'गाने खोजें...',
    artistPlaylist: 'कलाकार • प्लेलिस्ट',
    primaryNavigation: 'मुख्य नेविगेशन',
    artistAlbumGrid: 'कलाकारों की सूची',
    musicCollection: 'संगीत संग्रह',
    searchPlaceholder: 'आप क्या सुनना चाहते हैं?',
    listenHeading: 'आप क्या सुनना चाहते हैं?',
    artist: 'कलाकार',
    emptyState: 'कोई परिणाम नहीं मिला। कोई दूसरा कलाकार या गाना आज़माएँ।',
    nowPlaying: 'अभी चल रहा है:',
    none: 'कुछ नहीं',
    trackProgress: 'गाने की प्रगति',
    previousSong: 'पिछला गाना',
    playPause: 'चलाएँ या रोकें',
    nextSong: 'अगला गाना',
    toggleRepeat: 'दोहराव चालू या बंद करें',
    muteUnmute: 'आवाज़ बंद या चालू करें',
    volume: 'आवाज़'
  },
  'pt-PT': {
    library: 'Biblioteca',
    favorites: 'Favoritos',
    settings: 'Definições',
    preferences: 'PREFERÊNCIAS',
    language: 'Idioma',
    searchSongs: 'Pesquisar músicas...',
    artistPlaylist: 'Artista • Lista de reprodução',
    primaryNavigation: 'Navegação principal',
    artistAlbumGrid: 'Grelha de artistas',
    musicCollection: 'Coleção de música',
    searchPlaceholder: 'O que quer ouvir?',
    listenHeading: 'O que quer ouvir?',
    artist: 'Artista',
    emptyState: 'Não foram encontrados resultados. Tente outro artista ou música.',
    nowPlaying: 'A tocar:',
    none: 'Nenhuma',
    trackProgress: 'Progresso da faixa',
    previousSong: 'Música anterior',
    playPause: 'Reproduzir ou pausar',
    nextSong: 'Música seguinte',
    toggleRepeat: 'Ativar ou desativar repetição',
    muteUnmute: 'Ativar ou desativar som',
    volume: 'Volume'
  },
  ru: {
    library: 'Медиатека',
    favorites: 'Избранное',
    settings: 'Настройки',
    preferences: 'ПРЕДПОЧТЕНИЯ',
    language: 'Язык',
    searchSongs: 'Поиск песен...',
    artistPlaylist: 'Исполнитель • Плейлист',
    primaryNavigation: 'Основная навигация',
    artistAlbumGrid: 'Список исполнителей',
    musicCollection: 'Музыкальная коллекция',
    searchPlaceholder: 'Что хотите послушать?',
    listenHeading: 'Что хотите послушать?',
    artist: 'Исполнитель',
    emptyState: 'Ничего не найдено. Попробуйте другого исполнителя или песню.',
    nowPlaying: 'Сейчас играет:',
    none: 'Нет',
    trackProgress: 'Прогресс трека',
    previousSong: 'Предыдущая песня',
    playPause: 'Воспроизвести или приостановить',
    nextSong: 'Следующая песня',
    toggleRepeat: 'Включить или выключить повтор',
    muteUnmute: 'Включить или выключить звук',
    volume: 'Громкость'
  },
  fr: {
    library: 'Bibliothèque',
    favorites: 'Favoris',
    settings: 'Paramètres',
    preferences: 'PRÉFÉRENCES',
    language: 'Langue',
    searchSongs: 'Rechercher des morceaux...',
    artistPlaylist: 'Artiste • Playlist',
    primaryNavigation: 'Navigation principale',
    artistAlbumGrid: 'Grille des artistes',
    musicCollection: 'Collection musicale',
    searchPlaceholder: 'Que souhaitez-vous écouter ?',
    listenHeading: 'Que souhaitez-vous écouter ?',
    artist: 'Artiste',
    emptyState: 'Aucun résultat. Essayez un autre artiste ou morceau.',
    nowPlaying: 'En cours de lecture :',
    none: 'Aucun',
    trackProgress: 'Progression du morceau',
    previousSong: 'Morceau précédent',
    playPause: 'Lire ou mettre en pause',
    nextSong: 'Morceau suivant',
    toggleRepeat: 'Activer ou désactiver la répétition',
    muteUnmute: 'Activer ou désactiver le son',
    volume: 'Volume'
  },
  es: {
    library: 'Biblioteca',
    favorites: 'Favoritos',
    settings: 'Ajustes',
    preferences: 'PREFERENCIAS',
    language: 'Idioma',
    searchSongs: 'Buscar canciones...',
    artistPlaylist: 'Artista • Lista de reproducción',
    primaryNavigation: 'Navegación principal',
    artistAlbumGrid: 'Lista de artistas',
    musicCollection: 'Colección musical',
    searchPlaceholder: '¿Qué quieres escuchar?',
    listenHeading: '¿Qué quieres escuchar?',
    artist: 'Artista',
    emptyState: 'No se encontraron resultados. Prueba con otro artista o canción.',
    nowPlaying: 'Reproduciendo:',
    none: 'Nada',
    trackProgress: 'Progreso de la canción',
    previousSong: 'Canción anterior',
    playPause: 'Reproducir o pausar',
    nextSong: 'Siguiente canción',
    toggleRepeat: 'Activar o desactivar repetición',
    muteUnmute: 'Silenciar o activar el sonido',
    volume: 'Volumen'
  },
  'zh-CN': {
    library: '音乐库',
    favorites: '收藏',
    settings: '设置',
    preferences: '偏好设置',
    language: '语言',
    searchSongs: '搜索歌曲...',
    artistPlaylist: '艺人 • 播放列表',
    primaryNavigation: '主导航',
    artistAlbumGrid: '艺人列表',
    musicCollection: '音乐合集',
    searchPlaceholder: '想听些什么？',
    listenHeading: '想听些什么？',
    artist: '艺人',
    emptyState: '没有找到结果。请尝试其他艺人或歌曲。',
    nowPlaying: '正在播放：',
    none: '无',
    trackProgress: '播放进度',
    previousSong: '上一首',
    playPause: '播放或暂停',
    nextSong: '下一首',
    toggleRepeat: '切换循环播放',
    muteUnmute: '静音或取消静音',
    volume: '音量'
  },
  tr: {
    library: 'Kütüphane',
    favorites: 'Favoriler',
    settings: 'Ayarlar',
    preferences: 'TERCİHLER',
    language: 'Dil',
    searchSongs: 'Şarkı ara...',
    artistPlaylist: 'Sanatçı • Çalma listesi',
    primaryNavigation: 'Ana gezinme',
    artistAlbumGrid: 'Sanatçı listesi',
    musicCollection: 'Müzik koleksiyonu',
    searchPlaceholder: 'Ne dinlemek istersiniz?',
    listenHeading: 'Ne dinlemek istersiniz?',
    artist: 'Sanatçı',
    emptyState: 'Sonuç bulunamadı. Başka bir sanatçı veya şarkı deneyin.',
    nowPlaying: 'Şimdi çalıyor:',
    none: 'Yok',
    trackProgress: 'Parça ilerlemesi',
    previousSong: 'Önceki şarkı',
    playPause: 'Oynat veya duraklat',
    nextSong: 'Sonraki şarkı',
    toggleRepeat: 'Tekrarı aç veya kapat',
    muteUnmute: 'Sesi kapat veya aç',
    volume: 'Ses seviyesi'
  },
  ur: {
    library: 'لائبریری',
    favorites: 'پسندیدہ',
    settings: 'ترتیبات',
    preferences: 'ترجیحات',
    language: 'زبان',
    searchSongs: 'گانے تلاش کریں...',
    artistPlaylist: 'فنکار • پلے لسٹ',
    primaryNavigation: 'بنیادی نیویگیشن',
    artistAlbumGrid: 'فنکاروں کی فہرست',
    musicCollection: 'موسیقی کا مجموعہ',
    searchPlaceholder: 'آپ کیا سننا چاہتے ہیں؟',
    listenHeading: 'آپ کیا سننا چاہتے ہیں؟',
    artist: 'فنکار',
    emptyState: 'کوئی نتیجہ نہیں ملا۔ کوئی اور فنکار یا گانا آزمائیں۔',
    nowPlaying: 'اب چل رہا ہے:',
    none: 'کچھ نہیں',
    trackProgress: 'گانے کی پیش رفت',
    previousSong: 'پچھلا گانا',
    playPause: 'چلائیں یا روکیں',
    nextSong: 'اگلا گانا',
    toggleRepeat: 'دہرائیں آن یا آف کریں',
    muteUnmute: 'آواز بند یا بحال کریں',
    volume: 'آواز کی سطح'
  }
};

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

function applyLanguage(language) {
  const selectedLanguage = translations[language] ? language : 'en';
  const copy = translations[selectedLanguage];
  root.lang = selectedLanguage;
  root.dir = ['ar', 'ur'].includes(selectedLanguage) ? 'rtl' : 'ltr';

  document.querySelectorAll('[data-i18n]').forEach((element) => {
    const key = element.dataset.i18n;
    if (copy[key]) element.textContent = copy[key];
  });
  document.querySelectorAll('[data-i18n-placeholder]').forEach((element) => {
    const key = element.dataset.i18nPlaceholder;
    if (copy[key]) element.setAttribute('placeholder', copy[key]);
  });
  document.querySelectorAll('[data-i18n-aria-label]').forEach((element) => {
    const key = element.dataset.i18nAriaLabel;
    if (copy[key]) element.setAttribute('aria-label', copy[key]);
  });
  languageOptions.forEach((option) => {
    option.setAttribute('aria-pressed', String(option.dataset.language === selectedLanguage));
  });

  if (searchInput && !searchInput.hasAttribute('data-i18n-placeholder')) {
    searchInput.placeholder = copy.searchSongs;
  }
  const artistPlaylistLabel = document.querySelector('#album-header p');
  if (artistPlaylistLabel) artistPlaylistLabel.textContent = copy.artistPlaylist;

  const playerLabel = document.getElementById('player');
  if (playerLabel) {
    const labelNode = Array.from(playerLabel.childNodes).find(
      (node) => node.nodeType === Node.TEXT_NODE && node.textContent.trim()
    );
    if (labelNode) labelNode.textContent = ` ${copy.nowPlaying} `;
    playerLabel.querySelector('#progress')?.setAttribute('aria-label', copy.trackProgress);
    playerLabel.querySelector('#volume')?.setAttribute('aria-label', copy.volume);
    const controlLabels = [
      ['.button-group .control-btn:first-child', copy.previousSong],
      ['#playBtn', copy.playPause],
      ['.button-group .control-btn:nth-child(3)', copy.nextSong],
      ['#loopBtn', copy.toggleRepeat],
      ['#muteBtn', copy.muteUnmute]
    ];
    controlLabels.forEach(([selector, label]) => {
      playerLabel.querySelector(selector)?.setAttribute('aria-label', label);
    });
  }
  const nowPlaying = document.getElementById('nowPlaying');
  if (nowPlaying && Object.values(translations).some((translation) => translation.none === nowPlaying.textContent)) {
    nowPlaying.textContent = copy.none;
  }
  localStorage.setItem('tunely-language', selectedLanguage);
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

function renderSongCatalog() {
  if (!catalogGrid || !Array.isArray(window.tunelySongCatalog)) return;

  const fragment = document.createDocumentFragment();
  window.tunelySongCatalog.forEach((album) => {
    const artistFolder = album.artist;
    album.tracks.forEach(([title, audioFile, imageFile]) => {
      const song = document.createElement('button');
      song.className = 'song-card';
      song.type = 'button';
      song.dataset.search = title;
      song.dataset.artist = album.artist;
      song.dataset.preview = `Audios/${artistFolder}/${audioFile}`;
      song.dataset.albumPage = album.page;
      song.setAttribute('aria-label', `${title} by ${album.artist}`);

      const image = document.createElement('img');
      image.src = `Audios/${artistFolder}/${imageFile}`;
      image.alt = '';
      image.loading = 'lazy';

      const copy = document.createElement('span');
      copy.className = 'song-card-copy';

      const songTitle = document.createElement('span');
      songTitle.className = 'song-card-title';
      songTitle.textContent = title;

      const artistName = document.createElement('span');
      artistName.className = 'song-card-artist';
      artistName.textContent = album.artist;

      copy.append(songTitle, artistName);
      song.append(image, copy);
      fragment.appendChild(song);
    });
  });

  catalogGrid.appendChild(fragment);
  songCards = Array.from(catalogGrid.querySelectorAll('.song-card'));
}

function shuffleCatalogItems() {
  if (!catalogGrid) return;
  const items = Array.from(catalogGrid.children);

  for (let index = items.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [items[index], items[randomIndex]] = [items[randomIndex], items[index]];
  }

  items.forEach((item) => catalogGrid.appendChild(item));
}

function playCatalogSong(song) {
  const audio = document.getElementById('audio');
  const nowPlaying = document.getElementById('nowPlaying');
  if (!audio || !song.dataset.preview) return;

  previewAudio.pause();
  currentPreview = null;
  audio.src = song.dataset.preview;
  audio.load();
  if (nowPlaying) nowPlaying.textContent = `${song.dataset.search} — ${song.dataset.artist}`;
  songCards.forEach((card) => card.classList.toggle('playing', card === song));
  audio.play().catch((error) => {
    console.error('Could not play the selected song.', error);
  });
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
    const displayValue = card.classList.contains('song-card')
      ? `${textValue} — ${card.dataset.artist}`
      : textValue;
    const label = highlightText(displayValue, query);
    return `<button type="button" class="suggestion" data-search="${escapeHtml(textValue)}">${label}</button>`;
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
      const searchableTitle = title.toLowerCase();
      const matched = query.split(/\s+/).every((term) => searchableTitle.includes(term));
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
  }

  if (songCards.length) {
    songCards.forEach((song) => {
      const title = song.dataset.search || '';
      const artist = song.dataset.artist || '';
      const searchableText = `${title} ${artist}`.toLowerCase();
      const matched = query.split(/\s+/).every((term) => searchableText.includes(term));
      song.classList.toggle('hidden', Boolean(query) && !matched);
      if (!query || matched) matches.push(song);
    });
  } else if (!cards.length && songItems.length) {
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
      return;
    }

    const song = songCards.find((item) => item.dataset.search === searchValue);
    if (song) playCatalogSong(song);
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

function initLanguageSettings() {
  const menu = document.getElementById('menu');
  if (menu && !settingsToggle) {
    const settings = document.createElement('div');
    settings.className = 'settings';

    const toggle = document.createElement('button');
    toggle.id = 'settingsToggle';
    toggle.className = 'settings-toggle';
    toggle.type = 'button';
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-controls', 'settingsMenu');
    toggle.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19.14 12.94c.04-.3.06-.61.06-.94s-.02-.64-.07-.94l2.03-1.58a.5.5 0 0 0 .12-.64l-1.92-3.32a.5.5 0 0 0-.61-.22l-2.39.96a7.28 7.28 0 0 0-1.63-.94l-.36-2.54A.49.49 0 0 0 13.88 2h-3.76a.49.49 0 0 0-.49.42L9.27 4.96c-.59.23-1.13.54-1.63.94l-2.39-.96a.5.5 0 0 0-.61.22L2.72 8.48a.5.5 0 0 0 .12.64l2.03 1.58c-.05.3-.07.62-.07.94s.02.64.07.94l-2.03 1.58a.5.5 0 0 0-.12.64l1.92 3.32c.12.2.36.29.61.22l2.39-.96c.5.4 1.04.71 1.63.94l.36 2.54c.04.24.24.42.49.42h3.76c.25 0 .45-.18.49-.42l.36-2.54c.59-.23 1.13-.54 1.63-.94l2.39.96c.23.09.49 0 .61-.22l1.92-3.32a.5.5 0 0 0-.12-.64l-2.03-1.58z"></path><circle cx="12" cy="12" r="3.5"></circle></svg><span data-i18n="settings"></span><span class="settings-chevron" aria-hidden="true">⌃</span>';

    const panel = document.createElement('section');
    panel.id = 'settingsMenu';
    panel.className = 'settings-menu';
    panel.setAttribute('aria-labelledby', 'settingsTitle');
    panel.hidden = true;
    panel.innerHTML = '<div class="settings-menu-heading"><span class="settings-kicker" data-i18n="preferences"></span><h2 id="settingsTitle" data-i18n="settings"></h2></div><p class="settings-label" data-i18n="language"></p><div class="language-options" role="group" data-i18n-aria-label="language"><button class="language-option" type="button" data-language="en" aria-pressed="false">English</button><button class="language-option" type="button" data-language="ar" aria-pressed="false">العربية</button><button class="language-option" type="button" data-language="bn" aria-pressed="false">বাংলা</button><button class="language-option" type="button" data-language="zh-CN" aria-pressed="false">中文（简体）</button><button class="language-option" type="button" data-language="fr" aria-pressed="false">Français</button><button class="language-option" type="button" data-language="el" aria-pressed="false">Ελληνικά</button><button class="language-option" type="button" data-language="hi" aria-pressed="false">हिन्दी</button><button class="language-option" type="button" data-language="pt-PT" aria-pressed="false">Português (Portugal)</button><button class="language-option" type="button" data-language="ru" aria-pressed="false">Русский</button><button class="language-option" type="button" data-language="es" aria-pressed="false">Español</button><button class="language-option" type="button" data-language="tr" aria-pressed="false">Türkçe</button><button class="language-option" type="button" data-language="ur" aria-pressed="false">اردو</button></div>';

    settings.append(toggle, panel);
    menu.appendChild(settings);
  }

  settingsToggle = document.getElementById('settingsToggle');
  settingsMenu = document.getElementById('settingsMenu');
  languageOptions = Array.from(document.querySelectorAll('.language-option'));
  if (!settingsToggle || !settingsMenu) return;

  applyLanguage(localStorage.getItem('tunely-language') || 'en');

  settingsToggle.addEventListener('click', () => {
    const isOpen = settingsToggle.getAttribute('aria-expanded') === 'true';
    settingsToggle.setAttribute('aria-expanded', String(!isOpen));
    settingsMenu.hidden = isOpen;
  });

  languageOptions.forEach((option) => {
    option.addEventListener('click', () => {
      applyLanguage(option.dataset.language);
      settingsToggle.setAttribute('aria-expanded', 'false');
      settingsMenu.hidden = true;
      settingsToggle.focus();
    });
  });

  document.addEventListener('click', (event) => {
    if (!settingsMenu.contains(event.target) && !settingsToggle.contains(event.target)) {
      settingsToggle.setAttribute('aria-expanded', 'false');
      settingsMenu.hidden = true;
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !settingsMenu.hidden) {
      settingsToggle.setAttribute('aria-expanded', 'false');
      settingsMenu.hidden = true;
      settingsToggle.focus();
    }
  });
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
  renderSongCatalog();
  shuffleCatalogItems();
  initLanguageSettings();
  attachHoverEffects();
  attachLinkTransitions();
  attachSuggestionActions();
  initControls();
  if (catalogGrid) {
    catalogGrid.addEventListener('click', (event) => {
      const song = event.target.closest('.song-card');
      if (song) playCatalogSong(song);
    });
  }
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

const PLAYER_STORAGE_KEY = 'tunely-player-state';

function saveSharedPlayerState() {
  const audio = document.getElementById('audio');
  if (!audio) return;

  const nowPlaying = document.getElementById('nowPlaying');
  const audioSource = audio.currentSrc || audio.src || '';

  try {
    localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify({
      audioSrc: audioSource,
      currentSong: -1,
      currentTime: Number.isFinite(audio.currentTime) ? audio.currentTime : 0,
      volume: audio.volume,
      muted: !!audio.muted,
      loop: !!audio.loop,
      isPlaying: !audio.paused,
      songName: nowPlaying ? nowPlaying.innerText : ''
    }));
  } catch (error) {
    console.warn('Could not save player state.', error);
  }
}

function restoreSharedPlayerState() {
  const audio = document.getElementById('audio');
  if (!audio) return;

  let state = null;

  try {
    state = JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY) || 'null');
  } catch (error) {
    console.warn('Could not restore player state.', error);
    return;
  }

  if (!state || !state.audioSrc) return;

  audio.src = state.audioSrc;
  audio.load();
  audio.volume = Number.isFinite(Number(state.volume))
    ? Math.max(0, Math.min(1, Number(state.volume)))
    : 1;
  audio.muted = !!state.muted;
  audio.loop = !!state.loop;

  const restorePosition = () => {
    audio.currentTime = Number(state.currentTime) || 0;
  };
  if (audio.readyState >= 1) {
    restorePosition();
  } else {
    audio.addEventListener('loadedmetadata', restorePosition, { once: true });
  }

  const nowPlaying = document.getElementById('nowPlaying');
  if (nowPlaying && state.songName) {
    nowPlaying.innerText = state.songName;
  }

  const playButton = document.getElementById('playBtn');
  if (playButton) playButton.disabled = false;
  const volumeControl = document.getElementById('volume');
  if (volumeControl) volumeControl.value = String(audio.volume);
  const muteButton = document.getElementById('muteBtn');
  if (muteButton) muteButton.textContent = audio.muted ? '🔇' : '🔊';
  const loopButton = document.getElementById('loopBtn');
  if (loopButton) loopButton.classList.toggle('active', audio.loop);

  if (state.isPlaying) {
    audio.play().catch((error) => {
      console.warn('Playback could not be resumed automatically.', error);
    });
  }
}

function initGlobalAudioPlayer() {
  const audio = document.getElementById('audio');
  if (!audio) return;

  const playButton = document.getElementById('playBtn');
  const progress = document.getElementById('progress');
  const time = document.getElementById('time');
  const volume = document.getElementById('volume');
  const muteButton = document.getElementById('muteBtn');
  const loopButton = document.getElementById('loopBtn');
  const nowPlaying = document.getElementById('nowPlaying');

  const updatePlayButton = () => {
    if (!playButton) return;
    playButton.disabled = !audio.src;
    playButton.classList.toggle('playing', !audio.paused);
    playButton.innerHTML = audio.paused
      ? '<svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>'
      : '<svg viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>';
  };

  const updateProgress = () => {
    if (!progress) return;
    const hasDuration = Number.isFinite(audio.duration) && audio.duration > 0;
    progress.disabled = !hasDuration;
    if (hasDuration) {
      progress.value = (audio.currentTime / audio.duration) * 100;
      const formatTime = (seconds) => `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, '0')}`;
      if (time) time.textContent = `${formatTime(audio.currentTime)} / ${formatTime(audio.duration)}`;
    }
  };

  audio.addEventListener('play', updatePlayButton);
  audio.addEventListener('pause', updatePlayButton);
  audio.addEventListener('loadedmetadata', updateProgress);
  audio.addEventListener('timeupdate', updateProgress);
  audio.addEventListener('durationchange', updateProgress);

  if (playButton && typeof window.togglePlay !== 'function') {
    playButton.addEventListener('click', () => {
      if (audio.paused) {
        audio.play().catch((error) => console.error('Could not play the selected track.', error));
      } else {
        audio.pause();
      }
    });
  }

  if (progress && typeof progress.oninput !== 'function') {
    progress.addEventListener('input', () => {
      if (Number.isFinite(audio.duration)) {
        audio.currentTime = (Number(progress.value) / 100) * audio.duration;
      }
    });
  }

  if (volume && typeof volume.oninput !== 'function') {
    volume.value = String(audio.volume);
    volume.addEventListener('input', () => {
      audio.volume = Number(volume.value);
    });
  }

  if (muteButton) {
    audio.addEventListener('volumechange', () => {
      muteButton.textContent = audio.muted ? '🔇' : '🔊';
    });
  }
  if (muteButton && typeof window.toggleMute !== 'function') {
    muteButton.addEventListener('click', () => {
      audio.muted = !audio.muted;
    });
  }

  if (loopButton) {
    loopButton.classList.toggle('active', audio.loop);
  }
  if (loopButton && typeof window.toggleLoop !== 'function') {
    loopButton.addEventListener('click', () => {
      audio.loop = !audio.loop;
      loopButton.classList.toggle('active', audio.loop);
    });
  }
}

function patchPlayerControls() {
  const audio = document.getElementById('audio');
  if (!audio || window.__tunelyPlayerPatched) return;

  const hookPlayerFunction = (name) => {
    const original = window[name];
    if (typeof original !== 'function') return;

    window[name] = function (...args) {
      const result = original.apply(this, args);
      saveSharedPlayerState();
      return result;
    };
  };

  ['playSong', 'togglePlay', 'nextSong', 'prevSong', 'toggleLoop', 'toggleMute'].forEach(hookPlayerFunction);

  audio.addEventListener('timeupdate', saveSharedPlayerState);
  audio.addEventListener('play', saveSharedPlayerState);
  audio.addEventListener('pause', saveSharedPlayerState);
  audio.addEventListener('volumechange', saveSharedPlayerState);
  audio.addEventListener('ended', saveSharedPlayerState);

  window.__tunelyPlayerPatched = true;
}

window.addEventListener('load', () => {
  patchPlayerControls();
  initGlobalAudioPlayer();
  restoreSharedPlayerState();
});

window.addEventListener('beforeunload', saveSharedPlayerState);

init();
