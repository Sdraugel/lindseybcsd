import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/**
 * Hand-drawn checkbox + check - the campaign's brand motif (see preview.webp).
 * Slightly imperfect/sketchy strokes with rounded caps.
 *
 * Decorative by default (aria-hidden). Pass a `label` to expose it to assistive
 * tech as a meaningful image.
 *
 * Usage:
 *   <app-check />                          // boxed check, raspberry
 *   <app-check [boxed]="false" [size]="28" />
 *   <app-check label="Completed" />
 */
@Component({
  selector: 'app-check',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <svg
      [attr.width]="size()"
      [attr.height]="size()"
      viewBox="0 0 48 48"
      fill="none"
      class="inline-block overflow-visible"
      style="vertical-align: -0.18em"
      [attr.role]="label() ? 'img' : null"
      [attr.aria-label]="label() || null"
      [attr.aria-hidden]="label() ? null : 'true'"
    >
      @if (boxed()) {
        <path
          [attr.d]="boxPath"
          [attr.stroke]="boxColor()"
          [attr.stroke-width]="strokeWidth()"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      }
      <path
        [attr.d]="checkPath"
        [attr.stroke]="color()"
        [attr.stroke-width]="strokeWidth() + 0.4"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  `,
})
export class CheckmarkComponent {
  /** Rendered width/height in px. */
  readonly size = input(36);
  /** Check stroke color. */
  readonly color = input('var(--color-raspberry)');
  /** Box stroke color (a soft raspberry tint by default). */
  readonly boxColor = input(
    'color-mix(in srgb, var(--color-raspberry) 42%, transparent)',
  );
  /** Whether to draw the sketchy box behind the check. */
  readonly boxed = input(true);
  /** Base stroke width (the check is drawn slightly heavier). */
  readonly strokeWidth = input(3);
  /** Accessible label; when empty the icon is decorative (aria-hidden). */
  readonly label = input('');

  // Wobbly, hand-drawn square.
  protected readonly boxPath =
    'M9 12 C 8 10, 21 9, 32 9.5 C 39 9.8, 39.5 11, 39 22 C 38.6 32, 40 35.5, 32 36.5 C 21 37.7, 12 37.6, 9 36 C 7.3 35, 8 23, 8 19 C 8 16, 8 13, 9 12 Z';
  // Check that overshoots up-and-right past the box, like the sign.
  protected readonly checkPath =
    'M13 22 C 16 26, 18.5 29.5, 21.5 32 C 26 23.5, 32 14, 43 4.5';
}
