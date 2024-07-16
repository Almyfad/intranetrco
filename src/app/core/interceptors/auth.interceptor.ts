import { HttpEvent, HttpHandlerFn, HttpHeaders, HttpRequest } from "@angular/common/http";
import { inject } from "@angular/core";
import { Observable, tap } from "rxjs";
import { AuthService } from "../services/auth.service";

export function authInterceptor(req: HttpRequest<any>, next: HttpHandlerFn): Observable<HttpEvent<any>> {
    return next(req);
/*
    if (!token) {
        return next(req)
    }

    const headers = new HttpHeaders({
        Authorization: token
    })

    const newReq = req.clone({
        headers: headers
    })

    return next(newReq)*/
}