import { inject } from "@angular/core"
import { AuthService } from "../services/auth.service"
import { CanActivateFn, Router } from "@angular/router"
import { map, tap } from "rxjs";


export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.isLogged$.pipe(
    tap((isLogged) => {
      if (!isLogged) {
        router.navigateByUrl('/login'); // Rediriger si non connecté
      }
    }),
    map(isLogged => isLogged) // Renvoyer la valeur booléenne finale
  );
};