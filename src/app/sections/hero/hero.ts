// Hero section - the campaign's visual centerpiece, echoing the notebook-paper
// yard sign: a big royal-blue bubble name, raspberry sub-headline, and the
// signature hand-drawn checkbox lines. Full-width and text-forward on every
// size; the headline scales fluidly with the viewport. (The headshot lives in
// the Meet Lindsey section.)
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RevealDirective } from '../../shared/reveal.directive';
import { CheckmarkComponent } from '../../shared/checkmark';
import { ButtonDirective } from '../../shared/button.directive';

@Component({
  selector: 'app-hero',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RevealDirective, CheckmarkComponent, ButtonDirective],
  template: `
    <section id="top" class="shell pt-28 md:pt-36 pb-16 md:pb-24">
      <div appReveal>
        <h1 class="bubble text-[clamp(3rem,9vw,8rem)] leading-[1.02]">
          LINDSEY DRAUGEL
        </h1>

        <p
          class="mt-6 font-display text-raspberry-ink text-xl sm:text-2xl md:text-3xl font-semibold"
        >
          For School Board · District 2
        </p>

        <ul
          class="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-12"
        >
          <li class="flex items-center gap-3">
            <app-check [size]="48" [strokeWidth]="3.2" />
            <span class="callout text-2xl md:text-3xl">For our students.</span>
          </li>
          <li class="flex items-center gap-3">
            <app-check [size]="48" [strokeWidth]="3.2" />
            <span class="callout text-2xl md:text-3xl">For our teachers.</span>
          </li>
        </ul>

        <div class="mt-10 flex flex-wrap gap-4">
          <a appButton href="#get-involved">Get Involved</a>
          <a appButton variant="ghost" href="#meet">Meet Lindsey</a>
        </div>
      </div>
    </section>
  `,
})
export class Hero {}
