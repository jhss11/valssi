import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TagService } from '../../share/services/tag.service';
import { NotificationService } from '../../share/notification-service';
import { TranslateService } from '@ngx-translate/core';
import { TagModel } from '../../share/models/TagModel';
import { getFormValidationErrorMessage } from '../../share/form-validation';
import { Subject, takeUntil } from 'rxjs';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-tag-form',
  standalone: false,
  templateUrl: './tag-form.html',
  styleUrl: './tag-form.css'
})
export class TagForm implements OnInit, OnDestroy {
  private destroy$ = new Subject<boolean>();

  titleForm: string = 'Crear';
  isCreate: boolean = true;
  tagForm!: FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { id?: number },
    private dialogRef: MatDialogRef<TagForm>,
    private fb: FormBuilder,
    private tagService: TagService,
    private noti: NotificationService,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.initForm();

    if (this.data?.id) {
      this.isCreate = false;
      this.titleForm = 'Actualizar';
console.log("ID: "+ this.data.id)
      //Llamamos al backend para cargar los datos
      this.tagService
        .getById(this.data.id)
        .pipe(takeUntil(this.destroy$))
        .subscribe((tag: TagModel) => {
          this.patchFormValues(tag);
        });
    }
  }

  private initForm(): void {
    this.tagForm = this.fb.group({
      id: [null],
      name: [null, [Validators.required, Validators.minLength(3)]],
    });
  }

  private patchFormValues(data: TagModel): void {
    this.tagForm.patchValue({
      id: data.id,
      name: data.name,
    });
  }

  submit(): void {
  this.tagForm.markAllAsTouched();

  if (this.tagForm.invalid) {
    this.noti.error(
      'Formulario Inválido',
      'Por favor, revise los campos.',
      5000
    );
    return;
  }

  if (this.isCreate) {
    this.tagService
      .create(this.tagForm.value)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: any) => {
        this.noti.success('Etiqueta creada', `${data.name}`, 2000, '/tag');
        this.dialogRef.close(true);
      });
  } else {
    this.tagService
      .update(this.tagForm.value)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: any) => {
        this.noti.success('Etiqueta actualizada', `${data.name}`, 2000, '/tag');
        this.dialogRef.close(true);
      });
  }
}


  errorHandling(controlPath: string): string | false {
    return getFormValidationErrorMessage(this.tagForm, controlPath);
  }

close(): void {
    this.dialogRef.close(false);
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
