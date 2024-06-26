import { inject } from '@angular/core';
import { CanDeactivateFn } from '@angular/router';
import { marker as _ } from '@jsverse/transloco-keys-manager/marker';
import { Observable } from 'rxjs';
import { AccountComponent } from 'src/app/pages/user/account/account/account.component';
import { ConfirmDialogService } from 'src/app/shared/dialogs/confirm-dialog/confirm-dialog.service';
import { FormStatusService } from '../form/form-status.service';

export const CanDeactivateEditGuardFn: CanDeactivateFn<AccountComponent> = ():
  | Observable<boolean>
  | boolean => {
  const confirmDialogService = inject(ConfirmDialogService);
  const formStatusService = inject(FormStatusService);

  if (formStatusService.getFormEdited) {
    return true;
  }

  confirmDialogService
    .open({
      title: _('editUser.savingData.title'),
      content: _('editUser.savingData.subtitle'),
      buttonText: _('dialog.button.close'),
    })
    .subscribe();
  return false;
};
