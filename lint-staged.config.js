module.exports = {
  '**/*.ts': [
    (filenames) =>
      `eslint ${filenames
        .filter(
          (filename) =>
            !filename.endsWith('src/supabase/interfaces/supabase.ts'),
        )
        .join(' ')} --max-warnings 0`,
    (filenames) =>
      filenames.map((filename) => `prettier --write '${filename}'`),
  ],
};
