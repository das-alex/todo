import { Component, OnInit } from '@angular/core';
import { AuthServices } from '../__services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
  providers: [AuthServices]
})
export class SignupComponent implements OnInit {

  constructor(private authService: AuthServices, private router: Router) { }

  ngOnInit() {
  }

  registration(email: string, name: string, password: string) {
    this.authService.registration(email, name, password)
      .subscribe(result => {
        if (result) {
          this.router.navigate(['login']);
        }
      });
  }

}
