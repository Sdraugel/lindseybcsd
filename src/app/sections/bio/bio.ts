// "About" area: Meet Lindsey (headshot) and As a Mom (family photo). Two
// 2-column blocks (text + image) at every size. Notebook-paper theme, OnPush,
// zoneless. The photo column scales from ~7rem on phones up to 20rem on desktop.
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RevealDirective } from '../../shared/reveal.directive';

@Component({
  selector: 'app-bio',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RevealDirective],
  template: `
    <!-- Meet Lindsey -->
    <section id="meet" class="shell py-10 md:py-14">
      <div
        class="grid grid-cols-[minmax(0,1fr)_7rem] items-start gap-4 sm:grid-cols-[minmax(0,1fr)_11rem] sm:gap-6 md:grid-cols-[minmax(0,1fr)_20rem] md:gap-10"
      >
        <div appReveal>
          <p class="eyebrow">The candidate</p>
          <h2 class="bubble text-4xl md:text-5xl">Meet Lindsey</h2>
          <p class="mt-5 max-w-prose font-body text-ink">
            As a parent, early childhood educator, and community advocate, my
            focus is committed to being a student-centered and teacher-forward
            voice for our district.
          </p>
        </div>

        <!-- PHOTO: Lindsey headshot (swap src to replace; optimized copies in public/img/). -->
        <div appReveal [appReveal]="120">
          <figure class="paper-card rotate-1 p-2 md:p-3">
            <div class="aspect-[4/5] overflow-hidden rounded-lg md:rounded-xl">
              <img
                src="img/lindsey-headshot.jpg"
                alt="Lindsey Draugel"
                loading="lazy"
                decoding="async"
                class="h-full w-full object-cover object-center"
              />
            </div>
          </figure>
        </div>
      </div>
    </section>

    <!-- As a Mom -->
    <section id="as-a-mom" class="shell py-10 md:py-14">
      <div
        class="grid grid-cols-[minmax(0,1fr)_7rem] items-start gap-4 sm:grid-cols-[minmax(0,1fr)_11rem] sm:gap-6 md:grid-cols-[minmax(0,1fr)_20rem] md:gap-10"
      >
        <div appReveal>
          <p class="eyebrow">My family</p>
          <h2 class="bubble text-4xl md:text-5xl">As a Mom</h2>
          <p class="mt-5 max-w-prose font-body text-ink">
            My name is Lindsey Draugel and I am a mom of three boys that I am
            raising here in the Charleston area and have been a part of two
            different school districts. Being a parent of a neurodivergent kiddo
            presents with a set of challenges that require knowledge and advocacy
            that I have had to acquire to navigate the school system. This is
            what motivates and drives me to run for a position on the school
            board.
          </p>
        </div>

        <!-- Family photo supports the "mom of three boys" story. -->
        <div appReveal [appReveal]="120">
          <figure class="paper-card -rotate-1 p-2 md:p-3">
            <div class="aspect-[4/5] overflow-hidden rounded-lg md:rounded-xl">
              <img
                src="img/family.jpg"
                alt="Lindsey Draugel with her three sons"
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
export class Bio {}
