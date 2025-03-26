import { HttpHandlerFn, HttpInterceptorFn, HttpRequest } from "@angular/common/http";
import { inject } from "@angular/core";
import { Router } from "@angular/router";
import { catchError, throwError } from "rxjs";

export const ErrorInterceptor: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn) => {

    const router = inject(Router);

    return next(req).pipe(
        catchError((error) => {
            router.navigate(['error']);

            return throwError(() => new Error(error.message));
        })
    );
}