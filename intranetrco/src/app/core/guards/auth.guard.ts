import { inject } from "@angular/core"
import { AuthService } from "../services/auth.service"
import { Router } from "@angular/router"

export function authGuard() {
    const authService = inject(AuthService)
    const router = inject(Router)
    if (authService.isLogged) {
        return true
    }
    router.navigateByUrl('/login')
    return false
}