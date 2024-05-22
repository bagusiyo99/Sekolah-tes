import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CompanyComponent } from './company.component';
import { CompanyDasbhboardComponent } from './pages/company-dasbhboard/company-dasbhboard.component';
import { CreateAdComponent } from './pages/create-ad/create-ad.component';
import { AllAdsComponent } from './pages/all-ads/all-ads.component';
import { UpdateAdComponent } from './pages/update-ad/update-ad.component';
import { PesananComponent } from './pages/pesanan/pesanan.component';
import { ContactsComponent } from './pages/contacts/contacts.component';
import { TransaksiComponent } from './pages/transaksi/transaksi.component';


const routes: Routes = [
  { path: '', component: CompanyComponent },
  { path: 'dashboard', component: CompanyDasbhboardComponent },
  { path: 'tambahProduk', component: CreateAdComponent },
  { path: 'postingan', component: AllAdsComponent },
  { path: 'update/:id', component: UpdateAdComponent },
  { path: 'boking', component: PesananComponent },
  { path: 'contacts', component: ContactsComponent },
  { path: 'transaksi', component: TransaksiComponent },



];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CompanyRoutingModule { }
