import { escapeLike } from './sql.utils';

describe('escapeLike', () => {
  it('returns the same string if the string does not contain escapeCharacter, "%", ",", or "_"', () =>
    expect(escapeLike('a1!')).toBe(`a1!`));

  it('escapes "\\', () => expect(escapeLike('\\')).toBe('\\\\'));
  it('escapes "%"', () => expect(escapeLike('%')).toBe('\\%'));
  it('escapes ","', () => expect(escapeLike(',')).toBe('\\,'));
  it('escapes "_"', () => expect(escapeLike('_')).toBe('\\_'));
});
