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

    getListOfTasks(projectId: string, iterationId): Observable<Tasks[]> {
        const options = this.returnHeaders('auth');
        return this.http.get(this.serverAdress + '/' + projectId + '&' + iterationId, options)
            .map((tasksResult: Response) => {
                return tasksResult.json().task;
            });
    }

    addTask(
        task: string,
        description: string,
        status: string,
        points: string,
        userId: string,
        projectId: string,
        iterationId: string
    ): Observable<string> {
        const options = this.returnHeaders('auth');
        const taskObj = {
            task: task,
            describe: description,
            status: status,
            points: points,
            idUser: userId,
            idProject: projectId,
            idIteration: iterationId
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

    deleteTask(taskId: string) {
        const options = this.returnHeaders('auth');
        return this.http.delete(this.serverAdress + '/delete/' + taskId, options)
            .map((response: Response) => {
                return response.json();
            });
    }

    editTask(taskId: string, task: object) {
        const options = this.returnHeaders('auth');
        return this.http.patch(this.serverAdress + '/update/' + taskId,
            JSON.stringify(task), options)
            .map((response: Response) => {
                console.log(response.json());
                return response.json();
            });
    }
}
