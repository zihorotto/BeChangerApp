import { Injectable } from '@angular/core';
import { ApiConfiguration } from '../api-configuration';
import { HttpClient, HttpParams} from '@angular/common/http';
import { Observable } from 'rxjs';
import { FeedbackRequest } from '../models/feedback-request';
import { PageResponseFeedbackResponse } from '../models/page-response-feedback-response';

export interface FindAllFeedbackByProduct$Params {
  'product-id': number;
  page?: number;
}

@Injectable({
  providedIn: 'root'
})
export class FeedbackService {

  constructor(
    protected config: ApiConfiguration,
    protected http: HttpClient
  ) {
    this.rootUrl = config.rootUrl;
  }

  rootUrl:string;

  saveFeedback(params: FeedbackRequest): Observable<number> {
    return this.http.post<number>(`${this.rootUrl}/feedbacks`, params);
  }

  findAllFeedbackByProduct(params: FindAllFeedbackByProduct$Params): Observable<PageResponseFeedbackResponse> {
    let httpParams = new HttpParams();
    
    if (params.page !== undefined) {
      httpParams = httpParams.set('page', params.page.toString());
    }
  
    return this.http.get<PageResponseFeedbackResponse>(`${this.rootUrl}/feedbacks/product/${params['product-id']}`, { params: httpParams });
  }
}
