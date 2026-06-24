// Experience: "My Experience" and "Point of View" as two cards on the
// notebook-paper theme. OnPush, zoneless; scroll-reveal with a small stagger.
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RevealDirective } from '../../shared/reveal.directive';

@Component({
  selector: 'app-experience',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RevealDirective],
  template: `
    <section id="experience" class="shell py-10 md:py-14">
      <div class="grid gap-6 md:grid-cols-2 md:items-start md:gap-8">
        <article appReveal class="paper-card p-6 md:p-8">
          <p class="eyebrow">Background</p>
          <h2 class="bubble text-3xl md:text-4xl">My Experience</h2>
          <p class="mt-4 font-body leading-relaxed text-ink">
            With a background of over 20 years in childcare that started as a
            teacher in a classroom, to building and running a highly successful
            preschool program from the ground up, my experience has proven that
            developmentally appropriate practices work towards a student's
            success. I know what it looks like when a school environment works
            for kids, and I have seen what it looks like when it does not.
          </p>
        </article>

        <article appReveal [appReveal]="100" class="paper-card p-6 md:p-8">
          <p class="eyebrow">Why I'm running</p>
          <h2 class="bubble text-3xl md:text-4xl">Point of View</h2>
          <p class="mt-4 font-body leading-relaxed text-ink">
            After many discussions with teachers, parents, and community members,
            I began to attend the Berkeley County School District board meetings
            for the purpose of asking hard questions and advocating for students,
            teachers and families who deserve a voice. I am running for the
            District 2 school board seat to be your voice in that room.
          </p>
        </article>
      </div>
    </section>
  `,
})
export class Experience {}
