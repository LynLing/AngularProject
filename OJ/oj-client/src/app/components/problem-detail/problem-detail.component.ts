import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { DataService } from '../../services/data.service';
import { Problem } from '../../models/problem.model';


@Component({
  selector: 'app-problem-detail',
  templateUrl: './problem-detail.component.html',
  styleUrls: ['./problem-detail.component.css']
})
export class ProblemDetailComponent implements OnInit {
  problem: Problem;

  constructor(private dataservice: DataService,
  private route: ActivatedRoute) { }

  ngOnInit() {
    //sunscribe: when params changes, this.problem will be updated
    // +: convert string to int
    this.route.params.subscribe(params => {
      //this.problem = this.dataservice.getProblem(+params['id']);
      this.dataservice.getProblem(+params['id'])
      .then(problem=> this.problem = problem)
    })
  }

}
