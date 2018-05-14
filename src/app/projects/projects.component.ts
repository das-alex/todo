import { Component, OnInit } from '@angular/core';
import { ProjectsService } from '../__services/projects.service';
import { Projects } from '../__models/projects.model';
import { RouterModule, Router } from '@angular/router';
import { DataShareService } from '../__services/data-share.service';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css'],
  providers: [ ProjectsService ]
})
export class ProjectsComponent implements OnInit {
  public projects: Projects[] = [];

  constructor(
    private projectsService: ProjectsService,
    private dataShare: DataShareService,
    private router: Router
  ) { }

  ngOnInit() {
    this.getProjects();
  }

  getProjects() {
    this.projectsService.getProjects('5aee0275640f673c4a6997ed')
        .subscribe(result => this.projects = result);
  }

  openProject(projectId: string) {
    this.dataShare.setStringData(projectId);
    this.router.navigate(['/dashboard/tasks']);
  }

}
