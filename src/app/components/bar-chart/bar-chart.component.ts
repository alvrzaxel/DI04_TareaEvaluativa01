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

  // Propiedad que almacenará la instancia de Chart.js
  public chart!: Chart;

  // Almacena los datos de la API
  public apiData: { categoria: string; totalResults: number }[] = [];

  // Define el tipo de gráfico seleccionado
  @Input() tipoChartSelected: string = "";

  // Estos inputs las recibimos desde tab6.page.html y se declaran en tab6.page.ts
  @Input() datosCategorias: number[] = [];
  @Input() nombresCategorias: string[] = [];
  
  // Arrays para personalizar los colores del gráfico
  @Input() backgroundColorCategorias: string[] = [];
  @Input() borderColorCategorias: string[] = [];

  constructor(
    private el: ElementRef, // Permite acceder a elementos del DOM dentro del componente
    private renderer: Renderer2, // Permite manipular el DOM de forma segura con Angular
    private gestionApi: GestionApiService // Servicio que proporciona datos de la API
  ) { }

  ngOnInit(): void {
    console.log("Ejecuta ngOnInit en BarChartComponent");
    this.inicializarChart(); // Llama al método para inicializar el gráfico

    // Se suscribe al observable datos$ de tipo BehaviorSubject del servicio gestionApi para recibir datos en tiempo real
    // Cuando emita un valor, recibiremos una notificación con el nuevo calor
    this.gestionApi.datos$.subscribe((datos) => {
      console.log("Datos recibidos del API:", datos);

      // Verifica si los datos recibidos no son undefined
      if (datos != undefined) {

        // Rellenamos con los valores recibidos del API
        this.apiData.push({categoria: datos.categoria, totalResults: datos.totalResults}) // Agrega los datos al array apiData
        console.log("apiData actualizado:", this.apiData);

        // Llama al método para actualizar el gráfico con los nuevos datos
        this.actualizarChart();
      }
    });
  }

  private actualizarChart()
  {
    console.log("Ejecutando actualizarChart()");
    console.log("Datos actuales en apiData:", this.apiData);

    // Estructura para organizar los datos por categoría
    const datasetsByCompany: { [key: string]: { label: string; data: number[]; backgroundColor: string[]; borderColor: string[]; borderWidth: number } } = {};

    // Itera sobre los datos obtenidos de la API
    this.apiData.forEach((row: { categoria: string; totalResults: number}, index: number) => {
      // Extrae la categoría
      const categoria = row.categoria;
      // Extrae la cantidad de resultados
      const totalResults = row.totalResults;

      // Si la categoría no existe en datasetsByCompany, la inicializa
      if (!datasetsByCompany[categoria]) {
        datasetsByCompany[categoria] = {
          label: 'Valores de ' + categoria, // Etiqueta para la categoría
          data: [], // Datos vacíos que se llenarán después
          backgroundColor: [this.backgroundColorCategorias[index]], // Color de fondo
          borderColor: [this.borderColorCategorias[index]], // Color del borde
          borderWidth: 1 // Ancho del borde
        };
      }

      // Asigna los datos a la categoría correspondiente
      datasetsByCompany[categoria].data[index] = totalResults;

      // Asigna color de fondo
      datasetsByCompany[categoria].backgroundColor[index] = this.backgroundColorCategorias[index];

      // Asigna color de borde
      datasetsByCompany[categoria].borderColor[index] = this.borderColorCategorias[index];
      
    });

    // Asigna las etiquetas del eje X
    this.chart.data.labels = this.apiData.map((row: { categoria: string; totalResults: number }) => row.categoria);
    
    // Asigna los conjuntos de datos al gráfico
    this.chart.data.datasets = Object.values(datasetsByCompany);

    // Actualiza el gráfico con los nuevos datos
    this.chart.update(); 
    console.log("Chart actualizado");

    /*
    this.chart.data.labels = [];
    this.apiData.forEach((row: { categoria: string; totalResults: number }) => {
      if (this.chart.data.labels){
        this.chart.data.labels.push(row.categoria);
      }
    });
    */
  }

  private inicializarChart() {
    // Sacamos datos fuera del if/else y lo declaramos con let en vez de const
    let data = null; // Variable para almacenar los datos del gráfico

    // Verifica si el tipo de gráfico seleccionado es de barras
    if (this.tipoChartSelected == "bar-chart"){
      data = {
        labels: this.nombresCategorias, // Etiquetas para el eje X
        datasets: [{
          label: 'My First Dataset', // Etiqueta del conjunto de datos
          data: this.datosCategorias, // Datos para las barras
          fill: false, // Indica que no se rellene el área debajo de la línea (si fuera otro tipo de gráfico)
          backgroundColor: this.backgroundColorCategorias, // Colores de fondo de las barras
          borderColor: this.borderColorCategorias, // Colores de borde de las barras
          tension: 0.1 // Define la curvatura en gráficos de línea (no aplica en barras)
        }]
      };
    } else {
      // Datos por defecto en caso de otro tipo de gráfico
      data = {
        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
        datasets: [{
          label: 'My First Dataset',
          data: [65, 59, 80, 81, 56, 55, 40],
          fill: false,
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(255, 159, 64, 0.2)',
            'rgba(255, 205, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(201, 203, 207, 0.2)'
          ],
          borderColor: [
            'rgb(255, 99, 132)',
            'rgb(255, 159, 64)',
            'rgb(255, 205, 86)',
            'rgb(75, 192, 192)',
            'rgb(54, 162, 235)',
            'rgb(153, 102, 255)',
            'rgb(201, 203, 207)'
          ],
          tension: 0.1
        }]
      };
    }

    // Crea un elemento <canvas> dinámicamente
    // Creación del canvas donde se renderiza el gráfico
    const canvas = this.renderer.createElement('canvas');
    this.renderer.setAttribute(canvas, 'id', 'barChart'); // Asigna un ID al canvas

    // Obtiene el contenedor del gráfico en la plantilla HTML con id "contenedor-barchart"
    const container = this.el.nativeElement.querySelector('#contenedor-barchart');
    this.renderer.appendChild(container, canvas); // Agrega el canvas al contenedor

    // Se crea la instancia de Chart.js con los datos
    this.chart = new Chart(canvas, {
      type: 'bar' as ChartType, // Especifica que el gráfico es de tipo barra
      data: data, // Datos del gráfico
      options: { // Configuración del gráfico
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
              boxWidth: 0,
              font: {
                size: 16,
                weight: 'bold'
              }
            },
          }
        },
      }
    });
  
    this.chart.canvas.width = 100;
    this.chart.canvas.height = 100;
  }

}
