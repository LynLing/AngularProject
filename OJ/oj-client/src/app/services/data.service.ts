import { Injectable } from '@angular/core';
import { Problem } from '../models/problem.model';
//import { PROBLEMS } from '../mock-problems';
import {HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Rx';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';


@Injectable()
export class DataService {
  //list of problems
  //problems: Problem[] = PROBLEMS;
  //BehaviorSubject: when subscribe, we can get the value that emitted last time.
  //subject: when subscribing, we can only get the value the emmited after subscribe and we can not get value that emmited before we subscribe.
  private _problemSource = new BehaviorSubject<Problem[]>([]);


  constructor(private httpClient: HttpClient) { }
  //return a list of probblems
  getProblems(): Observable<Problem[]> {
    //return this.problems;
    this.httpClient.get('api/v1/problems')
    .toPromise()
    .then((res: any) => {
      this._problemSource.next(res);
    })
    .catch(this.handleError);
    return this._problemSource.asObservable();
  }
  //input id
  // return a problem by id
  getProblem(id: number): Promise<Problem> {
    return this.httpClient.get(`api/v1/problems/${id}`)
    .toPromise()
    .then((res: any) => res)
    .catch(this.handleError);
  }

  addProblem(problem: Problem) {
    //assin problem id
    const options = {headers: new HttpHeaders({'Content-Type': 'application/json'})};
    // problem.id = this.problems.length + 1;
    // this.problems.push(problem);
    return this.httpClient.post('api/v1/problems', problem, options)
    .toPromise()
    .then((res:any) => {
      this.getProblems();

      return res;
    })
    .catch(this.handleError);
  }

  //self added api DataService on 3/2/2018
  modifyProblem(problem: Problem) {
  const options = {headers: new HttpHeaders({'Content-Type': 'application/json'})};
  return this.httpClient.put('api/v1/problems', problem, options)
  .toPromise()
  .then((res: any) => {
    this.getProblems();

    return res;
  })
  .catch(this.handleError);
}

  private handleError(error: any): Promise<any> {
    return Promise.reject(error.body || error);
  }

  buildAndRun(data): Promise<any> {
    //define the content type in http request header
    //content-type declares the body type when you issue a POST request
    const options = {headers: new HttpHeaders({'Content-Type': 'application/json'})}
    console.log("dataService/buildAndRun" + JSON.stringify(data));

    return this.httpClient.post('api/v1/build_and_run',data,options)
    .toPromise() // convert observable to promise
    .then(
      res => {
        console.log('DataService/buildAndRun:' + res);
        return res;
      }
    )
    .catch(this.handleError);
  }


}
