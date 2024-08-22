import {Component, OnInit} from '@angular/core';
import {ButtonComponent} from "../../components/build-blocks/button/button.component";
import {CalendarComponent} from "../../components/build-blocks/calendar/calendar.component";
import {MatIcon} from "@angular/material/icon";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    ButtonComponent,
    CalendarComponent,
    MatIcon
  ],
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit{

  buttonClick(text:string){
    console.log(text)
  }

  ngOnInit() {

  }
}
