import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';

// Registers the Nova web components once, before the first view is created.
import '@nova-ui/core/loader';

bootstrapApplication(AppComponent).catch((err) => console.error(err));
