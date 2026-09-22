/**
 * The wordmark, as text rather than an image.
 *
 * The period is its own element on purpose: the brand guideline treats it as a
 * visual node in its own right, and the loading/live state blink has nothing to
 * animate if the whole mark is one raster image.
 *
 * The custom lettering study — the terminal cut, the single irregularity — is
 * still a design task. This gets the structure right so that work can land
 * without another refactor.
 */
export function Wordmark({ live = false }: { live?: boolean }) {
  return (
    <span className="wordmark-text">
      bitpunk
      <span className={live ? "wordmark-dot is-live" : "wordmark-dot"}>.</span>
    </span>
  );
}
