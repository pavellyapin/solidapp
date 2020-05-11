import { createAction, props } from '@ngrx/store';

export const BeginLoadSettingsAction = createAction(
  '[Settings] - Begin LOAD'
);

export const SuccessLoadSettingsAction = createAction(
  '[Settings] - Success LOAD',
  props<{ payload: any }>()
);


//Get Categories
export const BeginGetActiveCategoriesAction = createAction(
  '[Categories] - Begin LOAD'
);

export const SuccessGetActiveCategoriesAction = createAction(
  '[Categories] - Success LOAD',
  props<{ payload: any }>()
);

//Resolution
export const BeginSetResolutionAction = createAction(
  '[Categories] - Begin Set resolution'
);

export const SuccessSetResolutionAction = createAction(
  '[Categories] - Success set resolution',
  props<{ payload: any }>()
);


export const ErrorSettingsAction = createAction('[Settings] - Error', props<Error>());
