package com.sekolah.repository;


import com.sekolah.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository <User, Long> {
    User findFirstByEmail ( String email);
}
