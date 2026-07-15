import { mergeApplicationConfig, ApplicationConfig } from '@angular/core';
import { provideServerRendering } from '@angular/ssr';
import { appConfig } from './app.config';

// The client routes (from appConfig's provideRouter) drive prerendering. Bare
// provideServerRendering() renders the routes listed in prerender.routes.txt
// (`/` and `/shop`) to static HTML.
const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(),
  ],
};

export const config = mergeApplicationConfig(appConfig, serverConfig);
