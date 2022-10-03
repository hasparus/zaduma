export const formatDate = (date: ConstructorParameters<typeof Date>[0]) =>
  new Date(date).toLocaleDateString("sv-SE");
