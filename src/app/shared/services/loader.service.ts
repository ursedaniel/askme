import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {LoaderModel} from '../models/LoaderModel';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {

  public loaderModel:LoaderModel;
  public loaderChange: BehaviorSubject<LoaderModel> = new BehaviorSubject(undefined);
  constructor() {
    this.loaderModel = new LoaderModel(false,null);
  }

  getData(){
    return this.loaderChange.asObservable();
  }

  update(loaderModel:LoaderModel){
    this.loaderModel = loaderModel;
    this.loaderChange.next(this.loaderModel);
  }

}
