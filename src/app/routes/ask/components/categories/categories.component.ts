import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatStepper} from "@angular/material";

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
    {title: 'NETWORK', class: 'fas fa-sitemap'},
    {title: 'SCHOOL', class: 'fas fa-user-graduate'},
  ];

  constructor(private _formBuilder: FormBuilder) {
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
      stepper.next();
    }, 0)
  }
}
