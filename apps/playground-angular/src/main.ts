import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';

// Registers the Kvui web components once, before the first view is created.
import '@kvui/core/loader';

bootstrapApplication(AppComponent, { providers: [provideRouter(routes)] }).catch((err) => console.error(err));
