import { Injectable } from '@angular/core';
import { Http, Headers, Response, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { Options } from 'selenium-webdriver/edge';

@Injectable()
export class AuthServices {
    public token: string;
    public userId: string;
    public loggedIn: boolean;
    public serverAddres = 'http://localhost:8001/api/users';

    constructor(private http: Http) {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        this.token = currentUser && currentUser.token;
        this.userId = currentUser && currentUser.userId;
    }

    login(email: string, password: string): Observable<boolean> {
        const headers = new Headers({'Content-Type': 'application/json'});
        const options = new RequestOptions({ headers: headers });
        return this.http.post(this.serverAddres + '/checkUser',
            JSON.stringify({email: email, password: password}), options)
            .map((res: Response) => {
                const recivedToken = res.json() && res.json().token;
                if (recivedToken) {
                    this.token = recivedToken;
                    localStorage.setItem('currentUser', JSON.stringify({
                        email: email,
                        userId: res.json().userId,
                        token: recivedToken
                    }));
                    this.loggedIn = true;
                    return true;
                } else {
                    return false;
                }
            });
    }

    logout(): void {
        this.token = null;
        this.loggedIn = false;
        localStorage.removeItem('currentUser');
    }
}
