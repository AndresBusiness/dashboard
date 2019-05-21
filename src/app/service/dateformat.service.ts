import { NgbDateParserFormatter, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { Injectable } from '@angular/core';
import * as moment from 'moment';
@Injectable()
export class NgbDateCustomParserFormatter extends NgbDateParserFormatter {
  parse(value: string): NgbDateStruct {
    if (value) {
      const dateParts = value.trim().split('/');
      if (dateParts.length === 1 && this.isNumber(dateParts[0])) {
        return {day: this.toInteger(dateParts[0]), month: null, year: null};
      } else if (dateParts.length === 2 && this.isNumber(dateParts[0]) && this.isNumber(dateParts[1])) {
        return {day: this.toInteger(dateParts[0]), month: this.toInteger(dateParts[1]), year: null};
      } else if (dateParts.length === 3 && this.isNumber(dateParts[0]) && this.isNumber(dateParts[1]) && this.isNumber(dateParts[2])) {
        return {day: this.toInteger(dateParts[0]), month: this.toInteger(dateParts[1]), year: this.toInteger(dateParts[2])};
      }
    }
    return null;
  }
 
  format(date: NgbDateStruct): string {
   
    return date ?
         moment(`${this.isNumber(date.month) ? this.padNumber(date.month) : ''}/${this.isNumber(date.day) ? this.padNumber(date.day) : ''}/${date.year}`).locale('es').format('Do MMMM, YYYY'):
        '';
  }

  verificarFecha(date: any): boolean {
    let valido = false
    if(this.isNumber(date.month) && this.isNumber(date.day)  && date.year){
        console.log('mes: ', date.month);
        console.log('dia: ', date.day);
        console.log('año: ', date.year);
        valido = true
    }
    return valido
  }
    isNumber(value: any): value is number {
     return !isNaN(this.toInteger(value));
    }

    toInteger(value: any): number {
     return parseInt(`${value}`, 10);
    }

    padNumber(value: number) {
     if (this.isNumber(value)) {
       return `0${value}`.slice(-2);
     } else {
       return '';
     }
    }
 

}