import {AfterViewInit, Component, ElementRef, EventEmitter, HostBinding, Input, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {fromEvent, merge, Observable, Subscription} from 'rxjs';
import {filter, map, pairwise, switchMap, takeUntil, tap} from 'rxjs/operators';
import {ModalWindowStateData} from "./model/modal-window-state.data";
import {ModalWindowSizeModifiersData} from "./model/modal-window-size-modifiers.data";

@Component({
  selector: 'app-modal-window',
  templateUrl: './modal-window.component.html',
  styleUrls: ['./modal-window.component.css'],
})
export class ModalWindowComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input()
  public headerTitle: string;

  @Input()
  id: string;
  @Output()
  decline: EventEmitter<void> = new EventEmitter();

  @ViewChild('header', {static: false})
  header: ElementRef;
  @ViewChild('footer', {static: false})
  footer: ElementRef;

  @HostBinding('class.full-size')
  fullSize = false;
  @HostBinding('class.default-size')
  defaultSize = false;
  @HostBinding('class.minimize-size')
  minimize = false;

  @Input()
  @HostBinding('class.resizable')
  resizable = true;

  @Input()
  baseHeight: string;
  @Input()
  baseWidth: string;
  @Input()
  minHeight: string;
  @Input()
  minWidth: string;

  @Input()
  allowMinimize = true;
  @Input()
  allowFullSize = true;

  @HostBinding('style.minHeight')
  get getMinHeight(): string {
    return this.minimize ? undefined : this.minHeight;
  }

  @HostBinding('style.minWidth')
  get getMinWidth(): string {
    return this.minimize ? undefined : this.minWidth;
  }

  private mousedownF$: Observable<MouseEvent>;
  private mousedownH$: Observable<MouseEvent>;
  private mousemove$: Observable<MouseEvent>;
  private mouseup$: Observable<MouseEvent>;

  private onModalDrag$: Observable<any>;
  private onModalDragSubscription$: Subscription;
  private onModalResize$: Observable<any>;
  private onModalResizeSubscription$: Subscription;

  private txtyCache: { tx?: number, ty?: number } = {tx: null, ty: null};

  constructor(
    public elementRef: ElementRef
  ) {
  }

  ngOnDestroy(): void {
    this.onModalDragSubscription$.unsubscribe();
    this.onModalResizeSubscription$.unsubscribe();

    this.saveUserModalSizeModifiers();
  }

  ngAfterViewInit(): void {
    this.mousedownF$ = fromEvent<MouseEvent>(this.header.nativeElement, 'mousedown');
    this.mousedownH$ = fromEvent<MouseEvent>(this.footer.nativeElement, 'mousedown');
    this.mousemove$ = fromEvent<MouseEvent>(document, 'mousemove');
    this.mouseup$ = fromEvent<MouseEvent>(document, 'mouseup');

    this.onModalDrag$ = this.initModalDrag();
    this.onModalDragSubscription$ = this.onModalDrag$.subscribe();

    this.onModalResize$ = this.initModalResize();
    this.onModalResizeSubscription$ = this.onModalResize$.subscribe();

    this.setSizeModifier();
    this.setPosition();
    this.setSize();
  }

  public initModalDrag(): Observable<any> {
    return merge(this.mousedownF$, this.mousedownH$).pipe(
      tap(event => this.markElementAsActiveModal(event)),
      tap(event => getBody().classList.add('disable-user-select')),
      switchMap((e) => {
          e?.stopPropagation();
          return this.onMouseMoveAfterMouseDown().pipe(
            takeUntil(this.mouseup$)
          );
        }
      )
    );
  }

  ngOnInit(): void {
  }

  public onFullSizeButtonClick(): void {
    this.fullSize = true;
    this.minimize = false;
    this.defaultSize = false;
  }

  public onNormalSizeButtonClick(): void {
    this.fullSize = false;
    this.minimize = false;

    this.txtyCache = {ty: 0, tx: 0};
    this.elementRef.nativeElement.style.transform = 'translate(0px, 0px)';
  }

  private setSize(): void {
    const size = this.getModalWindowStateData()?.size;

    size?.height
      ? this.elementRef.nativeElement.style.height = size?.height
      : this.elementRef.nativeElement.style.height = this.baseHeight;

    size?.width
      ? this.elementRef.nativeElement.style.width = size?.width
      : this.elementRef.nativeElement.style.width = this.baseWidth;
  }

  public setPosition(): void {
    const translate = this.getModalWindowStateData()?.translate;
    if (translate?.tx && translate?.ty) {
      this.elementRef.nativeElement.style.transform = `translate(${translate.tx}px, ${translate.ty}px)`;
    }
  }

  private initModalResize(): Observable<any> {
    return this.mouseup$.pipe(
      tap(() => {
        const width = this.elementRef.nativeElement.style.width;
        const height = this.elementRef.nativeElement.style.height;
        this.saveUserModalWindowSize(width, height);
        this.saveUserModalWindowTranslate(this.elementRef.nativeElement);
        getBody().classList.remove('disable-user-select');
      })
    );
  }

  public onMinimizeClick(): void {
    this.minimize = true;
    this.fullSize = false;

    this.txtyCache = {ty: 0, tx: 0};
    this.elementRef.nativeElement.style.transform = `translate(${0}px, ${0}px)`;
  }

  public onSetDefault(): void {
    this.minimize = false;
    this.fullSize = false;

    this.elementRef.nativeElement.style.width = this.baseWidth;
    this.elementRef.nativeElement.style.height = this.baseHeight;

    this.txtyCache = {ty: 0, tx: 0};
    this.elementRef.nativeElement.style.transform = 'translate(0px, 0px)';
  }

  private onMouseMoveAfterMouseDown(): Observable<any> {
    return this.mousemove$.pipe(
      filter(() => !this.fullSize),
      pairwise(),
      map(([moveEvent1, moveEvent2]) => {

        const ty = moveEvent2.clientY - moveEvent1.clientY;
        const tx = moveEvent2.clientX - moveEvent1.clientX;
        return {ty, tx};
      }),
      tap((translate) => {
        let tx = 0;
        let ty = 0;

        if (this.txtyCache.tx != null && this.txtyCache.ty != null) {
          tx = this.txtyCache.tx;
          ty = this.txtyCache.ty;
        } else {
          const translateValuesFromElement = this.getTranslateValues(this.elementRef.nativeElement);

          tx = translateValuesFromElement.tx;
          ty = translateValuesFromElement.ty;
        }

        tx = tx + translate.tx;
        ty = ty + translate.ty;

        this.txtyCache = {tx, ty};

        this.elementRef.nativeElement.style.transform = `translate(${tx}px, ${ty}px)`;
      })
    );
  }

  public getTranslateValues(element: HTMLElement): { tx: number, ty: number } {
    let tx = 0;
    let ty = 0;

    const transform: string = element.style.transform;
    const txty: string[] = transform
      .replace('translate(', '')
      .replace(')', '')
      .replace('px', '')
      .replace('px', '')
      .split(',')
      .filter(el => el != null && el !== '');

    if (txty.length === 2) {
      tx = parseInt(txty[0], 10);
      ty = parseInt(txty[1], 10);
    }

    return {
      tx, ty
    };
  }

  public markElementAsActiveModal(event: any): void {
    const nativeElement = this.elementRef.nativeElement;
    // tslint:disable-next-line:no-shadowed-variable
    const elementsByClassName = document.getElementsByClassName('active-modal');
    Array.prototype.forEach.call(elementsByClassName, (element) => {
      element.classList.remove('active-modal');
    });
    if (nativeElement.contains(event.target)) {
      nativeElement.classList.add('active-modal');
    }
  }

  private saveUserModalWindowSize(width: string, height: string): void {
    const modalWindowStateData = this.getModalWindowStateData();
    modalWindowStateData.size = {width, height};
    this.setModalWindowStateData(modalWindowStateData);
  }

  public getModalWindowStateData(): ModalWindowStateData {
    const modalWindowStateDataString = sessionStorage.getItem(`${this.id}:data`);
    let modalWindowStateData: ModalWindowStateData = JSON.parse(modalWindowStateDataString);
    if (modalWindowStateData == null) {
      // @ts-ignore
      modalWindowStateData = {};
    }
    return modalWindowStateData;
  }

  public setModalWindowStateData(modalWindowStateData: ModalWindowStateData): void {
    sessionStorage.setItem(`${this.id}:data`, JSON.stringify(modalWindowStateData));
  }

  private saveUserModalWindowTranslate(nativeElement: HTMLElement): void {
    const modalWindowStateData = this.getModalWindowStateData();
    modalWindowStateData.translate = this.getTranslateValues(nativeElement);
    this.setModalWindowStateData(modalWindowStateData);
  }

  private setSizeModifier(): void {
    const sizeModifiers = this.getModalWindowSizeModifiersData();

    if (sizeModifiers) {
      if (sizeModifiers.fullSize != null) {
        this.fullSize = sizeModifiers.fullSize;
      }
      if (sizeModifiers.defaultSize != null) {
        this.defaultSize = sizeModifiers.defaultSize;
      }
      if (sizeModifiers.minimize != null) {
        this.minimize = sizeModifiers.minimize;
      }
    }
  }

  private saveUserModalSizeModifiers(): void {
    sessionStorage.setItem(`${this.id}:sizeModifiers`, JSON.stringify({
      fullSize: this.fullSize,
      defaultSize: this.defaultSize,
      minimize: this.minimize
    }));
  }

  private getModalWindowSizeModifiersData(): ModalWindowSizeModifiersData {
    const modalWindowStateDataString = sessionStorage.getItem(`${this.id}:sizeModifiers`);
    return JSON.parse(modalWindowStateDataString);
  }
}

export function getBody(): HTMLElement {
  return document.getElementsByTagName('body')[0];
}
