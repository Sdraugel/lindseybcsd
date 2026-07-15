// Slim sticky desktop header (md+ only). On phones the fixed hamburger
// (app-mobile-nav) is the nav, so this is hidden below md. Height tracks
// --nav-h (4.5rem desktop) so it stays under the 80px cap and matches the
// anchor scroll-margin. Translucent paper so the notebook rules read through.
//
// Left: the campaign logo (links home). Right: text links, all one ink color;
// the link for the section currently in view is highlighted in brand blue via
// an IntersectionObserver scroll-spy (no scroll listeners).
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  afterNextRender,
  inject,
  signal,
} from '@angular/core';

interface NavLink {
  href: string;
  label: string;
}

@Component({
  selector: 'app-site-header',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header
      class="sticky top-0 z-40 hidden h-[var(--nav-h)] border-b border-ink/10 bg-paper/85 backdrop-blur-sm md:block"
    >
      <div class="shell flex h-full items-center justify-between gap-6 py-0">
        <!-- Campaign logo, links home. -->
        <a
          href="#top"
          class="flex shrink-0 items-center no-underline"
          aria-label="Draugel for District 2, back to top"
        >
          <img
            src="img/logo.png"
            alt="Draugel for District 2"
            class="h-14 w-auto"
            decoding="async"
          />
        </a>

        <nav aria-label="Primary" class="flex items-center gap-1 lg:gap-2">
          @for (link of links; track link.href) {
            <a
              [href]="link.href"
              [attr.aria-current]="isActive(link.href) ? 'true' : null"
              class="rounded-full px-2.5 py-2 font-display text-[0.95rem] no-underline transition hover:bg-brand-blue/10 hover:text-brand-blue lg:px-3"
              [class]="
                isActive(link.href)
                  ? 'font-bold text-brand-blue'
                  : 'font-semibold text-ink'
              "
            >
              {{ link.label }}
            </a>
          }
        </nav>
      </div>
    </header>
  `,
})
export class SiteHeader {
  private readonly destroyRef = inject(DestroyRef);

  /** Section links in page/scroll order (matches the section DOM order). */
  protected readonly links: NavLink[] = [
    { href: '#get-involved', label: 'Get Involved' },
    { href: '#shop', label: 'Shop' },
    { href: '#meet', label: 'Meet Lindsey' },
    { href: '#experience', label: 'Experience' },
    { href: '#point-of-view', label: 'Point of View' },
    { href: '#showing-up', label: 'Showing Up' },
    { href: '#priorities', label: 'Priorities' },
  ];

  /** Id of the section currently in view (scroll-spy); '' near the top. */
  private readonly activeId = signal('');

  protected isActive(href: string): boolean {
    return href === '#' + this.activeId();
  }

  constructor() {
    afterNextRender(() => {
      if (typeof IntersectionObserver === 'undefined') return;

      const sections = this.links
        .map((l) => document.getElementById(l.href.slice(1)))
        .filter((el): el is HTMLElement => el != null);

      // Active = the observed section occupying the most of an upper band just
      // under the header (top ~20-35% of the viewport).
      const ratios = new Map<string, number>();
      const observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            ratios.set(
              entry.target.id,
              entry.isIntersecting ? entry.intersectionRatio : 0,
            );
          }
          let bestId = '';
          let bestRatio = 0;
          for (const [id, ratio] of ratios) {
            if (ratio > bestRatio) {
              bestRatio = ratio;
              bestId = id;
            }
          }
          if (bestId !== this.activeId()) this.activeId.set(bestId);
        },
        {
          rootMargin: '-20% 0px -65% 0px',
          threshold: [0, 0.25, 0.5, 0.75, 1],
        },
      );

      sections.forEach((s) => observer.observe(s));
      this.destroyRef.onDestroy(() => observer.disconnect());
    });
  }
}
