
import { Component, OnDestroy } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { PrimeNGConfig } from 'primeng/api';
import { Subscription } from 'rxjs';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent   {

  title = 'gogs_front';
  subscription: Subscription;

  constructor(private primengConfig: PrimeNGConfig,  private translateService: TranslateService) {
    console.log("app");
    this.translateService.use('fr');
    this.subscription = this.translateService.get('primeng').subscribe(res => this.primengConfig.setTranslation(res));
  }


    ngOnInit(): void {
        this.primengConfig.ripple = true;

    }

    translate(lang: string) {

    }

    changeLang(lang: string) {
      this.translateService.use(lang);
    }

    ngOnDestroy() {
       if (this.subscription) {
          this.subscription.unsubscribe();
      }
    }
}
