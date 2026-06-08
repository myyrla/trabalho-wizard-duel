module.exports = {
  root: true,
  extends: ['airbnb-base'],
  parserOptions: {
    ecmaVersion: 'latest',
  },
  rules: {
    'no-console': ['error', { allow: ['error', 'log'] }],
  },
  overrides: [
    {
      files: ['public/js/**/*.js'],
      env: {
        browser: true,
        es2021: true,
      },
      globals: {
        fetchPack: 'readonly',
        fetchSpells: 'readonly',
        fetchCpuDeck: 'readonly',
        renderCard: 'readonly',
        renderDeckBadges: 'readonly',
        renderSpells: 'readonly',
        renderPack: 'readonly',
        renderLoadingMessage: 'readonly',
        logBattleMessage: 'readonly',
        setStatusMessage: 'readonly',
        showScreen: 'readonly',
        toggleDraftCard: 'readonly',
        rerollPack: 'writable',
        confirmDraft: 'writable',
        castSpell: 'writable',
        nextRound: 'writable',
        restartGame: 'writable',
      },
      rules: {
        'no-use-before-define': 'off',
        'no-unused-vars': 'off',
      },
    },
    {
      files: ['index.js', 'routes/**/*.js', 'services/**/*.js', 'constants.js'],
      env: {
        node: true,
        es2021: true,
      },
    },
  ],
};
