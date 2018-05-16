import { Injectable } from '@angular/core';
import { Http, Response, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { AuthServices } from './auth.service';
import 'rxjs/add/operator/map';

@Injectable()
export class IterationService {
    public serverUrl = 'http://localhost:8001/api/iterations';

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

    getIterations(projectId: string) {
        const options = this.returnHeaders('auth');
        this.http.get(this.serverUrl + '/' + projectId, options)
            .map((listOfIter: Response) => {
                return listOfIter.json().iterations;
            });
    }

    addIteration(name: string, projectId: string) {
        const options = this.returnHeaders('auth');
        const iteration = {
            name: name,
            idProject: projectId
        };
        this.http.post(this.serverUrl + '/', JSON.stringify(iteration), options)
            .map((iterationResponse: Response) => {
                return iterationResponse.json();
            });
    }

    updateIteration(name: string, iterationId: string) {
        const options = this.returnHeaders('auth');
        const iteration = {
            name: name
        };
        this.http.patch(this.serverUrl + '/' + iterationId, JSON.stringify(iteration), options)
            .map((updateIterRes: Response) => {
                return updateIterRes.json();
            });
    }
}
