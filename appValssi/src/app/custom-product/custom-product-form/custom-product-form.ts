import { Component, OnInit } from '@angular/core';
import { NotificationService } from '../../share/notification-service';
import { Router } from '@angular/router';
import { OptionValueService } from '../../share/services/option-value.service';

@Component({
  selector: 'app-custom-product-form',
  standalone: false,
  templateUrl: './custom-product-form.html',
  styleUrl: './custom-product-form.css',
})
export class CustomProductForm implements OnInit {
  groupedOptions: { [key: string]: any[] } = {};
  selectedOptions: { [key: string]: any } = {};

  constructor(
    private optionsService: OptionValueService,
    private noti: NotificationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.optionsService.get().subscribe({
      next: (data) => {
        this.groupedOptions = {
          Color: data.filter((x: any) => x.optionId === 1),
          Tamaño: data.filter((x: any) => x.optionId === 2),
          Diseño: data.filter((x: any) => x.optionId === 3),
        };
      },
      error: () => {
        this.noti.info('error', 'Error al cargar las opciones');
      },
    });
  }

  enviar() {
    const seleccion = Object.values(this.selectedOptions);
    if (seleccion.length < 3) {
      this.noti.info('info', 'Debe seleccionar una opción de cada categoría');
      return;
    }

    console.log('Opciones seleccionadas:', this.selectedOptions);
    // Aquí puedes navegar o guardar lo que necesites
  }
}
