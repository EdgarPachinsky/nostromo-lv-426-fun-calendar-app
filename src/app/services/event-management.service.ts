import {EventEmitter, Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EventManagementService {

  updateEvents: EventEmitter<any> = new EventEmitter();

  constructor() { }
}
