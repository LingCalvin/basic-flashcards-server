export class MisconfiguredException extends Error {
  constructor(message?: string) {
    super(message);
    this.name = 'MisconfiguredException';
  }
}
