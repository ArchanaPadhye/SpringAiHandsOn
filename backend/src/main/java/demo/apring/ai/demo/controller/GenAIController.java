package demo.apring.ai.demo.controller;

import demo.apring.ai.demo.service.ChatService;
import demo.apring.ai.demo.service.ImageService;
import demo.apring.ai.demo.service.RecipeService;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.ai.image.Image;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.Base64;
import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/")
public class GenAIController {

    private static Logger log = LoggerFactory.getLogger(GenAIController.class);

    private ChatService chatService;
    private final ImageService imageService;
    private RecipeService recipeService;

    public GenAIController(ChatService chatService, ImageService imageService, RecipeService recipeService){
        this.chatService = chatService;
        this.imageService = imageService;
        this.recipeService = recipeService;
    }

    @GetMapping ("/ask-ai")
    public ResponseEntity<String> getResponse(@RequestParam String prompt){
        return ResponseEntity.ok().body(chatService.getResponse(prompt));
    }

    @GetMapping ("ask-ai-options")
    public ResponseEntity<String> getChatResponse(@RequestParam String prompt){
        return ResponseEntity.ok().body(chatService.getChatResponse(prompt));
    }

    @GetMapping("/generate-image")
    public ResponseEntity<byte[]> getImage(HttpServletResponse response, @RequestParam String prompt) throws IOException {
        log.info("Image requested for prompt [{}] = {}", prompt);
        Image image = imageService.generateImage(prompt).getResult().getOutput();
        log.info("Image received url {}", image.getUrl());

        //if( image.getUrl() == null){


            response.setContentType(MediaType.IMAGE_JPEG_VALUE);
            byte[] decodeBase64 = Base64.getDecoder().decode(image.getB64Json());
            log.info("Returning image");
            return ResponseEntity.ok().body(decodeBase64);
        /*} else {
            return ResponseEntity.ok().body( image.getUrl());
        }*/
        // redirect to the url
        /*log.info("redirect url for [{}] = {}",  prompt,url);
         response.sendRedirect(url);*/
    }

    @GetMapping("/recipe-creator")
    public ResponseEntity<String> getImage(@RequestParam String ingrediaents,
                                                 @RequestParam (defaultValue="any") String cuisine,
                                                    @RequestParam (defaultValue="") String restrictions) throws IOException {
        return ResponseEntity.ok().body(recipeService.createRecipe(  ingrediaents, cuisine, restrictions));
    }
}
