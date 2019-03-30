import { Component, Input, OnInit } from '@angular/core';
import {NgbModal, NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';

@Component({
  selector: 'app-modal-chofer',
  templateUrl: './modal-chofer.component.html',
  styleUrls: ['./modal-chofer.component.css']
})
export class ModalChoferComponent implements OnInit {


  @Input() chofer: any;

  constructor(public activeModal: NgbActiveModal,
    public router: Router) {

  }

  ngOnInit() {
  }

  abrirDetalle(uid) {
    const path = `/detalle-choferes/${uid}`;
    this.router.navigate([path]);
    this.activeModal.close('Close click');
  }

}
