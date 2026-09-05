import { describe, expect, test } from 'bun:test';
import { parseArgs } from '../../../src/cli/parse-args';

describe('parseArgs init', () => {
  test('init with no dir defaults to "."', () => {
    expect(parseArgs(['init'])).toEqual({ kind: 'init', dir: '.' });
  });

  test('init with a dir uses it', () => {
    expect(parseArgs(['init', 'my-app'])).toEqual({ kind: 'init', dir: 'my-app' });
  });

  test('init with a name and a dir scaffolds that name into that dir', () => {
    // `bunmaska init my-app .` - the create-react-app shape people reach for.
    expect(parseArgs(['init', 'my-app', '.'])).toEqual({ kind: 'init', dir: '.', name: 'my-app' });
  });

  test('init with extra arguments errors', () => {
    const command = parseArgs(['init', 'a', 'b', 'c']);
    expect(command.kind).toBe('error');
    if (command.kind === 'error') {
      expect(command.message).toContain('unexpected argument c');
    }
  });
});
