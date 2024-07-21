import { inject } from "@angular/core"
import { AuthService } from "../services/auth.service"
import { CanActivateFn, Router } from "@angular/router"
import { map, tap } from "rxjs";


export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.UserInfoGuard$.pipe(
    tap((userInfo) => {
      console.log('authGuard', userInfo)
      if (userInfo?.isConnected === false) {
        router.navigateByUrl('/login'); // Rediriger si non connecté
      }
    }),
    map(userInfo => userInfo?.isConnected === true) // Renvoyer la valeur booléenne finale
  );
};