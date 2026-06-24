// "Showing Up" gallery: candidate-in-action photos (board meetings, candidate
// forums, advocacy, community). Notebook-paper theme; transparent section,
// OnPush, zoneless. Optimized images live in public/img/.
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RevealDirective } from '../../shared/reveal.directive';

interface Photo {
  src: string;
  alt: string;
  caption: string;
  /** scrapbook tilt */
  tilt: string;
}

@Component({
  selector: 'app-gallery',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RevealDirective],
  template: `
    <section id="showing-up" class="shell py-10 md:py-14">
      <div appReveal class="max-w-2xl">
        <p class="eyebrow">On the trail</p>
        <h2 class="bubble text-4xl md:text-5xl">Showing Up</h2>
        <p class="mt-5 font-body text-lg text-ink">
          From board meetings to candidate forums to community events, I show up
          for our students, teachers, and families.
        </p>
      </div>

      <ul
        class="mt-10 mx-auto grid max-w-2xl list-none grid-cols-2 gap-4 p-0 sm:gap-6"
      >
        @for (photo of photos; track photo.src; let i = $index) {
          <li appReveal [appReveal]="i * 90" class="h-full">
            <figure
              class="paper-card mx-auto h-full w-full max-w-80 p-3"
              [class]="photo.tilt"
            >
              <div class="aspect-[4/5] overflow-hidden rounded-xl">
                <img
                  [src]="photo.src"
                  [alt]="photo.alt"
                  loading="lazy"
                  decoding="async"
                  class="h-full w-full object-cover object-center"
                />
              </div>
              <figcaption
                class="mt-3 px-1 text-center font-body text-sm text-ink-soft"
              >
                {{ photo.caption }}
              </figcaption>
            </figure>
          </li>
        }
      </ul>
    </section>
  `,
})
export class Gallery {
  protected readonly photos: Photo[] = [
    {
      src: 'img/town-hall-speaking.jpg',
      alt: 'Lindsey Draugel speaking at a Berkeley County School District candidate town hall',
      caption: 'Speaking at a BCSD candidate town hall',
      tilt: 'rotate-1',
    },
    {
      src: 'img/community-carnival.jpg',
      alt: 'Lindsey Draugel volunteering at a community carnival event',
      caption: 'Out in the community',
      tilt: '-rotate-1',
    },
    {
      src: 'img/candidate-panel.jpg',
      alt: 'Lindsey Draugel advocating for children in the community',
      caption: 'Advocating for our children',
      tilt: 'rotate-1',
    },
    {
      src: 'img/community-color-run.jpg',
      alt: 'Lindsey Draugel volunteering with students at Philip Simmons Elementary, where she is PTA Events Chair',
      caption: 'Volunteering at Philip Simmons Elementary (PTA Events Chair)',
      tilt: '-rotate-1',
    },
  ];
}
