// Site footer: brand line, campaign-finance disclaimer, copyright, contact.
// Notebook-paper theme: transparent background, top hairline rule, muted text.
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

          <div class="flex flex-col gap-2">
            <!-- TODO(legal): Confirm the exact SC campaign-finance disclaimer wording required and the registered committee name. SC law may mandate specific "Paid for by ..." text. Verify before publishing. -->
            <p>
              Paid for by
              <span class="font-semibold text-ink">[PLACEHOLDER: campaign committee name]</span>
            </p>

            <p>
              Contact:
              <a
                class="font-semibold text-raspberry-ink underline decoration-raspberry/40 underline-offset-2 hover:decoration-raspberry"
                href="mailto:draugelfordistrict2@gmail.com"
                >draugelfordistrict2&#64;gmail.com</a
              >
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
}
