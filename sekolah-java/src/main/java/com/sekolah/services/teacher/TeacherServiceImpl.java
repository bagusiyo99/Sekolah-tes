package com.sekolah.services.teacher;


import com.sekolah.dto.TeacherDto;
import com.sekolah.entity.Article;
import com.sekolah.entity.Teacher;
import com.sekolah.entity.User;
import com.sekolah.enums.UserRole;
import com.sekolah.repository.TeacherRepository;
import com.sekolah.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class TeacherServiceImpl implements TeacherService {

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private TeacherRepository teacherRepository;

    @Override
    public boolean postTeacher(Long userId, TeacherDto teacherDTO) throws IOException {
        // Validasi peran pengguna
        Optional<User> optionalUser = userRepository.findById(userId);
        if (optionalUser.isPresent()) {
            User user = optionalUser.get();
            if (user.getRole() == UserRole.COMPANY) { // Pastikan pengguna memiliki peran COMPANY
                Teacher teacher = new Teacher();
                teacher.setTitle(teacherDTO.getTitle());
                teacher.setDescription(teacherDTO.getDescription());
                teacher.setImg(teacherDTO.getImg().getBytes());
                teacher.setUser(user);
                teacher.setCreatedAt(new Date());
                teacherRepository.save(teacher);
                return true;
            }
        }
        return false; // Mengembalikan false jika pengguna tidak memiliki peran COMPANY
    }

    @Override
    public List<TeacherDto> getAllTeachers(Long userId) {
        return teacherRepository.findByUserId(userId)
                .stream()
                .map(Teacher::getTeacherDto)
                .collect(Collectors.toList());
    }

    public TeacherDto getTeacherById(Long teacherId) {
        Optional<Teacher> optionalTeacher = teacherRepository.findById(teacherId);
        if (optionalTeacher.isPresent()) {
            return optionalTeacher.get().getTeacherDto();
        }
        return null;
    }

    @Override
    public boolean updateTeacher(Long teacherId, TeacherDto teacherDTO) throws IOException {
        Optional<Teacher> optionalTeacher = teacherRepository.findById(teacherId);
        if (optionalTeacher.isPresent()) {
            Teacher teacher = optionalTeacher.get();
            teacher.setTitle(teacherDTO.getTitle());
            teacher.setDescription(teacherDTO.getDescription());
            teacher.setCreatedAt(new Date());

            if (teacherDTO.getImg() != null) {
                teacher.setImg(teacherDTO.getImg().getBytes());
            }

            teacherRepository.save(teacher);
            return true;
        }
        return false;
    }

    @Override
    public boolean deleteTeacher(Long teacherId) {
        Optional<Teacher> optionalTeacher = teacherRepository.findById(teacherId);
        if (optionalTeacher.isPresent()) {
            teacherRepository.delete(optionalTeacher.get());
            return true;
        }
        return false;
    }

    // Metode untuk mencari iklan berdasarkan nama
    public List<TeacherDto> searchTeacherByTitle(String title) {
        // Menggunakan stream untuk memetakan setiap Ad menjadi AdDTO berdasarkan nama yang diberikan
        return teacherRepository.findAllByTitleContaining(title).stream().map(Teacher::getTeacherDto).collect(Collectors.toList());
    }
}
