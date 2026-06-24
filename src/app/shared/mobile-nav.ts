// Mobile navigation: a hamburger button (shown below md) that opens a menu of
// the section links. On md+ the hero's button row is the nav, so this is hidden.
// Zoneless-friendly (signal toggle); closes on link click, backdrop click, or Esc.
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

interface NavLink {
  href: string;
  label: string;
  primary?: boolean;
}

@Component({
  selector: 'app-mobile-nav',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '(document:keydown.escape)': 'close()' },
  template: `
    <div class="md:hidden">
      <button
        type="button"
        (click)="toggle()"
        [attr.aria-expanded]="open()"
        aria-controls="mobile-nav-menu"
        [attr.aria-label]="open() ? 'Close menu' : 'Open menu'"
        class="fixed right-3 top-3 z-[70] inline-flex h-11 w-11 items-center justify-center rounded-full bg-brand-blue text-white shadow-[0_12px_26px_-12px_rgba(24,42,110,0.85)] transition hover:bg-brand-blue-soft"
      >
        @if (open()) {
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M6 6 18 18 M18 6 6 18" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" />
          </svg>
        } @else {
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M4 7h16 M4 12h16 M4 17h16" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" />
          </svg>
        }
      </button>

      @if (open()) {
        <div
          class="fixed inset-0 z-[60] bg-black/20"
          (click)="close()"
          aria-hidden="true"
        ></div>
        <nav
          id="mobile-nav-menu"
          aria-label="Primary"
          class="fixed right-3 top-16 z-[70] w-60 rounded-2xl bg-paper-soft p-2 shadow-[0_20px_40px_-20px_rgba(24,42,110,0.6)] ring-1 ring-black/10"
        >
          @for (link of links; track link.href) {
            <a
              [href]="link.href"
              (click)="close()"
              class="block rounded-xl px-4 py-3 font-display font-bold no-underline transition"
              [class]="
                link.primary
                  ? 'bg-brand-blue text-white hover:bg-brand-blue-soft'
                  : 'text-ink hover:bg-brand-blue/10 hover:text-brand-blue'
              "
            >
              {{ link.label }}
            </a>
          }
        </nav>
      }
    </div>
  `,
})
export class MobileNav {
  protected readonly open = signal(false);

  protected readonly links: NavLink[] = [
    { href: '#get-involved', label: 'Get Involved', primary: true },
    { href: '#meet', label: 'Meet Lindsey' },
    { href: '#experience', label: 'Experience' },
    { href: '#point-of-view', label: 'Point of View' },
    { href: '#showing-up', label: 'Showing Up' },
    { href: '#priorities', label: 'Priorities' },
  ];

  protected toggle(): void {
    this.open.update((o) => !o);
  }

  protected close(): void {
    this.open.set(false);
  }
}
