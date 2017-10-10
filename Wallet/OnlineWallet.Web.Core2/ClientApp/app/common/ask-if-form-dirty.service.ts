import { Injectable } from '@angular/core';
import { CanDeactivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class AskIfFormDirtyService implements CanDeactivate<ICleanForm> {

  constructor() { }

  canDeactivate(component: ICleanForm, currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot, nextState?: RouterStateSnapshot): boolean | Observable<boolean> | Promise<boolean> {
    var isCleanForm = !component.isCleanForm || component.isCleanForm();
    if (isCleanForm || confirm("There is unsaved data on the form. Are you sure leaving?")) {
      return true;
    }
    return false;
  }
}

export interface ICleanForm {
  isCleanForm(): boolean;
}