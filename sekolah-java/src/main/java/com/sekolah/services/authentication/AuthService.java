// Paket
package com.sekolah.services.authentication;

import com.sekolah.dto.SignupRequestDTO;
import com.sekolah.dto.UserDto;

// Deklarasi antarmuka AuthService
public interface AuthService {

    // Metode untuk mendaftar pengguna baru sebagai client
    UserDto signupClient(SignupRequestDTO signupRequestDTO);

    // Metode untuk memeriksa apakah pengguna sudah ada berdasarkan email
    Boolean presentByEmail(String email);

    // Metode untuk mendaftar pengguna baru sebagai company
    UserDto signupCompany(SignupRequestDTO signupRequestDTO);
}
