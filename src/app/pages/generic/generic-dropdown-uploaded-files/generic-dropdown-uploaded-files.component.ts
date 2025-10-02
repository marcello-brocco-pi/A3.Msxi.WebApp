import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ComponentBaseComponent } from '../../../shared/componentbase/component-base.component';
import { EDonwloadFormat, LogGenFileManagerAttachmentDto } from '../generic-file-upload/models/genericFileUploadDetailResponsePostDto.model';
import { ModalMessageService } from '../../../shared/modal-message/modal-message.service';
import { GeneralUtilsService } from '../../../shared/services/general-utils.service';
import { GenImportStatusService } from '../generic-import-status/services/generic-import-status.service';
import { FormsModule } from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { ButtonModule } from 'primeng/button';

@Component({
    selector: 'app-generic-dropdown-uploaded-files',
    standalone: true,
    imports: [FormsModule,CommonModule, TranslateModule, SelectModule, ButtonModule],
    templateUrl: './generic-dropdown-uploaded-files.component.html'
})
export class GenericDropdownUploadedFilesComponent extends ComponentBaseComponent {

    @Input() lstAttachmentDto: LogGenFileManagerAttachmentDto[] = [];
    private tAllegatoNonPresente: string = '';
    countries: any[] | undefined;

    selectedCountry: string | undefined;

    constructor(private modalMessageService: ModalMessageService, private generalUtilsService: GeneralUtilsService, private importStatusService: GenImportStatusService,
        translate: TranslateService) {
        super(translate);

    }

    override ngOnInit() {
        super.ngOnInit();         
    }

    override applyTranslation(): void {
        this.tAllegatoNonPresente = this.translate.instant("Allegato non presente per la richiesta effettuata.");

    }

    downloadAttach(rowItem: LogGenFileManagerAttachmentDto) {
        this.importStatusService.downloadAttach(rowItem.fileName, rowItem.filePath, rowItem.direction, EDonwloadFormat.Bytes)
            .subscribe((response) => {
                this.saveAs(response);
            });
    }

    saveAs(response: any): void {
        if (response.body !== null) {
            this.generalUtilsService.downloadBlobType(response.body, response.body.type,
                this.generalUtilsService.getXFileNameFromRepsonse(response));
        }
        else {
            this.modalMessageService.showError(this.tAllegatoNonPresente)
        }
    }

    copyToClipboard(value: string) {
        this.generalUtilsService.copyToClipboard(value);
    }

    getIconExtension(fileName: string) : string {
        let ext = fileName.split('.').pop()?.toLocaleLowerCase();
        let extClass = this.generalUtilsService.getIconExtension(ext);
        return extClass;
    }
}