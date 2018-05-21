import { Component, OnInit, OnDestroy } from '@angular/core';
import { DataShareService } from '../__services/data-share.service';
import { TasksService } from '../__services/tasks.service';
import { Tasks } from '../__models/tasks.model';
import { AuthServices } from '../__services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';

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
  public iterationId: string;
  public message: string;
  private todo: Tasks[] = [];
  private doing: Tasks[] = [];
  private done: Tasks[] = [];
  private backlog: Tasks[] = [];

  public addTaskModal = false;
  public backlogModal = false;
  private currentTask: Tasks;

  constructor(
    private dataShare: DataShareService,
    private tasksService: TasksService,
    private auth: AuthServices,
    private actRoute: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.actRoute.parent.params.subscribe((parentParams) => {
      this.projectId = parentParams['idProject'];
      this.actRoute.params.subscribe((childParams) => {
        this.iterationId = childParams['idIteration'];
        this.getTasks();
      });
    });
  }

  getTasks() {
    this.done.length = this.doing.length = this.todo.length = 0;
    this.backlog.length = 0;
    this.tasksService.getListOfTasks(this.projectId, this.iterationId)
      .subscribe(result => result.forEach(item => {
        console.log(item);
        if (item.inBacklog === false) {
          if (item.status === 'todo') {
            this.todo.push(item);
          } else if (item.status === 'doing') {
            this.doing.push(item);
          } else {
            this.done.push(item);
          }
        } else {
          this.backlog.push(item);
        }
      }));
  }

  addTask(
    taskName: string,
    description: string,
    status: string,
    points: string
  ) {
    this.tasksService.addTask(taskName, description, status,
      points, this.auth.userId, this.projectId, this.iterationId)
      .subscribe(result => {
        this.message = result;
        this.ngOnInit();
      });
  }

  deleteTask(taskId: string) {
    this.tasksService.deleteTask(taskId)
      .subscribe(result  => {
        console.log(result);
        this.ngOnInit();
      });
  }

  editTask(taskId: string, task: string, status: string, describe: string, points: number) {
    const taskObj = {
      task: task,
      status: status,
      describe: describe,
      points: points
    };
    this.tasksService.editTask(taskId, taskObj)
      .subscribe(result => {
        this.message = result;
        this.ngOnInit();
      });
  }

  changeStatus(taskId: string, status: string) {
    const taskObj = {
      status: status
    };
    this.tasksService.editTask(taskId, taskObj)
      .subscribe(result  => {
        console.log(result);
        this.ngOnInit();
      });
  }

  toBacklog(taskId: string) {
    const taskObj = {
      inBacklog: true
    };
    this.tasksService.editTask(taskId, taskObj)
      .subscribe(result  => {
        console.log(result);
        this.ngOnInit();
      });
  }

  fromBackLog(taskId: string) {
    this.backlog.length = 0;
    const taskObj = {
      inBacklog: false
    };
    this.tasksService.editTask(taskId, taskObj)
      .subscribe(result  => {
        console.log(result);
        this.ngOnInit();
      });
  }

  cancelAddTask() {
    this.addTaskModal = false;
  }

  cancelBacklog() {
    this.backlogModal = false;
  }

  showAddButton(task?: Tasks) {
    this.currentTask = task;
    this.addTaskModal = true;
  }

  showBacklog() {
    this.backlogModal = true;
  }

}
