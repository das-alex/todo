import { Component, OnInit } from '@angular/core';
import { ProjectsService } from '../__services/projects.service';
import { Projects } from '../__models/projects.model';
import { RouterModule, Router } from '@angular/router';
import { DataShareService } from '../__services/data-share.service';
import { AuthServices } from '../__services/auth.service';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css'],
  providers: [ ProjectsService ]
})
export class ProjectsComponent implements OnInit {
  public projects: Projects[] = [];
  public addProjectButton = false;

  constructor(
    private projectsService: ProjectsService,
    private dataShare: DataShareService,
    private auth: AuthServices,
    private router: Router
  ) { }

  ngOnInit() {
    this.getProjects();
  }

  addProjectButtonFn() {
    this.addProjectButton = this.addProjectButton === false ? true : false;
  }

  getProjects() {
    this.projectsService.getProjects(this.auth.userId)
        .subscribe(result => this.projects = result);
  }

  openProject(projectId: string, projectName: string) {
    this.router.navigate(['/dashboard/project/', projectId]);
  }

  addProject(projectName: string) {
    this.projectsService.addProject(this.auth.userId, projectName)
      .subscribe(result => console.log(result));
  }

  deleteProject(projectId: string) {
    this.projectsService.deleteProject(projectId, this.auth.userId)
      .subscribe(result => console.log(result));
  }

}
