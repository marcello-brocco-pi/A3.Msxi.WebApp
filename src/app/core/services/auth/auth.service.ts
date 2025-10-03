import { EventEmitter, Injectable } from '@angular/core';
import { Observable, catchError } from 'rxjs';
import { AuthResponseGetDto, CompanyInfo, UserInfo } from './models/auth-response-get-dto.model';
import { HttpClient } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
import { ServiceBaseService } from '../../../shared/services/service-base.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService extends ServiceBaseService {

  public selectedCompanyChanged: EventEmitter<CompanyInfo | null> = new EventEmitter<CompanyInfo | null>();
  private readonly TOKEN = 'token';
  private readonly USER_INFO = 'userInfo';
  private readonly SELECTED_COMPANY = 'selectedCompany';

  private _userInfo: UserInfo | null = this.getValueFromStorage(this.USER_INFO)??null;
  private _token : string | null = this.getValueFromStorage(this.TOKEN)??null;
  private _selectedCompany: CompanyInfo | null = this.getValueFromStorage(this.SELECTED_COMPANY)??null;
  private tRolesNull! : string;
  private tRolesArrayNull! : string;
  private tNameNotEmpty! : string;

  constructor(private http : HttpClient,  translate : TranslateService) {
    super(translate);
    
  }

  protected override applyTranslation() {
    this.tRolesNull = this.translate.instant("ruolo non può essere nullo");
    this.tRolesArrayNull = this.translate.instant("rolesArray non valido");
    this.tNameNotEmpty = this.translate.instant('name non può essere vuoto');
  }


  public get selectedCompany(): CompanyInfo | null {
    let result : CompanyInfo | null = null;

    if (this._selectedCompany) {
      result = this._selectedCompany;
    } else {
      result = this.getValueFromStorage(this.SELECTED_COMPANY);
    }
    return result;
  }

  public set selectedCompany(value: CompanyInfo | null) {
    this._selectedCompany = value;
    if (value) {
      sessionStorage.setItem(this.SELECTED_COMPANY, JSON.stringify(value));
    } else {
      sessionStorage.removeItem(this.SELECTED_COMPANY);
    }
    this.selectedCompanyChanged.emit
  }

  public get userInfo() {
    let result : UserInfo | null = null;
    if (this._userInfo) {
      result = this._userInfo;
    } else {
      result = this.getValueFromStorage(this.USER_INFO);
    }

    return result;
  }

  public set userInfo( value : UserInfo | null) {
    this._userInfo = value;
    if (value) {
      sessionStorage.setItem(this.USER_INFO, JSON.stringify(value));
    } else {
      sessionStorage.removeItem(this.USER_INFO);
    }

  }

  public get token(){
    let result : string | null = null;
    if (this._token) {
      result = this._token;
    } else {
      result = this.getValueFromStorage(this.TOKEN);
    }

    return result;
  }

  public set token(value : string | null) {
    this._token = value;
    if (value) {
      sessionStorage.setItem(this.TOKEN, JSON.stringify(value));
    } else {
      sessionStorage.removeItem(this.TOKEN);
    }

  }

  get isUserLoggedIn(): boolean {
    return this.userInfo != null;
  }

  public getLoggedUserRolesString() : string
  {
    let roles = '';
    if (this.userInfo && this.userInfo.roles && this.userInfo.roles.length > 0) {
      for (const role of this.userInfo.roles) {
        if (roles.length > 0) {
          roles += ', ';
        }
        roles += role;
      }
    }
    return roles;
  }

  public isInRole(roles : string) : boolean {
    if (!roles) {
      throw new Error(this.tRolesNull);
    }
    if (!this.userInfo || !this.userInfo.roles || this.userInfo.roles.length == 0) {
      return false;
    }
    let foundRolesCount = 0;
    let rolesArray = roles.split(',');
    if (!rolesArray) {
      throw new Error(this.tRolesArrayNull);
    }
    for (const role of rolesArray) {
      var foundRole = this.userInfo.roles.filter((p: string) => p == role ).length > 0;
      if (foundRole) {
        foundRolesCount++;
      }
    }

    return foundRolesCount > 0;
  }

  public getLogin(username: string, password: string) : Observable<AuthResponseGetDto> {
    const request : any = {
        username : username,
        password : password
    };

    return this.http.post<AuthResponseGetDto>(this.BASE_URL + '/Auth', request)
    .pipe(
        catchError(this.handleError.bind(this))
    );
  }

  public logOut() {
    this.userInfo = null;
    this.selectedCompany = null;
  }

  private getValueFromStorage(name : string) {
    if (!name) {
      throw new Error(this.tNameNotEmpty);
    }
    let result = null;
    const valueFromStorage = sessionStorage.getItem(name);
    if (valueFromStorage) {
      result = JSON.parse(valueFromStorage);
    }
    return result;
  }

}




