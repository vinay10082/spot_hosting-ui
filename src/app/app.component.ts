import { Component } from '@angular/core';

@Component({
    standalone: false,
    selector: 'app-root',
    template: `<router-outlet></router-outlet>`,
    styles: [`
    :host {
        display: block;
        height: 100vh;
        }
    `]
})
export class AppComponent {
    title = 'angular-ngrx-editor';
}