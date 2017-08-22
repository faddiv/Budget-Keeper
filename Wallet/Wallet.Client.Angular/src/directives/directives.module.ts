import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommandFocusDirective } from './command-focus.directive';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    CommandFocusDirective
  ],
  exports: [
    CommandFocusDirective
  ]
})
export class DirectivesModule { }
