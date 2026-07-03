// Hero section - the campaign's visual centerpiece. Asymmetric split: the
// royal-blue bubble name, raspberry tagline, and signature checkbox callouts on
// one side; the candidate headshot (the page's primary visual anchor) framed
// like a scrapbook photo on the other. Stacks to a single column on phones.
// Full section nav lives in the sticky header (desktop) and hamburger (mobile),
// so the hero keeps a focused primary + secondary CTA on every size.
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RevealDirective } from '../../shared/reveal.directive';
import { CheckmarkComponent } from '../../shared/checkmark';

@Component({
  selector: 'app-hero',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RevealDirective, CheckmarkComponent],
  template: `
    <section id="top" class="shell pt-6 pb-12 md:pt-10 md:pb-16">
      <div
        class="grid items-center gap-8 md:grid-cols-[1.15fr_0.85fr] md:gap-12"
      >
        <!-- Message column -->
        <div class="text-center md:text-left">
          <!-- Name + tagline share a shrink-to-fit box so the tagline can be
               justified across the exact width of DRAUGEL at any screen size. -->
          <div appReveal class="inline-block">
            <h1 class="bubble text-[clamp(4rem,12vw,7rem)] leading-[1]">
              DRAUGEL
            </h1>
            <p
              class="mt-[-1vw] font-display font-semibold text-raspberry-ink text-[clamp(1.3rem,5vw,2.1rem)] text-justify [text-align-last:justify]"
            >
              For School Board · District 2
            </p>
          </div>

          <ul
            appReveal
            [appReveal]="120"
            class="mt-7 flex flex-wrap items-center justify-center gap-x-2 gap-y-2 sm:gap-x-10 md:justify-start"
          >
            <li class="flex items-center gap-1 sm:gap-3">
              <app-check class="sm:hidden" [size]="20" [strokeWidth]="3.8" />
              <app-check
                class="hidden sm:inline-block"
                [size]="44"
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
                [size]="44"
                [strokeWidth]="3.2"
              />
              <span class="callout text-sm sm:text-2xl md:text-3xl"
                >For our teachers.</span
              >
            </li>
          </ul>
        </div>

        <!-- Visual anchor: candidate headshot (eager-loaded as the LCP image). -->
        <div
          appReveal
          [appReveal]="160"
          class="mx-auto w-full max-w-[15rem] sm:max-w-[19rem] md:max-w-none"
        >
          <figure class="paper-card rotate-1 p-2 md:p-3">
            <div class="aspect-[4/5] overflow-hidden rounded-lg md:rounded-xl">
              <img
                src="img/lindsey-headshot.jpg"
                alt="Lindsey Draugel"
                fetchpriority="high"
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
