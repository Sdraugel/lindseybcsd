/**
 * Shop section - campaign merchandise store.
 *
 * The site embeds a Shopify *collection* (not individual products) through the
 * Shopify Buy Button SDK. The `collection` component fetches whatever products
 * live in the "Store" collection at page load, so the candidate can add,
 * remove, or re-price items entirely in Shopify admin with NO code change and
 * NO redeploy here. The code references the collection, never a product.
 *
 * The store is gated behind the three SHOPIFY_* constants below (mirrors the
 * Anedot gate in contact.ts): while any is empty the section shows an
 * "opening soon" state and no SDK is loaded. Fill all three in - from a Shopify
 * Basic plan with the Buy Button sales channel enabled - to go live. Nothing
 * else here changes when the product lineup changes.
 *
 * Fulfillment is hands-off: Shopify orders auto-forward to Printify (print on
 * demand). Payment + checkout are hosted by Shopify off this static site.
 */
import {
  ChangeDetectionStrategy,
  Component,
  afterNextRender,
  computed,
} from '@angular/core';

import { RevealDirective } from '../../shared/reveal.directive';

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
 * ID of the "Store" collection to render (copied from the Buy Button embed for
 * that collection). This is the ONLY hook the site references - manage the
 * product lineup by adding/removing products in this collection in Shopify.
 */
const COLLECTION_ID = '476912845020';

/** Shopify Buy Button SDK loader (fetched on demand; the global is untyped). */
const BUY_BUTTON_SDK =
  'https://sdks.shopifycdn.com/buy-button/latest/buy-button-storefront.min.js';

/** DOM id the collection component mounts into. */
const MOUNT_ID = 'shop-collection';

@Component({
  selector: 'app-shop',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RevealDirective],
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
        <!-- Shopify Buy Button renders the "Store" collection into this node. -->
        <div id="shop-collection" class="mt-10"></div>
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

  constructor() {
    // Browser-only: afterNextRender never runs during SSR/prerender, so the
    // Shopify SDK and `document` are only ever touched in the browser.
    afterNextRender(() => {
      if (this.storeOpen()) this.mountStore();
    });
  }

  /** Load the Buy Button SDK (once) then render the collection. */
  private mountStore(): void {
    const node = document.getElementById(MOUNT_ID);
    if (!node) return;

    const w = window as unknown as { ShopifyBuy?: { UI?: unknown } };
    const render = () => this.renderCollection();

    // SDK already present and initialized.
    if (w.ShopifyBuy?.UI) {
      render();
      return;
    }

    // Script tag already injected (e.g. by a prior mount) - wait for it.
    const existing = document.querySelector<HTMLScriptElement>(
      `script[src="${BUY_BUTTON_SDK}"]`,
    );
    if (existing) {
      existing.addEventListener('load', render);
      return;
    }

    const script = document.createElement('script');
    script.async = true;
    script.src = BUY_BUTTON_SDK;
    script.onload = render;
    (document.head || document.body).appendChild(script);
  }

  /** Build the Storefront client and mount the collection, styled on-brand. */
  private renderCollection(): void {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const shopify = (window as unknown as { ShopifyBuy: any }).ShopifyBuy;
    const client = shopify.buildClient({
      domain: SHOPIFY_DOMAIN,
      storefrontAccessToken: STOREFRONT_ACCESS_TOKEN,
    });

    // Brand tokens mirrored from src/styles.css @theme.
    const brandBlue = '#2748c8';
    const brandBlueInk = '#182a6e';
    const ctaButton = {
      'font-family': 'Nunito, sans-serif',
      'font-weight': '700',
      'border-radius': '9999px',
      'background-color': brandBlue,
      ':hover': { 'background-color': brandBlueInk },
      ':focus': { 'background-color': brandBlueInk },
    };

    const options = {
      product: {
        // Clicking a card's button opens the product modal (buttonDestination:
        // 'modal') so shoppers can flip through all of a product's images and
        // pick a variant. The modal has its own Add to cart, so multi-item
        // orders still work. Grid cards stay clean (no inline variant selectors).
        buttonDestination: 'modal',
        contents: { img: true, title: true, price: true, options: false },
        text: { button: 'View product' },
        styles: {
          button: ctaButton,
          title: { 'font-family': '"Baloo 2", sans-serif' },
          price: { 'font-family': 'Nunito, sans-serif' },
        },
      },
      cart: {
        popup: false,
        text: { title: 'Cart', total: 'Subtotal', button: 'Checkout' },
        styles: { button: ctaButton },
      },
      toggle: {
        styles: { toggle: ctaButton },
      },
      // Keep the modal compact. The old wide (1500px) sizing existed to fit
      // Printify's size-chart table; with that removed the modal only holds an
      // image + variant pickers, so a narrower box looks better and stays short
      // enough on phones that the close "X" (which hangs just above the box) is
      // never pushed off the top of the screen. Do NOT add overflow/max-height
      // here - clipping the box hides that hanging X.
      modal: {
        styles: {
          modal: { 'max-width': '92%', width: '900px' },
        },
      },
      // The modal opened on product click: a swipeable carousel of every product
      // image (imgWithCarousel), the variant selectors, and an Add to cart.
      // description: false hides Printify's text size-chart - sizing now lives in
      // a product image in the carousel instead.
      modalProduct: {
        contents: {
          img: false,
          imgWithCarousel: true,
          button: false,
          buttonWithQuantity: true,
          description: false,
        },
        text: { button: 'Add to cart' },
        styles: {
          button: ctaButton,
          title: { 'font-family': '"Baloo 2", sans-serif' },
          price: { 'font-family': 'Nunito, sans-serif' },
        },
      },
    };

    // Right after the SDK script loads, createComponent can silently no-op on a
    // fresh page load (it renders on client-side nav but not always on a direct
    // hit / refresh of /shop). Mount into the current live node; if nothing was
    // injected, retry a few times until the SDK has settled.
    let attempts = 0;
    const mount = (): void => {
      const node = document.getElementById(MOUNT_ID);
      if (!node) return;
      attempts += 1;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      shopify.UI.onReady(client)
        .then((ui: any) => {
          if (node.children.length > 0) return; // already mounted
          ui.createComponent('collection', {
            id: COLLECTION_ID,
            node,
            moneyFormat: '${{amount}}',
            options,
          });
          window.setTimeout(() => {
            const live = document.getElementById(MOUNT_ID);
            if (live && live.children.length === 0 && attempts < 4) mount();
          }, 700);
        })
        .catch((e: unknown) =>
          console.error('[shop] Buy Button mount failed:', e),
        );
    };
    mount();
  }
}
