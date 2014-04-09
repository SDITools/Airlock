module.exports = {
  unit: {
    options: {
      tests: ['tests/unit/']
    }
  },
  integration: {
    options: {
      tests: ['tests/integration/'],
      helpers: ['tests/helpers/integration.js']
    }
  }
};
