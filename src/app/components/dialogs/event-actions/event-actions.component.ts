import {ChangeDetectorRef, Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogContent, MatDialogRef} from "@angular/material/dialog";
import {InputComponent} from "../../build-blocks/input/input.component";
import {Form, FormControl, FormGroup, Validators} from "@angular/forms";
import {Subscription} from "rxjs";
import {ButtonComponent} from "../../build-blocks/button/button.component";
import {TextAreaComponent} from "../../build-blocks/text-area/text-area.component";
import {SelectComponent} from "../../build-blocks/select/select.component";
import {CdkDrag} from "@angular/cdk/drag-drop";

@Component({
  selector: 'app-event-actions',
  standalone: true,
  imports: [
    MatDialogContent,
    InputComponent,
    ButtonComponent,
    TextAreaComponent,
    SelectComponent,
    CdkDrag
  ],
  templateUrl: './event-actions.component.html',
})
export class EventActionsComponent implements OnInit, OnDestroy {
  private readonly $subscription = new Subscription();
  formGroup!: FormGroup;

  constructor(
    public matDialog: MatDialog,
    public changeDetectorRef: ChangeDetectorRef,
    public matDialogRef: MatDialogRef<EventActionsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
  }

  ngOnInit() {
    this.formGroup = new FormGroup({
      'title': new FormControl('', [Validators.required]),
      'description': new FormControl('', []),
      'time': new FormControl('', [Validators.required]),
    })

    if(this.data?.event){
      this.data.timeOptions.push({
        value: this.data.event.time,
        label: this.data.event.time,
      })

      this.initializeFormValues();
    }

    if(this.data.time){
      this.formGroup.get('time')?.patchValue(this.data.time);
      this.formGroup.get('time')?.disable();
    }
  }

  initializeFormValues(){
    this.formGroup.get('title')?.patchValue(this.data.event.title)
    this.formGroup.get('description')?.patchValue(this.data.event.description)
    this.formGroup.get('time')?.patchValue(this.data.event.time)
  }

  save(){
    if(this.formGroup.invalid){
      this.formGroup.markAllAsTouched()
      return;
    }

    this.matDialogRef.close(this.formGroup.getRawValue())
  }

  close(){
    this.matDialogRef.close()
  }

  ngOnDestroy() {
    this.$subscription.unsubscribe()
  }
}
