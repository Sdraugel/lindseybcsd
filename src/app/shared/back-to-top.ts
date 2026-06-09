// Floating "back to top" button. Appears once the page is scrolled down and
// smooth-scrolls to the top (respects prefers-reduced-motion). Zoneless-friendly:
// the scroll listener updates a signal, which schedules change detection.
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  afterNextRender,
  inject,
  signal,
} from '@angular/core';

/** Show the button after the user has scrolled past this many pixels. */
const SHOW_AFTER_PX = 160;

@Component({
  selector: 'app-back-to-top',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button
      type="button"
      aria-label="Back to top"
      (click)="toTop()"
      class="fixed bottom-5 right-5 z-50 inline-flex h-12 w-12 items-center justify-center rounded-full bg-brand-blue text-white shadow-[0_12px_26px_-12px_rgba(24,42,110,0.85)] transition duration-200 ease-out hover:-translate-y-0.5 hover:bg-brand-blue-soft"
      [class.opacity-0]="!visible()"
      [class.translate-y-3]="!visible()"
      [class.pointer-events-none]="!visible()"
      [attr.tabindex]="visible() ? null : -1"
      [attr.aria-hidden]="visible() ? null : 'true'"
    >
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M12 19V6 M6 11l6-6 6 6"
          stroke="currentColor"
          stroke-width="2.4"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </button>
  `,
})
export class BackToTop {
  private readonly destroyRef = inject(DestroyRef);
  protected readonly visible = signal(false);

  constructor() {
    afterNextRender(() => {
      const onScroll = () => {
        const show = window.scrollY > SHOW_AFTER_PX;
        if (show !== this.visible()) this.visible.set(show);
      };
      onScroll();
      window.addEventListener('scroll', onScroll, { passive: true });
      this.destroyRef.onDestroy(() =>
        window.removeEventListener('scroll', onScroll),
      );
    });
  }

  protected toTop(): void {
    const reduce =
      typeof matchMedia === 'function' &&
      matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
  }
}
