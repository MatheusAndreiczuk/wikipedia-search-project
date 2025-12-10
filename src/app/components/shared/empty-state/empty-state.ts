import { Component, input } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-empty-state',
  imports: [LucideAngularModule],
  templateUrl: './empty-state.html',
  styleUrls: ['./empty-state.css'],
})
export class EmptyState {
  message = input.required<string>();
  icon = input.required<any>();
}
