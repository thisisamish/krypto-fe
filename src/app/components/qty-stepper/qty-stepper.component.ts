import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-qty-stepper',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './qty-stepper.component.html',
  styleUrls: ['./qty-stepper.component.css'],
})
export class QtyStepperComponent {
  @Input() value = 0;
  @Input() min = 0;
  @Input() max: number | null = null;
  @Input() step = 1;
  @Input() disabled = false;
  @Input() size: 'sm' | 'md' = 'sm';
  @Output() valueChange = new EventEmitter<number>();

  private clamp(n: number) {
    const s = Math.trunc(Number.isFinite(n) ? n : 0);
    const lo = this.min ?? 0;
    const hi = this.max ?? Number.POSITIVE_INFINITY;
    return Math.min(hi, Math.max(lo, s));
  }

  increment() {
    if (this.disabled) return;
    this.value = this.clamp(this.value + this.step);
    this.valueChange.emit(this.value);
  }

  decrement() {
    if (this.disabled) return;
    this.value = this.clamp(this.value - this.step);
    this.valueChange.emit(this.value);
  }

  onInput(ev: Event) {
    const next = parseFloat((ev.target as HTMLInputElement).value);
    this.value = this.clamp(Number.isFinite(next) ? next : 0);
    this.valueChange.emit(this.value);
  }

  onBlur() {
    // normalize display (e.g., empty -> min)
    this.value = this.clamp(this.value);
    this.valueChange.emit(this.value);
  }
}
