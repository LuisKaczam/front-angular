import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';


  
export const authGuardProfissional: CanActivateFn = (route, state) => {
const token = localStorage.getItem("token");
const role = localStorage.getItem("role");
const router = inject(Router)
if(token != null && role == 'PROFISSIONAL'){
  console.log(token);
  console.log(role);
  return true;
}else{
  router.navigate(['/login-profissional']);
  return false;
}
};
