import { Component, OnInit } from '@angular/core';
import { AuthServices } from '../__services/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  providers: [AuthServices]
})
export class DashboardComponent implements OnInit {
  public userEmail: string;

  constructor(private auth: AuthServices) {
    if (localStorage.getItem('currentUser')) {
      const currentUser = JSON.parse(localStorage.getItem('currentUser'));
      this.userEmail = currentUser.email;
    }
  }

  ngOnInit() {
  }

  logout() {
    this.auth.logout();
  }

}
