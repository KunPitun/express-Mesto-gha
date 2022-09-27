class BadRequesError extends Error {
  constructor(message) {
    super(message);
    this.name = 'BadRequesError';
    this.statusCode = 400;
  }
}

module.exports = BadRequesError;
