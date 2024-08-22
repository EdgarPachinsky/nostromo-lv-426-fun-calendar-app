import {Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges} from '@angular/core';
import {
  convertToEventArray, deleteEvent,
  formatDate,
  formatDateToKey,
  generateTimeBlockObjects,
  getAvailableTimeKeys, getEventsForDate,
  setEvent
} from "../../../utils/utils";
import {InputComponent} from "../../build-blocks/input/input.component";
import {FormControl, FormGroup} from "@angular/forms";
import {Subscription} from "rxjs";
import {TextAreaComponent} from "../../build-blocks/text-area/text-area.component";
import {SelectComponent} from "../../build-blocks/select/select.component";
import {EventActionsComponent} from "../../dialogs/event-actions/event-actions.component";
import {MatDialog} from "@angular/material/dialog";
import {EventManagementService} from "../../../services/event-management.service";
import {ButtonComponent} from "../../build-blocks/button/button.component";
import {MatIcon} from "@angular/material/icon";
import {MatTooltip} from "@angular/material/tooltip";
import {CdkDrag} from "@angular/cdk/drag-drop";
import {IEvent} from "../../../models/event.model";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-scheduler',
  standalone: true,
  imports: [
    InputComponent,
    TextAreaComponent,
    SelectComponent,
    ButtonComponent,
    MatIcon,
    MatTooltip,
    CdkDrag
  ],
  templateUrl: './scheduler.component.html',
})
export class SchedulerComponent implements OnInit, OnDestroy, OnChanges{
  @Input() interval!: number;
  @Input() selectedDate!: Date | null;

  private readonly $subscription = new Subscription();
  protected readonly formatDate = formatDate;
  public timeBlocks:Array<{time: string, show:boolean}> = [];
  public selectedDateKey!: string | null;
  allEvents!: { [timeKey:string]: IEvent } | null;
  busyIndex!: number;

  constructor(
    public dialog: MatDialog,
    public matSnackBar: MatSnackBar,
    public eventManagementService: EventManagementService,
  ) {
  }

  ngOnInit() {
    this.getEvents();

    this.$subscription.add(
      this.eventManagementService.updateEvents.subscribe((res) => {
        this.getEvents();
      })
    )
  }

  getEvents(){
    this.allEvents = getEventsForDate(formatDateToKey(this.selectedDate as Date));
  }

  calculateTimeBlocks(){
    const startTime = new Date();
    startTime.setHours(0, 0, 0, 0); // 12:00

    const endTime = new Date();
    endTime.setHours(24, 0, 0, 0); // 22:00

    this.timeBlocks = generateTimeBlockObjects(startTime, endTime, this.interval);
    this.timeBlocks.pop();
  }

  ngOnChanges(changes: SimpleChanges) {
    if(changes['interval']?.currentValue){
      this.calculateTimeBlocks();

      this.getEvents();
    }

    if(changes['selectedDate']?.currentValue && this.selectedDate){
      this.selectedDateKey = formatDateToKey(this.selectedDate);

      this.getEvents();
    }
  }

  addEvent(time: string){
    const startTime = new Date();
    startTime.setHours(0, 0, 0, 0); // 12:00

    const endTime = new Date();
    endTime.setHours(24, 0, 0, 0); // 22:00

    let eventActionsComponentRef = this.dialog.open(EventActionsComponent, {
      width: '600px',
      autoFocus: false,
      data: {
        time,
        timeOptions: getAvailableTimeKeys(
          formatDateToKey(this.selectedDate as Date), startTime, endTime, this.interval || 15
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
        setEvent(formatDateToKey(this.selectedDate as Date), res.time, res)
        this.matSnackBar.open(`Event Added Successfully At ${res.time}!` , '',{duration:2000, horizontalPosition: 'start', verticalPosition: 'top'})
        this.eventManagementService.updateEvents.next(true)
      })
    )
  }

  deleteEvent(time: string){
    deleteEvent(formatDateToKey(this.selectedDate as Date), time)
    this.eventManagementService.updateEvents.next(true)
  }

  editEvent(time: string, event: IEvent){
    const startTime = new Date();
    startTime.setHours(0, 0, 0, 0); // 12:00

    const endTime = new Date();
    endTime.setHours(24, 0, 0, 0); // 22:00

    let eventActionsComponentRef = this.dialog.open(EventActionsComponent, {
      width: '600px',
      autoFocus: false,
      data: {
        event,
        timeOptions: getAvailableTimeKeys(
          formatDateToKey(this.selectedDate as Date), startTime, endTime, this.interval || 15
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
        deleteEvent(formatDateToKey(this.selectedDate as Date), time);
        setEvent(formatDateToKey(this.selectedDate as Date), res.time, res);
        this.matSnackBar.open('Event Edited Successfully' , '',{duration:2000, horizontalPosition: 'start', verticalPosition: 'top'})
        this.eventManagementService.updateEvents.next(true);
      })
    )
  }

  initializeStartCoordinates($event: any, event: IEvent, index: number){
    this.busyIndex = index;
    // Capture the initial position
    event.initialY = $event.source.getFreeDragPosition().y;
  }

  dragEnded($event: any, event: IEvent, index: number){
    // get the drag position
    const dragPosition = $event.source.getFreeDragPosition();
    const { y } = dragPosition;
    // divide y by 50 , height of each block
    let indexOffset = ~~(Math.floor(y/50))
    // add it to initial index , indexOffset can be negative if direction is up
    // means we will need to subtract
    // and positive if direction is down , means we need to add
    // anyway by just adding offset to initial index we will get right index in time blocks
    index = index + indexOffset

    //check if occupied by other appointment
    if(this.allEvents && this.allEvents[this.timeBlocks[index].time]){
      // revert if occupied
      $event.source._dragRef.setFreeDragPosition({ x: 0, y: event.initialY });
      delete event.initialY;

      this.matSnackBar.open('Sorry But Slot Is Occupied By Other Event !' , '',{duration:2000, horizontalPosition: 'start', verticalPosition: 'top'})
      return
    }

    // delete old event
    deleteEvent(formatDateToKey(this.selectedDate as Date), event.time as string)
    // change time in new data
    event.time = this.timeBlocks[index].time;
    // add event
    setEvent(formatDateToKey(this.selectedDate as Date), this.timeBlocks[index].time, event);
    // notify observers

    this.matSnackBar.open(`Event Time Edited Successfully. New Time Is ${this.timeBlocks[index].time}` , '',{duration:2000, horizontalPosition: 'start', verticalPosition: 'top'})
    this.eventManagementService.updateEvents.next(true)
  }

  ngOnDestroy() {
    this.$subscription.unsubscribe();
  }
}
