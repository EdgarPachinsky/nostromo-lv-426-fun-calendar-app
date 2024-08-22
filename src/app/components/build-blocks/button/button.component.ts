import {Component, EventEmitter, HostListener, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {NgClass} from "@angular/common";

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [
    NgClass
  ],
  templateUrl: './button.component.html',
})
export class ButtonComponent implements OnInit, OnChanges{
  @Input() title!: string;
  @Input() additionalContainerClasses!: string[];
  @Input() additionalButtonClasses!: string[];
  @Input() size: 'extra-small' | 'small' | 'medium' | 'large' = 'small';
  @Input() isActive!: boolean;

  @Output() clickE: EventEmitter<any> = new EventEmitter();
  buttonClassList:string[] = ['alien-button'];
  containerClassList:string[] = ['alien-div'];

  disableHostListeners: boolean = false;

  onButtonClick(){
    this.clickE.emit(true)
  }

  ngOnInit() {
    this.buttonClassList.push(this.size)

    if(this.additionalButtonClasses?.length){
      this.buttonClassList = this.buttonClassList.concat(this.additionalButtonClasses);
    }
    if(this.additionalContainerClasses?.length){
      this.containerClassList = this.containerClassList || [];
      this.containerClassList = this.containerClassList.concat(this.additionalContainerClasses);
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if(changes['isActive']?.currentValue){
      this.disableHostListeners = true;
      this.addActiveClass();
    }else{
      this.disableHostListeners = false;
      this.removeActiveClass();
    }
  }

  private addActiveClass() {
    if (!this.buttonClassList.includes('active')) {
      this.buttonClassList.push('active');
    }
  }

  private removeActiveClass() {
    const index = this.buttonClassList.indexOf('active');
    if (index !== -1) {
      this.buttonClassList.splice(index, 1);
    }
  }
}
