# S-AUTO redesign concept

Статичный адаптивный прототип новой шапки, двухслайдового первого экрана и строки преимуществ для S-AUTO.

## Просмотр

Из папки проекта запустите:

```powershell
node server.mjs
```

После этого откройте `http://127.0.0.1:4173/`.

Основные файлы:

- `index.html` — структура и контент;
- `styles.css` — визуальная система и адаптив;
- `script.js` — мобильное меню и форма заявки;
- `assets/s-auto-camry-motion.png` — Toyota Camry в движении;
- `assets/s-auto-choice-lineup.png` — масштаб выбора автомобилей.

## Варианты кейсов для согласования

- `/#portfolio` — исходный горизонтальный слайдер.
- `/?cases=portrait#portfolio` — альтернативный слайдер: активное фото 4:3, подпись под изображением и по два вертикальных превью с каждой стороны на широком экране.

В вертикальном варианте пока используются кадрированные горизонтальные фотографии. Перед окончательным согласованием нужны вертикальные оригиналы клиента.

## Новое изображение формы

`assets/s-auto-selection-sedan.png` — рекламная иллюстрация, созданная встроенным imagegen, не фотография клиентской сделки. Заменяет повтор изображения первого экрана только в форме.

Prompt: Use case: photorealistic-natural. Asset type: editorial photo for the image half of a car-selection enquiry form on a refined Russian automotive website. Primary request: a new distinctive automobile photo, not a fleet or skyline scene. Scene: a single graphite grey contemporary sedan parked outside a quiet contemporary concrete and glass showroom, soft warm daylight, subtle reflections, natural believable photography. Composition: square photograph, full car in three-quarter front view entirely visible in the upper-middle half of frame, car occupies about 65 percent of image width with generous margins on both sides; bottom 30 percent mostly quiet dark textured asphalt for separately overlaid website copy. Camera at natural chest height, 50mm lens feel, sophisticated restrained automotive editorial style, charcoal and warm stone neutrals. No people, no city skyline, no sunset fleet, no overlaid text, no typography, no watermarks, no fake dealership signage. This is a promotional illustration, not a customer delivery photograph.
