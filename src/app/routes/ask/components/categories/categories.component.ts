import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatStepper} from '@angular/material';
import {ToastrService} from 'ngx-toastr';
import {FindconnectionComponent} from "../findconnection/findconnection.component";

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss']
})
export class CategoriesComponent implements OnInit {
  questionForm: FormGroup;
  secondFormGroup: FormGroup;
  categorySelectedId: number;
  categorySelected: boolean;
  showConnections: boolean;
  @ViewChild('connectionsComponent') connectionsComponent: FindconnectionComponent;


  categoriesList = [
    {title: 'A.I.', class: 'fas fa-robot'},
    {title: 'ANALYTICS', class: 'fas fa-chart-pie'},
    {title: 'ANIMALS', class: 'fas fa-dragon'},
    {title: 'AUDIO', class: 'fas fa-headphones'},
    {title: 'AUTOMOTIVE', class: 'fas fa-car'},
    {title: 'BUILDINGS', class: 'fas fa-building'},
    {title: 'CODING', class: 'fas fa-code'},
    {title: 'COMPUTERS', class: 'fas fa-laptop'},
    {title: 'DATABASE', class: 'fas fa-database'},
    {title: 'DESIGN', class: 'fas fa-palette'},
    {title: 'GAMING', class: 'fas fa-gamepad'},
    {title: 'HEALTH', class: 'fas fa-heart'},
    {title: 'MARKETING', class: 'fas fa-bullhorn'},
    {title: 'MATHEMATICS', class: 'fas fa-superscript'},
    {title: 'NETWORK', class: 'fas fa-sitemap'},
    {title: 'SCHOOL', class: 'fas fa-user-graduate'},
    {title: 'SCIENCE', class: 'fas fa-atom'},
    {title: 'WRITING', class: 'fas fa-pencil-alt'},
  ];

  constructor(private _formBuilder: FormBuilder,
              private toastr: ToastrService) {
  }

  ngOnInit() {
    this.questionForm = this._formBuilder.group({
      question: ['', Validators.required]
    });
    this.secondFormGroup = this._formBuilder.group({
      secondCtrl: ['', Validators.required]
    });
  }

  goForward(stepper: MatStepper) {
    setTimeout(() => {
      this.toastr.success('Category picked', 'First step');
      stepper.next();
    }, 0);
  }

  goStep2(stepper: MatStepper) {
    if (this.questionForm.valid) {
      setTimeout(() => {
        this.toastr.success('Typed the question', 'Second step');
        stepper.next();
      }, 0);
    }
  }

  getConnections() {
    // this.showConnections = true;
    this.connectionsComponent.getConnections();
  }
}
