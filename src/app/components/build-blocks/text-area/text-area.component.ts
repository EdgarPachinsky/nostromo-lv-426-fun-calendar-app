import {Component, Input} from '@angular/core';
import {FormControlName, FormGroup, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatError, MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {MatIcon} from "@angular/material/icon";
import {MatIconButton} from "@angular/material/button";

@Component({
  selector: 'app-text-area',
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
  templateUrl: './text-area.component.html',
})
export class TextAreaComponent {
  @Input() label!: string;
  @Input() formGroup!: FormGroup;
  @Input() formControlNameString!: string;
}
