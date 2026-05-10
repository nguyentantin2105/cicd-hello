module.exports = [
  {
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "commonjs",
      globals: {
        document: "readonly",
        module: "readonly",
        require: "readonly",
        __dirname: "readonly",
        process: "readonly",
        console: "readonly",
        test: "readonly",
        expect: "readonly",
      },
    },
    rules: {
      "no-unused-vars": "warn",
      "no-undef": "error",
    },
  },
];
