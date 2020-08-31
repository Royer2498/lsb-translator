import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class CoordinatesService {
  private virtualMachineDirection;
  constructor(private http: HttpClient) { 
    this.virtualMachineDirection = 'http://openpose-virtual-machine.southcentralus.cloudapp.azure.com:3000';
  }

  public async getCoordinatesFromVirtualMachine(file) {
    var payload: any = new FormData();
    payload.append('video', file);
    return this.http.post(this.virtualMachineDirection + '/coordinates', payload).toPromise();
  }

}
