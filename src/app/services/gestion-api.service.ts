import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import { RespuestaNoticias } from '../interfaces/interfaces';

@Injectable({
  providedIn: 'root'
})
export class GestionApiService {

  // Variables de configuración para la API
  apiKey: string = environment.apiKey;
  apiUrl: string = environment.apiUrl;

  // BehaviorSubject tipo json (categoria y totalResults o undefined)
  // Tipo especial de Observable que siempre tiene un valor actual y emite ese valor inmediatamente a los nuevos suscriptores
  // En este caso, emite objetos de tipo "{ categoria: string; totalResults: number } | undefined"
  private datosSubject: BehaviorSubject<{ categoria: string; totalResults: number } | undefined> = new BehaviorSubject<{ categoria: string; totalResults: number } | undefined>(undefined);

  //Creamos el observable datos$ para gestionar los cambios que vienen desde la API
  // Este observable será usado por otros componentes para suscribirse a los datos
  public datos$: Observable<{ categoria: string; totalResults: number } | undefined> = this.datosSubject.asObservable();

  // Inyección de HttpClient para realizar solicitudes HTTP
  constructor(private http: HttpClient) { }

  // Método para cargar los datos de una categoría específica
  // Realiza una solicitud GET a la API de noticias para obtener los resultados
  public cargarCategoria(categoria: string) {

    //Realizamos la llamada api y la recogemos en un observable de tipo RespuestaNoticias
    let respuesta: Observable<RespuestaNoticias> = this.http.get<RespuestaNoticias>("https://newsapi.org/v2/top-headlines?country=us&category=" + categoria + "&apiKey=" + this.apiKey);

    // Nos suscribimos a la respuesta de la API
    respuesta.subscribe( data => {
      if (data && data.totalResults !== undefined) {

        // Mediante datosSubject.next, avisamos a todos los suscriptores (en este caso datos$) de que hemos recibido un nuevo valor
        this.datosSubject.next({ categoria: categoria, totalResults: data.totalResults });

      } else {
        console.error('La propiedad totalResults no está definida en la respuesta:', data);
      }
    });
  }
}
