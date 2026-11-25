# Repeated-letter feedback examples

Original MIT teaching code by Leon Reed, made with AI assistance and then reviewed and tested. This is a small standalone example, not an official Wordle implementation, solver, answer list, or the production source of Riddle List.

## Why two passes?

A letter being present in a secret does not establish that every guessed copy should receive a match. Exact positions consume their copies first. Only the unmatched secret letters remain available for misplaced guesses.

For synthetic secret `abc` and guess `aaa`, the result is `correct, absent, absent`. Testing only `secret.includes(letter)` would over-credit the second and third copies. For `aab` and `baa`, the result is `present, correct, present`.

## Run locally

Requires Node.js 18 or later. No package installation, network access, account or API key is needed.

```sh
node feedback.mjs
```

The file exports a pure `feedback(secret, guess)` function and runs its tests only when executed directly. Inputs are nonempty, equally long lowercase ASCII strings. This narrow contract deliberately avoids pretending to validate dictionary words or Unicode alphabets.

## Verification

The tests enumerate all 729 pairs of three-character strings over `a`, `b`, `c`. For every pair they check exact-position correctness, per-letter match counts, and agreement with an independent pool-removal oracle. Three explicit examples and five invalid inputs are checked too. These checks cover this toy contract; they do not certify another publisher's rules.

## Maker context

I build [Riddle List](https://riddlelist.com/), a daily-puzzle discovery directory with sourced guides and official play links. The [Wordle guide](https://riddlelist.com/games/wordle/) is one starting point for comparing letter-feedback mechanics. The directory does not run publisher games or store game progress. This README describes my own educational work, not an independent recommendation.

MIT license. Copyright (c) 2026 Leon Reed.
