import { Component, Input, OnInit } from '@angular/core';
import {NgbModal, NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-modal-chofer',
  templateUrl: './modal-chofer.component.html',
  styleUrls: ['./modal-chofer.component.css']
})
export class ModalChoferComponent implements OnInit {


  @Input() chofer: any;

  constructor(public activeModal: NgbActiveModal) {

  }

  ngOnInit() {
    const castor = 'http://www.aldiadallas.com/wp-content/uploads/2016/12/brasil-taxista-300x300.jpg';
    const lira = 'https://anamariaalvarado.tv/wp-content/uploads/2018/08/29507e94-9bef-4ad4-bf16-eb0eda3ac7f3-1-300x300.jpg';
    this.chofer.img = this.chofer.genero === 'male' ? castor : lira;
  }

}
