# Custom Background Native for Spicetify

Свой Spotify: фоны, стеклянные панели, пресеты и штатные тексты песен.
Your Spotify: custom backgrounds, glass panels, presets and native lyrics.

[Русский](#русский) · [English](#english) · **1.2.1**

## Русский

### Возможности

- Свой фон: картинки, GIF и видео MP4/WebM без звука до 30 МБ.
- Масштаб, положение, размытие и затемнение фона; плавная смена картинок.
- Отдельные настройки стеклянных панелей медиатеки, центра и плеера.
- Свой или автоматически подобранный цвет текста.
- Полноразмерная боковая панель текстов Spotify: подсветка текущей строки, плавная прокрутка и перемотка нажатием.
- Русский перевод под оригиналом: общая подсветка и прокрутка, выбранный цвет текста и локальный кэш переводов.
- Фон панели текста: Canvas → доступное видео текущего трека → обложка. Видео заполняет панель без искажения пропорций и градиента, обложка под ним скрыта. Цвет текста и ровная контрастная подложка подстраиваются под фон самой панели.
- Настройки обложек, размеров текста, строк и элементов плеера.
- Скрытие подкастов, рекомендаций, магазина и штатной правой панели.
- Пресеты со своим фоном, привязка к плейлистам, экспорт и импорт с предпросмотром.

Это самостоятельное расширение для Spicetify. Другие расширения и отдельные сервисы текстов не нужны. Оно использует штатный источник текстов Spotify, без чтения кэшей и запуска чужих загрузчиков. При наличии таймингов текст синхронизируется по строкам; послоговая и побуквенная синхронизация не заявляется. Если Spotify не предоставляет текст, панель сообщает об этом.

### Установка

Нужны настольный Spotify и установленный [Spicetify](https://spicetify.app/docs/getting-started/).

1. Скачай [custom-bg.js](https://raw.githubusercontent.com/stepashilochvostov467/spicetify-custom-background-native/main/custom-bg.js).
2. Положи файл в каталог Extensions внутри папки настроек Spicetify. В Windows обычно это `%APPDATA%\spicetify\Extensions`.
3. Выполни:

```powershell
spicetify config extensions custom-bg.js
spicetify apply
```

**Alt+B** — настройки, **Alt+P** — следующее оформление. Тексты включаются в разделе «Текст песни в правой панели → Spotify».

### Перевод песен

Нажми **RU** в заголовке панели текста или включи «Русский перевод под каждой строкой» в настройках. По умолчанию используется **«На компьютере · EN → RU»**: английский текст переводится локальной моделью без дневной квоты, API-ключей и дополнительных расширений. При первом запуске скачиваются движок и модель. После загрузки сам перевод работает без интернета; исходные строки должны быть доступны в Spotify. При очистке кэша модель потребуется скачать заново.

Перевод показывается под оригиналом, использует его тайминг и цвет оформления. Нажатие на перевод перематывает к той же строке. Повторяющиеся строки переводятся один раз; результаты хранятся локально до 30 дней. Вычисления выполняются в отдельном потоке, модель выгружается из памяти после минуты простоя. Локальный режим передаёт в сеть только запросы фиксированных файлов движка и модели; текст песни остаётся на устройстве. Пока поддерживается английский → русский; художественное качество перевода не гарантируется. Цензура не применяется. Для выражения «fucking … up» добавлена контекстная поправка, сохраняющая грубый смысл; это не универсальное исправление всех ошибок модели.

Для других языков можно **явно выбрать MyMemory** в настройке «Переводчик». Этот режим отправляет строки [онлайн-сервису](https://mymemory.translated.net/doc/spec.php), у которого [лимит 5000 символов в день](https://mymemory.translated.net/doc/usagelimits.php). Автоматического переключения с локального режима на онлайн нет. При ошибке оригинал остаётся доступен; ↻ повторяет попытку.

Эта версия заменяет файл `custom-bg.js` предыдущего варианта. Выбирай один вариант расширения; запуск двух копий одновременно не поддерживается. Настройки и формат пресетов совместимы, неподдерживаемый источник текста из старого пресета отключается.

### Доступность и производительность

Картинки и настройки хранятся локально. Постоянного кадрового цикла у статичного фона нет. Синхронизация текста останавливается на паузе, при выключенной панели и в скрытом окне; видео также приостанавливается в скрытом окне.

Тексты, Canvas и клипы зависят от доступности в Spotify, аккаунта, региона и версии клиента. Недоступное видео заменяется обложкой. Независимость от других расширений не гарантирует неизменность внутренних API Spotify.

## English

### Features

- Custom images, GIFs and muted looping MP4/WebM videos up to 30 MB.
- Background framing, zoom, blur, dimming and image crossfades.
- Independent glass settings for the library, main area and player.
- Custom or automatically selected text colors.
- Full-height native Spotify lyric sidebar with line highlighting, smooth following and click-to-seek.
- Russian translation below each original line, sharing its highlight, timing and selected color, with a local translation cache.
- Sidebar backgrounds: Canvas → accessible current-track video → static cover. Videos fill the panel with centered cropping, preserving proportions without gradients or an underlying cover. Text color and a uniform contrast layer adapt to the sidebar media itself.
- Cover, typography, track row and player sizing controls.
- Hide podcasts, recommendations, store links and Spotify's native sidebar.
- Per-playlist presets with their own backgrounds, portable export and import preview.

A self-contained Spicetify extension: no companion extensions or separate lyric services. Lyrics come directly from Spotify's native source, without reading another extension's cache or triggering its loader. Timing is line-based when available; syllable and character timing are not provided. Unavailable lyrics are reported clearly.

### Installation

Install desktop Spotify and [Spicetify](https://spicetify.app/docs/getting-started/). Download [custom-bg.js](https://raw.githubusercontent.com/stepashilochvostov467/spicetify-custom-background-native/main/custom-bg.js), copy it to Spicetify's Extensions directory, and run the commands above.

**Alt+B** opens settings; **Alt+P** switches presets. Enable lyrics in the sidebar lyric settings by selecting Spotify.

### Russian translation

Press **RU** in the lyric panel header or enable Russian translation in settings. The default **on-device EN → RU** engine translates English locally without a daily service quota, API key or companion extension. The runtime and model download on first use. Afterwards translation itself works offline; original lines must still be available from Spotify. Clearing the cache requires downloading the model again.

Translations appear below their originals and share their highlight, timing, text color and click-to-seek action. Repeated lines are translated once; results are cached locally for up to 30 days. Inference runs in a worker; the model is unloaded after one minute of inactivity. Local mode only requests fixed runtime and model assets over the network; lyric text stays on the device. English → Russian is currently supported. Machine translation does not guarantee literary quality.

For other languages, explicitly select **MyMemory** in translator settings. This sends lines to the [online provider](https://mymemory.translated.net/doc/spec.php), whose anonymous tier is [limited to 5000 characters per day](https://mymemory.translated.net/doc/usagelimits.php). Local mode never silently falls back online. Errors preserve originals; press ↻ to retry.

This replaces the previous variant's `custom-bg.js`. Use one variant at a time. Appearance settings and preset files remain compatible; an unsupported imported lyric source is disabled.

### Availability and performance

Images and settings are stored locally. Static backgrounds have no permanent frame loop. Lyric synchronization stops when paused, hidden or disabled. Background video pauses in hidden windows.

Lyrics, Canvas and music videos depend on Spotify availability, account, region and client version. Unavailable video falls back to the cover. Internal Spotify APIs can change independently of this extension.

## Development

Node.js and Google Chrome are required for the browser checks.

```sh
npm ci
npm run build
npm test
```

`npm run test:local` additionally downloads the actual translation model into an ignored test browser profile, verifies inference and UI responsiveness, then starts a fresh worker with networking disabled. Standard tests mock inference and do not download model weights.

The build produces `custom-bg.js` and checks its syntax. Isolated browser tests cover native lyrics, line timing, stale requests, seek/pause behavior, Canvas fallback, video layout, preset import/export and idle callbacks. Tests run without companion extensions and do not guarantee compatibility with every Spotify release.

[Report a bug / Сообщить об ошибке](https://github.com/stepashilochvostov467/spicetify-custom-background-native/issues) · [Contributing](CONTRIBUTING.md) · [Roadmap](ROADMAP.md)

MIT License. Independent project, not affiliated with Spotify. Local model/runtime credits and pinned versions: [THIRD_PARTY.md](THIRD_PARTY.md).
