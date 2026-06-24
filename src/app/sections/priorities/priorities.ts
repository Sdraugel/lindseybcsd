// Priorities / Issues section - four equal-height "what I'll fight for" cards
// on the notebook-paper surface, each led by the hand-drawn checkbox motif.
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RevealDirective } from '../../shared/reveal.directive';
import { CheckmarkComponent } from '../../shared/checkmark';

@Component({
  selector: 'app-priorities',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RevealDirective, CheckmarkComponent],
  template: `
    <section id="priorities" class="shell py-10 md:py-14">
      <div appReveal class="max-w-2xl">
        <h2 class="bubble text-4xl md:text-5xl">What I'll Fight For</h2>
      </div>

      <ul
        class="mt-10 md:mt-14 grid grid-cols-2 gap-4 sm:gap-6 md:gap-8 items-stretch list-none p-0"
      >
        @for (card of cards; track card.heading; let i = $index) {
          <li appReveal [appReveal]="i * 90" class="h-full">
            <article class="paper-card h-full p-3 sm:p-4 md:p-6 flex flex-col">
              <div class="flex items-start gap-2">
                <app-check [size]="24" class="shrink-0" />
                <h3
                  class="font-display leading-tight text-brand-blue text-sm sm:text-base md:text-xl"
                >
                  {{ card.heading }}
                </h3>
              </div>
              <p class="mt-1.5 text-xs leading-snug sm:text-sm sm:leading-normal text-ink">
                {{ card.body }}
              </p>
            </article>
          </li>
        }
      </ul>
    </section>
  `,
})
export class Priorities {
  protected readonly cards = [
    {
      heading: 'Teacher Support',
      body: 'Improve working conditions, fill vacancies, and ensure teachers have the resources and classroom support they need to stay and thrive.',
    },
    {
      heading: 'Curriculum & Assessment Reform',
      body: 'Partner with curriculum and academic departments to rework pacing guides, reduce over-reliance on standardized assessments, and limit screen time in early elementary grades.',
    },
    {
      heading: 'Intervention & Student Support',
      body: 'Restore reading and math interventionists and promote Social Emotional Learning at every level, starting in lower elementary.',
    },
    {
      heading: 'Parent Education & Communication',
      body: "Ensure families receive clear, transparent communication so they can be informed and empowered partners in their child's education.",
    },
  ];
}
