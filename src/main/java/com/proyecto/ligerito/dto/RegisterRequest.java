package com.proyecto.ligerito.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public class RegisterRequest {

    @NotBlank(message = "El nick no puede estar vacío")
    private String nick;
    @NotBlank(message = "El email no peude estar vacío")
    @Email(message = "El email no tiene un formato válido")
    private String email;
    @NotBlank(message = "La contraseña no puede estar vacía")
    private String password;

    public RegisterRequest() {
    }

    public RegisterRequest(String nick, String email, String password) {
        this.nick = nick;
        this.email = email;
        this.password = password;
    }

    public String getNick() {
        return nick;
    }

    public void setNick(String nick) {
        this.nick = nick;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    

}
