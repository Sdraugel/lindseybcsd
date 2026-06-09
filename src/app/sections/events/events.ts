// Upcoming Events section - embeds the campaign Google Calendar (read-only).
// She edits events in Google Calendar and this updates automatically; visitors
// can only view. To change calendars, set CALENDAR_ID to another PUBLIC
// calendar's ID (Google Calendar > Settings > the calendar > Integrate calendar
// > Calendar ID). Empty string shows a friendly "coming soon" state.
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { RevealDirective } from '../../shared/reveal.directive';

const CALENDAR_ID =
  'e208260556cd9dfab5cda9336df9950f0fc972a2815eef0ef71cd87f54bcb3d7@group.calendar.google.com';

@Component({
  selector: 'app-events',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RevealDirective],
  template: `
    <section id="events" class="shell py-10 md:py-14">
      <div appReveal class="max-w-2xl">
        <p class="eyebrow">On the calendar</p>
        <h2 class="bubble text-4xl md:text-5xl">Upcoming Events</h2>
        <p class="mt-5 font-body text-lg text-ink">
          Come say hello. Town halls, meet-and-greets, and community events are
          posted here as they're scheduled.
        </p>
      </div>

      @if (calendarUrl) {
        <div
          appReveal
          [appReveal]="80"
          class="paper-card mt-8 overflow-hidden p-2 md:p-3"
        >
          <iframe
            [src]="calendarUrl"
            title="Lindsey Draugel campaign events calendar"
            class="block h-[560px] w-full rounded-xl border-0 md:h-[640px]"
            loading="lazy"
          ></iframe>
        </div>
      } @else {
        <div appReveal [appReveal]="80" class="paper-card mt-8 p-10 text-center">
          <p class="bubble text-2xl">Events are coming soon</p>
          <p class="mx-auto mt-3 max-w-md text-ink-soft">
            We're lining up town halls and community events. Check back shortly.
          </p>
        </div>
      }
    </section>
  `,
})
export class Events {
  private readonly sanitizer = inject(DomSanitizer);

  /** Read-only Google Calendar embed (agenda view), or null when no calendar is set. */
  protected readonly calendarUrl: SafeResourceUrl | null = CALENDAR_ID
    ? this.sanitizer.bypassSecurityTrustResourceUrl(
        'https://calendar.google.com/calendar/embed?src=' +
          encodeURIComponent(CALENDAR_ID) +
          '&ctz=America%2FNew_York&mode=AGENDA' +
          '&showTitle=0&showPrint=0&showTabs=0&showCalendars=0&showTz=0&bgcolor=%23FBFAF3',
      )
    : null;
}
