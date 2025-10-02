import { HttpClient} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { ServiceBaseService } from '../../shared/services/service-base.service';
import { ChangePasswordRequestPatchDto } from './models/ChangePasswordRequestPatchDto.model';

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

    public patchUserProfileChangePassword(request : ChangePasswordRequestPatchDto | null): Observable<void> {
        return this.http.patch<void>(this.BASE_URL + '/Users', request)
            .pipe(
                catchError(this.handleError.bind(this))
            );
    }

}
