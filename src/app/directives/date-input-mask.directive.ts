import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appDateInputMask]'
})
export class DateInputMaskDirective {

  constructor(private el: ElementRef<HTMLInputElement>) {
    const input = this.el.nativeElement;
    input.inputMode = 'numeric';
    input.autocomplete = 'off';
    input.placeholder = 'dd/mm/aaaa';
  }

  @HostListener('focus')
  @HostListener('click')
  onFocus() {
    this.adjustCaret();
  }

  @HostListener('input', ['$event'])
  onInput(event: Event) {
    const input = event.target as HTMLInputElement;
    input.value = this.format(input.value);
    
    this.adjustCaret();
  }

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    const input = event.target as HTMLInputElement;
    const key = event.key;

    if (key === 'Backspace') {
      this.handleBackspace(event, input);
      return;
    }

    const isNumber = /[0-9]/.test(key);
    const isControl = ['Delete', 'ArrowLeft', 'ArrowRight', 'Tab'].includes(key);

    if (!isNumber && !isControl) {
      event.preventDefault();
    }

    if (isNumber && this.clean(input.value).length >= 8) {
      event.preventDefault();
    }
  }

  private handleBackspace(event: KeyboardEvent, input: HTMLInputElement) {
    event.preventDefault();

    const start = input.selectionStart || 0;
    const end = input.selectionEnd || start;
    const val = input.value;
    
    const digitStart = this.getDigitIndex(val, start);
    const digitEnd = this.getDigitIndex(val, end);

    if (digitStart === 0 && start === end) return;

    const cleanVal = this.clean(val);
    const deleteCount = Math.max(digitStart - 1, 0);
    
    const newVal = cleanVal.slice(0, deleteCount) + cleanVal.slice(digitEnd);
    input.value = this.format(newVal);

    const newPos = this.getCaretPos(deleteCount);
    requestAnimationFrame(() => input.setSelectionRange(newPos, newPos));
  }

  private format(val: string): string {
    const v = this.clean(val).slice(0, 8);
    const day = v.slice(0, 2);
    const month = v.slice(2, 4);
    const year = v.slice(4, 8);

    let res = day;

    if (month) {
      res += '/' + month;
    } else if (res.length === 2) {
      res += '/';
    }

    if (year) {
      if (res.length <= 3) res = res.padEnd(3, '/');
      res += '/' + year;
    } else if (res.length === 5) {
      res += '/';
    }

    return res;
  }

  private adjustCaret() {
    const input = this.el.nativeElement;
    const len = this.clean(input.value).length;
    const pos = this.getCaretPos(len);
    
    requestAnimationFrame(() => input.setSelectionRange(pos, pos));
  }

  private getCaretPos(len: number): number {
    const positions = [0, 1, 3, 4, 6, 7, 8, 9];
    return positions[len] ?? 10;
  }

  private getDigitIndex(val: string, caret: number): number {
    let count = 0;
    for (let i = 0; i < Math.min(caret, val.length); i++) {
      if (/\d/.test(val[i])) count++;
    }
    return count;
  }

  private clean(val: string): string {
    return val.replace(/\D/g, '');
  }
}
