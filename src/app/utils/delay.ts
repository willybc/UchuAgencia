import { Injectable } from '@angular/core';



@Injectable()
export class DelayService {
    load(): Promise<void> {
        return new Promise((resolve) => {
            setTimeout(resolve, 5000);
        })
    }
}