import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class IndexerService {

  baseUrl = 'https://metadata.etherbloom.com:8443';
  //baseUrl = 'https://149.28.83.115:8443';
  routes: any = {
    'blooms': async () => { const j = await fetch(`${this.baseUrl}/q/blooms`); return await j.json() },
    'seeds': async () => { const j = await fetch(`${this.baseUrl}/q/seeds`); return await j.json() },
    'bloom': async (id:string) => { const j = await fetch(`${this.baseUrl}/q/blooms.${id}`); return await j.json() },
    'user': async (id:string)=> { const j = await fetch(`${this.baseUrl}/q/${id}`); return await j.json() },
  }
  constructor() { }

  seeds() { return this.fetch('seeds') }

  async fetch(route: string, param ?:string) {
    if (!this.routes[route]) {
      throw new Error(`no route for request: ${route}`);
    }
    return await this.routes[route](param);
  }

  async _fetch(route: string) {
    const ret = await fetch(this.baseUrl + route);
    return await ret.json();
  }

}
