import { Component, OnInit } from '@angular/core';
import { AuthServices } from '../__services/auth.service';
import { Route } from '@angular/compiler/src/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [AuthServices]
})
export class LoginComponent implements OnInit {
  constructor(private authService: AuthServices, private router: Router) { }

  ngOnInit() {
    // this.authService.logout();
  }

  login(email: string, password: string) {
    this.authService.login(email, password)
      .subscribe(result => {
        if (result) {
          this.router.navigate(['/dashboard/projects']);
        }
      });
  }

}
