import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TeacherRoutingModule } from './teacher-routing.module';
import { TeacherComponent } from './teacher.component';
import { AllTeachersComponent } from './pages/all-teachers/all-teachers.component';
import { CreateTeachersComponent } from './pages/create-teachers/create-teachers.component';
import { UpdateTeachersComponent } from './pages/update-teachers/update-teachers.component';
import { ReactiveFormsModule } from '@angular/forms';
import { DemoNgZorroAntdModule } from '../DemoNgZorroAntdModule';


@NgModule({
  declarations: [
    TeacherComponent,
    AllTeachersComponent,
    CreateTeachersComponent,
    UpdateTeachersComponent
  ],
  imports: [
    CommonModule,
    TeacherRoutingModule,
       DemoNgZorroAntdModule,
    ReactiveFormsModule
  ]
})
export class TeacherModule { }
