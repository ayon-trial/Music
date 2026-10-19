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
const filterChips = Array.from(document.querySelectorAll('[data-content-filter]'));
const previewAudio = new Audio();
let selectedVisibleIndex = 0;
let activeContentFilter = 'all';
let currentPreview = null;
let previewTimer;
let hasInteracted = false;
let playlistLibrarySongs = [];

const translations = {
  en: {
    library: 'Library',
    discover: 'Home',
    favorites: 'Favorites',
    favoritesSubtitle: 'Your personal collection of songs you love.',
    likedSongs: 'Your liked songs',
    favoritesDescription: 'All the tracks you keep close, together in one place.',
    favoritesEmpty: 'Songs you love will appear here.',
    favoritesEmptyDescription: 'Start with a song that feels like you.',
    exploreMusic: 'Explore music',
    playAll: 'Play all',
    shuffle: 'Shuffle',
    sortBy: 'Sort by',
    recentlyAdded: 'Recently added',
    sortTitle: 'Title',
    sortFavorites: 'Sort favorites',
    playlistLibrary: 'Playlist Library',
    playlistsHeading: 'Your playlists',
    playlistsEmpty: 'No playlists yet. Use a song menu to create one and add songs.',
    playlistEmpty: 'This playlist has no songs yet.',
    playlistTrack: 'track',
    playlistTracks: 'tracks',
    settings: 'Settings',
    language: 'Language',
    theme: 'Theme',
    filterAll: 'All',
    filterMusic: 'Music',
    filterArtists: 'Artists',
    back: 'Back',
    lightTheme: 'Light',
    darkTheme: 'Dark',
    burgundyTheme: 'Burgundy',
    pinkTheme: 'Pink',
    purpleTheme: 'Purple',
    glacierTheme: 'Glacier',
    moreSongOptions: 'More song options',
    addToPlaylist: 'Add to playlist',
    addToFavorites: 'Add to favorites',
    createPlaylist: 'Create playlist',
    playlistNamePrompt: 'Enter a playlist name:',
    playlistAdded: 'Added to playlist',
    playlistAlreadyContainsSong: 'This song is already in the playlist.',
    favoriteAdded: 'Added to favorites',
    alreadyFavorite: 'This song is already in favorites.',
    playlistSaveFailed: 'Could not save the playlist.',
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
    discover: 'الرئيسية',
    favorites: 'المفضلة',
    likedSongs: 'الأغاني التي أعجبتك',
    favoritesSubtitle: 'مجموعتك الشخصية من الأغاني التي تحبها.',
    favoritesDescription: 'كل الأغاني التي تحبها، مجتمعة في مكان واحد.',
    favoritesEmpty: 'ستظهر هنا الأغاني التي تحبها.',
    favoritesEmptyDescription: 'ابدأ بأغنية تعبّر عنك.',
    exploreMusic: 'اكتشف الموسيقى',
    playAll: 'تشغيل الكل',
    shuffle: 'تشغيل عشوائي',
    sortBy: 'ترتيب حسب',
    recentlyAdded: 'أُضيفت مؤخرًا',
    sortTitle: 'العنوان',
    sortFavorites: 'ترتيب المفضلة',
    playlistLibrary: 'مكتبة قوائم التشغيل',
    playlistsHeading: 'قوائم التشغيل الخاصة بك',
    playlistsEmpty: 'لا توجد قوائم تشغيل بعد. استخدم قائمة الأغنية لإنشاء قائمة وإضافة الأغاني.',
    playlistEmpty: 'قائمة التشغيل هذه لا تحتوي على أغانٍ بعد.',
    playlistTrack: 'مقطع',
    playlistTracks: 'مقاطع',
    settings: 'الإعدادات',
    language: 'اللغة',
    theme: 'المظهر',
    filterAll: 'الكل',
    filterMusic: 'موسيقى',
    filterArtists: 'الفنانون',
    back: 'رجوع',
    lightTheme: 'فاتح',
    darkTheme: 'داكن',
    burgundyTheme: 'عنابي',
    pinkTheme: 'وردي',
    purpleTheme: 'أرجواني',
    glacierTheme: 'جليدي',
    moreSongOptions: 'المزيد من خيارات الأغنية',
    addToPlaylist: 'أضف إلى قائمة التشغيل',
    addToFavorites: 'أضف إلى المفضلة',
    createPlaylist: 'إنشاء قائمة تشغيل',
    playlistNamePrompt: 'أدخل اسم قائمة التشغيل:',
    playlistAdded: 'أُضيفت إلى قائمة التشغيل',
    playlistAlreadyContainsSong: 'هذه الأغنية موجودة بالفعل في قائمة التشغيل.',
    favoriteAdded: 'أُضيفت إلى المفضلة',
    alreadyFavorite: 'هذه الأغنية موجودة بالفعل في المفضلة.',
    playlistSaveFailed: 'تعذّر حفظ قائمة التشغيل.',
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
    discover: 'হোম',
    favorites: 'পছন্দের',
    likedSongs: 'আপনার পছন্দের গান',
    favoritesSubtitle: 'আপনার প্রিয় গানগুলোর ব্যক্তিগত সংগ্রহ।',
    favoritesDescription: 'আপনার পছন্দের সব গান এক জায়গায়।',
    favoritesEmpty: 'আপনার প্রিয় গানগুলো এখানে দেখা যাবে।',
    favoritesEmptyDescription: 'আপনার মনের মতো একটি গান দিয়ে শুরু করুন।',
    exploreMusic: 'গান খুঁজুন',
    playAll: 'সব চালান',
    shuffle: 'এলোমেলো চালান',
    sortBy: 'সাজান',
    recentlyAdded: 'সম্প্রতি যোগ করা',
    sortTitle: 'শিরোনাম',
    sortFavorites: 'পছন্দের গান সাজান',
    playlistLibrary: 'প্লেলিস্ট লাইব্রেরি',
    playlistsHeading: 'আপনার প্লেলিস্ট',
    playlistsEmpty: 'এখনও কোনো প্লেলিস্ট নেই। গানের মেনু থেকে প্লেলিস্ট তৈরি করে গান যোগ করুন।',
    playlistEmpty: 'এই প্লেলিস্টে এখনও কোনো গান নেই।',
    playlistTrack: 'টি গান',
    playlistTracks: 'টি গান',
    settings: 'সেটিংস',
    language: 'ভাষা',
    theme: 'থিম',
    filterAll: 'সব',
    filterMusic: 'সঙ্গীত',
    filterArtists: 'শিল্পীরা',
    back: 'ফিরে যান',
    lightTheme: 'হালকা',
    darkTheme: 'গাঢ়',
    burgundyTheme: 'বারগান্ডি',
    pinkTheme: 'গোলাপি',
    purpleTheme: 'বেগুনি',
    glacierTheme: 'হিমবাহ',
    moreSongOptions: 'গানের আরও বিকল্প',
    addToPlaylist: 'প্লেলিস্টে যোগ করুন',
    addToFavorites: 'পছন্দের তালিকায় যোগ করুন',
    createPlaylist: 'প্লেলিস্ট তৈরি করুন',
    playlistNamePrompt: 'প্লেলিস্টের নাম লিখুন:',
    playlistAdded: 'প্লেলিস্টে যোগ করা হয়েছে',
    playlistAlreadyContainsSong: 'গানটি ইতিমধ্যেই এই প্লেলিস্টে আছে।',
    favoriteAdded: 'পছন্দের তালিকায় যোগ করা হয়েছে',
    alreadyFavorite: 'গানটি ইতিমধ্যেই পছন্দের তালিকায় আছে।',
    playlistSaveFailed: 'প্লেলিস্ট সংরক্ষণ করা যায়নি।',
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
    discover: 'Αρχική',
    favorites: 'Αγαπημένα',
    likedSongs: 'Τραγούδια που σας αρέσουν',
    favoritesSubtitle: 'Η προσωπική σας συλλογή με τα τραγούδια που αγαπάτε.',
    favoritesDescription: 'Όλα τα κομμάτια που αγαπάτε, σε ένα μέρος.',
    favoritesEmpty: 'Τα τραγούδια που αγαπάτε θα εμφανίζονται εδώ.',
    favoritesEmptyDescription: 'Ξεκινήστε με ένα τραγούδι που σας εκφράζει.',
    exploreMusic: 'Εξερευνήστε τη μουσική',
    playAll: 'Αναπαραγωγή όλων',
    shuffle: 'Τυχαία αναπαραγωγή',
    sortBy: 'Ταξινόμηση κατά',
    recentlyAdded: 'Προστέθηκαν πρόσφατα',
    sortTitle: 'Τίτλος',
    sortFavorites: 'Ταξινόμηση αγαπημένων',
    playlistLibrary: 'Βιβλιοθήκη λιστών αναπαραγωγής',
    playlistsHeading: 'Οι λίστες αναπαραγωγής σας',
    playlistsEmpty: 'Δεν υπάρχουν λίστες αναπαραγωγής ακόμα. Χρησιμοποιήστε το μενού ενός τραγουδιού για να δημιουργήσετε λίστα και να προσθέσετε τραγούδια.',
    playlistEmpty: 'Αυτή η λίστα αναπαραγωγής δεν έχει τραγούδια ακόμα.',
    playlistTrack: 'κομμάτι',
    playlistTracks: 'κομμάτια',
    settings: 'Ρυθμίσεις',
    language: 'Γλώσσα',
    theme: 'Θέμα',
    filterAll: 'Όλα',
    filterMusic: 'Μουσική',
    filterArtists: 'Καλλιτέχνες',
    back: 'Πίσω',
    lightTheme: 'Ανοιχτό',
    darkTheme: 'Σκούρο',
    burgundyTheme: 'Μπορντό',
    pinkTheme: 'Ροζ',
    purpleTheme: 'Μωβ',
    glacierTheme: 'Παγετώνας',
    moreSongOptions: 'Περισσότερες επιλογές τραγουδιού',
    addToPlaylist: 'Προσθήκη στη λίστα αναπαραγωγής',
    addToFavorites: 'Προσθήκη στα αγαπημένα',
    createPlaylist: 'Δημιουργία λίστας αναπαραγωγής',
    playlistNamePrompt: 'Εισαγάγετε όνομα λίστας αναπαραγωγής:',
    playlistAdded: 'Προστέθηκε στη λίστα αναπαραγωγής',
    playlistAlreadyContainsSong: 'Αυτό το τραγούδι βρίσκεται ήδη στη λίστα αναπαραγωγής.',
    favoriteAdded: 'Προστέθηκε στα αγαπημένα',
    alreadyFavorite: 'Αυτό το τραγούδι βρίσκεται ήδη στα αγαπημένα.',
    playlistSaveFailed: 'Δεν ήταν δυνατή η αποθήκευση της λίστας αναπαραγωγής.',
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
    discover: 'होम',
    favorites: 'पसंदीदा',
    likedSongs: 'आपके पसंदीदा गाने',
    favoritesSubtitle: 'आपके पसंदीदा गानों का निजी संग्रह।',
    favoritesDescription: 'आपके सभी पसंदीदा गाने, एक ही जगह।',
    favoritesEmpty: 'आपके पसंदीदा गाने यहाँ दिखाई देंगे।',
    favoritesEmptyDescription: 'अपने मन का एक गाना चुनकर शुरुआत करें।',
    exploreMusic: 'संगीत खोजें',
    playAll: 'सभी चलाएँ',
    shuffle: 'शफ़ल',
    sortBy: 'क्रमबद्ध करें',
    recentlyAdded: 'हाल ही में जोड़े गए',
    sortTitle: 'शीर्षक',
    sortFavorites: 'पसंदीदा क्रमबद्ध करें',
    playlistLibrary: 'प्लेलिस्ट लाइब्रेरी',
    playlistsHeading: 'आपकी प्लेलिस्ट',
    playlistsEmpty: 'अभी कोई प्लेलिस्ट नहीं है। गानों के मेन्यू से प्लेलिस्ट बनाएँ और गाने जोड़ें।',
    playlistEmpty: 'इस प्लेलिस्ट में अभी कोई गाना नहीं है।',
    playlistTrack: 'गाना',
    playlistTracks: 'गाने',
    settings: 'सेटिंग',
    language: 'भाषा',
    theme: 'थीम',
    filterAll: 'सभी',
    filterMusic: 'संगीत',
    filterArtists: 'कलाकार',
    back: 'वापस',
    lightTheme: 'हल्का',
    darkTheme: 'गहरा',
    burgundyTheme: 'बरगंडी',
    pinkTheme: 'गुलाबी',
    purpleTheme: 'बैंगनी',
    glacierTheme: 'हिमनद',
    moreSongOptions: 'गाने के अन्य विकल्प',
    addToPlaylist: 'प्लेलिस्ट में जोड़ें',
    addToFavorites: 'पसंदीदा में जोड़ें',
    createPlaylist: 'प्लेलिस्ट बनाएँ',
    playlistNamePrompt: 'प्लेलिस्ट का नाम दर्ज करें:',
    playlistAdded: 'प्लेलिस्ट में जोड़ा गया',
    playlistAlreadyContainsSong: 'यह गाना पहले से प्लेलिस्ट में है।',
    favoriteAdded: 'पसंदीदा में जोड़ा गया',
    alreadyFavorite: 'यह गाना पहले से पसंदीदा में है।',
    playlistSaveFailed: 'प्लेलिस्ट सहेजी नहीं जा सकी।',
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
    discover: 'Início',
    favorites: 'Favoritos',
    likedSongs: 'Músicas de que gostas',
    favoritesSubtitle: 'A tua coleção pessoal de músicas favoritas.',
    favoritesDescription: 'Todas as músicas de que gostas, num só lugar.',
    favoritesEmpty: 'As músicas de que gostas vão aparecer aqui.',
    favoritesEmptyDescription: 'Começa com uma música que tenha a tua cara.',
    exploreMusic: 'Explorar música',
    playAll: 'Reproduzir tudo',
    shuffle: 'Aleatório',
    sortBy: 'Ordenar por',
    recentlyAdded: 'Adicionadas recentemente',
    sortTitle: 'Título',
    sortFavorites: 'Ordenar favoritos',
    playlistLibrary: 'Biblioteca de listas de reprodução',
    playlistsHeading: 'As tuas listas de reprodução',
    playlistsEmpty: 'Ainda não há listas de reprodução. Usa o menu de uma música para criar uma lista e adicionar músicas.',
    playlistEmpty: 'Esta lista de reprodução ainda não tem músicas.',
    playlistTrack: 'faixa',
    playlistTracks: 'faixas',
    settings: 'Definições',
    language: 'Idioma',
    theme: 'Tema',
    filterAll: 'Tudo',
    filterMusic: 'Música',
    filterArtists: 'Artistas',
    back: 'Voltar',
    lightTheme: 'Claro',
    darkTheme: 'Escuro',
    burgundyTheme: 'Bordô',
    pinkTheme: 'Rosa',
    purpleTheme: 'Roxo',
    glacierTheme: 'Glacial',
    moreSongOptions: 'Mais opções da música',
    addToPlaylist: 'Adicionar à lista de reprodução',
    addToFavorites: 'Adicionar aos favoritos',
    createPlaylist: 'Criar lista de reprodução',
    playlistNamePrompt: 'Introduz o nome da lista de reprodução:',
    playlistAdded: 'Adicionada à lista de reprodução',
    playlistAlreadyContainsSong: 'Esta música já está na lista de reprodução.',
    favoriteAdded: 'Adicionada aos favoritos',
    alreadyFavorite: 'Esta música já está nos favoritos.',
    playlistSaveFailed: 'Não foi possível guardar a lista de reprodução.',
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
    discover: 'Главная',
    favorites: 'Избранное',
    likedSongs: 'Понравившиеся песни',
    favoritesSubtitle: 'Ваша личная коллекция любимых песен.',
    favoritesDescription: 'Все песни, которые вам дороги, в одном месте.',
    favoritesEmpty: 'Любимые песни будут отображаться здесь.',
    favoritesEmptyDescription: 'Начните с песни, которая вам близка.',
    exploreMusic: 'Открыть музыку',
    playAll: 'Воспроизвести всё',
    shuffle: 'Перемешать',
    sortBy: 'Сортировка',
    recentlyAdded: 'Недавно добавленные',
    sortTitle: 'Название',
    sortFavorites: 'Сортировать избранное',
    playlistLibrary: 'Библиотека плейлистов',
    playlistsHeading: 'Ваши плейлисты',
    playlistsEmpty: 'Плейлистов пока нет. Создайте плейлист и добавьте песни через меню песни.',
    playlistEmpty: 'В этом плейлисте пока нет песен.',
    playlistTrack: 'трек',
    playlistTracks: 'треков',
    settings: 'Настройки',
    language: 'Язык',
    theme: 'Тема',
    filterAll: 'Все',
    filterMusic: 'Музыка',
    filterArtists: 'Исполнители',
    back: 'Назад',
    lightTheme: 'Светлая',
    darkTheme: 'Тёмная',
    burgundyTheme: 'Бордовая',
    pinkTheme: 'Розовая',
    purpleTheme: 'Фиолетовая',
    glacierTheme: 'Ледниковая',
    moreSongOptions: 'Другие действия с песней',
    addToPlaylist: 'Добавить в плейлист',
    addToFavorites: 'Добавить в избранное',
    createPlaylist: 'Создать плейлист',
    playlistNamePrompt: 'Введите название плейлиста:',
    playlistAdded: 'Добавлено в плейлист',
    playlistAlreadyContainsSong: 'Эта песня уже есть в плейлисте.',
    favoriteAdded: 'Добавлено в избранное',
    alreadyFavorite: 'Эта песня уже есть в избранном.',
    playlistSaveFailed: 'Не удалось сохранить плейлист.',
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
    discover: 'Accueil',
    favorites: 'Favoris',
    likedSongs: 'Morceaux que vous aimez',
    favoritesSubtitle: 'Votre collection personnelle de morceaux préférés.',
    favoritesDescription: 'Tous les morceaux que vous aimez, réunis au même endroit.',
    favoritesEmpty: 'Les morceaux que vous aimez apparaîtront ici.',
    favoritesEmptyDescription: 'Commencez par un morceau qui vous ressemble.',
    exploreMusic: 'Explorer la musique',
    playAll: 'Tout lire',
    shuffle: 'Lecture aléatoire',
    sortBy: 'Trier par',
    recentlyAdded: 'Ajoutés récemment',
    sortTitle: 'Titre',
    sortFavorites: 'Trier les favoris',
    playlistLibrary: 'Bibliothèque de playlists',
    playlistsHeading: 'Vos playlists',
    playlistsEmpty: 'Aucune playlist pour le moment. Utilisez le menu d’un morceau pour créer une playlist et y ajouter des morceaux.',
    playlistEmpty: 'Cette playlist ne contient encore aucun morceau.',
    playlistTrack: 'titre',
    playlistTracks: 'titres',
    settings: 'Paramètres',
    language: 'Langue',
    theme: 'Thème',
    filterAll: 'Tout',
    filterMusic: 'Musique',
    filterArtists: 'Artistes',
    back: 'Retour',
    lightTheme: 'Clair',
    darkTheme: 'Sombre',
    burgundyTheme: 'Bordeaux',
    pinkTheme: 'Rose',
    purpleTheme: 'Violet',
    glacierTheme: 'Glacier',
    moreSongOptions: 'Plus d’options pour ce morceau',
    addToPlaylist: 'Ajouter à une playlist',
    addToFavorites: 'Ajouter aux favoris',
    createPlaylist: 'Créer une playlist',
    playlistNamePrompt: 'Saisissez le nom de la playlist :',
    playlistAdded: 'Ajouté à la playlist',
    playlistAlreadyContainsSong: 'Ce morceau figure déjà dans la playlist.',
    favoriteAdded: 'Ajouté aux favoris',
    alreadyFavorite: 'Ce morceau figure déjà dans les favoris.',
    playlistSaveFailed: 'Impossible d’enregistrer la playlist.',
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
    discover: 'Inicio',
    favorites: 'Favoritos',
    likedSongs: 'Tus canciones favoritas',
    favoritesSubtitle: 'Tu colección personal de canciones favoritas.',
    favoritesDescription: 'Todas las canciones que te gustan, en un solo lugar.',
    favoritesEmpty: 'Las canciones que te gustan aparecerán aquí.',
    favoritesEmptyDescription: 'Empieza con una canción que vaya contigo.',
    exploreMusic: 'Explorar música',
    playAll: 'Reproducir todo',
    shuffle: 'Aleatorio',
    sortBy: 'Ordenar por',
    recentlyAdded: 'Añadidas recientemente',
    sortTitle: 'Título',
    sortFavorites: 'Ordenar favoritos',
    playlistLibrary: 'Biblioteca de listas',
    playlistsHeading: 'Tus listas de reproducción',
    playlistsEmpty: 'Todavía no hay listas. Usa el menú de una canción para crear una lista y añadir canciones.',
    playlistEmpty: 'Esta lista todavía no tiene canciones.',
    playlistTrack: 'canción',
    playlistTracks: 'canciones',
    settings: 'Ajustes',
    language: 'Idioma',
    theme: 'Tema',
    filterAll: 'Todo',
    filterMusic: 'Música',
    filterArtists: 'Artistas',
    back: 'Atrás',
    lightTheme: 'Claro',
    darkTheme: 'Oscuro',
    burgundyTheme: 'Burdeos',
    pinkTheme: 'Rosa',
    purpleTheme: 'Morado',
    glacierTheme: 'Glaciar',
    moreSongOptions: 'Más opciones de la canción',
    addToPlaylist: 'Añadir a la lista',
    addToFavorites: 'Añadir a favoritos',
    createPlaylist: 'Crear lista de reproducción',
    playlistNamePrompt: 'Escribe el nombre de la lista de reproducción:',
    playlistAdded: 'Añadida a la lista de reproducción',
    playlistAlreadyContainsSong: 'Esta canción ya está en la lista de reproducción.',
    favoriteAdded: 'Añadida a favoritos',
    alreadyFavorite: 'Esta canción ya está en favoritos.',
    playlistSaveFailed: 'No se pudo guardar la lista de reproducción.',
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
    discover: '首页',
    favorites: '收藏',
    likedSongs: '喜欢的歌曲',
    favoritesSubtitle: '你喜爱的歌曲专属收藏。',
    favoritesDescription: '把你喜欢的歌曲都收录在这里。',
    favoritesEmpty: '你喜欢的歌曲会显示在这里。',
    favoritesEmptyDescription: '从一首与你心意相通的歌开始。',
    exploreMusic: '探索音乐',
    playAll: '全部播放',
    shuffle: '随机播放',
    sortBy: '排序方式',
    recentlyAdded: '最近添加',
    sortTitle: '标题',
    sortFavorites: '排序收藏',
    playlistLibrary: '播放列表库',
    playlistsHeading: '你的播放列表',
    playlistsEmpty: '还没有播放列表。使用歌曲菜单创建播放列表并添加歌曲。',
    playlistEmpty: '此播放列表中还没有歌曲。',
    playlistTrack: '首歌曲',
    playlistTracks: '首歌曲',
    settings: '设置',
    language: '语言',
    theme: '主题',
    filterAll: '全部',
    filterMusic: '音乐',
    filterArtists: '艺人',
    back: '返回',
    lightTheme: '浅色',
    darkTheme: '深色',
    burgundyTheme: '酒红色',
    pinkTheme: '粉色',
    purpleTheme: '紫色',
    glacierTheme: '冰川',
    moreSongOptions: '更多歌曲选项',
    addToPlaylist: '添加到播放列表',
    addToFavorites: '添加到收藏',
    createPlaylist: '创建播放列表',
    playlistNamePrompt: '输入播放列表名称：',
    playlistAdded: '已添加到播放列表',
    playlistAlreadyContainsSong: '此歌曲已在播放列表中。',
    favoriteAdded: '已添加到收藏',
    alreadyFavorite: '此歌曲已在收藏中。',
    playlistSaveFailed: '无法保存播放列表。',
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
    discover: 'Ana Sayfa',
    favorites: 'Favoriler',
    likedSongs: 'Beğendiğin şarkılar',
    favoritesSubtitle: 'Sevdiğin şarkılardan oluşan kişisel koleksiyonun.',
    favoritesDescription: 'Sevdiğin tüm şarkılar tek bir yerde.',
    favoritesEmpty: 'Sevdiğin şarkılar burada görünecek.',
    favoritesEmptyDescription: 'Sana hitap eden bir şarkıyla başla.',
    exploreMusic: 'Müziği keşfet',
    playAll: 'Tümünü çal',
    shuffle: 'Karıştır',
    sortBy: 'Sıralama',
    recentlyAdded: 'Son eklenenler',
    sortTitle: 'Başlık',
    sortFavorites: 'Favorileri sırala',
    playlistLibrary: 'Çalma Listesi Kitaplığı',
    playlistsHeading: 'Çalma listelerin',
    playlistsEmpty: 'Henüz çalma listesi yok. Şarkı menüsünden bir liste oluşturup şarkı ekle.',
    playlistEmpty: 'Bu çalma listesinde henüz şarkı yok.',
    playlistTrack: 'parça',
    playlistTracks: 'parça',
    settings: 'Ayarlar',
    language: 'Dil',
    theme: 'Tema',
    filterAll: 'Tümü',
    filterMusic: 'Müzik',
    filterArtists: 'Sanatçılar',
    back: 'Geri',
    lightTheme: 'Açık',
    darkTheme: 'Koyu',
    burgundyTheme: 'Bordo',
    pinkTheme: 'Pembe',
    purpleTheme: 'Mor',
    glacierTheme: 'Buzul',
    moreSongOptions: 'Daha fazla şarkı seçeneği',
    addToPlaylist: 'Çalma listesine ekle',
    addToFavorites: 'Favorilere ekle',
    createPlaylist: 'Çalma listesi oluştur',
    playlistNamePrompt: 'Çalma listesi adını girin:',
    playlistAdded: 'Çalma listesine eklendi',
    playlistAlreadyContainsSong: 'Bu şarkı zaten çalma listesinde.',
    favoriteAdded: 'Favorilere eklendi',
    alreadyFavorite: 'Bu şarkı zaten favorilerde.',
    playlistSaveFailed: 'Çalma listesi kaydedilemedi.',
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
    discover: 'ہوم',
    favorites: 'پسندیدہ',
    likedSongs: 'آپ کے پسندیدہ گانے',
    favoritesSubtitle: 'آپ کے پسندیدہ گانوں کا ذاتی مجموعہ۔',
    favoritesDescription: 'آپ کے پسندیدہ تمام گانے ایک ہی جگہ۔',
    favoritesEmpty: 'آپ کے پسندیدہ گانے یہاں نظر آئیں گے۔',
    favoritesEmptyDescription: 'اپنے مزاج کے کسی گانے سے آغاز کریں۔',
    exploreMusic: 'موسیقی دریافت کریں',
    playAll: 'سب چلائیں',
    shuffle: 'بے ترتیب چلائیں',
    sortBy: 'ترتیب دیں',
    recentlyAdded: 'حال ہی میں شامل',
    sortTitle: 'عنوان',
    sortFavorites: 'پسندیدہ ترتیب دیں',
    playlistLibrary: 'پلے لسٹ لائبریری',
    playlistsHeading: 'آپ کی پلے لسٹس',
    playlistsEmpty: 'ابھی کوئی پلے لسٹ نہیں۔ گانے کے مینو سے پلے لسٹ بنائیں اور گانے شامل کریں۔',
    playlistEmpty: 'اس پلے لسٹ میں ابھی کوئی گانا نہیں۔',
    playlistTrack: 'گانا',
    playlistTracks: 'گانے',
    settings: 'ترتیبات',
    language: 'زبان',
    theme: 'تھیم',
    filterAll: 'سب',
    filterMusic: 'موسیقی',
    filterArtists: 'فنکار',
    back: 'واپس',
    lightTheme: 'ہلکا',
    darkTheme: 'گہرا',
    burgundyTheme: 'عنابی',
    pinkTheme: 'گلابی',
    purpleTheme: 'جامنی',
    glacierTheme: 'گلیشیئر',
    moreSongOptions: 'گانے کے مزید اختیارات',
    addToPlaylist: 'پلے لسٹ میں شامل کریں',
    addToFavorites: 'پسندیدہ میں شامل کریں',
    createPlaylist: 'پلے لسٹ بنائیں',
    playlistNamePrompt: 'پلے لسٹ کا نام درج کریں:',
    playlistAdded: 'پلے لسٹ میں شامل کر دیا گیا',
    playlistAlreadyContainsSong: 'یہ گانا پہلے ہی پلے لسٹ میں ہے۔',
    favoriteAdded: 'پسندیدہ میں شامل کر دیا گیا',
    alreadyFavorite: 'یہ گانا پہلے ہی پسندیدہ میں ہے۔',
    playlistSaveFailed: 'پلے لسٹ محفوظ نہیں ہو سکی۔',
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

const FAVORITES_STORAGE_KEY = 'tunely-favorites';

function getFavoriteSongs() {
  try {
    const stored = JSON.parse(localStorage.getItem(FAVORITES_STORAGE_KEY) || '[]');
    return Array.isArray(stored) ? stored : [];
  } catch (error) {
    return [];
  }
}

function saveFavoriteSongs(songs) {
  localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(songs));
}

function getCurrentSongFromPlayer() {
  const nowPlaying = document.getElementById('nowPlaying');
  if (!nowPlaying) return null;

  const text = (nowPlaying.textContent || '').trim();
  if (!text || text === 'None') return null;

  const match = text.match(/^(.*?)(?:\s+[—-]\s+|\s+-\s+)(.*)$/);
  if (!match) {
    return { title: text, artist: 'Unknown Artist' };
  }

  return {
    title: match[1].trim(),
    artist: match[2].trim()
  };
}

function findCatalogTrackByAudio(source) {
  if (!source || !Array.isArray(window.tunelySongCatalog)) return null;

  let normalizedSource = source;
  try {
    normalizedSource = decodeURIComponent(source);
  } catch (error) {
    console.warn('Could not decode the current audio URL while matching its catalog entry.', error);
  }
  normalizedSource = normalizedSource.replace(/\\/g, '/').toLowerCase();

  for (const album of window.tunelySongCatalog) {
    for (const [title, audioFile, imageFile] of album.tracks) {
      const relativeAudioPath = `Audios/${album.artist}/${audioFile}`.toLowerCase();
      if (normalizedSource.endsWith(relativeAudioPath)) {
        return { album, title, imageFile };
      }
    }
  }

  return null;
}

function updatePlayerArtwork(source) {
  const artworkLink = document.getElementById('playerArtworkLink');
  const artwork = document.getElementById('playerArtwork');
  if (!artworkLink || !artwork) return;

  const track = findCatalogTrackByAudio(source);
  if (!track) {
    artworkLink.hidden = true;
    artwork.removeAttribute('src');
    artworkLink.removeAttribute('href');
    artworkLink.removeAttribute('aria-label');
    return;
  }

  artwork.src = `Audios/${track.album.artist}/${track.imageFile}`;
  artworkLink.href = track.album.page;
  artworkLink.setAttribute('aria-label', `Open ${track.album.artist} album`);
  artworkLink.hidden = false;
}

function buildFavoriteSongFromCurrentPlayer() {
  const audio = document.getElementById('audio');
  const audioSource = audio ? (audio.currentSrc || audio.src || '') : '';
  const catalog = Array.isArray(window.tunelySongCatalog) ? window.tunelySongCatalog : [];
  const catalogTrack = findCatalogTrackByAudio(audioSource);
  if (catalogTrack) {
    const { album, title, imageFile } = catalogTrack;
    return {
      title,
      artist: album.artist,
      preview: audioSource,
      image: `Audios/${album.artist}/${imageFile}`,
      page: album.page
    };
  }

  const song = getCurrentSongFromPlayer();
  if (!song) return null;

  const artistName = document.querySelector('#album-header h1')?.textContent.trim() || song.artist;
  const album = catalog.find((entry) => entry.artist.toLowerCase() === artistName.toLowerCase());
  const track = album?.tracks.find(([title]) => title.toLowerCase() === song.title.toLowerCase());
  return {
    title: song.title,
    artist: artistName,
    preview: audioSource,
    image: track ? `Audios/${artistName}/${track[2]}` : '',
    page: window.location.pathname.split('/').pop() || 'index.html'
  };
}

function isSongFavorite(song) {
  if (!song) return false;

  return getFavoriteSongs().some((favorite) => {
    return String(favorite.title || '').toLowerCase() === String(song.title || '').toLowerCase()
      && String(favorite.artist || '').toLowerCase() === String(song.artist || '').toLowerCase();
  });
}

function toggleFavoriteSong(song, options = {}) {
  if (!song) return false;

  const { redirect = false, liked } = options;
  const songs = getFavoriteSongs();
  const existingIndex = songs.findIndex((favorite) => {
    return String(favorite.title || '').toLowerCase() === String(song.title || '').toLowerCase()
      && String(favorite.artist || '').toLowerCase() === String(song.artist || '').toLowerCase();
  });
  const shouldLike = typeof liked === 'boolean' ? liked : existingIndex === -1;

  if (shouldLike) {
    if (existingIndex === -1) {
      songs.push({ ...song, addedAt: Date.now() });
    }
    saveFavoriteSongs(songs);
    if (redirect) {
      window.setTimeout(() => {
        window.location.href = 'Favorites.html';
      }, 180);
    }
    return true;
  }

  if (existingIndex !== -1) {
    songs.splice(existingIndex, 1);
    saveFavoriteSongs(songs);
  }
  return false;
}

function syncLikeButtonState() {
  const likeBtn = document.getElementById('likeBtn');
  if (!likeBtn) return;

  const song = buildFavoriteSongFromCurrentPlayer();
  const isLiked = isSongFavorite(song);
  likeBtn.classList.toggle('liked', isLiked);
  likeBtn.setAttribute('aria-pressed', String(isLiked));
  likeBtn.textContent = isLiked ? '♥' : '♡';
  likeBtn.title = isLiked ? 'Unlike song' : 'Like song';
}

const PLAYLIST_STORAGE_KEY = 'tunely-playlists';

function getStoredPlaylists() {
  try {
    const playlists = JSON.parse(localStorage.getItem(PLAYLIST_STORAGE_KEY) || '[]');
    return Array.isArray(playlists)
      ? playlists.filter((playlist) => typeof playlist?.name === 'string' && playlist.name.trim())
      : [];
  } catch (error) {
    console.warn('Could not read saved playlists.', error);
    return [];
  }
}

function saveStoredPlaylists(playlists) {
  try {
    localStorage.setItem(PLAYLIST_STORAGE_KEY, JSON.stringify(playlists));
    return true;
  } catch (error) {
    console.error('Could not save playlists.', error);
    showSongActionFeedback(getCurrentTranslations().playlistSaveFailed);
    return false;
  }
}

function getCurrentTranslations() {
  return translations[localStorage.getItem('tunely-language') || 'en'] || translations.en;
}

function showSongActionFeedback(message) {
  let feedback = document.getElementById('songActionFeedback');
  if (!feedback) {
    feedback = document.createElement('div');
    feedback.id = 'songActionFeedback';
    feedback.className = 'song-action-feedback';
    feedback.setAttribute('role', 'status');
    feedback.setAttribute('aria-live', 'polite');
    document.body.appendChild(feedback);
  }

  feedback.textContent = message;
  feedback.classList.add('visible');
  window.clearTimeout(feedback.timeoutId);
  feedback.timeoutId = window.setTimeout(() => feedback.classList.remove('visible'), 2200);
}

function addSongToPlaylist(playlistName, song) {
  const playlists = getStoredPlaylists();
  const playlist = playlists.find((item) =>
    typeof item?.name === 'string' && item.name.toLowerCase() === playlistName.toLowerCase()
  );
  if (!playlist) return false;

  playlist.songs = Array.isArray(playlist.songs) ? playlist.songs : [];
  const alreadyAdded = playlist.songs.some((item) =>
    String(item?.title || '').toLowerCase() === song.title.toLowerCase()
    && String(item?.artist || '').toLowerCase() === song.artist.toLowerCase()
  );
  if (alreadyAdded) {
    showSongActionFeedback(getCurrentTranslations().playlistAlreadyContainsSong);
    return true;
  }

  playlist.songs.push(song);
  if (!saveStoredPlaylists(playlists)) return false;
  renderPlaylistLibrary();
  showSongActionFeedback(`${getCurrentTranslations().playlistAdded}: ${playlist.name}`);
  return true;
}

function populatePlaylistMenu(menu) {
  const options = menu.querySelector('.song-playlist-options');
  if (!options) return;
  options.replaceChildren();

  getStoredPlaylists().forEach((playlist) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'song-action-option';
    button.dataset.songAction = 'add-to-playlist';
    button.dataset.playlistName = playlist.name;
    button.setAttribute('role', 'menuitem');
    button.textContent = playlist.name;
    options.appendChild(button);
  });

  const createButton = document.createElement('button');
  createButton.type = 'button';
  createButton.className = 'song-action-option';
  createButton.setAttribute('role', 'menuitem');
  const createInput = document.createElement('input');
  createInput.type = 'text';
  createInput.className = 'song-playlist-name';
  createInput.placeholder = getCurrentTranslations().playlistNamePrompt;
  createInput.dataset.i18nPlaceholder = 'playlistNamePrompt';
  createInput.setAttribute('aria-label', getCurrentTranslations().playlistNamePrompt);

  createButton.dataset.songAction = 'create-playlist';
  createButton.dataset.i18n = 'createPlaylist';
  createButton.textContent = getCurrentTranslations().createPlaylist;

  const createRow = document.createElement('div');
  createRow.className = 'song-playlist-create';
  createRow.append(createInput, createButton);
  options.appendChild(createRow);
  options.hidden = false;
}

function handleSongAction(action, song, menu) {
  const copy = getCurrentTranslations();
  if (action.dataset.songAction === 'playlist-open') {
    populatePlaylistMenu(menu);
    return;
  }

  if (action.dataset.songAction === 'favorite') {
    if (isSongFavorite(song)) {
      showSongActionFeedback(copy.alreadyFavorite);
    } else {
      toggleFavoriteSong(song, { liked: true });
      showSongActionFeedback(copy.favoriteAdded);
    }
    syncLikeButtonState();
    menu.hidden = true;
    return;
  }

  if (action.dataset.songAction === 'add-to-playlist') {
    addSongToPlaylist(action.dataset.playlistName, song);
    menu.hidden = true;
    return;
  }

  if (action.dataset.songAction === 'create-playlist') {
    const nameInput = menu.querySelector('.song-playlist-name');
    const name = nameInput?.value.trim();
    if (!name) {
      nameInput?.focus();
      return;
    }

    const playlistName = name;
    const playlists = getStoredPlaylists();
    let playlist = playlists.find((item) =>
      typeof item?.name === 'string' && item.name.toLowerCase() === playlistName.toLowerCase()
    );
    if (!playlist) {
      playlist = { name: playlistName, songs: [] };
      playlists.push(playlist);
      if (!saveStoredPlaylists(playlists)) return;
    }

    addSongToPlaylist(playlist.name, song);
    menu.hidden = true;
  }
}

function createSongActions(song) {
  const actions = document.createElement('div');
  actions.className = 'song-actions';
  actions.addEventListener('click', (event) => event.stopPropagation());

  const toggle = document.createElement('button');
  toggle.type = 'button';
  toggle.className = 'song-actions-toggle';
  toggle.setAttribute('aria-label', getCurrentTranslations().moreSongOptions);
  toggle.dataset.i18nAriaLabel = 'moreSongOptions';
  toggle.setAttribute('aria-haspopup', 'menu');
  toggle.setAttribute('aria-expanded', 'false');
  toggle.dataset.songActionsToggle = '';
  toggle.textContent = '⋮';

  const menu = document.createElement('div');
  menu.className = 'song-actions-menu';
  menu.setAttribute('role', 'menu');
  menu.hidden = true;
  menu.addEventListener('click', (event) => {
    const action = event.target.closest('[data-song-action]');
    if (action) handleSongAction(action, song, menu);
  });

  const playlistButton = document.createElement('button');
  playlistButton.type = 'button';
  playlistButton.className = 'song-action-option';
  playlistButton.dataset.songAction = 'playlist-open';
  playlistButton.dataset.i18n = 'addToPlaylist';
  playlistButton.setAttribute('role', 'menuitem');
  playlistButton.textContent = getCurrentTranslations().addToPlaylist;

  const favoriteButton = document.createElement('button');
  favoriteButton.type = 'button';
  favoriteButton.className = 'song-action-option';
  favoriteButton.dataset.songAction = 'favorite';
  favoriteButton.dataset.i18n = 'addToFavorites';
  favoriteButton.setAttribute('role', 'menuitem');
  favoriteButton.textContent = getCurrentTranslations().addToFavorites;

  const playlistOptions = document.createElement('div');
  playlistOptions.className = 'song-playlist-options';
  playlistOptions.hidden = true;
  menu.append(playlistButton, favoriteButton, playlistOptions);
  actions.append(toggle, menu);

  toggle.addEventListener('click', () => {
    const willOpen = menu.hidden;
    document.querySelectorAll('.song-actions-menu').forEach((otherMenu) => {
      otherMenu.hidden = true;
      otherMenu.previousElementSibling?.setAttribute('aria-expanded', 'false');
    });
    menu.hidden = !willOpen;
    toggle.setAttribute('aria-expanded', String(willOpen));
    if (willOpen) playlistOptions.hidden = true;
  });

  return actions;
}

function enhanceArtistSongRows() {
  const catalog = Array.isArray(window.tunelySongCatalog) ? window.tunelySongCatalog : [];
  const artistName = document.querySelector('#album-header h1')?.textContent.trim() || '';
  const album = catalog.find((entry) => entry.artist.toLowerCase() === artistName.toLowerCase());
  if (!album) return;

  document.querySelectorAll('.song').forEach((row) => {
    if (row.querySelector('.song-actions')) return;
    const title = Array.from(row.childNodes)
      .filter((node) => node.nodeType === Node.TEXT_NODE)
      .map((node) => node.textContent.trim())
      .filter(Boolean)
      .join(' ');
    const track = album.tracks.find(([trackTitle]) => trackTitle.toLowerCase() === title.toLowerCase());
    if (!track) return;

    row.dataset.search = track[0];
    row.dataset.artist = album.artist;
    row.dataset.preview = `Audios/${album.artist}/${track[1]}`;
    row.dataset.image = `Audios/${album.artist}/${track[2]}`;
    row.dataset.albumPage = album.page;
    row.appendChild(createSongActions({
      title: track[0],
      artist: album.artist,
      preview: row.dataset.preview,
      image: row.dataset.image,
      page: album.page
    }));
  });
}

function getCatalogSongDetails(song) {
  const catalog = Array.isArray(window.tunelySongCatalog) ? window.tunelySongCatalog : [];
  const album = catalog.find((entry) =>
    entry.artist.toLowerCase() === String(song.artist || '').toLowerCase()
  );
  const track = album?.tracks.find(([title]) =>
    title.toLowerCase() === String(song.title || '').toLowerCase()
  );
  const audioMatch = findCatalogTrackByAudio(song.preview);
  const matchedAlbum = album || audioMatch?.album;
  const matchedTrack = track || (audioMatch
    ? [audioMatch.title, null, audioMatch.imageFile]
    : null);

  return {
    title: song.title,
    artist: song.artist || matchedAlbum?.artist || 'Unknown Artist',
    preview: song.preview || (matchedAlbum && matchedTrack?.[1]
      ? `Audios/${matchedAlbum.artist}/${matchedTrack[1]}`
      : ''),
    image: song.image || (matchedAlbum && matchedTrack?.[2]
      ? `Audios/${matchedAlbum.artist}/${matchedTrack[2]}`
      : ''),
    page: song.page || matchedAlbum?.page || ''
  };
}

function createPlaylistLibrarySongCard(song) {
  const track = getCatalogSongDetails(song);
  const entry = document.createElement('div');
  entry.className = 'song-entry';

  const card = document.createElement('button');
  card.className = 'song-card';
  card.type = 'button';
  card.dataset.search = track.title;
  card.dataset.artist = track.artist;
  card.dataset.preview = track.preview;
  card.dataset.albumPage = track.page;
  card.setAttribute('aria-label', `${track.title} by ${track.artist}`);

  const image = document.createElement('img');
  if (track.image) image.src = track.image;
  image.alt = '';
  image.loading = 'lazy';

  const copy = document.createElement('span');
  copy.className = 'song-card-copy';
  const title = document.createElement('span');
  title.className = 'song-card-title';
  title.textContent = track.title;
  const artist = document.createElement('span');
  artist.className = 'song-card-artist';
  artist.textContent = track.artist;

  copy.append(title, artist);
  card.append(image, copy);
  entry.append(card, createSongActions(track));
  return entry;
}

function renderPlaylistLibrary() {
  const container = document.getElementById('playlistCollection');
  const emptyState = document.getElementById('playlistsEmpty');
  if (!container) return;

  const playlists = getStoredPlaylists();
  container.replaceChildren();
  playlistLibrarySongs = [];

  if (!playlists.length) {
    if (emptyState) emptyState.hidden = false;
    return;
  }

  if (emptyState) emptyState.hidden = true;

  playlists.forEach((playlist) => {
    const songs = Array.isArray(playlist.songs)
      ? playlist.songs.filter((song) => song && typeof song.title === 'string')
      : [];
    const section = document.createElement('section');
    section.className = 'playlist-library-section';

    const heading = document.createElement('div');
    heading.className = 'playlist-library-heading';
    const title = document.createElement('h3');
    title.textContent = playlist.name;
    const count = document.createElement('span');
    const copy = getCurrentTranslations();
    count.textContent = `${songs.length} ${songs.length === 1 ? copy.playlistTrack : copy.playlistTracks}`;
    heading.append(title, count);

    const grid = document.createElement('div');
    grid.className = 'grid playlist-song-grid';
    if (!songs.length) {
      const emptyPlaylist = document.createElement('p');
      emptyPlaylist.className = 'playlist-empty';
      emptyPlaylist.textContent = getCurrentTranslations().playlistEmpty;
      grid.appendChild(emptyPlaylist);
    } else {
      songs.forEach((song) => {
        const playlistSong = getCatalogSongDetails(song);
        const playlistIndex = playlistLibrarySongs.length;
        playlistLibrarySongs.push(playlistSong);
        const entry = createPlaylistLibrarySongCard(playlistSong);
        entry.querySelector('.song-card').dataset.playlistIndex = String(playlistIndex);
        grid.appendChild(entry);
      });
    }

    section.append(heading, grid);
    container.appendChild(section);
  });
}

function initPlaylistLibraryPlayback() {
  const container = document.getElementById('playlistCollection');
  const previousButton = document.querySelector('[data-playlist-previous]');
  const nextButton = document.querySelector('[data-playlist-next]');
  if (!container) return;

  let currentIndex = -1;
  const playAt = (index) => {
    if (!playlistLibrarySongs.length) return;
    currentIndex = (index + playlistLibrarySongs.length) % playlistLibrarySongs.length;
    const card = Array.from(container.querySelectorAll('.song-card')).find((item) =>
      Number(item.dataset.playlistIndex) === currentIndex
    );
    if (card) playCatalogSong(card);
    if (previousButton) previousButton.disabled = false;
    if (nextButton) nextButton.disabled = false;
  };

  container.addEventListener('click', (event) => {
    const card = event.target.closest('.song-card');
    if (!card) return;
    currentIndex = Number(card.dataset.playlistIndex);
    playCatalogSong(card);
    if (previousButton) previousButton.disabled = false;
    if (nextButton) nextButton.disabled = false;
  });

  previousButton?.addEventListener('click', () => playAt(currentIndex - 1));
  nextButton?.addEventListener('click', () => playAt(currentIndex + 1));
}

function renderFavoriteSongs() {
  const favorites = getFavoriteSongs();
  const grid = document.getElementById('favoritesGrid');
  const emptyState = document.getElementById('favoritesEmpty');
  if (!grid) return;

  grid.innerHTML = '';

  if (!favorites.length) {
    if (emptyState) emptyState.hidden = false;
    return;
  }

  if (emptyState) emptyState.hidden = true;

  favorites.forEach((song, index) => {
    const entry = document.createElement('div');
    entry.className = 'song-entry';
    entry.dataset.recentIndex = String(index);
    entry.dataset.addedAt = String(Number.isFinite(song.addedAt) ? song.addedAt : index);
    const card = document.createElement('button');
    card.className = 'song-card';
    card.type = 'button';
    card.dataset.search = song.title;
    card.dataset.artist = song.artist || 'Unknown Artist';
    card.dataset.preview = song.preview || '';
    card.dataset.albumPage = song.page || '';
    card.setAttribute('aria-label', `${song.title} by ${song.artist || 'Unknown Artist'}`);

    const image = document.createElement('img');
    const album = (window.tunelySongCatalog || []).find(
      (entry) => entry.artist.toLowerCase() === String(song.artist || '').toLowerCase()
    );
    const track = album?.tracks.find(([title]) => title.toLowerCase() === String(song.title || '').toLowerCase());
    const audioMatch = findCatalogTrackByAudio(song.preview);
    const artwork = song.image || (track ? `Audios/${album.artist}/${track[2]}` : '')
      || (audioMatch ? `Audios/${audioMatch.album.artist}/${audioMatch.imageFile}` : '');
    if (artwork) image.src = artwork;
    image.alt = '';
    image.loading = 'lazy';

    const copy = document.createElement('span');
    copy.className = 'song-card-copy';

    const title = document.createElement('span');
    title.className = 'song-card-title';
    title.textContent = song.title;

    const artist = document.createElement('span');
    artist.className = 'song-card-artist';
    artist.textContent = song.artist || 'Unknown Artist';

    const favoriteMark = document.createElement('span');
    favoriteMark.className = 'favorites-card-heart';
    favoriteMark.setAttribute('aria-hidden', 'true');
    favoriteMark.textContent = '♥';

    copy.append(title, artist);
    card.append(image, copy, favoriteMark);
    entry.append(card, createSongActions(song));
    grid.appendChild(entry);
  });

  const hasFavorites = favorites.length > 0;
  document.getElementById('playFavorites')?.toggleAttribute('disabled', !hasFavorites);
  document.getElementById('shuffleFavorites')?.toggleAttribute('disabled', !hasFavorites);
}

function initFavoritePlayback() {
  const grid = document.getElementById('favoritesGrid');
  const audio = document.getElementById('audio');
  const previousButton = document.querySelector('[data-favorite-previous]');
  const nextButton = document.querySelector('[data-favorite-next]');
  const playAllButton = document.getElementById('playFavorites');
  const shuffleButton = document.getElementById('shuffleFavorites');
  const sortSelect = document.getElementById('favoritesSort');
  if (!grid || !audio) return;

  const sortFavorites = (sortBy) => {
    const entries = Array.from(grid.children);
    entries.sort((first, second) => {
      if (sortBy === 'title') {
        return first.querySelector('.song-card-title').textContent.localeCompare(
          second.querySelector('.song-card-title').textContent,
          root.lang
        );
      }
      if (sortBy === 'artist') {
        return first.querySelector('.song-card-artist').textContent.localeCompare(
          second.querySelector('.song-card-artist').textContent,
          root.lang
        );
      }
      return Number(second.dataset.addedAt) - Number(first.dataset.addedAt)
        || Number(second.dataset.recentIndex) - Number(first.dataset.recentIndex);
    });
    entries.forEach((entry) => grid.appendChild(entry));
    const playingCard = grid.querySelector('.song-card.playing');
    if (playingCard) currentIndex = Array.from(grid.querySelectorAll('.song-card')).indexOf(playingCard);
  };

  let currentIndex = -1;
  const playAt = (index) => {
    const cards = Array.from(grid.querySelectorAll('.song-card'));
    if (!cards.length) return;
    if (previousButton) previousButton.disabled = false;
    if (nextButton) nextButton.disabled = false;
    currentIndex = (index + cards.length) % cards.length;
    playCatalogSong(cards[currentIndex]);
  };

  grid.addEventListener('click', (event) => {
    const card = event.target.closest('.song-card');
    if (!card) return;
    currentIndex = Array.from(grid.querySelectorAll('.song-card')).indexOf(card);
    if (previousButton) previousButton.disabled = false;
    if (nextButton) nextButton.disabled = false;
    playCatalogSong(card);
  });

  previousButton?.addEventListener('click', () => playAt(currentIndex - 1));
  nextButton?.addEventListener('click', () => playAt(currentIndex + 1));
  playAllButton?.addEventListener('click', () => {
    grid.querySelector('.song-card')?.click();
  });
  shuffleButton?.addEventListener('click', () => {
    const entries = Array.from(grid.children);
    for (let index = entries.length - 1; index > 0; index -= 1) {
      const randomIndex = Math.floor(Math.random() * (index + 1));
      [entries[index], entries[randomIndex]] = [entries[randomIndex], entries[index]];
    }
    entries.forEach((entry) => grid.appendChild(entry));
    grid.querySelector('.song-card')?.click();
  });
  sortSelect?.addEventListener('change', () => sortFavorites(sortSelect.value));
  sortFavorites(sortSelect?.value || 'recent');
}

function hexToRgba(hex, alpha = 0.16) {
  const cleaned = hex.replace('#', '');
  const bigint = parseInt(cleaned, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function applyTheme(theme) {
  const availableThemes = ['burgundy', 'pink', 'purple', 'dark', 'light', 'glacier'];
  const selectedTheme = availableThemes.includes(theme) ? theme : 'dark';
  body.dataset.theme = selectedTheme;
  if (themeToggle) {
    themeToggle.textContent = selectedTheme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode';
  }
  document.querySelectorAll('.theme-option').forEach((option) => {
    option.setAttribute('aria-pressed', String(option.dataset.themeChoice === selectedTheme));
  });
  localStorage.setItem('musicTheme', selectedTheme);
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
      const entry = document.createElement('div');
      entry.className = 'song-entry';
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
      entry.append(song, createSongActions({
        title,
        artist: album.artist,
        preview: song.dataset.preview,
        image: `Audios/${artistFolder}/${imageFile}`,
        page: album.page
      }));
      fragment.appendChild(entry);
    });
  });

  catalogGrid.appendChild(fragment);
  songCards = Array.from(catalogGrid.querySelectorAll('.song-card'));
}

function normalizePlayerMarkup() {
  const playerElement = document.getElementById('player');
  if (!playerElement) return;

  playerElement.classList.add('shared-player');
  playerElement.setAttribute('role', 'region');
  playerElement.setAttribute('aria-label', 'Music player');
  playerElement.innerHTML = `
    <div class="player-track">
      <a id="playerArtworkLink" class="player-artwork-link" hidden>
        <img id="playerArtwork" class="player-artwork" alt="">
      </a>
      <div class="player-track-info">
        <span class="player-label" data-i18n="nowPlaying">Now Playing:</span>
        <span id="nowPlaying" data-i18n="none">None</span>
      </div>
    </div>
    <input type="range" id="progress" min="0" max="100" value="0" aria-label="Track progress" data-i18n-aria-label="trackProgress" disabled>
    <span id="time">0:00 / 0:00</span>
    <div class="button-group">
      <button class="control-btn" type="button" aria-label="Previous song" data-i18n-aria-label="previousSong" data-player-previous data-favorite-previous data-playlist-previous disabled>
        <svg viewBox="0 0 24 24"><path d="M6 6h2v12H6zm3.5 6L18 6v12z"/></svg>
      </button>
      <button id="playBtn" type="button" aria-label="Play or pause" data-i18n-aria-label="playPause" disabled>
        <svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
      </button>
      <button class="control-btn" type="button" aria-label="Next song" data-i18n-aria-label="nextSong" data-player-next data-favorite-next data-playlist-next disabled>
        <svg viewBox="0 0 24 24"><path d="M16 6h2v12h-2zM6 6l8.5 6L6 18z"/></svg>
      </button>
      <button id="loopBtn" class="control-btn" type="button" aria-label="Toggle repeat" data-i18n-aria-label="toggleRepeat">
        <svg viewBox="0 0 24 24"><path d="M17 1l4 4-4 4V6H7v4H5V6a2 2 0 0 1 2-2h10V1zM7 23l-4-4 4-4v3h10v-4h2v4a2 2 0 0 1-2 2H7v3z"/></svg>
      </button>
    </div>
    <div class="controls">
      <button id="muteBtn" type="button" aria-label="Mute or unmute" data-i18n-aria-label="muteUnmute">🔊</button>
      <input type="range" id="volume" min="0" max="1" step="0.01" value="1" aria-label="Volume" data-i18n-aria-label="volume">
      <button id="likeBtn" class="like-btn" type="button" aria-label="Like song" aria-pressed="false" title="Like song">♡</button>
    </div>`;
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
  updatePlayerArtwork(song.dataset.preview);
  if (nowPlaying) nowPlaying.textContent = `${song.dataset.search} — ${song.dataset.artist}`;
  songCards.forEach((card) => card.classList.toggle('playing', card === song));
  document.querySelectorAll('#favoritesGrid .song-card').forEach((card) => {
    card.classList.toggle('playing', card === song);
  });
  document.querySelectorAll('#playlistCollection .song-card').forEach((card) => {
    card.classList.toggle('playing', card.dataset.search === song.dataset.search
      && card.dataset.artist === song.dataset.artist);
  });
  syncLikeButtonState();
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
  const showArtists = activeContentFilter === 'all' || activeContentFilter === 'artists';
  const showMusic = activeContentFilter === 'all' || activeContentFilter === 'music';

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

      const visible = showArtists && (!query || matched);
      card.classList.toggle('hidden', !visible);
      if (visible) {
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
      const visible = showMusic && (!query || matched);
      song.classList.toggle('hidden', !visible);
      song.closest('.song-entry')?.classList.toggle('hidden', !visible);
      if (visible) matches.push(song);
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
  applyTheme(stored);
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
    toggle.innerHTML = '<img src="Images/setting.png" class="settings-icon" alt="" aria-hidden="true"><span data-i18n="settings"></span><span class="settings-chevron" aria-hidden="true">⌃</span>';

    const panel = document.createElement('section');
    panel.id = 'settingsMenu';
    panel.className = 'settings-menu';
    panel.setAttribute('aria-labelledby', 'settingsTitle');
    panel.hidden = true;
    const languages = [
      ['en', 'English'], ['ar', 'العربية'], ['bn', 'বাংলা'], ['zh-CN', '中文（简体）'],
      ['fr', 'Français'], ['el', 'Ελληνικά'], ['hi', 'हिन्दी'], ['pt-PT', 'Português (Portugal)'],
      ['ru', 'Русский'], ['es', 'Español'], ['tr', 'Türkçe'], ['ur', 'اردو']
    ];
    panel.innerHTML = `
      <div class="settings-menu-heading">
        <h2 id="settingsTitle" data-i18n="settings"></h2>
      </div>
      <div class="settings-options" data-settings-view="home">
        <button class="settings-option" type="button" data-settings-target="language">
          <span data-i18n="language"></span><span class="settings-option-arrow" aria-hidden="true">›</span>
        </button>
        <button class="settings-option" type="button" data-settings-target="theme">
          <span data-i18n="theme"></span><span class="settings-option-arrow" aria-hidden="true">›</span>
        </button>
      </div>
      <div class="settings-subview" data-settings-view="language" hidden>
        <button class="settings-back" type="button" data-settings-home data-i18n="back"></button>
        <p class="settings-label" data-i18n="language"></p>
        <div class="language-options" role="group" data-i18n-aria-label="language">
          ${languages.map(([code, label]) => `<button class="language-option" type="button" data-language="${code}" aria-pressed="false">${label}</button>`).join('')}
        </div>
      </div>
      <div class="settings-subview" data-settings-view="theme" hidden>
        <button class="settings-back" type="button" data-settings-home data-i18n="back"></button>
        <p class="settings-label" data-i18n="theme"></p>
        <div class="theme-options" role="group" data-i18n-aria-label="theme">
          <button class="theme-option" type="button" data-theme-choice="burgundy" aria-pressed="false" data-i18n="burgundyTheme">Burgundy</button>
          <button class="theme-option" type="button" data-theme-choice="pink" aria-pressed="false" data-i18n="pinkTheme">Pink</button>
          <button class="theme-option" type="button" data-theme-choice="purple" aria-pressed="false" data-i18n="purpleTheme">Purple</button>
          <button class="theme-option" type="button" data-theme-choice="dark" aria-pressed="false" data-i18n="darkTheme"></button>
          <button class="theme-option" type="button" data-theme-choice="light" aria-pressed="false" data-i18n="lightTheme"></button>
          <button class="theme-option" type="button" data-theme-choice="glacier" aria-pressed="false" data-i18n="glacierTheme">Glacier</button>
        </div>
      </div>`;

    settings.append(toggle, panel);
    menu.appendChild(settings);
  }

  settingsToggle = document.getElementById('settingsToggle');
  settingsMenu = document.getElementById('settingsMenu');
  languageOptions = Array.from(document.querySelectorAll('.language-option'));
  if (!settingsToggle || !settingsMenu) return;

  applyTheme(body.dataset.theme || 'dark');
  applyLanguage(localStorage.getItem('tunely-language') || 'en');

  const showSettingsView = (view) => {
    settingsMenu.querySelectorAll('[data-settings-view]').forEach((section) => {
      section.hidden = section.dataset.settingsView !== view;
    });
  };

  settingsToggle.addEventListener('click', () => {
    const isOpen = settingsToggle.getAttribute('aria-expanded') === 'true';
    settingsToggle.setAttribute('aria-expanded', String(!isOpen));
    settingsMenu.hidden = isOpen;
    if (!isOpen) showSettingsView('home');
  });

  settingsMenu.addEventListener('click', (event) => {
    const target = event.target.closest('[data-settings-target]');
    if (target) {
      showSettingsView(target.dataset.settingsTarget);
      return;
    }
    if (event.target.closest('[data-settings-home]')) {
      showSettingsView('home');
    }
    const themeOption = event.target.closest('[data-theme-choice]');
    if (themeOption) {
      applyTheme(themeOption.dataset.themeChoice);
    }
  });

  languageOptions.forEach((option) => {
    option.addEventListener('click', () => {
      applyLanguage(option.dataset.language);
      settingsToggle.setAttribute('aria-expanded', 'false');
      settingsMenu.hidden = true;
      showSettingsView('home');
      settingsToggle.focus();
    });
  });

  document.addEventListener('click', (event) => {
    if (!settingsMenu.contains(event.target) && !settingsToggle.contains(event.target)) {
      settingsToggle.setAttribute('aria-expanded', 'false');
      settingsMenu.hidden = true;
      showSettingsView('home');
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !settingsMenu.hidden) {
      settingsToggle.setAttribute('aria-expanded', 'false');
      settingsMenu.hidden = true;
      showSettingsView('home');
      settingsToggle.focus();
    }
  });
}

function initControls() {
  filterChips.forEach((chip) => {
    chip.addEventListener('click', () => {
      activeContentFilter = chip.dataset.contentFilter;
      filterChips.forEach((item) => {
        const selected = item === chip;
        item.classList.toggle('active', selected);
        item.setAttribute('aria-pressed', String(selected));
      });
      updateSearch();
    });
  });

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const nextTheme = body.dataset.theme === 'dark' ? 'light' : 'dark';
      applyTheme(nextTheme);
    });
  }

  const likeBtn = document.getElementById('likeBtn');
  if (likeBtn) {
    likeBtn.addEventListener('click', () => {
      const song = buildFavoriteSongFromCurrentPlayer();
      if (!song) return;

      const currentlyLiked = isSongFavorite(song);
      const nextLiked = !currentlyLiked;
      const isLiked = toggleFavoriteSong(song, { redirect: nextLiked, liked: nextLiked });
      likeBtn.classList.toggle('liked', isLiked);
      likeBtn.setAttribute('aria-pressed', String(isLiked));
      likeBtn.textContent = isLiked ? '♥' : '♡';
      likeBtn.title = isLiked ? 'Unlike song' : 'Like song';
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
  normalizePlayerMarkup();
  initTheme();
  renderSongCatalog();
  enhanceArtistSongRows();
  shuffleCatalogItems();
  initLanguageSettings();
  attachHoverEffects();
  attachLinkTransitions();
  attachSuggestionActions();
  initControls();
  if (document.getElementById('favoritesGrid')) {
    renderFavoriteSongs();
    initFavoritePlayback();
  }
  if (document.getElementById('playlistCollection')) {
    renderPlaylistLibrary();
    initPlaylistLibraryPlayback();
  }
  if (document.getElementById('likeBtn')) {
    syncLikeButtonState();
  }
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

  document.addEventListener('click', (event) => {
    if (event.target.closest('.song-actions')) return;
    document.querySelectorAll('.song-actions-menu:not([hidden])').forEach((menu) => {
      menu.hidden = true;
      menu.previousElementSibling?.setAttribute('aria-expanded', 'false');
    });
  });

  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return;
    document.querySelectorAll('.song-actions-menu:not([hidden])').forEach((menu) => {
      menu.hidden = true;
      menu.previousElementSibling?.setAttribute('aria-expanded', 'false');
    });
  });
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
  updatePlayerArtwork(state.audioSrc);
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
  syncLikeButtonState();

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
  const previousButton = document.querySelector('[data-player-previous]');
  const nextButton = document.querySelector('[data-player-next]');
  const progress = document.getElementById('progress');
  const time = document.getElementById('time');
  const volume = document.getElementById('volume');
  const muteButton = document.getElementById('muteBtn');
  const loopButton = document.getElementById('loopBtn');
  const nowPlaying = document.getElementById('nowPlaying');

  if (!document.getElementById('favoritesGrid') && !document.getElementById('playlistCollection')) {
    previousButton?.addEventListener('click', () => {
      if (typeof window.prevSong === 'function') window.prevSong();
    });
    nextButton?.addEventListener('click', () => {
      if (typeof window.nextSong === 'function') window.nextSong();
    });
  }

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
  audio.addEventListener('play', syncLikeButtonState);
  audio.addEventListener('loadstart', () => {
    updatePlayerArtwork(audio.currentSrc || audio.src);
  });
  audio.addEventListener('loadedmetadata', () => {
    updatePlayerArtwork(audio.currentSrc || audio.src);
  });
  audio.addEventListener('pause', updatePlayButton);
  audio.addEventListener('loadedmetadata', updateProgress);
  audio.addEventListener('timeupdate', updateProgress);
  audio.addEventListener('durationchange', updateProgress);

  if (playButton) {
    playButton.addEventListener('click', () => {
      if (typeof window.togglePlay === 'function') {
        window.togglePlay();
      } else if (audio.paused) {
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
  if (muteButton) {
    muteButton.addEventListener('click', () => {
      if (typeof window.toggleMute === 'function') {
        window.toggleMute();
      } else {
        audio.muted = !audio.muted;
      }
    });
  }

  if (loopButton) {
    loopButton.classList.toggle('active', audio.loop);
  }
  if (loopButton) {
    loopButton.addEventListener('click', () => {
      if (typeof window.toggleLoop === 'function') {
        window.toggleLoop();
      } else {
        audio.loop = !audio.loop;
        loopButton.classList.toggle('active', audio.loop);
      }
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
      if (name === 'playSong') {
        updatePlayerArtwork(audio.currentSrc || audio.src);
        document.querySelector('[data-player-previous]')?.removeAttribute('disabled');
        document.querySelector('[data-player-next]')?.removeAttribute('disabled');
      }
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
