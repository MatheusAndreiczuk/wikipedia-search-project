import { Component, input, output } from '@angular/core';
import { LucideAngularModule, X } from 'lucide-angular';

@Component({
  selector: 'app-confirmation-modal',
  standalone: true,
  imports: [LucideAngularModule],
  templateUrl: './confirmation-modal.html',
})
export class ConfirmationModal {
  isOpen = input.required<boolean>();
  title = input.required<string>();
  message = input.required<string>();
  confirmText = input<string>('Confirmar');
  cancelText = input<string>('Cancelar');

  confirm = output<void>();
  cancel = output<void>();

  readonly closeIcon = X;

  onConfirm() {
    this.confirm.emit();
  }

  onCancel() {
    this.cancel.emit();
  }
}
