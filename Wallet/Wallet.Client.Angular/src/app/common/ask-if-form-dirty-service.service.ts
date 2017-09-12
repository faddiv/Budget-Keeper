import { Injectable } from '@angular/core';
import { CanDeactivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class AskIfFormDirtyServiceService implements CanDeactivate<IDirtyForm> {

  constructor() { }

  canDeactivate(component: IDirtyForm, currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot, nextState?: RouterStateSnapshot): boolean | Observable<boolean> | Promise<boolean> {
    var isDirt = component.isDirtyForm && component.isDirtyForm();
    if (!isDirt || confirm("There is unsaved data on the form. Are you sure leaving?")) {
      return true;
    }
    return false;
  }
}

export interface IDirtyForm {
  isDirtyForm();
}