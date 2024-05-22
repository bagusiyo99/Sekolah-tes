package com.sekolah.repository;

import com.sekolah.entity.Contact;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ContactRepository extends JpaRepository <Contact, Long> {
    List<Contact> findByUserId(Long userId);
    List<Contact> findAllByAddressContaining(String address);

}
