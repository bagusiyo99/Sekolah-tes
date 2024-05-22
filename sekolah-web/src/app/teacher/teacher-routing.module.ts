import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TeacherComponent } from './teacher.component';
import { CreateTeachersComponent } from './pages/create-teachers/create-teachers.component';
import { AllTeachersComponent } from './pages/all-teachers/all-teachers.component';
import { UpdateTeachersComponent } from './pages/update-teachers/update-teachers.component';

const routes: Routes = [
  { path: '', component: TeacherComponent },
      { path: 'teacher', component: CreateTeachersComponent },
  { path: 'teachers', component: AllTeachersComponent },
  { path: 'update/:id', component: UpdateTeachersComponent },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TeacherRoutingModule { }
