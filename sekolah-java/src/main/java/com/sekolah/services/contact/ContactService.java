package com.sekolah.services.contact;

import com.sekolah.dto.ContactDTO;

import java.io.IOException;
import java.util.List;

public interface ContactService {
    boolean postContact (Long userId, ContactDTO contactDTO) throws IOException;

    List<ContactDTO> getAllContact(Long userId);

    ContactDTO getContactById(Long contactId);

    List<ContactDTO> searchContactByName(String name);
}
