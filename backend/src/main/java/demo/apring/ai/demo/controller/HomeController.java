package demo.apring.ai.demo.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class HomeController {

    @GetMapping("/")
    public ResponseEntity<String> home() {

        return ResponseEntity.ok().body("Application is running successfully!");
    }
}
