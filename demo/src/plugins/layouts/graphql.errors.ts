import { ErrorResult } from '@gseller/core';
export class LayoutCategoryTitleInvalid extends ErrorResult {
    readonly __typename = 'LayoutCategoryTitleInvalid';
    readonly errorCode = 'LAYOUT_CATEGORY_TITLE_INVALID';
    readonly message = 'Invalid layout category title.';
}

export class LayoutTitleInvalid extends ErrorResult {
    readonly __typename = 'LayoutTitleInvalid';
    readonly errorCode = 'LAYOUT_TITLE_INVALID';
    readonly message = 'Invalid layout title.';
}
  
export class LayoutCategoryInvalidID extends ErrorResult {
    readonly __typename = 'LayoutCategoryInvalidID';
    readonly errorCode = 'LAYOUT_CATEGORY_INVALID_ID';
    readonly message = 'Invalid layout category ID.';
}
  
export class InvalidData extends ErrorResult {
    readonly __typename = 'InvalidData';
    readonly errorCode = 'INVALID_DATA';
    readonly message = 'Invalid data.';
}
  
export class InvalidLayoutPrice extends ErrorResult {
    readonly __typename = 'InvalidLayoutPrice';
    readonly errorCode = 'INVALID_LAYOUT_PRICE';
    readonly message = 'Invalid layout price.';
}
  
export class LayoutInvalid extends ErrorResult {
    readonly __typename = 'LayoutInvalid';
    readonly errorCode = 'LAYOUT_INVALID';
    readonly message = 'Invalid layout.';
}
  
export class LayoutIDInvalid extends ErrorResult {
    readonly __typename = 'LayoutIDInvalid';
    readonly errorCode = 'LAYOUT_ID_INVALID';
    readonly message = 'Invalid layout ID.';
}
