import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseGetResponse, QueryParams } from 'types/api';
import { queryParser } from 'utils/queryParser';

export interface Timesheet {
  startTime: number;
  endTime: number;
  description?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = process.env['API_URL'] ?? '';

  constructor(private httpClient: HttpClient) { }

  public getTimesheets(query?: QueryParams) {
    const queryParams = query ? queryParser(query) : '';
    return this.httpClient.get<Array<BaseGetResponse<Timesheet>>>(`${this.baseUrl}/timesheets${queryParams}`);
  }
}
