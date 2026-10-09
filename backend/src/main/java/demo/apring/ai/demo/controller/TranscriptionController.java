package demo.apring.ai.demo.controller;

import com.openai.models.audio.AudioResponseFormat;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.ai.audio.transcription.AudioTranscriptionPrompt;
import org.springframework.ai.audio.transcription.AudioTranscriptionResponse;
import org.springframework.ai.image.Image;
import org.springframework.ai.openai.OpenAiAudioTranscriptionModel;
import org.springframework.ai.openai.OpenAiAudioTranscriptionOptions;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.FileSystemResource;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.Base64;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
public class TranscriptionController {


    private static Logger log = LoggerFactory.getLogger(TranscriptionController.class);

    OpenAiAudioTranscriptionModel transcriptionModel;
    OpenAiAudioTranscriptionOptions transcriptionOptions;


    public TranscriptionController(@Value("${spring.ai.openai.api-key}")  String API_KEY){

        transcriptionOptions
                = OpenAiAudioTranscriptionOptions.builder()
                .apiKey(API_KEY)
                .responseFormat(AudioResponseFormat.TEXT)
                .language("en")
                .temperature(0f)
                .build();

        transcriptionModel = OpenAiAudioTranscriptionModel.builder()
                .options(transcriptionOptions)
                .build();


    }

    @PostMapping ("/transcribe-audio")
    public ResponseEntity<String> transcribe(@RequestParam("file") MultipartFile file) throws IOException{

        File tempfile = File.createTempFile("audio", ".wav");
        file.transferTo(tempfile);

        FileSystemResource audioFile = new FileSystemResource(tempfile);
        AudioTranscriptionPrompt transcriptionRequest = new AudioTranscriptionPrompt(audioFile, transcriptionOptions);
        AudioTranscriptionResponse response = transcriptionModel.call(transcriptionRequest);
        tempfile.delete();
        return new ResponseEntity<>(response.getResult().getOutput(), HttpStatus.OK);
    }


}
