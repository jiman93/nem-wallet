// http://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,
  parser: 'babel-eslint',
  parserOptions: {
    sourceType: 'module'
  },
  env: {
    browser: true,
  },
  extends: 'airbnb-base',
  // required to lint *.vue files
  plugins: [
    'html'
  ],
  // check if imports actually resolve
  'settings': {
    'import/resolver': {
      'webpack': {
        'config': 'build/webpack.base.conf.js'
      }
    }
  },
  // add your custom rules here
  'rules': {
    // don't require .vue extension when importing
    'import/extensions': ['error', 'always', {
      'js': 'never',
      'vue': 'never'
    }],
    // allow optionalDependencies
    'import/no-extraneous-dependencies': ['error', {
      'optionalDependencies': ['test/unit/index.js']
    }],
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
    // allow console.log during development
    'no-console': process.env.NODE_ENV === 'production' ? 2 : 0,
    // disable linebreak checking i got so many problems with this
    'linebreak-style': 'off',
    // this rule is preventing vujs methode syntax from working so i changed it a bit
    "object-shorthand": 'off',
    // allow the state to be shadowed in the store modules
    "no-shadow": ["error", { "allow": ["state"] }],
    // allow state modification in the store mosules
    "no-param-reassign": ["error", { "props": true, "ignorePropertyModificationsFor": ["state"] }],
    // allow the args to not be unused
    'no-unused-vars': ["error", { "args": "none" }],
    //allow variable function naming
    'func-names': ["error", "as-needed"],
    // allow bitwise use
    'no-bitwise': 'off',
    // forces a return to be writing in one line without braces
    'arrow-body-style': 'off',
  },
  "overrides": [
    {
      //creating exception configuration for vue files
      "files": ["*.vue"],
      // "excludedFiles": "*.test.js",
      "rules": {
        // rules for vue files
      },
    },
  ],
}
