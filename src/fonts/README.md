# Classical emphasis

Selected on 2026-10-20: **Cormorant Garamond Italic, ink black**.

The shared configuration is [`typography.css`](../app/typography.css).

| Role | Typeface | Scale / weight |
| --- | --- | --- |
| Page and homepage section titles | Georgia | 42–72px responsive, 400 |
| Secondary headings and product names | Georgia | 28–40px responsive, 400 |
| Reading section headings | Georgia | 24–30px responsive, 400 |
| Editorial body copy | Instrument Sans | 15px, 400, line height 1.75 |
| Actions and buttons | Instrument Sans | 13px, 400, line height 1.5 |
| Heading emphasis | Cormorant Garamond Italic | 500, ink black |
| Body emphasis | Cormorant Garamond Italic | 600, ink black |

Paragraphs share a `.75em` gap. Summaries use up to 42ch; reading copy uses up
to 65ch. Artwork may need a narrower copy measure for contrast. Use emphasis
only for short phrases, not whole paragraphs. Orange is for small brand accents,
progress and interaction feedback, rather than emphasized body text.

The wordmark and artwork navigation retain their composition-dependent sizing.
Native platform windows keep the platforms' own typography.

The local Latin variable WOFF2 is 39,304 bytes and covers 500–600 without synthetic bold.
`next/font/local` loads it only when used, with `display: swap`; there are no
client requests to Google Fonts.

- Family: <https://fonts.google.com/specimen/Cormorant+Garamond>
- WOFF2 source: <https://fonts.gstatic.com/s/cormorantgaramond/v21/co3ZmX5slCNuHLi8bLeY9MK7whWMhyjYrEtImSqn7B6D.woff2>
- License: [SIL Open Font License 1.1](cormorant-garamond-OFL.txt)
