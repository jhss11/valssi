import { Component } from '@angular/core';
import { UserService } from '../../share/services/user.service';
import { NotificationService } from '../../share/notification-service';
import { Router } from '@angular/router';
import { PromotionModel } from '../../share/models/PromotionModel';
import { ActivatedRoute } from '@angular/router';
import { UserModel } from '../../share/models/UserModel';



@Component({
  selector: 'app-promotion-index',
  standalone: false,
  templateUrl: './user-listado.html',
  styleUrl: './user-listado.css'
})
export class UserListado {
//Respuesta del API
  datos: any;

  constructor(private vjService:UserService,
    private noti:NotificationService,
    private router:Router,
    private route: ActivatedRoute
  ) {   
    this.listUsers()
  }

  listUsers() {
    //localhost:3000/videojuego
    this.vjService.get().subscribe((respuesta: UserModel[]) => {
      console.log(respuesta);
      this.datos = respuesta;
      
    });
  }

  update(id:Number) {
    this.router.navigate(['/promotion',id])
  }

  createUser() {
    this.router.navigate(['/usuario/registrar'], {
      relativeTo: this.route,
    });
  }
}
