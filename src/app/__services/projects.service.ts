import { Injectable } from '@angular/core';
import { Http, RequestOptions, Headers, Response } from '@angular/http';
import { AuthServices } from './auth.service';
import { Observable } from 'rxjs/Observable';
import { Projects } from '../__models/projects.model';
import 'rxjs/add/operator/map';

@Injectable()
export class ProjectsService {
    public serverUrl = 'http://localhost:8001/api/projects';

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

    getProjects(userId: string) {
        const options = this.returnHeaders('auth');
        return this.http.post(this.serverUrl, JSON.stringify({idUser: userId}), options)
            .map((projectsResult: Response) => {
                return projectsResult.json().projects;
            });
    }

    addProject(userId: string, nameProject: string) {
        const options = this.returnHeaders('auth');
        const project = {
            name: nameProject,
            idUser: userId
        };
        return this.http.post(this.serverUrl + '/addProject', JSON.stringify(project), options)
            .map((projectResponse: Response) => {
                return projectResponse.json();
            });
    }
}
