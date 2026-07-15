/**
 * Get Involved / Donate section.
 *
 * Two cards side by side: "Chip In" (Anedot donations) and an "Upcoming Events"
 * card that embeds the campaign Google Calendar (read-only). Contact details
 * (email + social) live in the site footer.
 *
 * Online giving runs through Anedot. The account is gated behind ANEDOT_URL:
 * while it is empty the donation UI shows an "opening soon" state. Paste the
 * hosted donation-page "Share URL" into ANEDOT_URL to go live (pre-fill
 * amount/frequency via ?amount=100&frequency=monthly).
 */
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

import { RouterLink } from '@angular/router';

import { RevealDirective } from '../../shared/reveal.directive';
import { ButtonDirective } from '../../shared/button.directive';

/** Public Google Calendar ID (must be a public calendar to embed). */
const CALENDAR_ID = 'draugelfordistrict2@gmail.com';

/**
 * Live Anedot hosted donation-page URL. EMPTY = donations not open yet (the UI
 * shows an "opening soon" state). The chosen amount (whole dollars) and monthly
 * frequency are appended as Anedot URL parameters (?amount=100&frequency=monthly).
 *
 * NOTE: as of go-live this page was still pending Anedot verification/approval
 * and 404s until that clears; it starts working automatically once Anedot
 * publishes the page (no code change needed).
 */
const ANEDOT_URL = 'https://secure.anedot.com/draugel-for-bcsd-2/donate';

/** Suggested one-tap contribution amounts, in whole dollars. */
const PRESET_AMOUNTS = [25, 50, 100, 250] as const;

type Frequency = 'once' | 'monthly';

@Component({
  selector: 'app-contact',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RevealDirective, ButtonDirective, RouterLink],
  template: `
    <section id="get-involved" class="shell py-12 md:py-20">
      <div appReveal>
        <h2 class="bubble text-4xl md:text-5xl">Get Involved</h2>
        <p class="mt-4 text-lg text-ink">
          Grassroots campaigns run on grassroots support. Chip in to help us
          reach every voter in District 2 - every dollar goes straight to signs,
          mailers, and getting Lindsey's message out. Want to volunteer, host a
          yard sign, or just stay in the loop? We'd love to hear from you.
        </p>
        <div class="mt-6">
          <a appButton variant="secondary" size="md" routerLink="/shop">
            Shop the merch store
          </a>
        </div>
      </div>

      <div class="mt-10 grid gap-8 lg:grid-cols-2">
        <!-- Donation card -->
        <div appReveal [appReveal]="80" class="paper-card p-6 md:p-8">
          <div class="flex flex-wrap items-center gap-3">
            <h3 class="bubble text-2xl">Chip In</h3>
            @if (!donationsOpen()) {
              <span
                class="inline-flex items-center rounded-full bg-raspberry-soft px-3 py-1 text-xs font-display font-bold uppercase tracking-wide text-raspberry-ink"
              >
                Opening soon
              </span>
            }
          </div>
          <p class="mt-3 text-ink">
            Make a one-time gift or pitch in monthly. Choose an amount to get
            started.
          </p>

          <!-- Frequency: one-time vs monthly -->
          <div
            class="mt-6 inline-flex rounded-full bg-brand-blue/10 p-1"
            role="group"
            aria-label="Donation frequency"
          >
            <button
              type="button"
              class="rounded-full px-4 py-2 text-sm font-display font-bold transition"
              [class]="freqClass(frequency() === 'once')"
              [attr.aria-pressed]="frequency() === 'once'"
              (click)="frequency.set('once')"
            >
              One-time
            </button>
            <button
              type="button"
              class="rounded-full px-4 py-2 text-sm font-display font-bold transition"
              [class]="freqClass(frequency() === 'monthly')"
              [attr.aria-pressed]="frequency() === 'monthly'"
              (click)="frequency.set('monthly')"
            >
              Monthly
            </button>
          </div>

          <!-- Suggested amounts -->
          <div
            class="mt-5 flex flex-wrap gap-2.5"
            role="group"
            aria-label="Donation amount"
          >
            @for (amt of presets; track amt) {
              <button
                type="button"
                [class]="chipClass(selected() === amt)"
                [attr.aria-pressed]="selected() === amt"
                (click)="selectPreset(amt)"
              >
                {{ '$' + amt }}{{ frequency() === 'monthly' ? '/mo' : '' }}
              </button>
            }
            <button
              type="button"
              [class]="chipClass(selected() === 'other')"
              [attr.aria-pressed]="selected() === 'other'"
              (click)="selectOther()"
            >
              Other
            </button>
          </div>

          <!-- Custom amount (only when "Other" is chosen) -->
          @if (selected() === 'other') {
            <div class="mt-4 max-w-[14rem]">
              <label class="field-label" for="custom-amount">Other amount</label>
              <div class="relative mt-1.5">
                <span
                  class="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 font-display font-bold text-ink-soft"
                  aria-hidden="true"
                  >$</span
                >
                <input
                  class="field pl-7"
                  id="custom-amount"
                  type="number"
                  inputmode="numeric"
                  min="1"
                  step="1"
                  placeholder="50"
                  [value]="customAmount()"
                  (input)="setCustom($event)"
                />
              </div>
            </div>
          }

          <!-- Donate CTA -->
          <div class="mt-7">
            @if (canDonate()) {
              <a
                appButton
                [href]="donateHref()"
                target="_blank"
                rel="noopener noreferrer"
              >
                Donate {{ amountLabel()
                }}{{ frequency() === 'monthly' ? '/mo' : '' }}
              </a>
            } @else {
              <button appButton type="button" disabled>
                @if (donationsOpen()) {
                  Enter an amount
                } @else {
                  Donate {{ amountLabel() }}
                }
              </button>
            }
          </div>

          @if (donationsOpen()) {
            <p class="mt-4 flex items-center gap-2 text-sm text-ink-soft">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
              >
                <rect
                  x="5"
                  y="11"
                  width="14"
                  height="9"
                  rx="2"
                  stroke="currentColor"
                  stroke-width="2"
                />
                <path
                  d="M8 11V8a4 4 0 0 1 8 0v3"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                />
              </svg>
              Secure giving, processed by Anedot.
            </p>
          }

          <!--
            TODO(legal): A campaign-finance contribution disclaimer likely
            belongs here once giving is live (e.g. "Contributions are not tax
            deductible.", applicable SC contribution limits, and the
            employer/occupation notice for larger gifts). Confirm wording with
            the committee's compliance contact, then add a <p> below.
          -->
        </div>

        <!-- Upcoming events (read-only Google Calendar embed) -->
        <aside appReveal [appReveal]="160" class="paper-card p-6 md:p-8">
          <h3 class="bubble text-2xl">Upcoming Events</h3>
          <p class="mt-3 text-ink">
            Come say hello. Events are posted here as they're scheduled.
          </p>
          @if (calendarUrl) {
            <div class="mt-4 overflow-hidden rounded-xl ring-1 ring-black/5">
              <iframe
                [src]="calendarUrl"
                title="Lindsey Draugel campaign events calendar"
                class="block h-72 w-full border-0"
                loading="lazy"
              ></iframe>
            </div>
          } @else {
            <p
              class="mt-4 rounded-xl bg-paper px-4 py-8 text-center text-sm text-ink-soft"
            >
              Events are coming soon.
            </p>
          }
        </aside>
      </div>
    </section>
  `,
})
export class Contact {
  private readonly sanitizer = inject(DomSanitizer);

  /** Read-only Google Calendar embed (agenda view), or null when unset. */
  protected readonly calendarUrl: SafeResourceUrl | null = CALENDAR_ID
    ? this.sanitizer.bypassSecurityTrustResourceUrl(
        'https://calendar.google.com/calendar/embed?src=' +
          encodeURIComponent(CALENDAR_ID) +
          '&ctz=America%2FNew_York&mode=AGENDA' +
          '&showTitle=0&showPrint=0&showTabs=0&showCalendars=0&showTz=0&bgcolor=%23FBFAF3',
      )
    : null;

  /** Suggested contribution amounts (whole dollars). */
  protected readonly presets = PRESET_AMOUNTS;

  /** Currently selected amount: a preset (dollars) or 'other' (custom input). */
  protected readonly selected = signal<number | 'other'>(50);

  /** Raw value of the custom amount input (string straight from the field). */
  protected readonly customAmount = signal('');

  /** One-time vs. recurring monthly gift. */
  protected readonly frequency = signal<Frequency>('once');

  /** Whether online giving is live. False until ANEDOT_URL is filled in. */
  protected readonly donationsOpen = computed(() => ANEDOT_URL.length > 0);

  /** The resolved contribution amount in whole dollars (0 = not valid yet). */
  protected readonly effectiveAmount = computed<number>(() => {
    const sel = this.selected();
    if (sel !== 'other') return sel;
    const n = Math.floor(Number(this.customAmount()));
    return Number.isFinite(n) && n > 0 ? n : 0;
  });

  /** "$50" style label for the chosen amount, or '' when none is valid. */
  protected readonly amountLabel = computed(() => {
    const amount = this.effectiveAmount();
    return amount > 0 ? `$${amount}` : '';
  });

  /** Giving is live AND we have a valid amount to send. */
  protected readonly canDonate = computed(
    () => this.donationsOpen() && this.effectiveAmount() > 0,
  );

  /**
   * Anedot hosted-page URL with the chosen amount + frequency pre-filled.
   * Null while donations are closed (ANEDOT_URL empty).
   */
  protected readonly donateHref = computed<string | null>(() => {
    if (!ANEDOT_URL) return null;
    const url = new URL(ANEDOT_URL);
    const amount = this.effectiveAmount();
    if (amount > 0) url.searchParams.set('amount', String(amount));
    if (this.frequency() === 'monthly') {
      url.searchParams.set('frequency', 'monthly');
    }
    return url.toString();
  });

  protected selectPreset(amount: number): void {
    this.selected.set(amount);
  }

  protected selectOther(): void {
    this.selected.set('other');
  }

  protected setCustom(event: Event): void {
    this.customAmount.set((event.target as HTMLInputElement).value);
  }

  /** Classes for an amount chip (filled when active, tinted outline otherwise). */
  protected chipClass(active: boolean): string {
    return [
      'font-display font-bold rounded-full px-4 py-2.5 text-base cursor-pointer transition',
      active
        ? 'bg-brand-blue text-white shadow-[0_10px_22px_-12px_rgba(24,42,110,0.75)]'
        : 'bg-brand-blue/10 text-brand-blue ring-1 ring-inset ring-brand-blue/25 hover:bg-brand-blue/20',
    ].join(' ');
  }

  /** Classes for a frequency toggle (segmented control pill). */
  protected freqClass(active: boolean): string {
    return active
      ? 'bg-paper-soft text-brand-blue shadow-[0_2px_8px_-4px_rgba(24,42,110,0.5)]'
      : 'text-brand-blue/80 hover:text-brand-blue';
  }
}
