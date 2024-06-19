import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FormStatusService {
  private formStatus = new Subject<boolean>();
  private isFormEdited = true;

  public get getFormEdited(): boolean {
    return this.isFormEdited;
  }

  public setFormEdited(status: boolean): void {
    this.isFormEdited = status;
    this.formStatus.next(this.isFormEdited);
  }
}
