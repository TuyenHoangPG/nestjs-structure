export const enumToArray = (enumVariable): string[] => {
  return Object.keys(enumVariable).map((key) => enumVariable[key]);
};
