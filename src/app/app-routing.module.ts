import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SubscriberComponent } from './subscriber/subscriber.component';
import { LoginComponent } from './login/login.component';
import { PublisherComponent } from './publisher/publisher.component';
import { AdministratorComponent } from './administrator/administrator.component';

const routes: Routes = [
  { path: '',   redirectTo: '/login', pathMatch: 'full' }, // redirect to 
  { path: 'administrator', component: AdministratorComponent },
  { path: 'publisher', component: PublisherComponent },
  { path: 'subscriber', component: SubscriberComponent },
  { path: 'login', component: LoginComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
