import { Component, ElementRef, Input, OnInit, Renderer2 } from '@angular/core';
import { Chart, ChartType } from 'chart.js';

@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.scss'],
  standalone: false,
})
export class LineChartComponent  implements OnInit {

  // Propiedad que almacenará la instancia del gráfico
  public chart!: Chart;

  // Nombre del tab en el que se dibujará el gráfico
  @Input() nameTab: string = '';

  // Arrays para personalizar los colores del gráfico
  @Input() backgroundColorCategorias: string[] = [];
  @Input() borderColorCategorias: string[] = [];

  constructor(
    private el: ElementRef, // Permite acceder a elementos del DOM dentro del componente
    private renderer: Renderer2, // Permite manipular el DOM de forma segura con Angular
  ) { }

  ngOnInit(): void {
    console.log("Ejecuta ngOnInit en LineChartComponent");
    this.inicializarChart();
  }
  
  // Inicialización del gráfico
  private inicializarChart() {

    // Datos del gráfico
    const data = {
      labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
      datasets: [
        {
          label: 'First dataset',
          data: [10, 25, 40, 35, 50, 65, 80],
          fill: false,
          backgroundColor: this.backgroundColorCategorias[0],
          borderColor: this.borderColorCategorias[0],
          tension: 0.3,
          borderWidth: 1
        },
        {
          label: 'Second dataset',
          data: [80, 65, 50, 55, 40, 30, 20],
          fill: false,
          backgroundColor: this.backgroundColorCategorias[3],
          borderColor: this.borderColorCategorias[3],
          tension: 0.3,
          borderWidth: 1
        },
        {
          label: 'Third dataset',
          data: [30, 45, 60, 50, 70, 55, 75],
          fill: false,
          backgroundColor: this.backgroundColorCategorias[5],
          borderColor: this.borderColorCategorias[5],
          tension: 0.3,
          borderWidth: 1
        }
      ]
    };

    // Creación del elemento <canvas> dinámicamente donde se redenrizará el gráfico
    const canvas = this.renderer.createElement('canvas');
    this.renderer.setAttribute(canvas, 'id', this.nameTab + 'lineChart'); // ID única

    // Obtiene el contenedor del gráfico en la plantilla HTML con id "contenedor-linechart"
    const container = this.el.nativeElement.querySelector('#contenedor-linechart');
    this.renderer.appendChild(container, canvas); // Agrega el canvas al contenedor

    // Creación y configuración del gráfico con los datos
    this.chart = new Chart(canvas, {
      type: 'line' as ChartType,
      data: data,
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
      }
    });

    // Tamaño del canvas
    this.chart.canvas.width = 100;
    this.chart.canvas.height = 100;
  }

}
