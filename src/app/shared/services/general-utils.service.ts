import { HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ImageViewerConfig } from 'ngx-image-viewer-3';
import * as UTIF from 'utif';

@Injectable({
  providedIn: 'root'
})
export class GeneralUtilsService {

  constructor() { }

  public downloadTextPlainBlob(content: string, name: string) {
    this.downloadBlob(content, 'text/plain', name)
  }

  public downloadAppJsonBlob(content: string, name: string) {
    this.downloadBlob(content, 'application/json', name)
  }

  public downloadBlobType(content: string, type: string, name: string) {
    this.downloadBlob(content, type, name)
  }

   public blobToBase64 = (postedfile: Blob) => new Promise<any>((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(postedfile);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });

  public getXFileNameFromRepsonse(response: HttpResponse<Blob>) {
    let filename: string;
    try {
      filename = response.headers.get('x-file-name')!;
    }
    catch (e) {
      filename = 'download.pdf'
    }
    return filename
  }
  
  public getIconExtension(ext: string | undefined) {
    let extClass = '';
    if (ext === 'txt' || ext === 'log' || ext === 'csv') {
      extClass = 'pi pi-file-o';
    }
    if (ext === 'pdf' || ext === 'p7m') {
      extClass = 'pi pi-file-pdf';
    }
    else if (ext === 'doc' || ext === 'docx') {
      extClass = 'pi pi-file-word';
    }
    else if (ext === 'xls' || ext === 'xlsx') {
      extClass = 'pi pi-file-excel';
    }
    else if (ext === 'tif') {
      extClass = 'pi pi-image';
    }
    else if (ext === 'gif') {
      extClass = 'pi pi-image';
    }
    else if (ext === 'jpeg' || ext === 'jpg') {
      extClass = 'pi pi-image';
    }
    else if (ext === 'png') {
      extClass = 'pi pi-image';
    }
    else if (ext === 'eml') {
      extClass = 'pi pi-envelope';
    }    
    else {
      extClass = 'pi pi-file-o';
    }
    return extClass;
  }

  private downloadBlob(content: string, type: string, name: string) {
    const jsonBlob = new Blob([content], { type: type });
    const url = window.URL.createObjectURL(jsonBlob);
    const a = document.createElement('a');

    a.href = url;
    a.download = name;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }

  copyToClipboard(text: string): void {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";  // Evita che lo textarea sia visibile
    textArea.style.opacity = "0";       // Rende lo textarea invisibile
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
        const successful = document.execCommand("copy");
     } catch (err) {
        
    }
    document.body.removeChild(textArea);
  }

  
  public isImageFile(fileName: string) : boolean {
      const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.tiff', '.webp'];
      const fileExtension = fileName.toLowerCase().split('.').pop();
      return imageExtensions.includes('.' + fileExtension);
  }

  public isPdfFile(fileName: string) : boolean {
    const imageExtensions = ['.pdf', '.p7m'];
    const fileExtension = fileName.toLowerCase().split('.').pop();
    return imageExtensions.includes('.' + fileExtension);
  }

  public isTextFile(fileName: string): boolean {
    const textExtensions = ['.txt', '.log', '.csv', '.xml', '.json', '.js', '.html', '.css', '.md'];
    const fileExtension = fileName.toLowerCase().split('.').pop();
    return textExtensions.includes('.' + fileExtension);
  }
  
  public getImageType(fileName: string): string {
      const imageExtensions: Record<string, string> = {
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.png': 'image/png',
        '.gif': 'image/gif',
        '.bmp': 'image/bmp',
        '.tiff': 'image/tiff',
        '.webp': 'image/webp'
      };
      const fileExtension = fileName.toLowerCase().split('.').pop();
      return imageExtensions['.' + fileExtension!] || '';
    }

  public convertTiffBase64ToPngBase64(tiffBase64: string): string {
    try {
      // Decode base64 to binary
      const tiffBinary = atob(tiffBase64);
      const tiffArray = new Uint8Array(tiffBinary.length);
      for (let i = 0; i < tiffBinary.length; i++) {
        tiffArray[i] = tiffBinary.charCodeAt(i);
      }

      // Parse TIFF
      const ifds = UTIF.decode(tiffArray.buffer);
      UTIF.decodeImage(tiffArray.buffer, ifds[0]);

      // Get RGBA image data
      const firstIFD = ifds[0];
      const rgba = UTIF.toRGBA8(firstIFD);

      // Create canvas and draw image
      const canvas = document.createElement('canvas');
      canvas.width = firstIFD.width;
      canvas.height = firstIFD.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) return '';

      const imageData = ctx.createImageData(canvas.width, canvas.height);
      imageData.data.set(rgba);
      ctx.putImageData(imageData, 0, 0);

      // Get PNG base64
      const pngBase64 = canvas.toDataURL('image/png').split(',')[1];
      return pngBase64;
    } catch (e) {
      return '';
    }
  }

  public getImageViewerConfig(): ImageViewerConfig {
    return {
      btnClass: 'default',
      zoomFactor: 0.1,
      containerBackgroundColor: '#ccc',
      wheelZoom: true,
      allowFullscreen: false,
      allowKeyboardNavigation: true,
      btnIcons: {
        zoomIn: 'pi pi-search-plus',
        zoomOut: 'pi pi-search-minus',
        rotateClockwise: 'pi pi-refresh',
        rotateCounterClockwise: 'pi pi-replay',
      },
      btnShow: {
        zoomIn: true,
        zoomOut: true,
        rotateClockwise: true,
        rotateCounterClockwise: true,
        next: false,
        prev: false
      }
    };
  }
}



