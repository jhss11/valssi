import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TagService } from '../../share/services/tag.service';
import { NotificationService } from '../../share/notification-service';
import { TranslateService } from '@ngx-translate/core';
import { TagModel } from '../../share/models/TagModel';
import { getFormValidationErrorMessage } from '../../share/form-validation';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-tag-form',
  standalone: false,
  templateUrl: './tag-form.html',
  styleUrl: './tag-form.css'
})
export class TagForm implements OnInit, OnDestroy{
 private destroy$ = new Subject<boolean>();

  titleForm: string = 'Crear';
  idProduct: number | null = null;
  isCreate: boolean = true;

  tagForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    // private router: Router,
    // private activeRouter: ActivatedRoute,
    private tagService: TagService,
    private noti: NotificationService,
    private translate: TranslateService
  ) {}

 ngOnInit(): void {
    this.initForm();

    // this.activeRouter.params.subscribe((params: Params) => {
    //   this.idProduct = params['id'];
    //   this.isCreate = this.idProduct === undefined;


    //   if (this.idProduct != undefined) {
    //     this.tagService
    //       .getById(this.idProduct)
    //       .pipe(takeUntil(this.destroy$))
    //       .subscribe((data: any) => {
    //         this.patchFormValues(data);
    //       });
    //   }
    // });

    



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
          //Accion API create enviando toda la informacion del formulario
          this.tagService
            .create(this.tagForm.value)
            .pipe(takeUntil(this.destroy$))
            .subscribe((data: any) => {
              this.noti.success('Crear etiqueta', `${data.name}`, 2000, '/tag');
            });
          this.tagForm.reset();
        } else {
          //Accion API actualizar enviando toda la informacion del formulario
          this.tagService
            .update(this.tagForm.value)
            .pipe(takeUntil(this.destroy$))
            .subscribe((data: any) => {
              this.noti.success(
                'Actualizar Etiquet',
                ` ${data.name}`,
                2000,
                '/tag'
              );
            });
        }
      }
    
      errorHandling(controlPath: string): string | false {
        return getFormValidationErrorMessage(this.tagForm, controlPath);
      }
    
      
    
      
    
      ngOnDestroy(): void {
        this.destroy$.next(true);
        this.destroy$.unsubscribe();
      }


}
