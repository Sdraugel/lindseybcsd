// Experience and Point of View: two real 2-column sections (text + image),
// matching the Meet Lindsey / As a Mom layout. OnPush, zoneless.
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RevealDirective } from '../../shared/reveal.directive';

@Component({
  selector: 'app-experience',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RevealDirective],
  template: `
    <!-- Experience -->
    <section id="experience" class="shell py-10 md:py-14">
      <div
        class="grid grid-cols-[minmax(0,1fr)_7rem] items-start gap-4 sm:grid-cols-[minmax(0,1fr)_11rem] sm:gap-6 md:grid-cols-[minmax(0,1fr)_20rem] md:gap-10"
      >
        <div appReveal>
          <p class="eyebrow">Background</p>
          <h2 class="bubble text-4xl md:text-5xl">Experience</h2>
          <p class="mt-5 max-w-prose font-body text-ink">
            With a background of over 20 years in childcare that started as a
            teacher in a classroom, to building and running a highly successful
            preschool program from the ground up, my experience has proven that
            developmentally appropriate practices work towards a student's
            success. I know what it looks like when a school environment works
            for kids, and I have seen what it looks like when it does not.
          </p>
        </div>

        <!-- PHOTO: add an experience photo here (replace the placeholder with an
             <img src="img/..."> like the other sections). -->
        <div appReveal [appReveal]="120">
          <figure class="paper-card rotate-1 p-2 md:p-3">
            <div
              class="flex aspect-[4/5] items-center justify-center rounded-lg border-2 border-dashed border-ink-soft/30 bg-paper/50 md:rounded-xl"
            >
              <span
                class="px-2 text-center font-display text-xs text-ink-soft md:text-sm"
              >
                Photo coming soon
              </span>
            </div>
          </figure>
        </div>
      </div>
    </section>

    <!-- Point of View -->
    <section id="point-of-view" class="shell py-10 md:py-14">
      <div
        class="grid grid-cols-[minmax(0,1fr)_7rem] items-start gap-4 sm:grid-cols-[minmax(0,1fr)_11rem] sm:gap-6 md:grid-cols-[minmax(0,1fr)_20rem] md:gap-10"
      >
        <div appReveal>
          <p class="eyebrow">Why I'm running</p>
          <h2 class="bubble text-4xl md:text-5xl">Point of View</h2>
          <p class="mt-5 max-w-prose font-body text-ink">
            After many discussions with teachers, parents, and community members,
            I began to attend the Berkeley County School District board meetings
            for the purpose of asking hard questions and advocating for students,
            teachers and families who deserve a voice. I am running for the
            District 2 school board seat to be your voice in that room.
          </p>
        </div>

        <div appReveal [appReveal]="120">
          <figure class="paper-card -rotate-1 p-2 md:p-3">
            <div class="aspect-[4/5] overflow-hidden rounded-lg md:rounded-xl">
              <img
                src="img/advocacy-public-education.jpg"
                alt="Lindsey Draugel advocating for public education at a BCSD town hall"
                loading="lazy"
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
export class Experience {}
