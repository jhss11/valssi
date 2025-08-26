import { Component, inject } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { TagService } from '../../share/services/tag.service';
import { TagModel } from '../../share/models/TagModel';
import { TagForm } from '../tag-form/tag-form';

@Component({
  selector: 'app-tag-index',
  standalone: false,
  templateUrl: './tag-index.html',
  styleUrl: './tag-index.css',
})
export class TagIndex {
  tags: any;

  readonly dialog = inject(MatDialog);

  constructor(
    private tagService: TagService,
    private translate: TranslateService
  ) {
    this.listTags();
  }

  listTags() {
    this.tagService.get().subscribe((respuesta: TagModel[]) => {
      console.log(respuesta);
      this.tags = respuesta;
    });
  }

  editar(id: number) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '50%';
    dialogConfig.disableClose = false;
    dialogConfig.data = { id };

    const dialogRef = this.dialog.open(TagForm, dialogConfig);

    dialogRef.afterClosed().subscribe((updated: boolean) => {
      if (updated) {
        this.listTags();
      }
    });
  }

  create() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '50%';
    dialogConfig.disableClose = false;
    const dialogRef = this.dialog.open(TagForm, dialogConfig);

    dialogRef.afterClosed().subscribe((updated: boolean) => {
      if (updated) {
        this.listTags();
      }
    });
  }
}
