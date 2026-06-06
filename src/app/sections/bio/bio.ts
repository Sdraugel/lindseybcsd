// Meet Lindsey (bio) section - candidate story with her headshot and a family
// photo. Notebook-paper theme; transparent section, OnPush, zoneless. Two
// columns on desktop, single column on mobile (text first, photos after).
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RevealDirective } from '../../shared/reveal.directive';

@Component({
  selector: 'app-bio',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RevealDirective],
  template: `
    <section id="meet" class="shell py-10 md:py-14">
      <div class="grid items-start gap-10 md:grid-cols-[minmax(0,1fr)_20rem]">
        <!-- Text column: first on mobile, left on desktop -->
        <div appReveal>
          <p class="eyebrow">The candidate</p>
          <h2 class="bubble text-4xl md:text-5xl">Meet Lindsey</h2>

          <p
            class="mt-5 max-w-prose font-body text-lg italic text-raspberry-ink md:text-xl"
          >
            As a parent, early childhood educator, and community advocate, I'm
            committed to being a student-centered, teacher-forward voice for our
            district.
          </p>

          <div class="mt-6 space-y-5 font-body text-ink">
            <p class="max-w-prose">
              My name is Lindsey Draugel and I am a mom of three boys, including
              a child who is neurodivergent. Being a parent of a neurodivergent
              kiddo and navigating this school system motivated me to run for
              school board.
            </p>
            <p class="max-w-prose">
              I spent over 20 years in childcare, starting as a teacher in a
              classroom then building and running a preschool program from the
              ground up. I've researched developmentally appropriate practices,
              I know what it looks like when a school environment works for kids,
              and I know what it looks like when it doesn't.
            </p>
            <p class="max-w-prose">
              For the past several months I have been showing up at BCSD board
              meetings, asking hard questions, and advocating for students,
              teachers, and families who deserve better. I am running for the
              District 2 school board seat because our children and teachers need
              someone in that room who will fight for them every single day.
            </p>
          </div>
        </div>

        <!-- Photo column: after text on mobile, right on desktop. Capped to the
             same ~20rem width on mobile (centered) so the photos never balloon
             to full-bleed; the desktop grid column controls the width at md+. -->
        <div
          appReveal
          [appReveal]="120"
          class="mx-auto w-full max-w-80 space-y-5 md:max-w-none"
        >
          <!-- PHOTO: Lindsey headshot (swap src to replace; optimized copies in public/img/). -->
          <figure class="paper-card rotate-1 p-3">
            <div class="aspect-[4/5] overflow-hidden rounded-xl">
              <img
                src="img/lindsey-headshot.jpg"
                alt="Lindsey Draugel"
                loading="lazy"
                decoding="async"
                class="h-full w-full object-cover object-center"
              />
            </div>
          </figure>

          <!-- Family photo supports the "mom of three boys" story. -->
          <figure class="paper-card -rotate-1 p-3">
            <div class="aspect-[4/5] overflow-hidden rounded-xl">
              <img
                src="img/family.jpg"
                alt="Lindsey Draugel with her three sons"
                loading="lazy"
                decoding="async"
                class="h-full w-full object-cover object-center"
              />
            </div>
            <figcaption class="mt-2 text-center font-body text-sm text-ink-soft">
              Mom of three boys.
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  `,
})
export class Bio {}
