package com.example.demo.controller;

import java.util.regex.Pattern;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
public class RedirectController {

    private static final String URL_REGEX = "^(http|https)://.*";

    @GetMapping("/api/redirect")
    public String redirectToUrl(@RequestParam("url") String url) {
        if (!Pattern.matches(URL_REGEX, url)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid URL format");
        }
        return "redirect:" + url;
    }
}
