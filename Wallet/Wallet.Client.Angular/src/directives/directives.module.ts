import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommandFocusDirective } from './command-focus.directive';
import { FvFileDirective } from "directives/fv-file.directive";

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    CommandFocusDirective,
    FvFileDirective
  ],
  exports: [
    CommandFocusDirective,
    FvFileDirective
  ]
})
export class DirectivesModule { }
