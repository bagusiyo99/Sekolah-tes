package com.sekolah.dto;

import com.sekolah.enums.UserRole;
import lombok.Data;


@Data
public class SignupRequestDTO {

    private Long id;

    private String name;

    private String email;

    private String password;

    private String lastname;

    private String phone ;

    private UserRole role;
}
