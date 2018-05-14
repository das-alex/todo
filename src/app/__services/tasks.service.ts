import { Injectable } from '@angular/core';
import { Http, RequestOptions, Headers, Response } from '@angular/http';
import { AuthServices } from './auth.service';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import { Tasks } from '../__models/tasks.model';

@Injectable()
export class TasksService {
    public serverAdress = 'http://localhost:8001/api/tasks';

    constructor(private http: Http, private authService: AuthServices) {}

    returnHeaders(type: string) {
        let headers;
        if (type === 'auth') {
            headers = new Headers({
                'Content-Type': 'application/json',
                'Authorization': this.authService.token
            });
        } else {
            headers = new Headers({'Content-Type': 'application/json'});
        }
        const options = new RequestOptions({ headers: headers });
        return options;
    }

    getListOfTasks(projectId: string): Observable<Tasks[]> {
        const options = this.returnHeaders('auth');
        return this.http.get(this.serverAdress + '/' + projectId, options)
            .map((tasksResult: Response) => {
                return tasksResult.json().task;
            });
    }

    addTask(task: string, userId: string, projectId: string, status: string): Observable<string> {
        const options = this.returnHeaders('auth');
        const taskObj = {
            task: task,
            status: status,
            idUser: userId,
            idProject: projectId
        };
        return this.http.post(
                this.serverAdress + '/addTask',
                JSON.stringify(taskObj),
                options
            ).map((response: Response) => {
                console.log(response.json());
                return response.json();
            });
    }

    deleteTask() {
    }
}
