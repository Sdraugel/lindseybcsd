// Experience / Background section: vertical timeline of Lindsey's career and
// community service, each step accented with the hand-drawn checkbox motif.
// Zoneless + OnPush; inline template; scroll-reveal with a small stagger.
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RevealDirective } from '../../shared/reveal.directive';
import { CheckmarkComponent } from '../../shared/checkmark';

@Component({
  selector: 'app-experience',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RevealDirective, CheckmarkComponent],
  template: `
    <section id="experience" class="shell py-10 md:py-14">
      <div appReveal class="max-w-2xl">
        <p class="eyebrow">Experience</p>
        <h2 class="bubble text-4xl md:text-5xl">Experience &amp; Background</h2>
      </div>

      <ul class="mt-12 md:mt-16 grid gap-5 md:gap-6 lg:grid-cols-2">
        @for (item of items; track item.html; let i = $index) {
          <li
            appReveal
            [appReveal]="i * 80"
            class="paper-card flex items-start gap-4 p-5 md:p-6"
          >
            <span class="shrink-0 mt-0.5" aria-hidden="true">
              <app-check [size]="34" />
            </span>
            <p
              class="text-ink leading-relaxed text-base md:text-lg [&_strong]:text-brand-blue"
              [innerHTML]="item.html"
            ></p>
          </li>
        }
      </ul>
    </section>
  `,
})
export class Experience {
  protected readonly items = [
    {
      html:
        '<strong>20+ years in early childhood education &amp; care</strong>: started as a teacher across every age group (6 weeks to preK).',
    },
    {
      html:
        '<strong>Assistant Director</strong> at Trident Kids Academy and Coastal Kids Academy.',
    },
    {
      html:
        "<strong>Built &amp; ran the preschool program</strong> at Cainhoy Children's Academy (2019 to 2022). Won Charleston's Choice Award for Childcare/Daycare in <strong>2020 and 2021</strong>.",
    },
    {
      html:
        '<strong>PSE PTA:</strong> 4 years volunteering; 3 years (going on 4th) on the board: Teacher Appreciation co-chair (2 yrs), Events chair + Teacher Appreciation committee (1 yr), Events chair again next year.',
    },
    {
      html:
        '<strong>Currently:</strong> Administrative Assistant at Happy Hearts Therapy.',
    },
  ];
}
