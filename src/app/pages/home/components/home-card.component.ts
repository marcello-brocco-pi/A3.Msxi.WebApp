import { Component, Input } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { DividerModule } from 'primeng/divider';
import { ComponentBaseComponent } from '../../../shared/componentbase/component-base.component';
import { LayoutService } from '../../../layout/service/layout.service';
import { Router } from '@angular/router';
import { HomePageCardType } from '../../../shared/HomePageCards/home-page-card-type';
import { CommonModule } from '@angular/common';
import { HomeCardLink } from '../models/home-card-link.model';
import { ButtonModule } from 'primeng/button';

@Component({
    selector: 'app-home-card',
    standalone: true,
    templateUrl: './home-card.component.html',
    imports: [CommonModule, DividerModule, TranslateModule, ButtonModule],
})
export class HomeCardComponent extends ComponentBaseComponent {

    @Input()
    cardTitle: string = '';

    @Input()
    public cardIcon: string = '';

    @Input()
    public homePageCardType: HomePageCardType | null = null;

    @Input()
    public routePath: string = '';

    @Input()
    public links : HomeCardLink[] = [];

    constructor(translate: TranslateService, private layoutService: LayoutService, private router: Router) {
        super(translate);
    }

    override applyTranslation(): void {
        
    }

    public openPrimaryLink() {
        this.layoutService.layoutState.update(actualState => ({
            ...actualState,
            sidebarVisible: true
        }));

        if (this.homePageCardType != null) {
            this.layoutService.selectedHomePageCardTypeChanged.next(this.homePageCardType);
        }
        
        this.router.navigate([this.routePath]);
    }
    
    public openSecondaryLink(routePath: string) {
        this.layoutService.layoutState.update(actualState => ({
            ...actualState,
            sidebarVisible: true
        }));

        if (this.homePageCardType != null) {
            this.layoutService.selectedHomePageCardTypeChanged.next(this.homePageCardType);
        }

        this.router.navigate([routePath]);
    }
}
