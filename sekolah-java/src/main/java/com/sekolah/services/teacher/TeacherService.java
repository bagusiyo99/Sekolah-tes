package com.sekolah.services.teacher;

import com.sekolah.dto.ArticleDTO;
import com.sekolah.dto.TeacherDto;

import java.io.IOException;
import java.util.List;

public interface TeacherService {
    boolean postTeacher(Long userId, TeacherDto teacherDTO) throws IOException;
    List<TeacherDto> getAllTeachers(Long userId);

     TeacherDto getTeacherById(Long teacherId);


     boolean updateTeacher(Long teacherId, TeacherDto teacherDTO) throws IOException;

    boolean deleteTeacher(Long teacherId);
    List<TeacherDto> searchTeacherByTitle(String title);

}
