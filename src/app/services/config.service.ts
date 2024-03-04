import { Injectable } from '@angular/core';

@Injectable()
export class ConfigService {
    constructor() {}

	load(): Promise<void> {
        return new Promise((resolve) => {
            setTimeout(resolve, 7000);
        })
    }
}
