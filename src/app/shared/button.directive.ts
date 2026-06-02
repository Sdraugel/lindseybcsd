import { Directive, computed, input } from '@angular/core';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost';
export type ButtonSize = 'md' | 'lg';

/**
 * Pill button styling for `<button>` and `<a>` elements. Accessible by default
 * (semantic element + global focus-visible ring from styles.css).
 *
 * Usage:
 *   <a appButton href="#get-involved">Get Involved</a>
 *   <button appButton variant="ghost" size="md" type="button">Meet Lindsey</button>
 */
@Directive({
  selector: '[appButton]',
  host: { '[class]': 'classes()' },
})
export class ButtonDirective {
  readonly variant = input<ButtonVariant>('primary');
  readonly size = input<ButtonSize>('lg');

  private static readonly base =
    'inline-flex items-center justify-center gap-2 text-center align-middle ' +
    'font-display font-bold tracking-wide rounded-full no-underline ' +
    'cursor-pointer select-none ' +
    'transition duration-150 ease-out hover:-translate-y-0.5 active:translate-y-0 ' +
    'disabled:opacity-60 disabled:pointer-events-none disabled:translate-y-0';

  private static readonly sizes: Record<ButtonSize, string> = {
    md: 'text-base px-5 py-2.5',
    lg: 'text-lg px-7 py-3.5',
  };

  private static readonly variants: Record<ButtonVariant, string> = {
    primary:
      'bg-brand-blue text-white shadow-[0_12px_26px_-12px_rgba(24,42,110,0.75)] hover:bg-brand-blue-soft',
    secondary:
      'bg-raspberry text-white shadow-[0_12px_26px_-12px_rgba(140,64,96,0.7)] hover:brightness-105',
    ghost:
      'bg-transparent text-brand-blue ring-2 ring-inset ring-brand-blue hover:bg-brand-blue/10',
  };

  protected readonly classes = computed(() =>
    [
      ButtonDirective.base,
      ButtonDirective.sizes[this.size()],
      ButtonDirective.variants[this.variant()],
    ].join(' '),
  );
}
