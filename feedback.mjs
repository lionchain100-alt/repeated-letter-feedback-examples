// Original educational example by Leon Reed. MIT license.
// Synthetic inputs only; not an official game, solver, or answer list.
import assert from 'node:assert/strict';
import { pathToFileURL } from 'node:url';

export function feedback(secret, guess) {
  if (typeof secret !== 'string' || typeof guess !== 'string' ||
      !/^[a-z]+$/.test(secret) || !/^[a-z]+$/.test(guess) ||
      secret.length !== guess.length) {
    throw new TypeError('Use equally long, nonempty lowercase ASCII strings.');
  }
  const result = Array(guess.length).fill('absent');
  const remaining = new Map();
  for (let i = 0; i < secret.length; i++) {
    if (secret[i] === guess[i]) result[i] = 'correct';
    else remaining.set(secret[i], (remaining.get(secret[i]) ?? 0) + 1);
  }
  for (let i = 0; i < guess.length; i++) {
    if (result[i] === 'correct') continue;
    const count = remaining.get(guess[i]) ?? 0;
    if (count > 0) {
      result[i] = 'present';
      remaining.set(guess[i], count - 1);
    }
  }
  return result;
}

export function selfTest() {
  // A naive includes() test would mark too many copies as present.
  assert.deepEqual(feedback('abc', 'aaa'), ['correct', 'absent', 'absent']);
  assert.deepEqual(feedback('aab', 'baa'), ['present', 'correct', 'present']);
  assert.deepEqual(feedback('abc', 'cba'), ['present', 'correct', 'present']);
  const words = [];
  for (const a of 'abc') for (const b of 'abc') for (const c of 'abc') words.push(a+b+c);
  let pairs = 0;
  for (const secret of words) for (const guess of words) {
    const r = feedback(secret, guess);
    assert.equal(r.length, 3);
    for (let i = 0; i < 3; i++) assert.equal(r[i] === 'correct', secret[i] === guess[i]);
    for (const letter of 'abc') {
      const matches = r.filter((v, i) => guess[i] === letter && v !== 'absent').length;
      const expected = Math.min([...secret].filter(c => c === letter).length,
                                [...guess].filter(c => c === letter).length);
      assert.equal(matches, expected);
    }
    // Independent oracle: remove exact matches, then take each guess from a pool.
    const pool = [...secret].filter((c,i) => c !== guess[i]);
    const oracle = [...guess].map((c,i) => {
      if (c === secret[i]) return 'correct';
      const at = pool.indexOf(c);
      if (at === -1) return 'absent';
      pool.splice(at, 1); return 'present';
    });
    assert.deepEqual(r, oracle);
    pairs++;
  }
  for (const args of [['', ''], ['abc', 'ab'], ['ABC', 'abc'], [null, 'abc'], ['a1c','abc']]) {
    assert.throws(() => feedback(...args), TypeError);
  }
  return { exhaustivePairs: pairs, explicitExamples: 3, invalidInputs: 5, passed: true };
}
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  console.log(JSON.stringify(selfTest()));
}
