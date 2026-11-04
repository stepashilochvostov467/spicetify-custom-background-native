# Custom Background Native for Spicetify

Свой Spotify: фоны, стеклянные панели, пресеты и штатные тексты песен.
Your Spotify: custom backgrounds, glass panels, presets and native lyrics.

[Русский](#русский) · [English](#english) · **1.1.0**

## Русский

### Возможности

- Свой фон: картинки, GIF и видео MP4/WebM без звука до 30 МБ.
- Масштаб, положение, размытие и затемнение фона; плавная смена картинок.
- Отдельные настройки стеклянных панелей медиатеки, центра и плеера.
- Свой или автоматически подобранный цвет текста.
- Полноразмерная боковая панель текстов Spotify: подсветка текущей строки, плавная прокрутка и перемотка нажатием.
- Русский перевод под оригиналом: общая подсветка и прокрутка, выбранный цвет текста и локальный кэш переводов.
- Фон панели текста: Canvas → доступное видео текущего трека → обложка. Видео заполняет панель без искажения пропорций и градиента, обложка под ним скрыта.
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

Нажми **RU** в заголовке панели текста или включи «Русский перевод под каждой строкой» в настройках. При включении строки отправляются в [MyMemory](https://mymemory.translated.net/doc/spec.php) для машинного перевода; Spotify-токены, данные аккаунта и история прослушивания сервису не передаются. Дополнительные расширения и API-ключи не нужны.

Перевод показывается под оригиналом, использует его тайминг и цвет оформления. Нажатие на перевод перематывает к той же строке. Повторяющиеся строки переводятся один раз; результаты хранятся локально до 30 дней. В бесплатном анонимном режиме у сервиса [лимит 5000 символов в день](https://mymemory.translated.net/doc/usagelimits.php). При ошибке или исчерпании лимита оригинал и уже готовые переводы остаются доступны. Для повторной попытки нажми ↻. Качество и доступность машинного перевода зависят от сервиса.

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
- Sidebar backgrounds: Canvas → accessible current-track video → static cover. Videos fill the panel with centered cropping, preserving proportions without gradients or an underlying cover.
- Cover, typography, track row and player sizing controls.
- Hide podcasts, recommendations, store links and Spotify's native sidebar.
- Per-playlist presets with their own backgrounds, portable export and import preview.

A self-contained Spicetify extension: no companion extensions or separate lyric services. Lyrics come directly from Spotify's native source, without reading another extension's cache or triggering its loader. Timing is line-based when available; syllable and character timing are not provided. Unavailable lyrics are reported clearly.

### Installation

Install desktop Spotify and [Spicetify](https://spicetify.app/docs/getting-started/). Download [custom-bg.js](https://raw.githubusercontent.com/stepashilochvostov467/spicetify-custom-background-native/main/custom-bg.js), copy it to Spicetify's Extensions directory, and run the commands above.

**Alt+B** opens settings; **Alt+P** switches presets. Enable lyrics in the sidebar lyric settings by selecting Spotify.

### Russian translation

Press **RU** in the lyric panel header or enable Russian translation in settings. When enabled, lyric lines are sent to [MyMemory](https://mymemory.translated.net/doc/spec.php) for machine translation. Spotify tokens, account information and listening history are not sent. No companion extension or API key is required.

Translations appear below their originals and share the same highlight, timing, text color and click-to-seek action. Repeated lines are translated once; results are cached locally for up to 30 days. The service's anonymous tier is [limited to 5000 characters per day](https://mymemory.translated.net/doc/usagelimits.php). Errors or quota exhaustion preserve the originals and completed translations. Press ↻ to retry. Translation quality and availability depend on the service.

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

The build produces `custom-bg.js` and checks its syntax. Isolated browser tests cover native lyrics, line timing, stale requests, seek/pause behavior, Canvas fallback, video layout, preset import/export and idle callbacks. Tests run without companion extensions and do not guarantee compatibility with every Spotify release.

[Report a bug / Сообщить об ошибке](https://github.com/stepashilochvostov467/spicetify-custom-background-native/issues) · [Contributing](CONTRIBUTING.md) · [Roadmap](ROADMAP.md)

MIT License. Independent project, not affiliated with Spotify.
