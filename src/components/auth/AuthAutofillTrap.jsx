/**
 * Hidden decoy fields that absorb browser/password-manager autofill
 * so real form fields stay empty on refresh.
 */
export default function AuthAutofillTrap() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute -left-[9999px] h-0 w-0 overflow-hidden opacity-0"
    >
      <input type="text" name="username" tabIndex={-1} autoComplete="username" />
      <input type="password" name="password" tabIndex={-1} autoComplete="current-password" />
      <input type="email" name="email" tabIndex={-1} autoComplete="email" />
    </div>
  );
}
