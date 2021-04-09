import { Platform } from '@ionic/angular';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Storage } from '@ionic/storage';

const TOKEN_KEY = 'auth_token';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  authenticationState = new BehaviorSubject(false);
  
  constructor(
    private storage: Storage,
    private plt: Platform,
  ) {
    this.plt.ready().then(async() => {
      this.checkToken();
    })
  }

  /**
   * Realiza o login no sistema
   * @author Iago Nuvem
   * @since 10/2019
   */
  login(userData){
    return this.storage.set("userData", userData).then(res => {
      this.authenticationState.next(true);
    });
  }

  /**
   * Realiza o logout do sistema
   * @author Iago Nuvem
   * @since 10/2019
   */
  logout(){
    return this.storage.remove("userData").then(res => {
        this.authenticationState.next(false);
    });
  }

  /**
   * Verifica se usuário está logado
   * @author Iago Nuvem
   * @since 10/2019
   * @returns boolean
   */
  isAuthenticated(){
    return this.authenticationState.value;
  }

  /**
   * Verifica a validade do Token
   * @author Iago Nuvem
   * @since 10/2019
   * @returns boolean
   */
  checkToken(){
    return this.storage.get("userData").then(res => {
      if(res){
        this.authenticationState.next(true);
      } 
    });
  }
}
