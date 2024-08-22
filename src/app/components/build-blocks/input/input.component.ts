import {Component, Input} from '@angular/core';
import {MatError, MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {FormGroup, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatIcon} from "@angular/material/icon";
import {MatIconButton} from "@angular/material/button";

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [
    MatFormField,
    MatInput,
    FormsModule,
    MatIcon,
    MatIconButton,
    MatLabel,
    ReactiveFormsModule,
    MatError
  ],
  templateUrl: './input.component.html',
})
export class InputComponent {
  @Input() label!: string;
  @Input() formGroup!: FormGroup;
  @Input() formControlNameString!: string;
}
