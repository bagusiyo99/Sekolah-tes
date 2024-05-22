import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { UserStorageService } from 'src/app/basic/services/storage/user-storage.service';

const BASIC_URL = "http://localhost:8080/";

@Injectable({
  providedIn: 'root'
})


export class TeacherService {

    getAllArticles(): Observable<any> {
    return this.http.get(BASIC_URL + 'api/company/articles', {
      headers: this.createAuthorizationHeader()
    }).pipe(
      catchError(error => {
        return throwError(error);
      })
    );
  }

  constructor(private http: HttpClient) {}

  postTeacher(teacherDTO: any): Observable<any> {
    const userId = UserStorageService.getUserId();
    return this.http.post(BASIC_URL + `api/company/teacher/${userId}`, teacherDTO, {
      headers: this.createAuthorizationHeader()
    }).pipe(
      catchError(error => {
        return throwError(error);
      })
    );
  }

  



  getAllTeachersByUserId(): Observable<any> {
    const userId = UserStorageService.getUserId();
    return this.http.get(BASIC_URL + `api/company/teachers/${userId}`, {
      headers: this.createAuthorizationHeader()
    }).pipe(
      catchError(error => {
        return throwError(error);
      })
    );
    
  }


  getTeacherById(teacherId: any): Observable<any> {
    return this.http.get(BASIC_URL + `api/company/teacher/${teacherId}`, {
      headers: this.createAuthorizationHeader()
    })
  }

    updateTeacher(teacherId: any, teacherDTO:any): Observable<any> {
    return this.http.put(BASIC_URL + `api/company/teacher/${teacherId}`,teacherDTO, {
      headers: this.createAuthorizationHeader()
    })
  }

    deleteTeacher(teacherId: any): Observable<any> {
    return this.http.delete(BASIC_URL + `api/company/teacher/${teacherId}`, {
      headers: this.createAuthorizationHeader()
    })
  }


    updateTeacherById(teacherId: any, teacher: any) {
    throw new Error('Method not implemented.');
  }


 searchTeacherByService(title:any): Observable<any> {
    return this.http.get(BASIC_URL + `api/company/pencarian/${title}`, {
      headers: this.createAuthorizationHeader()
    }).pipe(
      catchError(error => {
        return throwError(error);
      })
    );
  }


    // Method untuk membuat header otorisasi
  createAuthorizationHeader(): HttpHeaders {
    let authHeaders: HttpHeaders = new HttpHeaders();
    return authHeaders.set(
      'Authorization',
      'Bearer ' + UserStorageService.getToken()
    );
  }
}
