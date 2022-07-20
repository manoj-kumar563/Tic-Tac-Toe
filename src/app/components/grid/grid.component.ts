import { ThisReceiver } from '@angular/compiler';
import { AfterViewInit, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { postionData } from 'src/app/Models/squareData';
import { Symbol} from '../../enums/Symbol';
import { GameOverCount } from '../../enums/GameOverCount'

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.css'],
})
export class GridComponent implements OnInit, AfterViewInit {
  constructor(private renderer: Renderer2) { }
  @ViewChild('container')
  private container!: ElementRef;
  count: number = 0;
  numbers: Array<number> = [0, 1, 2, 3, 4, 5, 6, 7, 8];
  data: Array<postionData> = [];
  isFirstUser: boolean = false;
  audio: any;
  isGameStarted: boolean = false;
  isGameOver: boolean = false;
  winner: string = "";
  combinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [6, 4, 2],
    [1, 4, 7],
    [0, 4, 8],
    [2, 5, 8],
    [0, 3, 6]
  ];
  ngOnInit(): void {
    this.audio = new Audio('https://www.fesliyanstudios.com/play-mp3/387');
    this.isFirstUser = true;
    this.data = [];
    for (let num = 0; num <= this.numbers.length - 1; num++) {
      this.data.push({
        number: num,
        symbol: '',
      });
    }
  }
  ngAfterViewInit() {

  }

  resetGame() {
    let count = 0;
    this.count = 0;
    let data: postionData[] = [];
    data = this.data.map((eachData) => {
      return { ...eachData, symbol: '' };
    });
    this.data = [];
    this.data = data;
    this.isGameStarted = false;
    this.isGameOver = false;
    this.isFirstUser = true;
    this.winner = "";
  }

  fillSymbols(number: number) {
    if (!this.winner) {
      this.audio.play();
      this.isGameStarted = true;
      if (this.count > 0) {
        this.isFirstUser = this.count % 2 == 0 ? true : false;
      }
      let currentSymbol = this.isFirstUser ? Symbol.first : Symbol.second;
      if (this.data[number] && this.data[number].symbol) {
        return;
      } else {
        this.data[number].symbol = currentSymbol;
        this.count++;
        this.isGameOver = (this.count == GameOverCount.count) ? true : false;
      }
      this.updateTable();
    } else {
      this.renderer.setStyle(this.container.nativeElement, 'pointerEvents', 'none');
    }

  }

  updateTable() { 
    for (let i = 0; i < this.combinations.length; i++) {
      let xCount = 0;
      let oCount = 0;
      for (let j = 0; j < this.combinations[i].length; j++) {
        if (this.data[this.combinations[i][j]].symbol) {
          let symbol = this.data[this.combinations[i][j]].symbol;
          if (symbol == Symbol.first) {
            xCount++;
          } if (symbol == Symbol.second) {
            oCount++;
          }
        }
      }
      if (xCount == 3) {
        this.isGameOver = true;
        this.count = 0;
        this.winner = Symbol.first;
        break;
      } else if (oCount == 3) {
        this.isGameOver = true;
        this.count = 0;
        this.winner = Symbol.second;
        break;
      } else{
        continue;
      }
    }
  }
}
