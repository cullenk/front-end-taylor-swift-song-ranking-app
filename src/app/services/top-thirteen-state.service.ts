import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { TopThirteenItem } from "../interfaces/Top13Item";

@Injectable({
  providedIn: 'root'
})
export class TopThirteenStateService {
  private topThirteenSubject = new BehaviorSubject<TopThirteenItem[]>([]);
  topThirteen$ = this.topThirteenSubject.asObservable();

  constructor() {
    console.log('TopThirteenStateService initialized');
  }

  updateTopThirteen(newList: TopThirteenItem[]) {
    console.log('TopThirteenStateService.updateTopThirteen() called with:', newList);
    this.topThirteenSubject.next(newList);
    console.log('TopThirteenStateService - Current state updated, subscribers will be notified');
  }

  getTopThirteen() {
    const currentValue = this.topThirteenSubject.value;
    console.log('TopThirteenStateService.getTopThirteen() called, current value:', currentValue);
    return currentValue;
  }
}