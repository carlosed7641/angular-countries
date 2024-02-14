import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Subject, Subscription, debounceTime } from 'rxjs';

@Component({
  selector: 'shared-search-box',
  templateUrl: './search-box.component.html',
  styles: ``
})
export class SearchBoxComponent implements OnInit, OnDestroy {

  private debouncer = new Subject<string>()
  private debouncerSubscription?: Subscription

  @Input()
  placeholder: string = ''

  @Input()
  initialValue: string = ''

  @Output()
  onValue = new EventEmitter<string>()


  @Output()
  onDebounce = new EventEmitter<string>()

  // @ViewChild('txtSearchInput')
  // txtSearch!: ElementRef<HTMLInputElement>

  ngOnInit(): void {
    this.debouncerSubscription = this.debouncer
      .pipe(
        debounceTime(200)
      )
      .subscribe(value => {
        this.onDebounce.emit(value)
      })
  }

  ngOnDestroy(): void {
    this.debouncerSubscription?.unsubscribe()
  }

  // search() {
  //   this.onValue.emit(this.txtSearch.nativeElement.value)
  // }

  onKeyPress(seachTerm: string) {
    this.debouncer.next(seachTerm)
  }
}
