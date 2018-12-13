import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor(public http: HttpClient) {}
  
  ngOnInit() {
  }

  public ping() {
    this.http.get('')
      .subscribe(
        data => console.log(data),
        err => console.log(err)
      );
  }
}
