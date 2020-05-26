import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AngularFireStorage } from '@angular/fire/storage';
import { AngularFirestore } from '@angular/fire/firestore';
import { ActivatedRoute } from '@angular/router';
import { MensajesService } from '../services/mensajes.service';
@Component({
  selector: 'app-agregar-cliente',
  templateUrl: './agregar-cliente.component.html',
  styleUrls: ['./agregar-cliente.component.scss']
})
export class AgregarClienteComponent implements OnInit {
  formularioCliente:FormGroup
  porcentajeSubida:number=0
  urlImgane:string=''
  esEditable:boolean=false
  id:string;
  constructor(private fb:FormBuilder,
              private storage:AngularFireStorage,
              private db:AngularFirestore,
              private activeRoute:ActivatedRoute,
              private msj:MensajesService) { }

  ngOnInit(): void {
  this.formularioCliente=this.fb.group({
    nombre:['', Validators.required],
    apellido:['',Validators.required],
    correo:['',Validators.compose([
      Validators.required,Validators.email
    ])],
    cedula:[''],
    fechaNacimiento:['',Validators.required],
    telefono:[''],
    imgUrl:['',Validators.required]
  })
    this.id=this.activeRoute.snapshot.params.clienteID;
    if(this.id!=undefined){
      this.esEditable=true;
      this.db.doc<any>('clientes/'+this.id).valueChanges().subscribe((cliente)=>{
        console.log(cliente)
        this.formularioCliente.setValue({
          nombre:cliente.nombre,
          apellido:cliente.apellido,
          correo:cliente.correo,
          cedula:cliente.cedula,
          fechaNacimiento:new Date(cliente.fechaNacimiento.seconds*1000).toISOString().substr(0,10),
          telefono:cliente.telefono,
          imgUrl:''
        })
        this.urlImgane=cliente.imgUrl;
      })
    }
   
  }

  agregar(){
    this.formularioCliente.value.imgUrl=this.urlImgane;
    this.formularioCliente.value.fechaNacimiento=new Date(this.formularioCliente.value.fechaNacimiento)
    console.log(this.formularioCliente.value)
    this.db.collection('clientes').add(this.formularioCliente.value).then((termino)=>{
    this.msj.mensajeCorrecto('Agregar','Se agrego correctamente')
    }).catch(()=>{
      this.msj.mensajeError('Error','Ocurrio algun error')
    })
    this.formularioCliente.reset()
  }

  editar(){
    this.formularioCliente.value.imgUrl=this.urlImgane;
    this.formularioCliente.value.fechaNacimiento=new Date(this.formularioCliente.value.fechaNacimiento)
    this.db.doc('clientes/'+this.id).update(this.formularioCliente.value).then(()=>{
      this.msj.mensajeCorrecto('Editar','Se edito correctamente')
    }).catch(()=>{
      this.msj.mensajeError('Error','Ocurrio algun error!')
    })
    
  }
    
  subirImagen(evento){
    if(evento.target.files.length>0){
      let nombre=new Date().getTime().toString()
      let archivo=evento.target.files[0]
      let extencion=archivo.name.toString().substring(archivo.name.toString().lastIndexOf('.'))
      let ruta = 'clientes/' + nombre +extencion;
      const referencia=this.storage.ref(ruta)
      const tarea = referencia.put(archivo)
      tarea.then((objeto)=>{
        console.log('imagen subida')
        referencia.getDownloadURL().subscribe((url)=>{
          this.urlImgane=url;
        })
      })
      tarea.percentageChanges().subscribe((porcentaje)=>{
        this.porcentajeSubida=parseInt(porcentaje.toString());
      })
    }
  }
}
