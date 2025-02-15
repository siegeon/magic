
/*
 * Magic Cloud, copyright Aista, Ltd. See the attached LICENSE file for details.
 */

// Angular and system imports.
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, Inject, OnInit } from '@angular/core';

// Application specific imports.
import { FeedbackService } from '../../../../services/feedback.service';
import { EvaluatorService } from 'src/app/components/tools/evaluator/services/evaluator.service';

/**
 * Save snippet dialog for saving snippets to the backend for later.
 */
@Component({
  selector: 'app-save-snippet-dialog',
  templateUrl: './save-snippet-dialog.component.html'
})
export class SaveSnippetDialogComponent implements OnInit {

  /*
   * Existing snippet files as returned from backend.
   * 
   * Needed to make autocompleter working allowing user to overwrite previously saved snippet.
   */
  private files: string[] = [];

  /**
   * Creates an instance of your login dialog.
   * 
   * @param evaluatorService Evaluator service needed to retrieve snippet files from backend
   * @param data Filename to intially populate filename textbox with. Typically only supplied if you previously loaded a file.
   */
  constructor(
    private evaluatorService: EvaluatorService,
    private feedbackService: FeedbackService,
    @Inject(MAT_DIALOG_DATA) public data: string) { }

  /**
   * OnInit implementation.
   */
  public ngOnInit() {

    // Retrieving snippets from backend.
    this.evaluatorService.snippets().subscribe((files: string[]) => {

      // Excluding all files that are not Hyperlambda files.
      this.files = files.filter(x => x.endsWith('.hl'));

    }, (error: any) => this.feedbackService.showError(error));
  }

  /**
   * Returns only the filename parts from the given full path and filename.
   * 
   * @param path Complete path of file
   */
  public getFilename(path: string) {

    // Removing path and extension, returning only filename.
    const result = path.substr(path.lastIndexOf('/') + 1);
    return result.substr(0, result.lastIndexOf('.'));
  }

  /**
   * Returns filtered files according to what user has typed.
   */
  public getFiltered() {

    // Filtering files according such that only filtered files are returned.
    return this.files.filter((idx: string)  => {
      return this.getFilename(idx).indexOf(this.data) !== -1 &&
        this.getFilename(idx) !== this.data;
    });
  }

  /**
   * Returns true if filename is a valid filename for snippet.
   */
  public filenameValid() {

    // A valid filename only contains [a-z], [0-9], '.' and '-'.
    for (var idx of this.data) {
      if ('abcdefghijklmnopqrstuvwxyz0123456789.-_'.indexOf(idx) === -1) {
        return false;
      }
    }
    return this.data.length > 0;
  }
}
