import { FirebaseService } from './../../service/firebase.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-modal-delete',
  templateUrl: './modal-delete.component.html',
  styleUrls: ['./modal-delete.component.css']
})
export class ModalDeleteComponent implements OnInit {
  
  @Input() item;
  @Input() collection;
  constructor(public activeModal: NgbActiveModal, public sFirebase: FirebaseService) {
  }
  ngOnInit() {
  }

  eliminar(){
    // this.sFirebase.deteleDocument(this.item, this.collection).then(()=>{
    //   this.activeModal.close(true);
    // });
  }

}