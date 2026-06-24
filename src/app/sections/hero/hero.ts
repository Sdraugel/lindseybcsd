// Hero section - the campaign's visual centerpiece, echoing the notebook-paper
// yard sign: a big royal-blue bubble name, raspberry sub-headline, and the
// signature hand-drawn checkbox lines. Full-width, centered, and text-forward on
// every size; the headline scales fluidly with the viewport. (The headshot lives
// in the Meet Lindsey section.)
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RevealDirective } from '../../shared/reveal.directive';
import { CheckmarkComponent } from '../../shared/checkmark';
import { ButtonDirective } from '../../shared/button.directive';

@Component({
  selector: 'app-hero',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RevealDirective, CheckmarkComponent, ButtonDirective],
  template: `
    <section id="top" class="shell pt-12 md:pt-16 pb-10 md:pb-14">
      <div appReveal class="text-center">
        <!-- Name + tagline share a shrink-to-fit box so the tagline can be
             justified across the exact width of DRAUGEL at any screen size. -->
        <div class="inline-block">
          <h1 class="bubble text-[clamp(4.5rem,14vw,8rem)] leading-[1]">
            DRAUGEL
          </h1>
          <p
            class="mt-[-1vw] font-display font-semibold text-raspberry-ink text-[clamp(1.4rem,5.7vw,2.4rem)] text-justify [text-align-last:justify]"
          >
            For School Board · District 2
          </p>
        </div>

        <ul
          class="mt-8 flex flex-wrap items-center justify-center gap-x-2 gap-y-2 sm:gap-x-12"
        >
          <li class="flex items-center gap-1 sm:gap-3">
            <app-check class="sm:hidden" [size]="20" [strokeWidth]="3.8" />
            <app-check
              class="hidden sm:inline-block"
              [size]="48"
              [strokeWidth]="3.2"
            />
            <span class="callout text-sm sm:text-2xl md:text-3xl"
              >For our students.</span
            >
          </li>
          <li class="flex items-center gap-1 sm:gap-3">
            <app-check class="sm:hidden" [size]="20" [strokeWidth]="3.8" />
            <app-check
              class="hidden sm:inline-block"
              [size]="48"
              [strokeWidth]="3.2"
            />
            <span class="callout text-sm sm:text-2xl md:text-3xl"
              >For our teachers.</span
            >
          </li>
        </ul>

        <div
          class="mt-10 hidden flex-wrap justify-center gap-3 sm:gap-4 md:flex"
        >
          <a appButton href="#get-involved">Get Involved</a>
          <a appButton variant="ghost" href="#meet">Meet Lindsey</a>
          <a appButton variant="ghost" href="#experience">Experience</a>
          <a appButton variant="ghost" href="#point-of-view">Point of View</a>
          <a appButton variant="ghost" href="#showing-up">Showing Up</a>
          <a appButton variant="ghost" href="#priorities">Priorities</a>
        </div>
      </div>
    </section>
  `,
})
export class Hero {}
