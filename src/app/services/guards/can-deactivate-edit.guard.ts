import { inject } from '@angular/core';
import { CanDeactivateFn } from '@angular/router';
import { AccountComponent } from 'src/app/pages/user/account/account/account.component';
import { FormStatusService } from '../form/form-status.service';
import { Observable } from 'rxjs';

export const CanDeactivateEditGuardFn: CanDeactivateFn<AccountComponent> = ():
  | Observable<boolean>
  | boolean => {
  const formStatusService = inject(FormStatusService);

  if (formStatusService.getFormEdited) {
    return true;
  }

  return false;
};
