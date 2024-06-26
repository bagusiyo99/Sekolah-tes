package com.sekolah.services.contact;

import com.sekolah.dto.ContactDTO;
import com.sekolah.entity.Contact;
import com.sekolah.entity.User;
import com.sekolah.enums.UserRole;
import com.sekolah.repository.ContactRepository;
import com.sekolah.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ContactServiceImpl implements ContactService {


    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ContactRepository contactRepository;

    @Override
    public boolean postContact (Long userId, ContactDTO contactDTO) throws IOException {
        // Validasi peran pengguna
        Optional<User> optionalUser = userRepository.findById(userId);
        if (optionalUser.isPresent()) {
            User user = optionalUser.get();
            if (user.getRole() == UserRole.CLIENT) {
                Contact contact = new Contact();
                contact.setPhone(contactDTO.getPhone());
                contact.setAddress(contactDTO.getAddress());
                contact.setDescription(contactDTO.getDescription());
                contact.setCreatedAt(new Date());
                contact.setUser(user);
                contact.setCreatedAt(new Date());
                contactRepository.save(contact);
                return true;

            }
        }
        return false; // Mengembalikan false jika pengguna tidak memiliki peran COMPANY
    }



    @Override
    public List<ContactDTO> getAllContact(Long userId) {
        return contactRepository.findByUserId(userId)
                .stream()
                .map(Contact::getContactDto)
                .collect(Collectors.toList());
    }

    @Override
    public ContactDTO getContactById(Long contactId) {
        Optional<Contact> optionalContact = contactRepository.findById(contactId);
        if (optionalContact.isPresent()) {
            return optionalContact.get().getContactDto();
        }
        return null;
    }


    public List<ContactDTO> searchContactByName(String address) {
        return contactRepository.findAllByAddressContaining(address).stream().map(Contact::getContactDto).collect(Collectors.toList());
    }


}
