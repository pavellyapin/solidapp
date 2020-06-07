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

//Get Pages

export const BeginGetAllPagesAction = createAction(
  '[Pages] - Begin LOAD Pages'
);

export const SuccessGetAllPagesAction = createAction(
  '[Pages] - Success LOAD Pages',
  props<{ payload: any }>()
);



//Resolution
export const BeginSetResolutionAction = createAction(
  '[Resolution] - Begin Set resolution'
);

export const SuccessSetResolutionAction = createAction(
  '[Resolution] - Success set resolution',
  props<{ payload: any }>()
);

//LOADING......

export const BeginLoadingAction = createAction(
  '[LOADING] - Begin'
);

export const SuccessLoadingAction = createAction(
  '[LOADING] - Success'
);


export const ErrorSettingsAction = createAction('[Settings] - Error', props<Error>());
