# Harry Potter Games

Sada jednoduchých browser her ze světa Harryho Pottera. Data z [HP API](https://hp-api.onrender.com/).

## Hry

| Hra | Popis |
|---|---|
| [Hádej jméno postavy](guess-character-name/) | Hangman — uhodni jméno postavy písmeno po písmenu |
| [Hádej kolej postavy](guess-house/) | Vyber správnou Bradavickou kolej ke jménu postavy |
| [Hádej zaklínadlo](guess-spell/) | Hangman — uhodni zaklínadlo |
| [Kdo je na fotce?](who-is-on-photo/) | Podívej se na fotku a vyber správné jméno |

## Spuštění lokálně

Otevři [`index.html`](index.html) v prohlížeči, nebo spusť libovolný statický server v kořeni repozitáře.

## Deploy na Netlify

1. Repozitář je propojen s Netlify (publish directory: `.`, viz `netlify.toml`).
2. Kořenová URL zobrazí menu her.
3. Jednotlivé hry jsou na `/guess-character-name/`, `/guess-house/` atd.

## Tech stack

- HTML, CSS, vanilla JavaScript (OOP třídy)
- Sdílené styly v `shared/common.css`
- Bez build stepu a bez externích knihoven
