import { Component, OnInit } from '@angular/core';
import { DataShareService } from '../__services/data-share.service';
import { TasksService } from '../__services/tasks.service';
import { Tasks } from '../__models/tasks.model';
import { AuthServices } from '../__services/auth.service';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css'],
  providers: [
    TasksService,
    AuthServices
  ]
})
export class TasksComponent implements OnInit {
  public projectId: string;
  public message: string;
  public todo: Tasks[] = [];
  public doing: Tasks[] = [];
  public done: Tasks[] = [];

  constructor(
    private dataShare: DataShareService,
    private tasksService: TasksService,
    private auth: AuthServices
  ) {
    this.projectId = this.dataShare.getStringData();
  }

  ngOnInit() {
    this.getTasks();
  }

  getTasks() {
    this.tasksService.getListOfTasks(this.projectId)
      .subscribe(result => result.forEach(item => {
        if (item.status === 'todo') {
          this.todo.push(item);
        } else if (item.status === 'doing') {
          this.doing.push(item);
        } else {
          this.doing.push(item);
        }
      }));
  }

  addTask(taskName: string) {
    console.log(taskName);
    this.tasksService.addTask(taskName, this.auth.userId, this.projectId, 'todo')
      .subscribe(result => this.message = result);
  }

}
