import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { TopThirteenItem } from "../interfaces/Top13Item";

@Injectable({
  providedIn: 'root'
})
export class TopThirteenStateService {
  private topThirteenSubject = new BehaviorSubject<TopThirteenItem[]>([]);
  topThirteen$ = this.topThirteenSubject.asObservable();

  updateTopThirteen(newList: TopThirteenItem[]) {
    this.topThirteenSubject.next(newList);
  }

  getTopThirteen() {
    return this.topThirteenSubject.value;
  }
}