// Experience is an image-RIGHT split (mirrors As a Mom's image-LEFT split: two
// deliberate, alternating splits in a row). Point of View breaks the run as a
// full-width feature - a wide advocacy photo with an overlapping statement card.
// OnPush, zoneless.
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RevealDirective } from '../../shared/reveal.directive';

@Component({
  selector: 'app-experience',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RevealDirective],
  template: `
    <!-- Experience: text left, image right. -->
    <section id="experience" class="shell py-12 md:py-16">
      <div
        class="grid grid-cols-[minmax(0,1fr)_7rem] items-center gap-4 sm:grid-cols-[minmax(0,1fr)_11rem] sm:gap-6 md:grid-cols-[minmax(0,1fr)_20rem] md:gap-10"
      >
        <div appReveal>
          <h2 class="bubble text-3xl md:text-5xl">Experience</h2>
          <p class="mt-5 max-w-prose font-body text-ink">
            With a background of over 20 years in childcare that started as a
            teacher in a classroom, to building and running a highly successful
            preschool program from the ground up, my experience has proven that
            developmentally appropriate practices work towards a student's
            success. I know what it looks like when a school environment works
            for kids, and I have seen what it looks like when it does not.
          </p>
        </div>

        <!-- PHOTO: Lindsey with the Charleston's Choice award for the preschool. -->
        <div appReveal [appReveal]="120" class="self-center">
          <figure class="paper-card rotate-1 p-2 md:p-3">
            <div class="aspect-[4/5] overflow-hidden rounded-lg md:rounded-xl">
              <img
                src="img/experience.jpg"
                alt="Lindsey Draugel holding the Charleston's Choice award for her preschool"
                loading="lazy"
                decoding="async"
                class="h-full w-full object-cover object-center"
              />
            </div>
          </figure>
        </div>
      </div>
    </section>

    <!-- Point of View: full-width feature with an overlapping statement card. -->
    <section id="point-of-view" class="shell py-16 md:py-24">
      <div class="relative">
        <div appReveal class="paper-card p-2 md:p-3">
          <div class="aspect-[3/2] overflow-hidden rounded-lg md:rounded-xl">
            <img
              src="img/advocacy-public-education.jpg"
              alt="Lindsey Draugel advocating for public education at a BCSD town hall"
              loading="lazy"
              decoding="async"
              class="h-full w-full object-cover object-center"
            />
          </div>
        </div>

        <div
          appReveal
          [appReveal]="140"
          class="paper-card relative z-10 mx-auto -mt-10 max-w-2xl p-6 md:-mt-20 md:mr-8 md:ml-auto md:p-8"
        >
          <h2 class="bubble text-4xl md:text-5xl">Point of View</h2>
          <p class="mt-4 font-body text-ink">
            After many discussions with teachers, parents, and community members,
            I began to attend the Berkeley County School District board meetings
            for the purpose of asking hard questions and advocating for students,
            teachers and families who deserve a voice. I am running for the
            District 2 school board seat to be your voice in that room.
          </p>
        </div>
      </div>
    </section>
  `,
})
export class Experience {}
