import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FormStatusService {
  private formStatus = new Subject<boolean>();
  private isFormEdited = true;

  setFormEdited(status: boolean): void {
    this.isFormEdited = status;
    this.formStatus.next(this.isFormEdited);
  }

  getFormEdited(): boolean {
    return this.isFormEdited;
  }
}
