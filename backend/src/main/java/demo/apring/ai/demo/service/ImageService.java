package demo.apring.ai.demo.service;

import org.springframework.ai.image.ImageOptions;
import org.springframework.ai.image.ImagePrompt;
import org.springframework.ai.image.ImageResponse;
import org.springframework.ai.openai.OpenAiImageModel;
import org.springframework.ai.openai.OpenAiImageOptions;
import org.springframework.stereotype.Service;

@Service
public class ImageService {

    private OpenAiImageModel imageModel;

    public ImageService(OpenAiImageModel imageModel){
        this.imageModel = imageModel;
    }

    public ImageResponse generateImage(String prompt){
        ImageResponse imageResponse = imageModel.call(new ImagePrompt(prompt));
        // new imangePrompt can have many other parameters which can be input from user
        // like quality, # of images, ht-wth of image etc
        imageModel.call(new ImagePrompt(prompt,
                OpenAiImageOptions.builder()
                        .n(2) // user input
                        .width(1024) // user input
                        .height(1024) // user input
                        .quality("high")// user input
                .build()
        ));
        return imageResponse;
    }
}
