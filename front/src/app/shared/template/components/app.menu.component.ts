import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { navigation } from '../../navigation';

@Component({
    selector: 'app-menu',
    templateUrl: './app.menu.component.html'
})
export class AppMenuComponent implements OnInit {

    model: any[] = [];

    ngOnInit() {
        this.model = navigation ;
    }
}
