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
    const castor = 'http://img2.tvtome.com/i/u/8dff27592c90427ec295f3cfd9ca9ea6.png';
    const lira = 'https://i.pinimg.com/originals/8c/f3/bb/8cf3bbade59aac19591eb0d236712d6a.png';
    this.chofer.img = this.chofer.genero === 'male' ? castor : lira;
  }

}
