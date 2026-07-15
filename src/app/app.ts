import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PaperComponent } from './shared/paper';
import { BackToTop } from './shared/back-to-top';
import { MobileNav } from './shared/mobile-nav';
import { SiteHeader } from './shared/site-header';
import { SiteFooter } from './sections/footer/footer';

@Component({
  selector: 'app-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterOutlet,
    PaperComponent,
    BackToTop,
    MobileNav,
    SiteHeader,
    SiteFooter,
  ],
  templateUrl: './app.html',
})
export class App {}
