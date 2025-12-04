import { Component } from '@angular/core';
import { Page } from "./components/page/page";

@Component({
  selector: 'app-root',
  imports: [Page],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected title = 'wiki-search';
}
