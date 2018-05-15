import { Injectable, OnInit } from '@angular/core';

@Injectable()
export class DataShareService  {
    private stringData: string;

    constructor() {}

    setStringData(data: string) {
        this.stringData = data;
    }

    getStringData() {
        const tmp = this.stringData;
        return tmp;
    }
}
