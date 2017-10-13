import { Directive, ElementRef, Input, OnChanges, SimpleChanges, EventEmitter, Output, HostListener } from '@angular/core';

@Directive({
  selector: '[fvFile][type=file]'
})
export class FvFileDirective {
  
  @Input("fvFile")
  model: FileList;

  @Output("fvFileChange")
  update = new EventEmitter<FileList>();

  constructor(private element: ElementRef) {
    
  }
  
  @HostListener("change", ["$event"]) onChange($event: Event) {
    var input =(<HTMLInputElement>$event.target);
    var files = input.files;
    this.update.emit(files);
  }

}
