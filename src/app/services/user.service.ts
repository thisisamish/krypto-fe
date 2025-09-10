import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface UserProfile {
  username: string;   // immutable in this example
  firstName: string;
  middleName?: string;
  lastName?: string;
  email: string;
  address: string;
  contactNo: string;
}

@Injectable({ providedIn: 'root' })
export class UserService {
  private meUrl = 'http://localhost:8080/api/v1/users/me';

  constructor(private http: HttpClient) {}

  getMe(): Observable<UserProfile> {
    return this.http.get<UserProfile>(this.meUrl, { withCredentials: true });
    // backend: GET /api/v1/users/me -> 200 with UserProfile
  }

  updateMe(payload: Omit<UserProfile, 'username'>): Observable<UserProfile> {
    return this.http.put<UserProfile>(this.meUrl, payload, { withCredentials: true });
    // backend: PUT /api/v1/users/me -> 200 with updated UserProfile
  }
}
