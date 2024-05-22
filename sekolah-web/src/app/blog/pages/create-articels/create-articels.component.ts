import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { BlogService } from '../../service/blog.service';

@Component({
  selector: 'app-create-articels',
  templateUrl: './create-articels.component.html',
  styleUrls: ['./create-articels.component.scss']
})
export class CreateArticelsComponent {
 validateForm!:FormGroup;
 isPosting: boolean = false; // Menyimpan status posting/ agar tidak double klik

  selectedFile: File | null;
  imagePreview: string | ArrayBuffer | null;

    
  constructor (
    private blogService: BlogService,
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

postArticle(){
  if (!this.isPosting) {
    this.isPosting = true; // Mengatur status posting menjadi true

    const formData: FormData = new FormData();
    formData.append('img', this.selectedFile);
    formData.append('title', this.validateForm.get('title').value);
    formData.append('description', this.validateForm.get('description').value);

    this.blogService.postArticle(formData).subscribe(
      res => {
        this.notification.success(
          'SUCCESS',
          'Tambahkan Data Berhasil',
          { nzDuration: 5000 }
        );
        this.router.navigateByUrl('/blog/articles');
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