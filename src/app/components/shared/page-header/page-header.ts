import { Component, input } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-page-header',
  imports: [LucideAngularModule],
  templateUrl: './page-header.html',
  styleUrls: ['./page-header.css'],
})
export class PageHeader {
  title = input.required<string>();
  icon = input<any>(); 
}
