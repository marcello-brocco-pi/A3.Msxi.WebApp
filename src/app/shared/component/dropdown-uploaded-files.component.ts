import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { ButtonModule } from 'primeng/button';
import { ComponentBaseComponent } from '../componentbase/component-base.component';
import { ModalMessageService } from '../modal-message/modal-message.service';
import { GeneralUtilsService } from '../services/general-utils.service';
import { UploadedAttachmentDto } from '../../pages/emailprocess/models/SourceEmailDto';
import { MultiSelectModule } from 'primeng/multiselect';

interface DataObject {
    name: string,
    value: string
}

@Component({
    selector: 'app-dropdown-uploaded-files',
    standalone: true,
    imports: [FormsModule,CommonModule, TranslateModule, SelectModule, ButtonModule, MultiSelectModule],
    templateUrl: './dropdown-uploaded-files.component.html'
})

export class GenericDropdownUploadedFilesComponent extends ComponentBaseComponent {
    @Input() uploadedPath: string = '';
    @Input() uploadedFileName: string = '';
    @Input() emailAttachs: UploadedAttachmentDto[] = [];
    private tAllegatoNonPresente: string = '';
    
    dataRows!: DataObject[];
    selectedRows!: DataObject[];

    constructor(private modalMessageService: ModalMessageService, private generalUtilsService: GeneralUtilsService,
        translate: TranslateService) {
        super(translate);

    }
    
    override ngOnInit() {
        super.ngOnInit();
        this.dataRows = [];
        for (let file of this.emailAttachs ?? []) {
            this.dataRows.push({name: file.name, value: file.uploadedPath});
        }
    }

    override applyTranslation(): void {
        this.tAllegatoNonPresente = this.translate.instant("Allegato non presente per la richiesta effettuata.");

    }

    // downloadAttach(rowItem: LogGenFileManagerAttachmentDto) {
    //     this.importStatusService.downloadAttach(rowItem.fileName, rowItem.filePath, rowItem.direction, EDonwloadFormat.Bytes)
    //         .subscribe((response) => {
    //             this.saveAs(response);
    //         });
    // }

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

    mergeAndDownloadSelectedFiles(selectedRows: DataObject[]) {
        if (selectedRows && selectedRows.length < 2) {
            this.modalMessageService.showError(this.translate.instant('Selezionare almeno due files per procedere con l\'unione'));
            return;
        }
        selectedRows = selectedRows || [];
    }

    downloadSelectedFiles(selectedRows: DataObject[]) {
        if (selectedRows && selectedRows.length < 1) {
            this.modalMessageService.showError(this.translate.instant('Selezionare almeno un file per procedere con il download'));
            return;
        }
        selectedRows = selectedRows || [];
    }
}