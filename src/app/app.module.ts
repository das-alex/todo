import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { TasksComponent } from './tasks/tasks.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { AuthServices } from './__services/auth.service';
import { ProjectsComponent } from './projects/projects.component';
import { AuthGuardService } from './__services/auth-guard.service';
import { ProjectsService } from './__services/projects.service';
import { DataShareService } from './__services/data-share.service';
import { DashboardComponent } from './dashboard/dashboard.component';
import { IterationsComponent } from './iterations/iterations.component';

const routs: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuardService],
    canActivateChild: [AuthGuardService],
    children: [
      { path: 'projects', component: ProjectsComponent },
      { path: 'project/:idProject', component: IterationsComponent, children: [
        { path: 'iteration/:idIteration', component: TasksComponent}
      ]},
      { path: '', redirectTo: '/dashboard/projects', pathMatch: 'full' }
    ]
  },
  { path: 'signup', component: SignupComponent },
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },
  {
    path: '**',
    component: NotFoundComponent
  }
];

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SignupComponent,
    TasksComponent,
    NotFoundComponent,
    ProjectsComponent,
    DashboardComponent,
    IterationsComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(routs),
    FormsModule,
    HttpModule
  ],
  providers: [
    AuthServices,
    AuthGuardService,
    DataShareService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
