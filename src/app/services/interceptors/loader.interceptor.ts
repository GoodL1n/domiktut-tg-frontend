import { HttpRequest, HttpHandlerFn, HttpInterceptorFn } from '@angular/common/http';
import { inject } from "@angular/core";
import { finalize } from "rxjs";
import { LoaderService } from "../loader.service";

export const LoaderInterceptor: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn) => {

  const loaderService = inject(LoaderService);

  loaderService.setIsLoading(true);
  console.log('загрузка начата');

  return next(req).pipe(
    finalize(() => {
      console.log('загрузка закончена');
      loaderService.setIsLoading(false);
    })
  )
}
