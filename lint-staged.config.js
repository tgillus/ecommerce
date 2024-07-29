export default {
  '*.{js,json,ts,md}': 'biome format --write --no-errors-on-unmatched',
  '*.{js,ts}': 'biome lint --apply --no-errors-on-unmatched',
};
