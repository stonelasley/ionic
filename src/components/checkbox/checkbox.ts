import { AfterContentInit, Component, EventEmitter, forwardRef, HostListener, Input, OnDestroy, Optional, Output, Provider, ViewEncapsulation } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { Form } from '../../util/form';
import { Item } from '../item/item';
import { isTrueProperty } from '../../util/util';

export const CHECKBOX_VALUE_ACCESSOR = new Provider(
    NG_VALUE_ACCESSOR, {useExisting: forwardRef(() => Checkbox), multi: true});


/**
 * @name Checkbox
 * @module ionic
 *
 * @description
 * The Checkbox is a simple component styled based on the mode. It can be
 * placed in an `ion-item` or used as a stand-alone checkbox.
 *
 * See the [Angular 2 Docs](https://angular.io/docs/ts/latest/guide/forms.html)
 * for more info on forms and inputs.
 *
 *
 * @usage
 * ```html
 *
 *  <ion-list>
 *
 *    <ion-item>
 *      <ion-label>Pepperoni</ion-label>
 *      <ion-checkbox [(ngModel)]="pepperoni"></ion-checkbox>
 *    </ion-item>
 *
 *    <ion-item>
 *      <ion-label>Sausage</ion-label>
 *      <ion-checkbox [(ngModel)]="sausage" disabled="true"></ion-checkbox>
 *    </ion-item>
 *
 *    <ion-item>
 *      <ion-label>Mushrooms</ion-label>
 *      <ion-checkbox [(ngModel)]="mushrooms"></ion-checkbox>
 *    </ion-item>
 *
 *  </ion-list>
 * ```
 *
 * @demo /docs/v2/demos/checkbox/
 * @see {@link /docs/v2/components#checkbox Checkbox Component Docs}
 */
@Component({
  selector: 'ion-checkbox',
  template: `
    <div class="checkbox-icon" [class.checkbox-checked]="_checked">
      <div class="checkbox-inner"></div>
    </div>
    <button ion-button="item-cover"
            role="checkbox"
            type="button"
            [id]="id"
            [attr.aria-checked]="_checked"
            [attr.aria-labelledby]="_labelId"
            [attr.aria-disabled]="_disabled">
    </button>
  `,
  host: {
    '[class.checkbox-disabled]': '_disabled'
  },
  providers: [CHECKBOX_VALUE_ACCESSOR],
  encapsulation: ViewEncapsulation.None,
})
export class Checkbox implements AfterContentInit, ControlValueAccessor, OnDestroy {
  private _checked: boolean = false;
  private _init: boolean;
  private _disabled: boolean = false;
  private _labelId: string;
  private _fn: Function;

  /**
   * @private
   */
  id: string;

  /**
   * @output {Checkbox} expression to evaluate when the checkbox value changes
   */
  @Output() ionChange: EventEmitter<Checkbox> = new EventEmitter<Checkbox>();

  constructor(
    private _form: Form,
    @Optional() private _item: Item
  ) {
    _form.register(this);

    if (_item) {
      this.id = 'chk-' + _item.registerInput('checkbox');
      this._labelId = 'lbl-' + _item.id;
      this._item.setCssClass('item-checkbox', true);
    }
  }

  /**
   * @private
   */
  @HostListener('click', ['$event'])
  private _click(ev: UIEvent) {
    console.debug('checkbox, checked');
    ev.preventDefault();
    ev.stopPropagation();
    this.onChange(!this._checked);
  }

  /**
   * @input {boolean} whether or not the checkbox is checked (defaults to false)
   */
  @Input()
  get checked(): boolean {
    return this._checked;
  }

  set checked(val: boolean) {
    this._setChecked(isTrueProperty(val));
    this.onChange(this._checked);
  }

  /**
   * @private
   */
  private _setChecked(isChecked: boolean) {
    if (isChecked !== this._checked) {
      this._checked = isChecked;
      if (this._init) {
        this.ionChange.emit(this);
      }
      this._item && this._item.setCssClass('item-checkbox-checked', isChecked);
    }
  }

  /**
   * @private
   */
  writeValue(val: any) {
    this._setChecked( isTrueProperty(val) );
  }

  /**
   * @private
   */
  registerOnChange(fn: Function): void {
    this._fn = fn;
    this.onChange = (isChecked: boolean) => {
      console.debug('checkbox, onChange', isChecked);
      fn(isChecked);
      this._setChecked(isChecked);
      this.onTouched();
    };
  }

  /**
   * @private
   */
  registerOnTouched(fn: any) { this.onTouched = fn; }

  /**
   * @input {boolean} whether or not the checkbox is disabled or not.
   */
  @Input()
  get disabled(): boolean {
    return this._disabled;
  }

  set disabled(val: boolean) {
    this._disabled = isTrueProperty(val);
    this._item && this._item.setCssClass('item-checkbox-disabled', this._disabled);
  }

  /**
   * @private
   */
  onChange(isChecked: boolean) {
    // used when this input does not have an ngModel or formControlName
    console.debug('checkbox, onChange (no ngModel)', isChecked);
    this._setChecked(isChecked);
    this.onTouched();
  }

  /**
   * @private
   */
  onTouched() {}

  /**
   * @private
   */
  ngAfterContentInit() {
    this._init = true;
  }

  /**
   * @private
   */
  ngOnDestroy() {
    this._form.deregister(this);
  }
}
