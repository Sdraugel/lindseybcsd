// "About" area. Meet Lindsey is a text-forward lead statement (the headshot is
// now the hero's visual anchor), and As a Mom is an image-LEFT split that
// mirrors Experience's image-RIGHT split for a deliberate zigzag. Notebook-paper
// theme, OnPush, zoneless.
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RevealDirective } from '../../shared/reveal.directive';

@Component({
  selector: 'app-bio',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RevealDirective],
  template: `
    <!-- Meet Lindsey: text-forward intro / lead statement. -->
    <section id="meet" class="shell py-14 md:py-20">
      <div appReveal class="max-w-3xl">
        <h2 class="bubble text-4xl md:text-6xl">Meet Lindsey</h2>
        <p
          class="mt-6 max-w-[42rem] font-body text-xl leading-relaxed text-ink md:text-2xl"
        >
          As a parent, early childhood educator, and community advocate, my
          focus is committed to being a
          <span class="font-bold text-raspberry-ink"
            >student-centered and teacher-forward</span
          >
          voice for our district.
        </p>
      </div>
    </section>

    <!-- As a Mom: image LEFT, text right. -->
    <section id="as-a-mom" class="shell py-12 md:py-16">
      <div
        class="grid grid-cols-[7rem_minmax(0,1fr)] items-center gap-4 sm:grid-cols-[11rem_minmax(0,1fr)] sm:gap-6 md:grid-cols-[20rem_minmax(0,1fr)] md:gap-10"
      >
        <!-- Family photo supports the "mom of three boys" story. -->
        <div appReveal class="self-center">
          <figure class="paper-card -rotate-1 p-2 md:p-3">
            <div class="aspect-[860/1305] overflow-hidden rounded-lg md:rounded-xl">
              <img
                src="img/family.jpg"
                alt="Lindsey Draugel with her three sons"
                loading="lazy"
                decoding="async"
                class="h-full w-full object-cover object-top"
              />
            </div>
          </figure>
        </div>

        <div appReveal [appReveal]="120">
          <h2 class="bubble text-3xl md:text-5xl">As a Mom</h2>
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
      </div>
    </section>
  `,
})
export class Bio {}
