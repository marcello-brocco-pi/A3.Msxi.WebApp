import { Component, EventEmitter, Output } from "@angular/core";
import { TranslateModule } from "@ngx-translate/core";
import { ButtonModule } from "primeng/button";
import { ToastModule } from "primeng/toast";

@Component({
    selector: 'app-toastnewversion',
    standalone: true,
    imports: [TranslateModule, ToastModule, ButtonModule],
    templateUrl: './app.toast-new-version.component.html',
})
export class AppToastNewVersion {
    @Output() reloadButtonClick = new EventEmitter<void>();
    constructor() {}

    public closeNewVersionInfo() {
        this.reloadButtonClick.emit();
    }

}