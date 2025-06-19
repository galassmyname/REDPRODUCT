import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class HotelService {
  private apiUrl = 'https://redproduct.onrender.com/api/hotels';

  constructor(private http: HttpClient) { }

  getHotels(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  getHotel(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

// hotel.service.ts
// hotel.service.ts
createHotel(formData: FormData): Observable<any> {
  return this.http.post(this.apiUrl, formData, {
    reportProgress: true,
    responseType: 'json' // Spécifiez explicitement le type de réponse
  }).pipe(
    catchError(error => {
      console.error('Erreur création hôtel:', error);
      return throwError(() => error);
    })
  );
}
  updateHotel(id: string, hotel: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, hotel);
  }

  deleteHotel(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}