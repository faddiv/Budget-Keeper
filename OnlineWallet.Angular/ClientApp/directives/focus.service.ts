import { Injectable } from '@angular/core';

@Injectable()
export class FocusService {

  private listeners: {
    [id: string]: () => void;
  } = {};

  constructor() { }

  public subscribe(id: string, callback: () => void): () => void {
    this.listeners[id] = callback;
    return () => {
      delete this.listeners[id];
    }
  }

  public focus(id: string) {
    if (this.listeners[id]) {
      this.listeners[id]();
    }
  }
}
