import { CommandFocusDirective } from "./command-focus.directive";
import { ComponentFixture, TestBed, inject } from "@angular/core/testing";

import { FocusService } from "./focus.service";
import { ElementRef, Component, NO_ERRORS_SCHEMA } from "@angular/core";
import { By } from "@angular/platform-browser";

describe("CommandFocusDirective", () => {

  let fixture: ComponentFixture<TestComponent>;

  beforeEach(() => {
    fixture = TestBed.configureTestingModule({
      providers: [FocusService],
      declarations: [TestComponent, CommandFocusDirective],
      schemas: [NO_ERRORS_SCHEMA]
    }).createComponent(TestComponent);
    fixture.detectChanges();
  });

  it("should create an instance", inject([FocusService], (focusService: FocusService) => {
    expect(focusService).toBeTruthy();
    const result = fixture.debugElement.queryAll(By.directive(CommandFocusDirective));
    expect(result).toBeTruthy();
    expect(result.length).toBe(2);
  }));

  it("should focus an element", inject([FocusService], (focusService: FocusService) => {
    const first = fixture.debugElement.queryAll(By.directive(CommandFocusDirective))[0];
    expect(first).toBeTruthy();
    expect(first.nativeElement).not.toBe(document.activeElement);

    focusService.focus("first");

    expect(first.nativeElement).toBe(document.activeElement);
  }));

  it("should focus an element with dynamic name", inject([FocusService], (focusService: FocusService) => {
    const second = fixture.debugElement.queryAll(By.directive(CommandFocusDirective))[1];
    expect(second).toBeTruthy();
    expect(second.nativeElement).not.toBe(document.activeElement);

    fixture.componentInstance.dynamic = "asdf";
    fixture.detectChanges();

    focusService.focus("asdf");

    expect(second.nativeElement).toBe(document.activeElement);
  }));
});

@Component({
  template: `
    <input type="text" focus-id="first" name="first" />
    <input type="text" [focus-id]="dynamic" name="second" />
  `
})
class TestComponent {
  dynamic: string;
  constructor() {

  }
}
