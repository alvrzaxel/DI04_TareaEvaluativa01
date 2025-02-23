import { Component, ElementRef, Input, OnInit, Renderer2 } from '@angular/core';
import { Chart, ChartType } from 'chart.js/auto';
import { GestionApiService } from 'src/app/services/gestion-api.service';

@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.scss'],
  standalone: false,
})
export class BarChartComponent  implements OnInit {

  // Propiedad que almacenará la instancia del gráfico
  public chart!: Chart;

  // Almacena los datos de la API
  public apiData: { categoria: string; totalResults: number }[] = [];

  // Número de categorías que se mostrarán en el gráfico
  @Input() numCategorias: number = 0;
  
  // Arrays para personalizar los colores del gráfico
  @Input() backgroundColorCategorias: string[] = [];
  @Input() borderColorCategorias: string[] = [];

  constructor(
    private el: ElementRef, // Permite acceder a elementos del DOM dentro del componente
    private renderer: Renderer2, // Permite manipular el DOM de forma segura con Angular
    private gestionApi: GestionApiService // Servicio que proporciona datos del API
  ) { }

  ngOnInit(): void {
    console.log("Ejecuta ngOnInit en BarChartComponent");
    this.inicializarChart();

    // Se suscribe al observable datos$ de tipo BehaviorSubject del servicio gestionApi para recibir datos en tiempo real
    // Cuando emita un valor, recibiremos una notificación con el nuevo calor
    this.gestionApi.datos$.subscribe((datos) => {
      console.log("Datos recibidos del API:", datos);

      // Verificación de los datos recibidos
      if (datos != undefined) {

        // Rellena apiData con los valores recibidos del API
        this.apiData.push({categoria: datos.categoria, totalResults: datos.totalResults});
        console.log("apiData actualizado:", this.apiData);

        // Esperamos a recibir todos los datos para actualizar el gráfico
        if (this.apiData.length === this.numCategorias) {
          this.actualizarChart();
        }
      }
    });
  }

  // Método para inicializar el gráfico
  private inicializarChart() {

    // Creación del elemento <canvas> dinámicamente donde se redenrizará el gráfico
    const canvas = this.renderer.createElement('canvas');
    this.renderer.setAttribute(canvas, 'id', 'barChart');

    // Obtención del contenedor del gráfico en la plantilla HTML con id "contenedor-barchart"
    const container = this.el.nativeElement.querySelector('#contenedor-barchart');
    this.renderer.appendChild(container, canvas); // Agrega el canvas al contenedor

    // Creación y configuración del gráfico
    this.chart = new Chart(canvas, {
      type: 'bar' as ChartType,
      data: { 
        labels: [],
        datasets: []
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true
          }
        },
        plugins: {
          legend: {
            labels: {
              font: {
                size: 16,
                weight: 'bold'
              }
            },
          }
        },
      },
    });

    // Tamaño del canvas
    this.chart.canvas.width = 100;
    this.chart.canvas.height = 100;
  }

  // Método para actualizar el gráfico con los nuevos datos recibidos
  private actualizarChart() {
    
    // Estructura para organizar los datos por categoría
    const datasetsByCompany: { [key: string]: { label: string; data: number[]; backgroundColor: string[]; borderColor: string[]; borderWidth: number } } = {};

    // Itera sobre los datos obtenidos de la API
    this.apiData.forEach((row: { categoria: string; totalResults: number}, index: number) => {
      const categoria = row.categoria;
      const totalResults = row.totalResults;

      // Si la categoría no existe en datasetsByCompany, la inicializa
      if (!datasetsByCompany[categoria]) {
        datasetsByCompany[categoria] = {
          label: 'Valores de ' + categoria.charAt(0).toUpperCase() + categoria.slice(1),
          data: [], // Datos vacíos que se llenarán después
          backgroundColor: [this.backgroundColorCategorias[index]],
          borderColor: [this.borderColorCategorias[index]],
          borderWidth: 1
        };
      }

      // Asigna los datos a la categoría correspondiente
      datasetsByCompany[categoria].data[index] = totalResults;

      // Asigna color de fondo y de borde
      datasetsByCompany[categoria].backgroundColor[index] = this.backgroundColorCategorias[index];
      datasetsByCompany[categoria].borderColor[index] = this.borderColorCategorias[index];
    });

    // Asigna las etiquetas del eje X usando los datos recibidos
    this.chart.data.labels = this.apiData.map((row: { categoria: string; totalResults: number }) => row.categoria);
    
    // Modifica las etiquetas (nombres de las categorías) estableciendo la primera letra en mayúscula
    this.chart.data.labels = this.apiData.map((row: { categoria: string; totalResults: number }) => {
      return row.categoria.charAt(0).toUpperCase() + row.categoria.slice(1);
    });

    // Asigna los conjuntos de datos al gráfico
    this.chart.data.datasets = Object.values(datasetsByCompany);

    // Actualiza el gráfico con los nuevos datos
    this.chart.update(); 
    console.log("Chart actualizado");
  }
  
}
