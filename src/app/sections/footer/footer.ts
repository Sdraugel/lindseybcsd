// Site footer: brand line, contact email + social, campaign-finance disclaimer,
// copyright. Notebook-paper theme: transparent background, top hairline rule,
// muted text.
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-site-footer',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  template: `
    <footer class="border-t border-black/10 text-sm text-ink-soft">
      <div class="shell py-10">
        <div class="flex flex-col gap-6">
          <!-- Brand line -->
          <p class="flex items-center gap-2">
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
                    class="inline-flex text-[#1877F2] transition hover:opacity-80"
                  >
                    @switch (s.name) {
                      @case ('facebook') {
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
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
