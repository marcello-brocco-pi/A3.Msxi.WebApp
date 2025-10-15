import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { ButtonModule } from 'primeng/button';
import { ComponentBaseComponent } from '../../../shared/componentbase/component-base.component';
import { ModalMessageService } from '../../../shared/modal-message/modal-message.service';
import { GeneralUtilsService } from '../../../shared/services/general-utils.service';
import { UploadedAttachmentDto } from '../models/source-email-dto';
import { MultiSelectModule } from 'primeng/multiselect';
import { DropdownDataObject } from '../../../shared/models/dropdown-dataobject.dto';
import { EmailProcessService } from '../../services/email-process.service';

@Component({
    selector: 'app-s3-dropdown-uploaded-files',
    standalone: true,
    imports: [FormsModule,CommonModule, TranslateModule, SelectModule, ButtonModule, MultiSelectModule],
    templateUrl: './s3-dropdown-uploaded-files.component.html'
})

export class S3DropdownUploadedFilesComponent extends ComponentBaseComponent {
    @Input() uploadedPath: string = '';
    @Input() uploadedFileName: string = '';
    @Input() emailAttachs: UploadedAttachmentDto[] = [];
    private tAllegatoNonPresente: string = '';
    
    dataRows!: DropdownDataObject[];
    selectedRows!: DropdownDataObject[];

    constructor(private modalMessageService: ModalMessageService, private generalUtilsService: GeneralUtilsService,
        translate: TranslateService, private emailProcessService: EmailProcessService) {
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

    downloadSelectedFiles(selectedRows: DropdownDataObject[]) {
        if (selectedRows && selectedRows.length < 1) {
            this.modalMessageService.showError(this.translate.instant('Selezionare almeno un file per procedere con il download'));
            return;
        }
        selectedRows = selectedRows || [];
    }
}