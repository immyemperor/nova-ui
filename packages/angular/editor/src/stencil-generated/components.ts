/* tslint:disable */
/* auto-generated angular directive proxies */
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter, Output, NgZone } from '@angular/core';

import { ProxyCmp } from './angular-component-lib/utils';

import type { Components } from '@omni/editor/components';

import { defineCustomElement as defineUiEditor } from '@omni/editor/components/ui-editor.js';
@ProxyCmp({
  defineCustomElementFn: defineUiEditor,
  inputs: ['accept', 'attachmentAccept', 'disabled', 'error', 'focusOnLoad', 'hint', 'label', 'maxFileSize', 'maxHeight', 'maxLength', 'mentionProvider', 'minHeight', 'name', 'placeholder', 'preset', 'readonly', 'required', 'slashCommands', 'toolbar', 'uploadHandler', 'value'],
  methods: ['getContentHTML', 'getContentJSON', 'getContentText', 'setContent', 'clear', 'insertContent', 'focusEditor', 'getEditor']
})
@Component({
  selector: 'ui-editor',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['accept', 'attachmentAccept', 'disabled', 'error', 'focusOnLoad', 'hint', 'label', 'maxFileSize', 'maxHeight', 'maxLength', 'mentionProvider', 'minHeight', 'name', 'placeholder', 'preset', 'readonly', 'required', 'slashCommands', 'toolbar', 'uploadHandler', 'value'],
  outputs: ['uiChange', 'uiFocus', 'uiBlur', 'uiReady', 'uiUploadStart', 'uiUploadComplete', 'uiUploadError'],
})
export class UiEditor {
  protected el: HTMLUiEditorElement;
  @Output() uiChange = new EventEmitter<UiEditorCustomEvent<string>>();
  @Output() uiFocus = new EventEmitter<UiEditorCustomEvent<void>>();
  @Output() uiBlur = new EventEmitter<UiEditorCustomEvent<void>>();
  @Output() uiReady = new EventEmitter<UiEditorCustomEvent<void>>();
  @Output() uiUploadStart = new EventEmitter<UiEditorCustomEvent<{ file: File }>>();
  @Output() uiUploadComplete = new EventEmitter<UiEditorCustomEvent<{ file: File; url: string }>>();
  @Output() uiUploadError = new EventEmitter<UiEditorCustomEvent<{ file: File; message: string }>>();
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


import type { UiEditorCustomEvent } from '@omni/editor/components';

export declare interface UiEditor extends Components.UiEditor {
  /**
   * Fires on every content change with the HTML.
   */
  uiChange: EventEmitter<UiEditorCustomEvent<string>>;

  uiFocus: EventEmitter<UiEditorCustomEvent<void>>;

  uiBlur: EventEmitter<UiEditorCustomEvent<void>>;

  uiReady: EventEmitter<UiEditorCustomEvent<void>>;

  uiUploadStart: EventEmitter<UiEditorCustomEvent<{ file: File }>>;

  uiUploadComplete: EventEmitter<UiEditorCustomEvent<{ file: File; url: string }>>;

  uiUploadError: EventEmitter<UiEditorCustomEvent<{ file: File; message: string }>>;
}


