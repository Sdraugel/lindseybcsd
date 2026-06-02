import { ChangeDetectionStrategy, Component } from '@angular/core';
import { PaperComponent } from './shared/paper';
import { Nav } from './sections/nav/nav';
import { Hero } from './sections/hero/hero';
import { Bio } from './sections/bio/bio';
import { Experience } from './sections/experience/experience';
import { Gallery } from './sections/gallery/gallery';
import { Priorities } from './sections/priorities/priorities';
import { Contact } from './sections/contact/contact';
import { SiteFooter } from './sections/footer/footer';

@Component({
  selector: 'app-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    PaperComponent,
    Nav,
    Hero,
    Bio,
    Experience,
    Gallery,
    Priorities,
    Contact,
    SiteFooter,
  ],
  templateUrl: './app.html',
})
export class App {}
