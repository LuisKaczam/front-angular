import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';


  
export const authGuardGestante: CanActivateFn = (route, state) => {
const token = localStorage.getItem("token");
const role = localStorage.getItem("role");
const router = inject(Router)
if(token != null && role == 'GESTANTE'){
  console.log(token);
  console.log(role);
  return true;
}else{
  router.navigate(['/login-gestante']);
  return false;
}
};
