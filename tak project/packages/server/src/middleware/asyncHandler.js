/** Encapsule un handler async pour transmettre les rejets de promesse au middleware d'erreur. */
export function asyncHandler(handler) {
  return (req, res, next) => {
    Promise.resolve(handler(req, res, next)).catch(next);
  };
}
