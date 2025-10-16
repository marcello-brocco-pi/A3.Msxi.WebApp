import { HttpClient} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { ServiceBaseService } from '../../shared/services/service-base.service';
import { ChangePasswordRequestDto, UserManagementResponseDto } from './models/change-password-request.dto.model';

@Injectable({
    providedIn: 'root'
})

export class UserProfileService extends ServiceBaseService{

    constructor(private http: HttpClient, translate : TranslateService) { 
        super(translate);
    }

    protected override applyTranslation(): void {
        // Implement any translation logic here if needed
    }

    public changePassword(request : ChangePasswordRequestDto | null): Observable<UserManagementResponseDto> {
        let url = this.BASE_URL + '/UserAccount/ChangePassword';
        if (!request) {
            return throwError(() => new Error('Request object is null'));
        }
        return this.http.patch<UserManagementResponseDto>(url, request)
            .pipe(
                catchError(this.handleError.bind(this))
            );
    }

}
