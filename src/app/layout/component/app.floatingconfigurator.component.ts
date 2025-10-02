import { Component, computed, inject } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { StyleClassModule } from 'primeng/styleclass';
import { LayoutService } from '../service/layout.service';
import { SelectLanguageDropDownComponent } from '../../shared/i18n/select-language-dropdown/select-language-dropdown.component';
import { AppConfigurator } from './app.configurator.component';


@Component({
    selector: 'app-floating-configurator',
    imports: [ButtonModule, StyleClassModule, SelectLanguageDropDownComponent,AppConfigurator],
    standalone: true,
    templateUrl: './app.floatingconfigurator.component.html'
})
export class AppFloatingConfigurator {
    

    LayoutService = inject(LayoutService);

    isDarkTheme = computed(() => this.LayoutService.layoutConfig().darkTheme);

    toggleDarkMode() {
        this.LayoutService.layoutConfig.update((state) => ({ ...state, darkTheme: !state.darkTheme }));
    }
}
