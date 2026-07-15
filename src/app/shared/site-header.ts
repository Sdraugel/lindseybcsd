// Slim sticky desktop header (md+ only). On phones the fixed hamburger
// (app-mobile-nav) is the nav, so this is hidden below md. Height tracks
// --nav-h (4.5rem desktop) so it stays under the 80px cap and matches the
// anchor scroll-margin. Translucent paper so the notebook rules read through.
//
// Left: the campaign logo (links home). Right: nav links. Home-section links
// route to '/' with a fragment so they work from the /shop page too; the "Shop"
// link routes to /shop and is highlighted by routerLinkActive. On the home page
// the in-view section is highlighted by an IntersectionObserver scroll-spy,
// rebuilt on navigation so it re-attaches to the home sections after a /shop
// visit recreates their DOM.
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  afterNextRender,
  inject,
  signal,
} from '@angular/core';
import {
  NavigationEnd,
  Router,
  RouterLink,
  RouterLinkActive,
} from '@angular/router';

interface NavLink {
  label: string;
  /** Home-page section id (link routes to '/' with this fragment). */
  fragment?: string;
  /** Explicit route path, e.g. '/shop'. */
  route?: string;
}

@Component({
  selector: 'app-site-header',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <header
      class="sticky top-0 z-40 hidden h-[var(--nav-h)] border-b border-ink/10 bg-paper/85 backdrop-blur-sm md:block"
    >
      <div class="shell flex h-full items-center justify-between gap-6 py-0">
        <!-- Campaign logo, links home. -->
        <a
          [routerLink]="['/']"
          fragment="top"
          class="flex shrink-0 items-center no-underline"
          aria-label="Draugel for District 2, home"
        >
          <img
            src="img/logo.png"
            alt="Draugel for District 2"
            class="h-14 w-auto"
            decoding="async"
          />
        </a>

        <nav aria-label="Primary" class="flex items-center gap-1 lg:gap-2">
          @for (link of links; track link.label) {
            @if (link.route) {
              <a
                [routerLink]="link.route"
                routerLinkActive
                #rla="routerLinkActive"
                [attr.aria-current]="rla.isActive ? 'page' : null"
                class="rounded-full px-2.5 py-2 font-display text-[0.95rem] no-underline transition hover:bg-brand-blue/10 hover:text-brand-blue lg:px-3"
                [class]="
                  rla.isActive
                    ? 'font-bold text-brand-blue'
                    : 'font-semibold text-ink'
                "
              >
                {{ link.label }}
              </a>
            } @else {
              <a
                [routerLink]="['/']"
                [fragment]="link.fragment"
                [attr.aria-current]="isActive(link.fragment!) ? 'true' : null"
                class="rounded-full px-2.5 py-2 font-display text-[0.95rem] no-underline transition hover:bg-brand-blue/10 hover:text-brand-blue lg:px-3"
                [class]="
                  isActive(link.fragment!)
                    ? 'font-bold text-brand-blue'
                    : 'font-semibold text-ink'
                "
              >
                {{ link.label }}
              </a>
            }
          }
        </nav>
      </div>
    </header>
  `,
})
export class SiteHeader {
  private readonly destroyRef = inject(DestroyRef);
  private readonly router = inject(Router);

  /** Nav links in page/scroll order. `fragment` = home section; `route` = own page. */
  protected readonly links: NavLink[] = [
    { label: 'Get Involved', fragment: 'get-involved' },
    { label: 'Shop', route: '/shop' },
    { label: 'Meet Lindsey', fragment: 'meet' },
    { label: 'Experience', fragment: 'experience' },
    { label: 'Point of View', fragment: 'point-of-view' },
    { label: 'Showing Up', fragment: 'showing-up' },
    { label: 'Priorities', fragment: 'priorities' },
  ];

  /** Id of the home section currently in view (scroll-spy); '' near the top. */
  private readonly activeId = signal('');

  /** Active scroll-spy observer over the home sections (browser only). */
  private observer?: IntersectionObserver;

  protected isActive(fragment: string): boolean {
    return fragment === this.activeId();
  }

  constructor() {
    afterNextRender(() => {
      this.setupSpy();
      // Rebuild the spy after each navigation so it re-attaches to the home
      // sections when returning from /shop (their DOM nodes are recreated).
      const sub = this.router.events.subscribe((e) => {
        if (e instanceof NavigationEnd) setTimeout(() => this.setupSpy(), 0);
      });
      this.destroyRef.onDestroy(() => {
        sub.unsubscribe();
        this.observer?.disconnect();
      });
    });
  }

  /** (Re)build the scroll-spy over whatever home sections are in the DOM now. */
  private setupSpy(): void {
    this.observer?.disconnect();
    this.observer = undefined;
    if (typeof IntersectionObserver === 'undefined') return;

    const sections = this.links
      .filter((l) => l.fragment)
      .map((l) => document.getElementById(l.fragment!))
      .filter((el): el is HTMLElement => el != null);

    if (!sections.length) {
      this.activeId.set('');
      return;
    }

    // Active = the observed section occupying the most of an upper band just
    // under the header (top ~20-35% of the viewport).
    const ratios = new Map<string, number>();
    this.observer = new IntersectionObserver(
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

    sections.forEach((s) => this.observer!.observe(s));
  }
}
