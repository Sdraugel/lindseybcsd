// Sticky site header / primary navigation for the Draugel for District 2 page.
// Full-width translucent paper bar with a wordmark, desktop links, and a
// signal-driven mobile menu. Zoneless-friendly (OnPush + signal toggle).
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { ButtonDirective } from '../../shared/button.directive';

@Component({
  selector: 'app-nav',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ButtonDirective],
  template: `
    <header
      class="sticky top-0 z-50 h-[var(--nav-h)] bg-paper/85 backdrop-blur border-b border-black/5"
    >
      <div class="shell flex h-full items-center justify-between">
        <!-- Wordmark -->
        <a
          href="#top"
          class="group inline-flex items-baseline gap-2 no-underline"
          aria-label="Draugel for District 2, back to top"
        >
          <span class="bubble text-2xl">Draugel</span>
          <span class="text-raspberry-ink font-display font-bold text-sm leading-none">
            District 2
          </span>
        </a>

        <!-- Desktop nav -->
        <nav aria-label="Primary" class="hidden md:flex items-center gap-7">
          <a
            href="#meet"
            class="font-display font-bold text-ink no-underline hover:text-brand-blue transition-colors"
            >Meet Lindsey</a
          >
          <a
            href="#experience"
            class="font-display font-bold text-ink no-underline hover:text-brand-blue transition-colors"
            >Experience</a
          >
          <a
            href="#priorities"
            class="font-display font-bold text-ink no-underline hover:text-brand-blue transition-colors"
            >Priorities</a
          >
          <a appButton size="md" href="#get-involved">Get Involved</a>
        </nav>

        <!-- Mobile hamburger -->
        <button
          type="button"
          class="md:hidden inline-flex items-center justify-center rounded-lg p-2 -mr-2 text-brand-blue hover:bg-brand-blue/10 transition-colors"
          [attr.aria-label]="menuOpen() ? 'Close menu' : 'Open menu'"
          [attr.aria-expanded]="menuOpen()"
          aria-controls="mobile-menu"
          (click)="toggleMenu()"
        >
          @if (menuOpen()) {
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M6 6 18 18 M18 6 6 18"
                stroke="currentColor"
                stroke-width="2.4"
                stroke-linecap="round"
              />
            </svg>
          } @else {
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M4 7h16 M4 12h16 M4 17h16"
                stroke="currentColor"
                stroke-width="2.4"
                stroke-linecap="round"
              />
            </svg>
          }
        </button>
      </div>

      <!-- Mobile menu panel -->
      @if (menuOpen()) {
        <nav
          id="mobile-menu"
          aria-label="Primary"
          class="md:hidden absolute inset-x-0 top-[var(--nav-h)] bg-paper/95 backdrop-blur border-b border-black/5 shadow-[0_14px_30px_-22px_rgba(24,42,110,0.5)]"
        >
          <ul class="shell flex flex-col gap-1 py-4">
            <li>
              <a
                href="#meet"
                class="block py-2 font-display font-bold text-ink no-underline hover:text-brand-blue transition-colors"
                (click)="closeMenu()"
                >Meet Lindsey</a
              >
            </li>
            <li>
              <a
                href="#experience"
                class="block py-2 font-display font-bold text-ink no-underline hover:text-brand-blue transition-colors"
                (click)="closeMenu()"
                >Experience</a
              >
            </li>
            <li>
              <a
                href="#priorities"
                class="block py-2 font-display font-bold text-ink no-underline hover:text-brand-blue transition-colors"
                (click)="closeMenu()"
                >Priorities</a
              >
            </li>
            <li class="pt-2">
              <a appButton size="md" href="#get-involved" (click)="closeMenu()"
                >Get Involved</a
              >
            </li>
          </ul>
        </nav>
      }
    </header>
  `,
})
export class Nav {
  /** Whether the mobile navigation panel is open. */
  protected readonly menuOpen = signal(false);

  protected toggleMenu(): void {
    this.menuOpen.update((open) => !open);
  }

  protected closeMenu(): void {
    this.menuOpen.set(false);
  }
}
