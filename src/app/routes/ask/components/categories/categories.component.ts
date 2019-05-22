import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss']
})
export class CategoriesComponent implements OnInit {
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  categorySelected: boolean;

  categoriesList = [
    {title: 'AUDIO', class: 'fas fa-headphones'},
    {title: 'ANALYTICS', class: 'fas fa-chart-pie'},
    {title: 'ANIMALS', class: 'fas fa-dragon'},
    {title: 'AUTOMOTIVE', class: 'fas fa-car'},
    {title: 'BUILDINGS', class: 'fas fa-building'},
    {title: 'NETWORK', class: 'fas fa-sitemap'},
    {title: 'A.I.', class: 'fas fa-robot'},
    {title: 'CODING', class: 'fas fa-code'},
    {title: 'DATABASE', class: 'fas fa-database'},
    {title: 'COMPUTERS', class: 'fas fa-laptop'},
    ];

  constructor(private _formBuilder: FormBuilder) {}

  ngOnInit() {
    this.firstFormGroup = this._formBuilder.group({
      firstCtrl: ['', Validators.required]
    });
    this.secondFormGroup = this._formBuilder.group({
      secondCtrl: ['', Validators.required]
    });
  }
}
