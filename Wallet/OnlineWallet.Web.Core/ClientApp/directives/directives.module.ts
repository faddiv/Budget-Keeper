import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommandFocusDirective } from './command-focus.directive';
import { FvFileDirective } from "./fv-file.directive";
import { RenderDirective } from "./render.directive";
import { FocusService } from "./focus.service";

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
  ],
  providers:[FocusService]
})
export class DirectivesModule { }
