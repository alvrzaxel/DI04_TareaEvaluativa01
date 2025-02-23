import { Component } from '@angular/core';
import { GestionApiService } from '../services/gestion-api.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage {

  // Variables para pasar como parámetros a los gráficos: colores de fondo y borde
  backgroundColorCat: string[] = ['rgba(255, 99, 132, 0.2)', 'rgba(255, 159, 64, 0.2)', 'rgba(255, 205, 86, 0.2)', 'rgba(75, 192, 192, 0.2)', 'rgba(54, 162, 235, 0.2)', 'rgba(153, 102, 255, 0.2)', 'rgba(201, 203, 207, 0.2)'];
  borderColorCat: string[] =['rgb(255, 99, 132)', 'rgb(255, 159, 64)', 'rgb(255, 205, 86)', 'rgb(75, 192, 192)', 'rgb(54, 162, 235)', 'rgb(153, 102, 255)', 'rgb(201, 203, 207)'];

  // Array con las categorías que se mostrarán en los gráficos
  categorias: string[] = ["business", "entertainment", "general", "technology", "health", "science", "sports"];

  // Segmento seleccionado por defecto
  tipoDeChartSeleccionado: string = "bar-chart";

  // Se inyecta el servicio de gestión de la API
  constructor(private gestionApi: GestionApiService) {}

  ngOnInit() {
    // Llamada a la API al inicializar el componente
    this.llamadaAPI();
  }

  // Método que se ejecuta cuando el segmento cambia
  segmentChanged(event: any) {
    // Actualiza el tipo de gráfico seleccionado basado en el valor del segmento
    this.tipoDeChartSeleccionado = event.detail.value;

    // En caso de bar-chart, llamamos de nuevo a la API
    if (this.tipoDeChartSeleccionado == "bar-chart"){
      this.llamadaAPI();
    }    
  }

  // Método para llamar a la API una vez por cada categoría
  private llamadaAPI() {
    this.categorias.forEach(categoria => {
      this.gestionApi.cargarCategoria(categoria);
    });
  }
}
