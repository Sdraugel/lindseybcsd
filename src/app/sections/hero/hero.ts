// Hero section - the campaign's visual centerpiece. Echoes the notebook-paper
// yard sign: a big royal-blue bubble name, raspberry sub-headline, and the
// signature hand-drawn checkbox lines, with primary/secondary CTAs.
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
      <div appReveal class="max-w-3xl">
        <h1
          class="bubble text-5xl sm:text-6xl md:text-7xl lg:text-8xl leading-[1.05]"
        >
          LINDSEY DRAUGEL
        </h1>

        <p
          class="mt-5 font-display text-raspberry text-xl md:text-2xl font-semibold"
        >
          For School Board · District 2
        </p>

        <ul class="mt-8 space-y-3">
          <li class="flex items-center gap-3">
            <app-check [size]="40" />
            <span class="callout text-2xl md:text-3xl">For our students.</span>
          </li>
          <li class="flex items-center gap-3">
            <app-check [size]="40" />
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
