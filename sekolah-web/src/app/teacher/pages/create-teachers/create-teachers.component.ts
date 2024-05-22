import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TeacherService } from '../../service/teacher.service';
import { Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';

@Component({
  selector: 'app-create-teachers',
  templateUrl: './create-teachers.component.html',
  styleUrls: ['./create-teachers.component.scss']
})
export class CreateTeachersComponent {
validateForm!:FormGroup;
 isPosting: boolean = false; // Menyimpan status posting/ agar tidak double klik

  selectedFile: File | null;
  imagePreview: string | ArrayBuffer | null;

    
  constructor (
    private teacherService: TeacherService,
     private fb :FormBuilder,
     private notification :NzNotificationService,
     private router: Router
     ){}


  ngOnInit() {
    this.validateForm = this.fb.group({
      title: [null, [Validators.required]],
      description: [null, [Validators.required]],
    });
  }

  onFileSelected(event:any) {
    this.selectedFile = event.target.files[0];
    this.previewImage();
  }

  previewImage(){
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result;
    }
    reader.readAsDataURL(this.selectedFile);
  }

postTeacher(){
  if (!this.isPosting) {
    this.isPosting = true; // Mengatur status posting menjadi true

    const formData: FormData = new FormData();
    formData.append('img', this.selectedFile);
    formData.append('title', this.validateForm.get('title').value);
    formData.append('description', this.validateForm.get('description').value);

    this.teacherService.postTeacher(formData).subscribe(
      res => {
        this.notification.success(
          'SUCCESS',
          'Tambahkan Data Berhasil',
          { nzDuration: 5000 }
        );
        this.router.navigateByUrl('/teacher/teachers');
      },
      error => {
        this.notification.error(
          'ERROR',
          error?.error?.message || 'Terjadi kesalahan',
          { nzDuration: 5000 }
        );
      }
    ).add(() => {
      this.isPosting = false; // Setelah selesai, kembalikan status posting ke false
    });
  }
}
}
