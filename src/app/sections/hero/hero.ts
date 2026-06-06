// Hero section - the campaign's visual centerpiece. Echoes the notebook-paper
// yard sign: a big royal-blue bubble name, raspberry sub-headline, and the
// signature hand-drawn checkbox lines, with primary/secondary CTAs. On large
// screens a headshot fills the right column; below lg it stays text-forward
// (like the sign) so phones and tablets read cleanly.
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
      <div
        class="grid items-center gap-10 lg:grid-cols-[1.15fr_minmax(0,22rem)] lg:gap-14 xl:gap-20"
      >
        <div appReveal class="max-w-2xl">
          <h1
            class="bubble text-5xl sm:text-6xl md:text-7xl xl:text-8xl leading-[1.05]"
          >
            LINDSEY DRAUGEL
          </h1>

          <p
            class="mt-5 font-display text-raspberry-ink text-xl md:text-2xl font-semibold"
          >
            For School Board · District 2
          </p>

          <ul class="mt-8 space-y-3">
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

        <!-- PHOTO: Lindsey headshot (swap src to replace; optimized copies in public/img/).
             Shown only on large screens so the mobile/tablet hero stays text-forward. -->
        <div appReveal [appReveal]="140" class="hidden lg:block">
          <figure class="paper-card rotate-2 p-3">
            <div class="aspect-[4/5] overflow-hidden rounded-xl">
              <img
                src="img/lindsey-headshot.jpg"
                alt="Lindsey Draugel"
                decoding="async"
                class="h-full w-full object-cover object-center"
              />
            </div>
          </figure>
        </div>
      </div>
    </section>
  `,
})
export class Hero {}
