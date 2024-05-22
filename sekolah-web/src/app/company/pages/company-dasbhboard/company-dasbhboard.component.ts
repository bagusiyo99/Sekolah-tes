import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { CompanyService } from '../../services/company.service';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-company-dasbhboard',
  templateUrl: './company-dasbhboard.component.html',
  styleUrls: ['./company-dasbhboard.component.scss']
})
export class CompanyDasbhboardComponent {
  bookings: any;
  ProductTerbanyak: string = '';
  totalPemesananDiApprove: number = 0;
  approvedBookingIds: string[] = [];

  constructor(
    private companyService: CompanyService,
    private notification: NzNotificationService,
    private router: Router
  ) {}

  ngOnInit() {
    this.getAllAdBookings();
  }

getAllAdBookings() {
  this.companyService.getAllAdBookings().subscribe(res => {

    this.totalPemesananDiApprove = 0;
    this.approvedBookingIds = [];

    const approvedFoodCounts = {};

    res.forEach(item => {
     

   
        this.totalPemesananDiApprove++;
        this.approvedBookingIds.push(item.id);

        // Tambahkan jumlah pesanan ke dalam objek approvedFoodCounts
        approvedFoodCounts[item.nameProduct] = (approvedFoodCounts[item.nameProduct] || 0) + item.amount;
      
    });

    // Temukan jenis kamar dengan pesanan terbanyak
    const mostOrderedApprovedFood = Object.keys(approvedFoodCounts).reduce((a, b) => approvedFoodCounts[a] > approvedFoodCounts[b] ? a : b);
    this.ProductTerbanyak = mostOrderedApprovedFood;

    this.bookings ;
  });
}


  generateLaporan() {

    this.totalPemesananDiApprove = 0;
    this.approvedBookingIds = [];

    this.getAllAdBookings();
  }

 
}
