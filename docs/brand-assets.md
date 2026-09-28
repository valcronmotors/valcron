# Brand carousel logo assets

Local files under `/public/brands/` power the Home brand swipe carousel.
They identify vehicle makes customers can search. They do **not** imply
franchise, authorized dealership, partnership, or sponsorship.

## Inventory

| Brand | File | Source (verified before commit) |
| --- | --- | --- |
| Toyota | `toyota.svg` | Official Toyota AEM CDN asset `VIS_toyota_logo_horiz_black_RGB_2023.svg` referenced from [toyota.com](https://www.toyota.com/) |
| Honda | `honda.svg` | Wikimedia Commons `File:Honda.svg` — Honda Motor Co. trademark artwork |
| Hyundai | `hyundai.svg` | Official [hyundaiusa.com](https://www.hyundaiusa.com/) navigation asset `hyundai-logo.svg` |
| Kia | `kia.svg` | Official [kia.com/us](https://www.kia.com/us/en) DAM asset `kia_logo_black.svg` |
| Nissan | `nissan.svg` | Official [nissanusa.com](https://www.nissanusa.com/) navigation asset `nissan-logo-black.svg` |
| Chevrolet | `chevrolet.png` | Official [chevrolet.com](https://www.chevrolet.com/) primary-navigation asset `chevrolet-logo-v2.png` |
| Ford | `ford.svg` | Wikimedia Commons `File:Ford_logo_flat.svg` — sourced from Ford Motor Company 2017 Annual Report |
| Mazda | `mazda.svg` | Wikimedia Commons `File:Mazda_logo_with_emblem,_new.svg` — credit [mazda.com](https://www.mazda.com/) |
| Mitsubishi | `mitsubishi.svg` | Official [mitsubishicars.com](https://www.mitsubishicars.com/) navigation asset `nav-logo-black.svg` |

## Rules

- Store assets locally. Do not hotlink third-party URLs in production.
- Prefer manufacturer official / media / navigation assets.
- Prefer SVG; use transparent PNG when SVG is unavailable from the manufacturer.
- Do not redraw, invent, AI-generate, or approximate marks.
- Preserve aspect ratio in the UI (`object-contain`). Do not stretch.
- Labels under tiles use plain brand names for search filters (`marca=`).
