import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { UserStorageService } from 'src/app/basic/services/storage/user-storage.service';

const BASIC_URL = "http://localhost:8080/";


@Injectable({
  providedIn: 'root'
})
export class ClientService {

  constructor(private http: HttpClient) { }

  
  getAllAds(): Observable<any> {
    return this.http.get(BASIC_URL + `api/client/ads`, {
      headers: this.createAuthorizationHeader()
    }).pipe(
      catchError(error => {
        return throwError(error);
      })
    );
    
  }

  

   getAllArticles(): Observable<any> {
    return this.http.get(BASIC_URL + `api/client/articles`, {
      headers: this.createAuthorizationHeader()
    }).pipe(
      catchError(error => {
        return throwError(error);
      })
    );
    
  }

  getAllTeachers(): Observable<any> {
    return this.http.get(BASIC_URL + `api/client/teachers`, {
      headers: this.createAuthorizationHeader()
    }).pipe(
      catchError(error => {
        return throwError(error);
      })
    );
    
  }


  getUserNameById(): Observable<any> {
          const userId = UserStorageService.getUserId();
    return this.http.get(BASIC_URL + `api/client/user/${userId}/name`, {
      headers: this.createAuthorizationHeader()
    }).pipe(
      catchError(error => {
        return throwError(error);
      })
    );
    
  }


    searchAdByName(name: any): Observable<any> {
    return this.http.get(BASIC_URL + `api/client/search/${name}`, {
      headers: this.createAuthorizationHeader()
    }).pipe(
      catchError(error => {
        return throwError(error);
      })
    );
    
  }

    filterAdsByFood(kindFood: string): Observable<any> {
    // You need to implement the logic for filtering ads by food
    // You can use a similar approach as getAllAds but with additional parameters
    // Here, I'm just returning an empty observable as a placeholder
    return new Observable<any>();
  }

     getAdDetailsByAdId(adId:any): Observable<any> {
    return this.http.get(BASIC_URL + `api/client/ad/${adId}`, {
      headers: this.createAuthorizationHeader()
    })
    
  }

      OrderProduct(bookDTO:any): Observable<any> {
    return this.http.post(BASIC_URL + `api/client/book-service`, bookDTO, {
      headers: this.createAuthorizationHeader()
    })
    
  }

    deleteBooking(bookingId: any): Observable<any> {
    return this.http.delete(BASIC_URL + `api/client/booking/${bookingId}`, {
      headers: this.createAuthorizationHeader()
    })
  }
 
    postContact(contactDTO: any): Observable<any> {
    const userId = UserStorageService.getUserId();
    return this.http.post(BASIC_URL + `api/client/contact/${userId}`, contactDTO, {
      headers: this.createAuthorizationHeader()
    }).pipe(
      catchError(error => {
        return throwError(error);
      })
    );
  }

     getMyBookings(): Observable<any> {
      const userId = UserStorageService.getUserId();
    return this.http.get(BASIC_URL + `api/client/my-bookings/${userId}`, {
      headers: this.createAuthorizationHeader()
    })
    
  }
  
  createAuthorizationHeader(): HttpHeaders {
    let authHeaders: HttpHeaders = new HttpHeaders();
    return authHeaders.set(
      'Authorization',
      'Bearer ' + UserStorageService.getToken()
    );
  }
  
}
