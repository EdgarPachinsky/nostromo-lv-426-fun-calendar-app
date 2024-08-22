import {Component, model, OnDestroy, OnInit} from '@angular/core';
import {MatCard} from "@angular/material/card";
import {MatCalendar} from "@angular/material/datepicker";
import {provideNativeDateAdapter} from "@angular/material/core";
import {ButtonComponent} from "../button/button.component";
import {SchedulerComponent} from "../../parts/scheduler/scheduler.component";
import {SelectComponent} from "../select/select.component";
import {FormControl, FormGroup, FormsModule} from "@angular/forms";
import {Subscription} from "rxjs";
import {MatDialog} from "@angular/material/dialog";
import {EventActionsComponent} from "../../dialogs/event-actions/event-actions.component";
import {
  convertToEventArray,
  formatDateToKey,
  getAvailableTimeKeys,
  getEventsForDate,
  setEvent
} from "../../../utils/utils";
import {EventManagementService} from "../../../services/event-management.service";
import {IEvent} from "../../../models/event.model";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [
    MatCard,
    MatCalendar,
    ButtonComponent,
    SchedulerComponent,
    SelectComponent,
    FormsModule
  ],
  templateUrl: './calendar.component.html',
  providers: [provideNativeDateAdapter()],
})
export class CalendarComponent implements OnInit, OnDestroy{
  private readonly $subscription = new Subscription();
  protected readonly parseInt = parseInt;
  selectedDate: Date | null = new Date();

  formGroup!: FormGroup;
  selectOptions = [
    {value:'5' ,  label: '5'},
    {value:'10' , label: '10'},
    {value:'15' , label: '15'},
    {value:'20' , label: '20'},
    {value:'30' , label: '30'}
  ]
  allEvents: IEvent[] = [];

  constructor(
    public dialog: MatDialog,
    public matSnackBar: MatSnackBar,
    public eventManagementService: EventManagementService,
  ) {
  }

  ngOnInit() {
    this.formGroup = new FormGroup({
      'interval': new FormControl(15)
    })
    this.getEvents();

    this.$subscription.add(
      this.eventManagementService.updateEvents.subscribe((res) => {
        this.getEvents();
      })
    )
    this.$subscription.add(
      this.formGroup.valueChanges.subscribe((res) => {
        if(res['interval']){
          this.getEvents();
        }
      })
    )
  }

  getEvents(){
    this.allEvents =
      convertToEventArray(
        getEventsForDate(
          formatDateToKey(this.selectedDate as Date)
        )
      )
  }

  addEvent(){
    const startTime = new Date();
    startTime.setHours(0, 0, 0, 0); // 12:00

    const endTime = new Date();
    endTime.setHours(24, 0, 0, 0); // 22:00

    let eventActionsComponentRef = this.dialog.open(EventActionsComponent, {
      width: '600px',
      autoFocus: false,
      data: {
        timeOptions: getAvailableTimeKeys(
          formatDateToKey(this.selectedDate as Date), startTime, endTime, parseInt(this.formGroup.get('interval')?.value) || 15
        ).map((el) => {
          return {
            value: el.time,
            label: el.time,
          }
        })
      }
    })
    this.$subscription.add(
      eventActionsComponentRef.afterClosed().subscribe((res) => {
        if(!res){
          return;
        }
        setEvent(formatDateToKey(this.selectedDate as Date), res.time, res);
        this.matSnackBar.open(`Event Added Successfully At ${res.time}!` , '',{duration:2000, horizontalPosition: 'start', verticalPosition: 'top'})
        this.eventManagementService.updateEvents.next(true)
      })
    )
  }

  ngOnDestroy() {
    this.$subscription.unsubscribe();
  }
}
