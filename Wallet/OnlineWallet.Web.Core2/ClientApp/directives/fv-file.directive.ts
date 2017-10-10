import { Directive, ElementRef, Input, OnChanges, SimpleChanges, EventEmitter, Output, HostListener } from '@angular/core';
import { ICommand } from "directives/ICommand";

@Directive({
  selector: '[fvFile][type=file]'
})
export class FvFileDirective {
  
  @Input("fvFile")
  model: IFileList;

  @Output("fvFileChange")
  update = new EventEmitter<IFileList>();

  constructor(private element: ElementRef) {
    
  }
  
  @HostListener("change") onChange() {
    var input = this.element.nativeElement;
    var files = input.files;
    this.update.emit(files);
  }

}

export interface IFileList {
    readonly length: number;
    item(index: number): any;
    [index: number]: any;
}
