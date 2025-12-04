import { Component } from '@angular/core';
import { LucideAngularModule, Search, Star } from "lucide-angular";

@Component({
  selector: 'app-search-bar',
  imports: [LucideAngularModule],
  templateUrl: './search-bar.html',
  styleUrl: './search-bar.css',
})
export class SearchBar {
  readonly searchIcon = Search;
  readonly starIcon = Star;
}
