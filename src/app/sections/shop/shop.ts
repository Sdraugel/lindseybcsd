/**
 * Shop section - campaign merchandise store.
 *
 * The product grid and the product-detail modal are rendered natively by this
 * component (see product-modal.ts): products are fetched through the Shopify
 * Storefront client (from the Buy Button SDK bundle) out of the "Store"
 * collection, so the candidate can still add/remove/re-price items entirely in
 * Shopify admin with NO code change and NO redeploy here.
 *
 * Only the CART stays a Shopify Buy Button component (floating toggle + drawer
 * + hosted checkout) - that part works well and handles payment off this static
 * site. The old Buy Button collection grid + popup modal are gone: the popup
 * lived in a locked cross-origin iframe that kept breaking on phones
 * (unreachable close X, overflow), which is why the UI is now ours.
 *
 * The store is gated behind the three SHOPIFY_* constants below (mirrors the
 * Anedot gate in contact.ts): while any is empty the section shows an
 * "opening soon" state and no SDK is loaded.
 *
 * Fulfillment is hands-off: Shopify orders auto-forward to Printify (print on
 * demand).
 */
import {
  ChangeDetectionStrategy,
  Component,
  afterNextRender,
  computed,
  signal,
} from '@angular/core';

import { RevealDirective } from '../../shared/reveal.directive';
import {
  ProductModal,
  SdkProduct,
  SdkVariant,
  money,
  shopifyImg,
} from './product-modal';

/**
 * Shopify storefront domain, e.g. 'draugel-store.myshopify.com'.
 * EMPTY = store not open yet (section shows an "opening soon" state).
 */
const SHOPIFY_DOMAIN = 'vqq2td-ex.myshopify.com';

/**
 * Storefront API access token from the Shopify Buy Button sales channel
 * (Sales channels > Buy Button). Safe to ship publicly: it is a read-only
 * storefront token, not an admin key.
 */
const STOREFRONT_ACCESS_TOKEN = '004c55faba4c6cd51527527ab59daf9a';

/**
 * ID of the "Store" collection to render. This is the ONLY hook the site
 * references - manage the product lineup by adding/removing products in this
 * collection in Shopify.
 */
const COLLECTION_ID = '476912845020';

/** Shopify Buy Button SDK loader (fetched on demand; the global is untyped). */
const BUY_BUTTON_SDK =
  'https://sdks.shopifycdn.com/buy-button/latest/buy-button-storefront.min.js';

/**
 * Option values to hide in the storefront UI, keyed by product title then
 * option name. This only filters what the site DISPLAYS - the variants still
 * exist in Shopify. The durable fix is deleting the variant in Printify (it
 * syncs to Shopify); remove the entry here once that's done.
 */
const HIDDEN_OPTION_VALUES: Record<string, Record<string, string[]>> = {
  'Unisex Cotton Crew Tee': { Size: ['XS'] },
};

/**
 * Strip hidden option values (and their variants) from a fetched product. The
 * SDK models are getter-only (mutating them throws), so this returns a plain
 * wrapper with filtered options/variants. The variant entries stay the ORIGINAL
 * SDK objects - the Buy Button cart needs those exact references on add.
 */
function applyHiddenOptions(product: SdkProduct): SdkProduct {
  const hidden = HIDDEN_OPTION_VALUES[product.title];
  if (!hidden) return product;
  const isHidden = (name: string, value: string) =>
    (hidden[name] ?? []).includes(value);
  return {
    id: product.id,
    title: product.title,
    images: product.images,
    options: product.options.map((opt) => ({
      name: opt.name,
      values: opt.values.filter((v) => !isHidden(opt.name, v.value)),
    })),
    variants: product.variants.filter((v) =>
      v.selectedOptions.every((o) => !isHidden(o.name, o.value)),
    ),
  };
}

/** The subset of the Buy Button cart component this code calls. */
interface CartLike {
  addVariantToCart(variant: SdkVariant, quantity: number): Promise<unknown>;
  open(): void;
}

@Component({
  selector: 'app-shop',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RevealDirective, ProductModal],
  template: `
    <section id="shop" class="shell py-14 md:py-20">
      <div appReveal class="max-w-2xl">
        <div class="flex flex-wrap items-center gap-3">
          <h2 class="bubble text-4xl md:text-5xl">Shop</h2>
          @if (!storeOpen()) {
            <span
              class="inline-flex items-center rounded-full bg-raspberry-soft px-3 py-1 text-xs font-display font-bold uppercase tracking-wide text-raspberry-ink"
            >
              Opening soon
            </span>
          }
        </div>
        <p class="mt-5 font-body text-lg text-ink">
          Rep Draugel For District 2! Every order
          helps fund the campaign, and it ships straight to you from our print
          partner.
        </p>
      </div>

      @if (storeOpen()) {
        @if (products(); as list) {
          <ul
            class="mt-10 grid list-none grid-cols-2 gap-4 p-0 sm:gap-6 lg:grid-cols-3 lg:gap-8"
          >
            @for (p of list; track p.id) {
              <li>
                <article class="paper-card flex h-full flex-col p-3 md:p-4">
                  <button
                    type="button"
                    (click)="openProduct(p)"
                    class="group block w-full cursor-pointer"
                    [attr.aria-label]="'View ' + p.title"
                  >
                    <div class="aspect-square overflow-hidden rounded-lg bg-white">
                      <img
                        [src]="cardImg(p)"
                        [alt]="p.title"
                        loading="lazy"
                        decoding="async"
                        class="h-full w-full object-cover transition duration-200 group-hover:scale-[1.04]"
                      />
                    </div>
                  </button>
                  <h3
                    class="mt-3 font-display text-sm font-bold leading-snug text-brand-blue md:text-base"
                  >
                    {{ p.title }}
                  </h3>
                  <p class="mt-1 text-sm font-semibold text-ink md:text-base">
                    {{ cardPrice(p) }}
                  </p>
                </article>
              </li>
            }
          </ul>
        } @else if (loadError()) {
          <div class="paper-card mt-10 p-8 text-center">
            <p class="font-body text-ink-soft">
              The store didn't load. Please refresh the page to try again.
            </p>
          </div>
        } @else {
          <!-- Loading skeleton while the Storefront API responds. -->
          <ul
            class="mt-10 grid list-none grid-cols-2 gap-4 p-0 sm:gap-6 lg:grid-cols-3 lg:gap-8"
            aria-hidden="true"
          >
            @for (i of [0, 1, 2, 3, 4, 5]; track i) {
              <li>
                <div class="paper-card animate-pulse p-3 md:p-4">
                  <div class="aspect-square rounded-lg bg-black/5"></div>
                  <div class="mt-3 h-4 w-3/4 rounded bg-black/5"></div>
                  <div class="mt-2 h-4 w-1/3 rounded bg-black/5"></div>
                  <div class="mt-4 h-10 rounded-full bg-black/5"></div>
                </div>
              </li>
            }
          </ul>
          <p class="sr-only" role="status">Loading products</p>
        }
      } @else {
        <div appReveal [appReveal]="80" class="paper-card mt-10 p-8 text-center">
          <p class="font-body text-ink-soft">
            Our merch store is opening soon. Check back to grab your District 2
            gear.
          </p>
        </div>
      }

      <p class="mt-8 text-sm text-ink-soft">
        Paid for by Draugel for District 2. Merchandise is printed and shipped by
        a third-party print partner.
      </p>
      <!--
        TODO(legal): SC Code section 8-13-1354 requires the payer's NAME + ADDRESS
        on campaign communications. Append the committee mailing address to the
        line above (e.g. "Paid for by Draugel for District 2, PO Box ..., City, SC
        ZIP") before the store goes public, and keep it consistent with the site
        footer disclaimer.
      -->
    </section>

    @if (selected(); as p) {
      <app-product-modal
        [product]="p"
        [onAdd]="addToCart"
        (closed)="selected.set(null)"
      />
    }
  `,
})
export class Shop {
  /** True once all three Shopify config values are filled in. */
  protected readonly storeOpen = computed(
    () =>
      SHOPIFY_DOMAIN.length > 0 &&
      STOREFRONT_ACCESS_TOKEN.length > 0 &&
      COLLECTION_ID.length > 0,
  );

  /** Products in the Store collection; null while loading. */
  protected readonly products = signal<SdkProduct[] | null>(null);

  /** Storefront fetch failed (network / config). */
  protected readonly loadError = signal(false);

  /** Product currently open in the detail modal. */
  protected readonly selected = signal<SdkProduct | null>(null);

  /** Resolves to the Buy Button cart component once the SDK is ready. */
  private cartReady: Promise<CartLike> | null = null;

  constructor() {
    // Browser-only: afterNextRender never runs during SSR/prerender, so the
    // Shopify SDK and `document` are only ever touched in the browser.
    afterNextRender(() => {
      if (this.storeOpen()) void this.init();
    });
  }

  protected openProduct(p: SdkProduct): void {
    this.selected.set(p);
  }

  /** First product photo, sized for the card grid. */
  protected cardImg(p: SdkProduct): string {
    return shopifyImg(p.images[0]?.src, 640);
  }

  /** "$30.00" or "From $25.00" when variants differ in price. */
  protected cardPrice(p: SdkProduct): string {
    const prices = p.variants.map((v) => Number(v.price.amount));
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    return min === max ? money(min) : 'From ' + money(min);
  }

  /**
   * Add to cart callback handed to the product modal (arrow fn keeps `this`).
   * Adding through the Buy Button cart component opens its drawer, which is the
   * user feedback; the modal is closed on success so the drawer is visible.
   */
  protected readonly addToCart = async (
    variant: SdkVariant,
    quantity: number,
  ): Promise<void> => {
    if (!this.cartReady) throw new Error('cart not initialized');
    const cart = await this.cartReady;
    await cart.addVariantToCart(variant, quantity);
    this.selected.set(null);
    cart.open(); // show the drawer as confirmation
  };

  /** Load the SDK, mount the cart (drawer + floating toggle), fetch products. */
  private async init(): Promise<void> {
    await this.loadSdk();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const shopify = (window as unknown as { ShopifyBuy: any }).ShopifyBuy;
    const client = shopify.buildClient({
      domain: SHOPIFY_DOMAIN,
      storefrontAccessToken: STOREFRONT_ACCESS_TOKEN,
    });

    // Brand tokens mirrored from src/styles.css @theme.
    const ctaButton = {
      'font-family': 'Nunito, sans-serif',
      'font-weight': '700',
      'border-radius': '9999px',
      'background-color': '#2748c8',
      ':hover': { 'background-color': '#182a6e' },
      ':focus': { 'background-color': '#182a6e' },
    };

    this.cartReady = shopify.UI.onReady(client).then(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (ui: any): CartLike => {
        if (ui.components.cart.length === 0) {
          ui.createComponent('cart', {
            options: {
              cart: {
                popup: false,
                text: { title: 'Cart', total: 'Subtotal', button: 'Checkout' },
                styles: { button: ctaButton },
              },
              toggle: { styles: { toggle: ctaButton } },
            },
          });
        }
        return ui.components.cart[0] as CartLike;
      },
    );

    try {
      const collection = await client.collection.fetchWithProducts(
        'gid://shopify/Collection/' + COLLECTION_ID,
        { productsFirst: 50 },
      );
      this.products.set(
        (collection.products as SdkProduct[]).map(applyHiddenOptions),
      );
    } catch (e) {
      console.error('[shop] product fetch failed:', e);
      this.loadError.set(true);
    }
  }

  /** Inject the Buy Button SDK script once and wait for it. */
  private loadSdk(): Promise<void> {
    const w = window as unknown as { ShopifyBuy?: { UI?: unknown } };
    if (w.ShopifyBuy?.UI) return Promise.resolve();

    return new Promise((resolve, reject) => {
      const existing = document.querySelector<HTMLScriptElement>(
        `script[src="${BUY_BUTTON_SDK}"]`,
      );
      if (existing) {
        existing.addEventListener('load', () => resolve());
        existing.addEventListener('error', reject);
        return;
      }
      const script = document.createElement('script');
      script.async = true;
      script.src = BUY_BUTTON_SDK;
      script.onload = () => resolve();
      script.onerror = reject;
      (document.head || document.body).appendChild(script);
    });
  }
}
