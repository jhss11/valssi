import { Component, OnInit, OnDestroy } from '@angular/core';
import { OptionValueService } from '../../share/services/option-value.service';
import { NotificationService } from '../../share/notification-service';
import { Subject, takeUntil } from 'rxjs';
import { CustomOptionValueModel } from '../../share/models/CustomOptionValueModel';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-update-price-diag',
  standalone: false,
  templateUrl: './update-price-diag.html',
  styleUrl: './update-price-diag.css'
})
export class UpdatePriceDiag implements OnInit, OnDestroy{
  private destroy$ = new Subject<void>();

  groupedOptions: { [key: string]: any[] } = {};
  isLoading = false;

  constructor(
    private optionValueService: OptionValueService,
    private noti: NotificationService,
    private dialogRef: MatDialogRef<UpdatePriceDiag>
  ) {}

  ngOnInit(): void {
    this.loadOptions();
  }

  private loadOptions(): void {
    this.isLoading = true;
    this.optionValueService
      .get()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.groupedOptions = {
            Color: data.filter((x: any) => x.optionId === 1),
            Tamano: data.filter((x: any) => x.optionId === 2),
            Diseno: data.filter((x: any) => x.optionId === 3),
          };
          this.isLoading = false;
        },
        error: () => {
          this.noti.error('Error', 'No se pudieron cargar las opciones');
          this.isLoading = false;
        },
      });
  }


  // Permite guardar todos los precios en lote
 updateAll(): void {
  const allOptions = Object.values(this.groupedOptions).flat();

  allOptions.forEach((opt: any) => {
    const payload: Partial<CustomOptionValueModel> = {
      id: opt.id,
      price: opt.price,
    };
console.log('PAYLOAD ' + payload.id ,payload)
    this.optionValueService.updatePrice(payload).subscribe({
      next: () => {
        
        this.noti.success(
          'Actualizado',
          `Precio actualizado`
        );
        this.dialogRef.close(true);
      },
      error: () => {
        this.noti.error('Error', `No se pudo actualizar`);
      },
    });
  });
}

// dentro del componente
optionLabels: { [key: string]: string } = {
  Color: 'Color',
  Tamano: 'Tamaño',
  Diseno: 'Diseño'
};

close(): void {
    this.dialogRef.close(false);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
