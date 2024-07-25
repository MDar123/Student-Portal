import { Component, inject, TemplateRef, OnInit, model } from '@angular/core';
import { Modal } from 'bootstrap';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Student } from './model';
import { FormGroup , FormControl , Validators, FormBuilder } from '@angular/forms';
import JSON from 'json5';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  title = 'Student-Portal';
	ngOnInit(): void {
    const localdata = localStorage.getItem('StudentDetail');
    if(localdata!=null){
      this.studentArr = JSON.parse(localdata); 
}
this.userForm = this.fb.group({
  studentid: [0],
  fName: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(15)]],
  lName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(15)]],
  contact: [1, [Validators.required, Validators.minLength(11), Validators.maxLength(11)]],
  city: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(15)]],
  state: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(15)]],
  email: ['', [Validators.required, Validators.email]]
});
}
constructor(private fb:FormBuilder){}
userForm!:FormGroup;


studentArr:Student[] = [];
studentList:Student = {
  studentid:0,
  fName:'',
  lName : '',
  contact:0,
  city : '',
  state : '',
  email : ''
};
isEditMode = false;
private modalService = inject(NgbModal);
closeResult = '';
random = false;
open(content: TemplateRef<any>, isEditMode: boolean = false) {
  this.isEditMode = isEditMode;
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then(
        (result: any) => {
            this.closeResult = `Closed with: ${result}`;
        },
        (reason: any) => {
            this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        }
    );
    if (!this.isEditMode) {
      this.userForm.reset({ studentid: 0, fName: '', lName: '', contact: null, city: '', state: '', email: '' });
    }
} 

public getDismissReason(reason: any): string {
    switch (reason) {
        case ModalDismissReasons.ESC:
            return 'by pressing ESC';
        case ModalDismissReasons.BACKDROP_CLICK:
            return 'by clicking on a backdrop';
        default:
            return `with: ${reason}`;
    }
}

/* Create Opeartion */

onSaveBtn(data:any)
{
  if (!this.isEditMode) {
  this.studentList = data;
  this.studentList.studentid = this.studentArr.length + 1;
  
  this.studentArr.push(this.studentList);
  localStorage.setItem('StudentDetail', JSON.stringify(this.studentArr));
  }
  this.modalService.dismissAll('Cross click')
}

/* Edit Operations */


onEditBtn(data: TemplateRef<any>, item: Student) {
  this.open(data,true);
  this.userForm.patchValue({
    studentid:item.studentid,
    fName: item.fName,
    lName: item.lName,
    contact: item.contact,
    city: item.city,
    state: item.state,
    email: item.email
  });
}

/* Update Operation */


onUpdate() {
const getData = localStorage.getItem('StudentDetail');
if(getData!=null){
this.studentArr = JSON.parse(getData);
let index:Student | any = this.studentArr.find(student => student.studentid == this.userForm.value.studentid);
if(index!=null){
index = this.userForm.value;
}
this.studentArr[index.studentid-1] = index;
localStorage.setItem('StudentDetail', JSON.stringify(this.studentArr));
}
this.modalService.dismissAll('Cross click') 
}

/* Delete Operation */

onDeleteBtn(id:number){
for (let i = 0; i < this.studentArr.length; i++) {
  if( this.studentArr[i].studentid == id){
  this.studentArr.splice(i,1);
  break;
  }
}
this.updateStudentIds();
localStorage.setItem('StudentDetail', JSON.stringify(this.studentArr));
}

updateStudentIds() {
  
  this.studentArr.forEach((student: { studentid: any; }, index: number) => {
    student.studentid = index + 1;
  });
}

}