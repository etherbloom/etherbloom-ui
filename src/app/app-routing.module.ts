import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { RegistryComponent } from './pages/registry/registry.component';
import { HoldersComponent } from './pages/holders/holders.component';
import { BloomPageComponent } from './pages/bloom-page/bloom-page.component';
const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'registry', component: RegistryComponent },
  { path: 'holders', component: HoldersComponent },
  { path: 'bloom/:id', component: BloomPageComponent },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
