// Site footer: brand line, contact email + social, campaign-finance disclaimer,
// copyright. Notebook-paper theme: transparent background, top hairline rule,
// muted text.
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CheckmarkComponent } from '../../shared/checkmark';

@Component({
  selector: 'app-site-footer',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CheckmarkComponent],
  template: `
    <footer class="border-t border-black/10 text-sm text-ink-soft">
      <div class="shell py-10">
        <div class="flex flex-col gap-6">
          <!-- Brand line -->
          <p class="flex items-center gap-2">
            <app-check [size]="22" />
            <span class="bubble text-2xl leading-none">Draugel</span>
            <span class="font-display font-bold text-raspberry-ink">District 2</span>
          </p>

          <!-- Contact + follow -->
          <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-6">
            <p>
              Contact:
              <a
                class="font-semibold text-raspberry-ink underline decoration-raspberry/40 underline-offset-2 hover:decoration-raspberry"
                href="mailto:draugelfordistrict2@gmail.com"
                >draugelfordistrict2&#64;gmail.com</a
              >
            </p>
            <ul class="flex items-center gap-3">
              @for (s of socials; track s.name) {
                <li>
                  <a
                    [href]="s.href"
                    [attr.aria-label]="s.label"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="inline-flex h-9 w-9 items-center justify-center rounded-full bg-brand-blue/10 text-brand-blue transition hover:bg-brand-blue hover:text-white"
                  >
                    @switch (s.name) {
                      @case ('facebook') {
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M13.5 21v-7h2.3l.4-2.8h-2.7V9.4c0-.8.2-1.4 1.4-1.4h1.4V5.5c-.2 0-1.1-.1-2-.1-2 0-3.4 1.2-3.4 3.5v1.9H8.6V14h2.3v7h2.6z"/></svg>
                      }
                    }
                  </a>
                </li>
              }
            </ul>
          </div>

          <div class="flex flex-col gap-2">
            <!-- TODO(legal): Confirm the exact SC campaign-finance disclaimer wording required and the registered committee name. SC law may mandate specific "Paid for by ..." text. Verify before publishing. -->
            <p>
              Paid for by
              <span class="font-semibold text-ink">[PLACEHOLDER: campaign committee name]</span>
            </p>

            <p class="text-ink-soft">
              &copy; {{ year }} Lindsey Draugel for District 2.
            </p>
          </div>
        </div>
      </div>
    </footer>
  `,
})
export class SiteFooter {
  /** Current full year for the copyright line. */
  protected readonly year = new Date().getFullYear();

  /** Social links shown in the footer (only Facebook is live). */
  protected readonly socials = [
    {
      name: 'facebook',
      label: "Follow Lindsey Draugel's campaign on Facebook",
      href: 'https://www.facebook.com/profile.php?id=61567444822559',
    },
  ];
}
