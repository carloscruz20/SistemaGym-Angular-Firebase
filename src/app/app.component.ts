import { Component } from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import {auth, User} from 'firebase/app';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'mastergym';
  usuario:User;
  cargando:Boolean=true;
  constructor(public afAuth:AngularFireAuth){
    this.afAuth.user.subscribe((usuario)=>
    {
        this.cargando=false;
      this.usuario=usuario;

    })
  }

  login() {
    this.afAuth.signInWithEmailAndPassword('carlosdv92@gmail.com','oso123456789');
  }
  
}
