import { Injectable } from '@angular/core';
import { Http, RequestOptions, Headers, Response } from '@angular/http';
import { AuthServices } from './auth.service';
import { Observable } from 'rxjs/Observable';
import { Projects } from '../__models/projects.model';
import 'rxjs/add/operator/map';

@Injectable()
export class ProjectsService {
    public serverUrl = 'http://localhost:8001/api/projects';

    constructor(private http: Http, private auth: AuthServices) {}

    getProjects(userId: string) {
        const headers = new Headers({
            'Content-Type': 'application/json',
            'Authorization': this.auth.token
        });
        const options = new RequestOptions({ headers: headers });
        return this.http.post(this.serverUrl, JSON.stringify({idUser: userId}), options)
            .map((projectsResult: Response) => {
                return projectsResult.json().projects;
            });
    }

    addProject(userId: string, nameProject: string) {

    }
}
