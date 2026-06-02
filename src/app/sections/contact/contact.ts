/**
 * Get Involved / Contact section.
 *
 * A reactive contact form on the notebook-paper theme. There is NO real backend:
 * a valid submit opens the visitor's email client via a `mailto:` link
 * (see `onSubmit`). The TODO(backend) block below shows exactly where to drop in
 * a real Formspree / EmailJS POST instead.
 */
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { RevealDirective } from '../../shared/reveal.directive';
import { CheckmarkComponent } from '../../shared/checkmark';
import { ButtonDirective } from '../../shared/button.directive';

const CONTACT_EMAIL = 'draugelfordistrict2@gmail.com';

@Component({
  selector: 'app-contact',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    RevealDirective,
    CheckmarkComponent,
    ButtonDirective,
  ],
  template: `
    <section id="get-involved" class="shell py-16 md:py-24">
      <div appReveal class="max-w-2xl">
        <p class="eyebrow">Join us</p>
        <h2 class="bubble text-4xl md:text-5xl">Get Involved</h2>
        <p class="mt-4 text-lg text-ink">
          Want to help, host a sign, or just stay in the loop? Send a note.
          We'd love to hear from you.
        </p>
      </div>

      <div class="mt-10 grid gap-8 lg:grid-cols-5 lg:items-start">
        <!-- Contact form -->
        <form
          appReveal
          [appReveal]="80"
          class="paper-card p-6 md:p-8 lg:col-span-3"
          novalidate
          (ngSubmit)="onSubmit()"
          [formGroup]="form"
        >
          <!-- Name -->
          <div>
            <label class="field-label" for="name">Name</label>
            <input
              class="field"
              id="name"
              type="text"
              autocomplete="name"
              formControlName="name"
              required
              [attr.aria-invalid]="showError('name') ? 'true' : null"
              [attr.aria-describedby]="showError('name') ? 'name-error' : null"
            />
            @if (showError('name')) {
              <p id="name-error" role="alert" class="mt-1.5 text-sm text-raspberry-ink">
                Please enter your name.
              </p>
            }
          </div>

          <!-- Email -->
          <div class="mt-5">
            <label class="field-label" for="email">Email</label>
            <input
              class="field"
              id="email"
              type="email"
              autocomplete="email"
              formControlName="email"
              required
              [attr.aria-invalid]="showError('email') ? 'true' : null"
              [attr.aria-describedby]="showError('email') ? 'email-error' : null"
            />
            @if (showError('email')) {
              <p id="email-error" role="alert" class="mt-1.5 text-sm text-raspberry-ink">
                @if (form.controls.email.hasError('required')) {
                  Please enter your email.
                } @else {
                  Please enter a valid email address.
                }
              </p>
            }
          </div>

          <!-- Message (optional) -->
          <div class="mt-5">
            <label class="field-label" for="message">
              Message <span class="text-ink-soft font-normal">(optional)</span>
            </label>
            <textarea
              class="field"
              id="message"
              rows="4"
              formControlName="message"
            ></textarea>
          </div>

          <div class="mt-6 flex flex-wrap items-center gap-4">
            <button appButton type="submit">Send message</button>

            @if (sent()) {
              <p role="status" class="flex items-center gap-2 text-ink font-display font-bold">
                <app-check [size]="28" />
                Thanks! Your email client should open. We'll be in touch soon.
              </p>
            }
          </div>

          <!--
            TODO(backend): replace the mailto fallback in onSubmit() with a real
            POST to a form service so submissions arrive without opening an email
            client. No backend is wired up yet. Example (Formspree):

            const res = await fetch('https://formspree.io/f/YOUR_FORM_ID', {
              method: 'POST',
              headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
              body: JSON.stringify(this.form.getRawValue()),
            });
            if (res.ok) { this.sent.set(true); this.form.reset(); }

            Or EmailJS:
            // import emailjs from '@emailjs/browser';
            // await emailjs.send('SERVICE_ID', 'TEMPLATE_ID', this.form.getRawValue(), 'PUBLIC_KEY');
          -->
        </form>

        <!-- Contact details + socials -->
        <aside appReveal [appReveal]="160" class="paper-card p-6 md:p-8 lg:col-span-2">
          <h3 class="bubble text-2xl">Reach Us Directly</h3>
          <p class="mt-3 text-ink">
            Prefer email? Write to us anytime at:
          </p>
          <p class="mt-2">
            <a
              class="font-display font-bold text-brand-blue underline decoration-2 underline-offset-2 hover:text-brand-blue-soft break-words"
              [href]="'mailto:' + email"
              >{{ email }}</a
            >
          </p>

          <h3 class="bubble text-xl mt-8">Follow Along</h3>
          <!-- TODO(social): only Facebook is wired up. Add Instagram / others here when their URLs exist. -->
          <ul class="mt-3 flex flex-wrap gap-3">
            @for (s of socials; track s.name) {
              <li>
                <a
                  [href]="s.href"
                  [attr.aria-label]="s.label"
                  [attr.target]="s.external ? '_blank' : null"
                  [attr.rel]="s.external ? 'noopener noreferrer' : null"
                  class="inline-flex h-11 w-11 items-center justify-center rounded-full bg-brand-blue/10 text-brand-blue transition hover:bg-brand-blue hover:text-white"
                >
                  @switch (s.name) {
                    @case ('facebook') {
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M13.5 21v-7h2.3l.4-2.8h-2.7V9.4c0-.8.2-1.4 1.4-1.4h1.4V5.5c-.2 0-1.1-.1-2-.1-2 0-3.4 1.2-3.4 3.5v1.9H8.6V14h2.3v7h2.6z"/></svg>
                    }
                  }
                </a>
              </li>
            }
          </ul>
        </aside>
      </div>
    </section>
  `,
})
export class Contact {
  /** Visible contact email address. */
  protected readonly email = CONTACT_EMAIL;

  /** Set true once the user has pressed "Send message". Drives validation display. */
  protected readonly submitted = signal(false);

  /** Set true after a valid submit triggers the mailto handoff. */
  protected readonly sent = signal(false);

  protected readonly form = new FormGroup({
    name: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
    message: new FormControl('', { nonNullable: true }),
  });

  /**
   * Social links. Only Facebook (the live campaign page) is shown. To add
   * Instagram or others, push another entry with name/label/href/external and
   * add a matching @case SVG in the template above.
   */
  protected readonly socials = [
    {
      name: 'facebook',
      label: "Follow Lindsey Draugel's campaign on Facebook",
      href: 'https://www.facebook.com/profile.php?id=61567444822559',
      external: true,
    },
  ];

  /** Show a field's error only after a submit attempt or once it's been touched. */
  protected showError(name: 'name' | 'email'): boolean {
    const control = this.form.controls[name];
    return control.invalid && (this.submitted() || control.touched);
  }

  protected onSubmit(): void {
    this.submitted.set(true);

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { name, email, message } = this.form.getRawValue();

    // TODO(backend): replace mailto fallback with:
    // fetch('https://formspree.io/f/YOUR_FORM_ID', { method:'POST', ... })
    // (see the full commented example in the template above).
    const subject = `Campaign inquiry from ${name}`;
    const body =
      `${message || '(no message)'}\n\n` + `Sent by ${name} (${email})`;
    const mailto =
      `mailto:${CONTACT_EMAIL}` +
      `?subject=${encodeURIComponent(subject)}` +
      `&body=${encodeURIComponent(body)}`;

    window.location.href = mailto;
    this.sent.set(true);
  }
}
