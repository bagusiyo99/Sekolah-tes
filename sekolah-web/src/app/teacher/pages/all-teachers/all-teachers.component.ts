import { Component } from '@angular/core';
import { TeacherService } from '../../service/teacher.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';

@Component({
  selector: 'app-all-teachers',
  templateUrl: './all-teachers.component.html',
  styleUrls: ['./all-teachers.component.scss']
})
export class AllTeachersComponent {
    teachers: any;
     pagedTeachers: any[];
    currentTeachersPage: number = 1;  // Halaman guru saat ini
    teachersPerPage: number = 6;  // Jumlah guru per halaman
    totalTeachers: number; // Total guru
    totalTeachersPages: number; // Total halaman guru
  validateForm!: FormGroup;


  constructor(
    private teacherService: TeacherService,
     private router: Router,
     private notification :NzNotificationService,
         private fb: FormBuilder

  ) {}

  ngOnInit() {
     this.validateForm = this.fb.group({
      service: [null, [Validators.required]],
    });
    this.getAllTeachersByUserId();   
  }


getAllTeachersByUserId() {
  this.teacherService.getAllTeachersByUserId()
    .subscribe(
      (res) => {
        // Mengurutkan artikel berdasarkan createdAt secara descending
        this.teachers = res.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        
        // Mendapatkan jumlah artikel dan halaman
        this.totalTeachers = this.teachers.length;
        this.totalTeachersPages = Math.ceil(this.totalTeachers / this.teachersPerPage);
        
        // Memperbarui artikel pada halaman pertama
        this.updatePagedTeachers();
      },
      (error) => {
        console.error('Failed to load Teachers:', error);
      }
    );
}

  updateImg(img) {
    return 'data:image/jpeg;base64,' + img;
  }


  
  // Metode untuk mengarahkan pengguna ke halaman update  dengan ID yang sesuai
  updateTeacher(teacherId: any) {
    this.router.navigate(['/teacher/update', teacherId]); // Navigasi ke halaman update dengan ID 
  }

deleteTeacher(teacherId: any) {
  this.teacherService.deleteTeacher(teacherId).subscribe(
    res => { 
      this.notification.success(
        'SUCCESS',
        'Hapus Data Telah Berhasil', 
        { nzDuration: 5000 }
      );
      this.getAllTeachersByUserId();
    },
    error => {
      // Tangani kesalahan jika ada
      console.error('Failed to delete ad:', error);
      this.notification.error(
        'ERROR',
        'Gagal menghapus data',
        { nzDuration: 5000 }
      );
    }
  );
}

searchTeacherByService() {
    // Ambil nilai dari form control 'service' yang ingin dicari
    const searchTerm = this.validateForm.get('service').value;

    // Jika input pencarian kosong, tampilkan semua data iklan
    if (!searchTerm) {
        this.getAllTeachersByUserId();
        return;
    }

    // Lakukan permintaan ke server untuk mencari iklan berdasarkan searchTerm
    this.teacherService.searchTeacherByService (searchTerm).subscribe(
        res => {
            // Simpan hasil pencarian ke variabel ads
            this.teachers = res;

            // Jika hasil pencarian kosong, tampilkan notifikasi
            if (!this.teachers || this.teachers.length === 0) {
                this.notification.warning(
                    'Peringatan',
                    'Tidak ada data yang ditemukan untuk pencarian Anda',
                    { nzDuration: 5000 }
                );
            }

            // Perbarui halaman iklan yang ditampilkan
            this.updatePagedTeachers();
        },
        error => {
            // Tangani kesalahan jika ada
            console.error('Failed to search Teachers:', error);
            this.notification.error(
                'ERROR',
                'Gagal mencari data',
                { nzDuration: 5000 }
            );
        }
    );
}


   // Fungsi untuk mengambil guru untuk halaman saat ini
    updatePagedTeachers() {
        const start = (this.currentTeachersPage - 1) * this.teachersPerPage;
        const end = start + this.teachersPerPage;
        this.pagedTeachers = this.teachers.slice(start, end);
    }


       // Fungsi untuk mengatur halaman guru
    goToTeachersPage(page: number) {
        this.currentTeachersPage = page;
        this.updatePagedTeachers();
    }


limitDescription(description: string, limit: number): string {
    if (description.length > limit) {
        return description.substring(0, limit) + '...'; // Menambahkan elipsis untuk menandakan bahwa deskripsi telah dipotong
    } else {
        return description;
    }
}


}
