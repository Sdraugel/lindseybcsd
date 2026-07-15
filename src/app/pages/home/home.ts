// Home route: the single-page campaign composition. Sections live in
// src/app/sections/*. The merch store is its own route (/shop), not a section
// here, so it no longer appears inline on the home page.
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Hero } from '../../sections/hero/hero';
import { Contact } from '../../sections/contact/contact';
import { Bio } from '../../sections/bio/bio';
import { Experience } from '../../sections/experience/experience';
import { Gallery } from '../../sections/gallery/gallery';
import { Priorities } from '../../sections/priorities/priorities';

@Component({
  selector: 'app-home',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Hero, Contact, Bio, Experience, Gallery, Priorities],
  template: `
    <app-hero />
    <app-contact />
    <app-bio />
    <app-experience />
    <app-gallery />
    <app-priorities />
  `,
})
export class Home {}
