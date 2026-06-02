import {
  Directive,
  DestroyRef,
  ElementRef,
  afterNextRender,
  inject,
  input,
} from '@angular/core';

/** Coerce the selector-bound value: bare `appReveal` -> "" -> 0; `[appReveal]="120"` -> 120. */
function toRevealDelay(value: number | string): number {
  const n = typeof value === 'number' ? value : parseFloat(value);
  return Number.isFinite(n) ? n : 0;
}

/**
 * Scroll-reveal directive: fades + slides an element into view the first time
 * it enters the viewport. Pure IntersectionObserver + CSS (see `.reveal` in
 * styles.css). Animate-once, then the observer disconnects.
 *
 * Robustness:
 *  - `prefers-reduced-motion` is honored in CSS (no flash).
 *  - The hidden "from" state only applies under `.js` (set in index.html), so
 *    with JS disabled or if IntersectionObserver is missing, content is shown.
 *
 * Usage:
 *   <section appReveal>…</section>
 *   <li appReveal [appReveal]="120">…</li>   // 120ms stagger delay
 */
@Directive({
  selector: '[appReveal]',
  host: { class: 'reveal' },
})
export class RevealDirective {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly destroyRef = inject(DestroyRef);

  /** Fraction of the element visible before it reveals (0-1). */
  readonly threshold = input(0.18, { alias: 'appRevealThreshold' });
  /** IntersectionObserver rootMargin (negative bottom triggers slightly early). */
  readonly rootMargin = input('0px 0px -8% 0px', { alias: 'appRevealRootMargin' });
  /** Optional stagger delay in milliseconds, bound via the selector input. */
  readonly delay = input(0, { alias: 'appReveal', transform: toRevealDelay });

  constructor() {
    afterNextRender(() => {
      const el = this.host.nativeElement;

      const delayMs = Number(this.delay()) || 0;
      if (delayMs > 0) {
        el.style.setProperty('--reveal-delay', `${delayMs}ms`);
      }

      // No IntersectionObserver (very old browser / SSR): just show it.
      if (typeof IntersectionObserver === 'undefined') {
        el.classList.add('reveal--visible');
        return;
      }

      const observer = new IntersectionObserver(
        (entries, obs) => {
          for (const entry of entries) {
            if (entry.isIntersecting) {
              el.classList.add('reveal--visible');
              obs.disconnect();
              break;
            }
          }
        },
        { threshold: this.threshold(), rootMargin: this.rootMargin() },
      );

      observer.observe(el);
      this.destroyRef.onDestroy(() => observer.disconnect());
    });
  }
}
