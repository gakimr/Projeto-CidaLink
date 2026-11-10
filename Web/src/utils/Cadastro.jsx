export function CompleteCadastro(user) {
  return Boolean(user?.latitude && user?.longitude);
}
