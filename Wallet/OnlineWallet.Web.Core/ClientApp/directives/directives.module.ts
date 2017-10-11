import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommandFocusDirective } from './command-focus.directive';
import { FvFileDirective } from "./fv-file.directive";
import { RenderDirective } from "./render.directive";

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    CommandFocusDirective,
    FvFileDirective,
    RenderDirective
  ],
  exports: [
    CommandFocusDirective,
    FvFileDirective,
    RenderDirective
  ]
})
export class DirectivesModule { }
