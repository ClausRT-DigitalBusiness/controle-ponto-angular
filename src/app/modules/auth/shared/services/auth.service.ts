import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
// import { BaseGetResponse, QueryParams } from 'types/api';
// import { queryParser } from 'utils/queryParser';
import { environment } from '../../../../../environments/environment';

// export interface Timesheet {
//   startTime: number;
//   endTime: number;
//   description?: string;
// }

export interface FormData {
  username: string;
  password: string;
}

export interface LoginData {
  token: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = environment.apiUrl;

  constructor(private httpClient: HttpClient) { }

  // public getTimesheets(query?: QueryParams) {
  //   const queryParams = query ? queryParser(query) : '';
  //   return this.httpClient.get<Array<BaseGetResponse<Timesheet>>>(`${this.baseUrl}/timesheets${queryParams}`);
  // }

  public login(data: FormData) {
    return this.httpClient.post<LoginData>(`${this.baseUrl}/login`, data);
  }
}
