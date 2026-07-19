/**
 * Product detail modal for the shop - fully our own UI (native <dialog>), not
 * the Shopify Buy Button popup. The Buy Button modal renders in a locked
 * cross-origin iframe that kept breaking on phones (unreachable close X,
 * content overflow), so the shop now fetches product data via the Storefront
 * client and this component renders it natively:
 *
 * - Native <dialog> + showModal(): top-layer rendering (paints above the fixed
 *   mobile nav), Escape-to-close, focus containment, ::backdrop - accessible by
 *   default.
 * - Mobile (< md): full-screen sheet, no X; a fixed "Back to Shop" bar at the
 *   bottom is the close affordance (thumb-reachable).
 * - Desktop (>= md): centered card with a top-right close X.
 *
 * Add to cart is delegated to the parent through the `onAdd` function input
 * (the parent owns the Shopify cart component); the button shows a busy state
 * until the returned promise settles.
 */
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  afterNextRender,
  computed,
  inject,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';

import { ButtonDirective } from '../../shared/button.directive';

/* Minimal shapes of the Storefront SDK models this UI reads. */
export interface SdkImage {
  src: string;
  altText?: string | null;
}
export interface SdkSelectedOption {
  name: string;
  value: string;
}
export interface SdkVariant {
  id: string;
  title: string;
  available: boolean;
  price: { amount: string };
  image?: SdkImage | null;
  selectedOptions: SdkSelectedOption[];
}
export interface SdkOption {
  name: string;
  values: { value: string }[];
}
export interface SdkProduct {
  id: string;
  title: string;
  images: SdkImage[];
  options: SdkOption[];
  variants: SdkVariant[];
}

/** Append a Shopify CDN width hint so phones don't download 2048px originals. */
export function shopifyImg(src: string | undefined, width: number): string {
  if (!src) return '';
  return src + (src.includes('?') ? '&' : '?') + 'width=' + width;
}

/** "30.0" -> "$30.00" */
export function money(amount: string | number): string {
  return '$' + Number(amount).toFixed(2);
}

@Component({
  selector: 'app-product-modal',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ButtonDirective],
  styles: `
    dialog.pm {
      padding: 0;
      border: 0;
      background: var(--color-paper-soft);
      color: var(--color-ink);
      /* Phones: full-screen sheet. */
      width: 100vw;
      height: 100dvh;
      max-width: 100vw;
      max-height: 100dvh;
      margin: 0;
    }
    dialog.pm::backdrop {
      background: rgba(24, 42, 110, 0.45);
    }
    @media (min-width: 768px) {
      dialog.pm {
        width: min(880px, 92vw);
        /* fit-content, not auto: the UA gives <dialog> inset:0, so auto height
           STRETCHES to the viewport (clamped by max-height) instead of hugging
           the content. */
        height: fit-content;
        max-height: 90vh;
        margin: auto;
        border-radius: 16px;
        box-shadow: 0 30px 60px -25px rgba(24, 42, 110, 0.6);
      }
    }
    /* Column layout: scrollable content + (on phones) a pinned footer bar. */
    .pm-wrap {
      display: flex;
      flex-direction: column;
      height: 100%;
      max-height: inherit;
    }
    .pm-main {
      flex: 1;
      overflow-y: auto;
      -webkit-overflow-scrolling: touch;
    }
    .pm-foot {
      flex: none;
      padding-bottom: env(safe-area-inset-bottom);
    }
  `,
  template: `
    <dialog
      #dlg
      class="pm"
      aria-labelledby="pm-title"
      (close)="closed.emit()"
      (click)="onBackdropClick($event)"
    >
      <div class="pm-wrap">
        <div class="pm-main">
          <!-- Desktop close X (mobile uses the bottom Back to Shop bar) -->
          <button
            type="button"
            (click)="close()"
            aria-label="Close product view"
            class="absolute right-3 top-3 z-10 hidden h-11 w-11 cursor-pointer items-center justify-center rounded-full bg-white/90 text-ink shadow-md ring-1 ring-black/10 transition hover:bg-white md:inline-flex"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M6 6 18 18 M18 6 6 18" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" />
            </svg>
          </button>

          <div class="grid grid-cols-1 md:grid-cols-2 md:gap-6 md:p-6">
            <!-- Media: stage + thumbnails -->
            <div>
              <div class="relative bg-white md:overflow-hidden md:rounded-xl">
                <!-- md:h-[420px] (not aspect-derived) keeps the image's large
                     intrinsic size from inflating the dialog's fit-content
                     height, which left empty space under the real content. -->
                <img
                  [src]="stageSrc()"
                  [alt]="currentAlt()"
                  class="aspect-square w-full object-contain md:aspect-auto md:h-[420px]"
                />
                @if (images().length > 1) {
                  <button
                    type="button"
                    (click)="prev()"
                    aria-label="Previous photo"
                    class="absolute left-2 top-1/2 inline-flex h-11 w-11 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white/85 text-ink shadow ring-1 ring-black/10 transition hover:bg-white"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <path d="M15 18l-6-6 6-6" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    (click)="next()"
                    aria-label="Next photo"
                    class="absolute right-2 top-1/2 inline-flex h-11 w-11 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white/85 text-ink shadow ring-1 ring-black/10 transition hover:bg-white"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <path d="M9 6l6 6-6 6" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                  </button>
                  <p class="pointer-events-none absolute bottom-2 right-3 rounded-full bg-black/45 px-2.5 py-0.5 text-xs font-semibold text-white" aria-hidden="true">
                    {{ index() + 1 }}/{{ images().length }}
                  </p>
                }
              </div>

              @if (images().length > 1) {
                <div
                  class="flex gap-2 overflow-x-auto p-3 md:p-0 md:pt-3"
                  role="group"
                  aria-label="Product photos"
                >
                  @for (img of images(); track img.src; let i = $index) {
                    <button
                      type="button"
                      (click)="index.set(i)"
                      [attr.aria-label]="'Photo ' + (i + 1) + ' of ' + images().length"
                      [attr.aria-current]="i === index()"
                      class="h-14 w-14 flex-none cursor-pointer overflow-hidden rounded-lg bg-white ring-2 transition"
                      [class]="i === index() ? 'ring-brand-blue' : 'ring-black/10 hover:ring-brand-blue/50'"
                    >
                      <img [src]="thumbSrc(img)" alt="" class="h-full w-full object-cover" />
                    </button>
                  }
                </div>
              }
            </div>

            <!-- Info: title, price, variant pickers, quantity, add to cart -->
            <div class="px-4 pb-6 pt-1 md:p-0">
              <h3 id="pm-title" class="font-display text-xl font-bold leading-snug text-brand-blue md:text-2xl">
                {{ product().title }}
              </h3>
              <p class="mt-1 text-lg font-semibold text-ink">{{ priceLabel() }}</p>

              @for (opt of product().options; track opt.name) {
                @if (opt.values.length > 1 || product().options.length > 1) {
                  <label class="mt-4 block">
                    <span class="field-label">{{ opt.name }}</span>
                    <select
                      class="field mt-1.5"
                      [value]="selections()[opt.name]"
                      (change)="setOption(opt.name, $event)"
                    >
                      @for (v of opt.values; track v.value) {
                        <option [value]="v.value">{{ v.value }}</option>
                      }
                    </select>
                  </label>
                }
              }

              <div class="mt-4">
                <span class="field-label block" id="pm-qty-label">Quantity</span>
                <div class="mt-1.5 inline-flex items-center gap-1" role="group" aria-labelledby="pm-qty-label">
                  <button
                    type="button"
                    (click)="decQty()"
                    [disabled]="qty() <= 1"
                    aria-label="Decrease quantity"
                    class="inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-full bg-brand-blue/10 font-display text-xl font-bold text-brand-blue ring-1 ring-inset ring-brand-blue/25 transition hover:bg-brand-blue/20 disabled:cursor-default disabled:opacity-40"
                  >
                    &minus;
                  </button>
                  <output class="w-12 text-center font-display text-lg font-bold" aria-live="polite">{{ qty() }}</output>
                  <button
                    type="button"
                    (click)="incQty()"
                    aria-label="Increase quantity"
                    class="inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-full bg-brand-blue/10 font-display text-xl font-bold text-brand-blue ring-1 ring-inset ring-brand-blue/25 transition hover:bg-brand-blue/20"
                  >
                    +
                  </button>
                </div>
              </div>

              <div class="mt-6">
                <button
                  appButton
                  size="md"
                  type="button"
                  class="w-full md:w-auto"
                  [disabled]="!canAdd()"
                  (click)="add()"
                >
                  @if (adding()) {
                    Adding&hellip;
                  } @else if (variant() && !variant()!.available) {
                    Sold out
                  } @else {
                    Add to cart &middot; {{ priceLabel() }}
                  }
                </button>
                @if (addError()) {
                  <p class="mt-2 text-sm font-semibold text-raspberry-ink" role="alert">
                    Something went wrong adding this to the cart. Please try again.
                  </p>
                }
              </div>
            </div>
          </div>
        </div>

        <!-- Mobile close bar -->
        <div class="pm-foot border-t border-black/10 bg-paper-soft p-3 md:hidden">
          <button appButton variant="ghost" size="md" type="button" class="w-full" (click)="close()">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M15 18l-6-6 6-6" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
            Back to Shop
          </button>
        </div>
      </div>
    </dialog>
  `,
})
export class ProductModal {
  /** Product whose details are shown (Storefront SDK model object). */
  readonly product = input.required<SdkProduct>();

  /**
   * Called on Add to cart with the resolved variant + quantity. The parent adds
   * to the Shopify cart and closes this modal on success; a rejected promise
   * keeps the modal open and shows an inline error.
   */
  readonly onAdd = input.required<(v: SdkVariant, qty: number) => Promise<void>>();

  /** Emitted when the dialog closes (X, Back to Shop, Escape, or backdrop). */
  readonly closed = output<void>();

  private readonly dlg = viewChild.required<ElementRef<HTMLDialogElement>>('dlg');

  /** Carousel position. */
  protected readonly index = signal(0);
  /** Chosen quantity (1..). */
  protected readonly qty = signal(1);
  /** Add-to-cart in flight. */
  protected readonly adding = signal(false);
  /** Last add attempt failed. */
  protected readonly addError = signal(false);

  /** User option picks; seeded from the first available variant. */
  private readonly userSelections = signal<Record<string, string> | null>(null);
  protected readonly selections = computed<Record<string, string>>(() => {
    const user = this.userSelections();
    if (user) return user;
    const seed =
      this.product().variants.find((v) => v.available) ??
      this.product().variants[0];
    return Object.fromEntries(
      (seed?.selectedOptions ?? []).map((o) => [o.name, o.value]),
    );
  });

  /** The variant matching the current picks (undefined for combos not sold). */
  protected readonly variant = computed<SdkVariant | undefined>(() => {
    const sel = this.selections();
    return this.product().variants.find((v) =>
      v.selectedOptions.every((o) => sel[o.name] === o.value),
    );
  });

  protected readonly images = computed<SdkImage[]>(() => this.product().images);

  protected readonly stageSrc = computed(() =>
    shopifyImg(this.images()[this.index()]?.src, 900),
  );
  protected readonly currentAlt = computed(
    () =>
      this.images()[this.index()]?.altText ||
      `${this.product().title} - photo ${this.index() + 1} of ${this.images().length}`,
  );

  protected readonly priceLabel = computed(() => {
    const v = this.variant();
    if (v) return money(v.price.amount);
    const min = Math.min(
      ...this.product().variants.map((x) => Number(x.price.amount)),
    );
    return money(min);
  });

  protected readonly canAdd = computed(
    () => !this.adding() && !!this.variant() && this.variant()!.available,
  );

  constructor() {
    const destroyRef = inject(DestroyRef);
    afterNextRender(() => {
      this.dlg().nativeElement.showModal();
      // The dialog top layer covers the page, but the page can still scroll
      // underneath on touch - lock it while open.
      document.body.style.overflow = 'hidden';
    });
    destroyRef.onDestroy(() => {
      document.body.style.overflow = '';
    });
  }

  protected thumbSrc(img: SdkImage): string {
    return shopifyImg(img.src, 120);
  }

  protected prev(): void {
    const n = this.images().length;
    this.index.update((i) => (i - 1 + n) % n);
  }

  protected next(): void {
    const n = this.images().length;
    this.index.update((i) => (i + 1) % n);
  }

  protected setOption(name: string, event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    this.userSelections.set({ ...this.selections(), [name]: value });
    this.addError.set(false);
    // Jump the carousel to the newly selected variant's photo (e.g. color swap).
    const img = this.variant()?.image;
    if (img) {
      const i = this.images().findIndex((x) => x.src === img.src);
      if (i >= 0) this.index.set(i);
    }
  }

  protected incQty(): void {
    this.qty.update((q) => Math.min(q + 1, 99));
  }

  protected decQty(): void {
    this.qty.update((q) => Math.max(q - 1, 1));
  }

  protected async add(): Promise<void> {
    const v = this.variant();
    if (!v || this.adding()) return;
    this.adding.set(true);
    this.addError.set(false);
    try {
      await this.onAdd()(v, this.qty());
    } catch {
      this.addError.set(true);
    } finally {
      this.adding.set(false);
    }
  }

  protected close(): void {
    this.dlg().nativeElement.close();
  }

  /** Clicks on the <dialog> element itself hit the ::backdrop area. */
  protected onBackdropClick(event: MouseEvent): void {
    if (event.target === this.dlg().nativeElement) this.close();
  }
}
