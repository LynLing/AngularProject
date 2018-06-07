import { Component, OnInit } from '@angular/core';
import { CollaborationService } from '../../services/collaboration.service';
import { ActivatedRoute, Params } from '@angular/router';
import {DataService } from '../../services/data.service';
import {Subscription} from 'rxjs/Subscription';

declare var ace: any;

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.css']
})
export class EditorComponent implements OnInit {
  languages: string[]  = ['Java', 'Python'];
  language: string = 'Java';
  sessionId: string;
  output: string = '';// for storing build and run output

  editor: any;
  users: string;
  subscriptionUsers: Subscription;

  constructor(private collaboration: CollaborationService,
              private route: ActivatedRoute, private dataService: DataService) { }

  defaultContent = {
    'Java': `public class Example {
      public static void main(String[] args) {
        // Type your Java code here.
      }
    }`,
    'Python': `class Solution:
      def example():
        # write your python code here.
    `
  };

  ngOnInit() {
    // use problem id as session id
    this.route.params
      .subscribe(params => {
        this.sessionId = params['id'];
        this.initEditor();
        this.collaboration.restoreBuffer();
      });
    }

  initEditor(): void {
    this.editor = ace.edit("editor");
    this.editor.setTheme("ace/theme/eclipse");
    this.resetEditor();

    // setup collaboration socket
    //this.collaboration.init(this.editor, this.sessionId);
    this.subscriptionUsers = this.collaboration.init(this.editor, this.sessionId)
    .subscribe(users => this.users = users);

    this.editor.lastAppliedChange = null;

    // registrer change callback
    this.editor.on("change", (e) => {
      console.log('editor changes: ' + JSON.stringify(e));
      if (this.editor.lastAppliedChange != e) {
        this.collaboration.change(JSON.stringify(e));
      }
    })

  }

  // reset editor content
  resetEditor(): void {
    this.editor.setValue(this.defaultContent[this.language]);
    this.editor.getSession().setMode("ace/mode/" + this.language.toLowerCase());
  }

  // set language
  setLanguage(language: string): void {
    this.language = language;

    this.resetEditor();
  }

  // submit
  submit(): void {
    let user_code = this.editor.getValue();
    console.log('frontend' + user_code);

    const data = {
      user_code: user_code,
      lang: this.language.toLocaleLowerCase()
    };
    console.log("submit:" + JSON.stringify(data))
    this.dataService.buildAndRun(data)
      .then(res => {
        this.output = res;
        console.log(this.output);
      });
  }

}
