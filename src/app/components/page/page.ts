import { Component, signal } from '@angular/core';
import { Menu } from "../shared/menu/menu";
import { RouterOutlet } from "@angular/router";
import { LucideAngularModule, Menu as MenuIcon, X } from 'lucide-angular';

@Component({
  selector: 'app-page',
  imports: [Menu, RouterOutlet, LucideAngularModule],
  templateUrl: './page.html',
  styleUrl: './page.css',
})
export class Page {
  readonly isMobileMenuOpen = signal(false);
  readonly menuIcon = MenuIcon;
  readonly closeIcon = X;

  toggleMobileMenu() {
    this.isMobileMenuOpen.update(v => !v);
  }
}
