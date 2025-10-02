import { Injectable } from '@angular/core';
import { NotificationService } from './notification-service';
import * as signalR from '@microsoft/signalr';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from '../../core/services/auth/auth.service';
import { UploadStatusNotifyDto, DocCubeHubMessageDto } from '../../layout/models/upload-status-notify-dto.model';
import { ServiceBaseService } from './service-base.service';

@Injectable({
    providedIn: 'root'
})

export class SignalrService extends ServiceBaseService{
    private readonly hubConnection: signalR.HubConnection;
    constructor(private notificationService: NotificationService, private auth: AuthService, translate: TranslateService) {
      super(translate);

      this.hubConnection = new signalR.HubConnectionBuilder()
        .withUrl(this.BASE_URL + '/docCubeHub', {
            withCredentials: false,
            transport: signalR.HttpTransportType.WebSockets
        })
        .withAutomaticReconnect([0, 2000, 10000, 30000]) // Tentativi di riconnessione: immediato, 2s, 10s, 30s
        .configureLogging(signalR.LogLevel.Information)
        .build();
        this.addReceiveNotificationListener();
        this.addReconnectionHandlers();
    }
  
    protected override applyTranslation(): void {
      // Implement any translation logic here if needed
    }

    getHubConnection(): signalR.HubConnection {
        return this.hubConnection;
    }

    startConnection(): void {
      if(this.hubConnection.state === signalR.HubConnectionState.Disconnected) {
          this.hubConnection.start()
              .then(() => console.log(`SignalR connection started on ${new Date().toLocaleString()}`))
              .catch((err: any) => console.error(`Error starting SignalR connection on ${new Date().toLocaleString()}: `, err));
      
              // Configura il timeout del client
          this.hubConnection.serverTimeoutInMilliseconds = 120000; // 2 minuti
          this.hubConnection.keepAliveIntervalInMilliseconds = 60000; // 1 minuto            
      }        
    }

    closeConnection(): void {
        this.hubConnection.stop()
            .then(() => console.log(`SignalR connection stopped on ${new Date().toLocaleString()}`))
            .catch((err: any) => console.error(`Error stopping SignalR connection on ${new Date().toLocaleString()}: `, err));
    }

    addReceiveNotificationListener() {
        this.hubConnection.on('SR_RemoteUploadStatusNotification', (message: UploadStatusNotifyDto) => {
          let isPassNotification = false;
          console.log('Notification SR_RemoteUploadStatusNotification received: ', message);

          if(this.auth.isInRole('GENImportStatusFullAccess')){
            if(this.auth.selectedCompany !== null && this.auth.selectedCompany.id === message.companyId){
              isPassNotification = true;
            }
          }
          else{            
            isPassNotification = this.isCompanyIdInAuth(message.companyId, this.auth);
          }

          if (isPassNotification) {
            this.notificationService.sendRemoteUploadStatusNotification(message);
          }          
          
        });

        this.hubConnection.on('SR_MessageFromRemoteUploader', (message: DocCubeHubMessageDto) => {
          let isPassNotification = false;
          console.log('Notification SR_MessageFromRemoteUploader received: ', message);

          if(this.auth.isInRole('GENImportStatusFullAccess')){
            if(this.auth.selectedCompany !== null && this.auth.selectedCompany.id === message.companyId){
              isPassNotification = true;
            }
          }
          else{            
            isPassNotification = this.isCompanyIdInAuth(message.companyId, this.auth);
          }

          if (isPassNotification) {
            this.notificationService.sendMessageFromRemoteUploader(message);
          }            
        });

        this.hubConnection.on('SR_FeUploadStatusNotification', (message: UploadStatusNotifyDto) => {
          console.log('Notification SR_FeUploadStatusNotification received: ', message);

          if (this.auth.userInfo && this.auth.userInfo.id === message.userId) {
            this.notificationService.sendFeUploadStatusNotification(message);
          }          
          
        });
    }

    addReconnectionHandlers() {
        this.hubConnection.onreconnecting((error: any) => {
          console.log(`Connection lost due to error "${error}". Reconnecting...`);
        });
      
        this.hubConnection.onreconnected((connectionId: any) => {
          console.log(`Connection reestablished. Connected with connectionId "${connectionId}".`);
        });
      
        this.hubConnection.onclose((error: any) => {
          console.log(`Connection closed due to error "${error}". Trying to reconnect...`);
          setTimeout(() => this.startConnection(), 5000); // Riprova a connettersi dopo 5 secondi
        });
      }

    isCompanyIdInAuth(companyId: number, auth: AuthService): boolean {
      const userInfo = auth.userInfo;
      if (!userInfo || !Array.isArray(userInfo.companies)) {
        return false;
      }
      return userInfo.companies.some((company: any) => company && company.id === companyId);
    }
}
