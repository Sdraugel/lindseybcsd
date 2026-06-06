/**
 * Get Involved / Donate section.
 *
 * Online giving runs through Anedot (https://anedot.com). The committee's
 * Anedot account is not finished yet, so everything below is BUILT AND READY
 * but gated behind a single constant:
 *
 *   ┌──────────────────────────────────────────────────────────────────────┐
 *   │  TODO(anedot): paste the live hosted donation-page "Share URL" into    │
 *   │  ANEDOT_URL below (e.g. 'https://secure.anedot.com/<committee>/donate').│
 *   │  The moment it is non-empty, the amount tiles go live and the Donate   │
 *   │  button links out (new tab) with the chosen amount + frequency         │
 *   │  pre-filled. Until then the UI shows a friendly "opening soon" state   │
 *   │  with an email fallback, so nothing links to a broken page.            │
 *   └──────────────────────────────────────────────────────────────────────┘
 *
 * Pre-fill via Anedot URL parameters (confirmed in Anedot's docs):
 *   ?amount=100          whole dollars, no cents
 *   &frequency=monthly   recurring commitment
 * Docs: https://help.anedot.com/knowledge/url-parameter
 *
 * Prefer an on-page form instead of linking out? Anedot also offers an iframe
 * "Embed Code". Drop that <iframe> in place of the amount tiles + Donate button
 * (Anedot recommends the hosted Share URL over the iframe, which is why the
 * link-out approach is wired up here).
 */
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  signal,
} from '@angular/core';

import { RevealDirective } from '../../shared/reveal.directive';
import { ButtonDirective } from '../../shared/button.directive';

const CONTACT_EMAIL = 'draugelfordistrict2@gmail.com';

/**
 * Live Anedot hosted donation-page URL. EMPTY = donations not open yet (the UI
 * shows an "opening soon" state). See the TODO(anedot) block at the top of this
 * file. Example once ready: 'https://secure.anedot.com/draugel-d2/donate'
 */
const ANEDOT_URL = '';

/** Suggested one-tap contribution amounts, in whole dollars. */
const PRESET_AMOUNTS = [25, 50, 100, 250] as const;

type Frequency = 'once' | 'monthly';

@Component({
  selector: 'app-contact',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RevealDirective, ButtonDirective],
  template: `
    <section id="get-involved" class="shell py-10 md:py-14">
      <div appReveal>
        <p class="eyebrow">Join us</p>
        <h2 class="bubble text-4xl md:text-5xl">Get Involved</h2>
        <p class="mt-4 text-lg text-ink">
          Grassroots campaigns run on grassroots support. Chip in to help us
          reach every voter in District 2 - every dollar goes straight to
          signs, mailers, and getting Lindsey's message out.
        </p>
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

          @if (!donationsOpen()) {
            <p class="mt-4 text-sm text-ink-soft">
              Secure online giving is opening soon. To contribute today, email
              us at
              <a
                class="font-display font-bold text-brand-blue underline decoration-2 underline-offset-2 hover:text-brand-blue-soft break-words"
                [href]="'mailto:' + email"
                >{{ email }}</a
              >.
            </p>
          } @else {
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

        <!-- Contact details + socials -->
        <aside appReveal [appReveal]="160" class="paper-card p-6 md:p-8">
          <h3 class="bubble text-2xl">Reach Us Directly</h3>
          <p class="mt-3 text-ink">
            Want to volunteer, host a yard sign, or just stay in the loop? Email
            us anytime - we'd love to hear from you.
          </p>
          <p class="mt-2">
            <a
              class="font-display font-bold text-brand-blue underline decoration-2 underline-offset-2 hover:text-brand-blue-soft break-words"
              [href]="'mailto:' + email"
              >{{ email }}</a
            >
          </p>

          <h3 class="bubble text-xl mt-8">Follow Along</h3>
          <!-- TODO(social): only Facebook is wired up. Add Instagram / others here when their URLs exist. -->
          <ul class="mt-3 flex flex-wrap gap-3">
            @for (s of socials; track s.name) {
              <li>
                <a
                  [href]="s.href"
                  [attr.aria-label]="s.label"
                  [attr.target]="s.external ? '_blank' : null"
                  [attr.rel]="s.external ? 'noopener noreferrer' : null"
                  class="inline-flex h-11 w-11 items-center justify-center rounded-full bg-brand-blue/10 text-brand-blue transition hover:bg-brand-blue hover:text-white"
                >
                  @switch (s.name) {
                    @case ('facebook') {
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M13.5 21v-7h2.3l.4-2.8h-2.7V9.4c0-.8.2-1.4 1.4-1.4h1.4V5.5c-.2 0-1.1-.1-2-.1-2 0-3.4 1.2-3.4 3.5v1.9H8.6V14h2.3v7h2.6z"/></svg>
                    }
                  }
                </a>
              </li>
            }
          </ul>
        </aside>
      </div>
    </section>
  `,
})
export class Contact {
  /** Visible contact email address. */
  protected readonly email = CONTACT_EMAIL;

  /** Suggested contribution amounts (whole dollars). */
  protected readonly presets = PRESET_AMOUNTS;

  /** Currently selected amount: a preset (dollars) or 'other' (custom input). */
  protected readonly selected = signal<number | 'other'>(50);

  /** Raw value of the custom amount input (string straight from the field). */
  protected readonly customAmount = signal('');

  /** One-time vs. recurring monthly gift. */
  protected readonly frequency = signal<Frequency>('once');

  /**
   * Whether online giving is live. False until ANEDOT_URL is filled in - see
   * the TODO(anedot) block at the top of this file.
   */
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

  /**
   * Social links. Only Facebook (the live campaign page) is shown. To add
   * Instagram or others, push another entry with name/label/href/external and
   * add a matching @case SVG in the template above.
   */
  protected readonly socials = [
    {
      name: 'facebook',
      label: "Follow Lindsey Draugel's campaign on Facebook",
      href: 'https://www.facebook.com/profile.php?id=61567444822559',
      external: true,
    },
  ];

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
