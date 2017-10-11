import { Directive, TemplateRef, ViewContainerRef, Input } from '@angular/core';

@Directive({
  selector: '[render]'
})
export class RenderDirective {

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef) { }
  
  @Input()
  set render(template: TemplateRef<any>) {
    this.viewContainer.createEmbeddedView(template);
  }
}
