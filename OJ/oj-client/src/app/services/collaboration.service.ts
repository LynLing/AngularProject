import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { Subject } from 'rxjs/Subject';

declare var io: any;

@Injectable()
export class CollaborationService {
  collaborationSocket: any;
  private _userSource = new Subject<string>();

  constructor() { }

  init(editor: any, sessionId: string): Observable<string> {
    this.collaborationSocket = io(window.location.origin, {query: 'sessionId=' + sessionId});

    this.collaborationSocket.on("change", (delta: string) => {
      console.log('collabration: editor changes by ' + delta);
      delta = JSON.parse(delta);
      editor.lastAppliedChange = delta;
      editor.getSession().getDocument().applyDeltas([delta]);
    });

    this.collaborationSocket.on("userchange", (data: string[]) => {
      console.log('collabration: user changes ' + data);

      this._userSource.next(data.toString());
    });

    return this._userSource.asObservable();
  }

  // emit event to make changes and inform server and other collaborators
  change(delta: string): void {
    this.collaborationSocket.emit("change", delta);
  }

  // send restoreBuffer request to server
  restoreBuffer(): void {
    this.collaborationSocket.emit("restoreBuffer");
  }
}
