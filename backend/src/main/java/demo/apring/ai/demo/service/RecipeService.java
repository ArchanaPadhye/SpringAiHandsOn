package demo.apring.ai.demo.service;

import org.springframework.ai.chat.model.ChatModel;
import org.springframework.ai.chat.model.ChatResponse;
import org.springframework.ai.chat.prompt.Prompt;
import org.springframework.ai.chat.prompt.PromptTemplate;
import org.springframework.ai.openai.OpenAiChatOptions;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class RecipeService {
    private final ChatModel chatModel;
    public RecipeService(ChatModel chatModel) {
        this.chatModel = chatModel;
    }

    public String getResponse(String prompt){
        return chatModel.call(prompt);
    }

    public String createRecipe(String ingredients, String cuisine, String dietaryRestrictions){
        var template = """
                I want to create a recipe using following ingredients: {ingredients}.
                The cuisine type i prefer {cuisine}.
                Please consider following dietary restrictions: {dietaryRestrictions}.
                Please provide me with a detailed recipe including title, list of ingredients and cooking insrtuctions.
                """;

        PromptTemplate promptTemplate = new PromptTemplate(template);
        Map<String, Object> params = Map.of("ingredients", ingredients,
                "cuisine", cuisine, "dietaryRestrictions", dietaryRestrictions);
        Prompt prompt = promptTemplate.create(params);
        ChatResponse response =  chatModel.call( prompt);
        return response.getResult().getOutput().getText();
    }



}
