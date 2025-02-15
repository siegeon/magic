import { throwError } from 'rxjs';
import { Component, Inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { HttpService } from 'src/app/services/http-service';
import { DialogComponent, DialogData } from '@app/base/dialog.component';

/**
 * Modal dialog for editing your existing [[component-header]] entity types, and/or
 * creating new entity types of type [[component-header]].
 */
@Component({
  templateUrl: './edit.[[component-filename]].html'
})
export class Edit[[component-name]] extends DialogComponent {

  /**
   * Constructor taking a bunch of services injected using dependency injection.
   */
  constructor(
    public dialogRef: MatDialogRef<Edit[[component-name]]>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    protected snackBar: MatSnackBar,
    public service: HttpService) {
    super(snackBar);
    this.primaryKeys = [[[primary-keys]]];
    this.createColumns = [[[create-input]]
    ];
    this.updateColumns = [[[update-input]]
    ];
  }

  /**
   * Returns a reference to ths DialogData that was dependency injected
   * into component during creation.
   */
  protected getData() {
    return this.data;
  }
  [[service-update-wrapper]]
  /**
   * Returns a reference to the create method, to create new entities.
   */
  protected getCreateMethod() {
    [[service-create-method]]
  }

  /**
   * Closes dialog.
   * 
   * @param data Entity that was created or updated
   */
  public close(data: any) {
    if (data) {
      this.dialogRef.close(data);
    } else {
      this.dialogRef.close();
    }
  }
}
