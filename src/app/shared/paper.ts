import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * Notebook-paper background shell: off-white paper with faint blue horizontal
 * ruled lines and a single red vertical margin line (all CSS - see
 * `.notebook-paper` in styles.css). Wrap page content inside it.
 *
 * Usage:
 *   <app-paper>
 *     <app-nav /> <main>…</main> <app-site-footer />
 *   </app-paper>
 */
@Component({
  selector: 'app-paper',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<div class="notebook-paper min-h-dvh"><ng-content /></div>`,
})
export class PaperComponent {}
