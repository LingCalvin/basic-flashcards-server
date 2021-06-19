import { stripCreatedAt, stripUpdatedAt } from './metadata.utils';

describe('stripCreatedAt', () => {
  it('removes the `created_at` property', () =>
    expect(stripCreatedAt({ created_at: new Date() })).toMatchObject({}));
});

describe('stripUpdatedAt', () => {
  it('removes the `updated_at` property', () =>
    expect(stripUpdatedAt({ updated_at: new Date() })).toMatchObject({}));
});
