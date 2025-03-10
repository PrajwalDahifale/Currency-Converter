  package com.CurrencyConverter.Controller;



import com.CurrencyConverter.Service.CurrencyRateService;


import com.CurrencyConverter.model.CurrencyRate;

import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;

@Controller
@RequestMapping("/api")
public class CurrencyRateController {
 
	@Autowired 
    private final CurrencyRateService service;
	private RestTemplate restTemplate;
	private static final String API_KEY = "921541f60ee967921f203e2d1a43407a";
     
    public CurrencyRateController(CurrencyRateService service, RestTemplate restTemplate) {
        this.service = service;
        this.restTemplate = restTemplate;
    }

    @GetMapping("/index")
    public String home() {
        return "index";
    }
    
  
    
    @GetMapping("/convert1")
    public String convert1() {
    	
    	return "convert";
    }

 // for fatching rate 
    @GetMapping("/getExchangeRate")
    public ResponseEntity<Map<String, Object>> convertCurrencyUI(
            @RequestParam String base, 
            @RequestParam String target) {

        // Example: Call your service or calculate the conversion rate.
        double rate = service.getExchangeRate(base, target);

        // Prepare a response map with the conversion data
        Map<String, Object> response = new HashMap<>();
        response.put("base", base);
        response.put("target", target);
        response.put("rate", rate);

        // Return the response as JSON with status OK (200)
        return ResponseEntity.ok(response);
    }
    //fetch all currencies
    @GetMapping("/showCurrencies")
    public String showAllCurrencies(Model model) {
        Map<String, Double> rates = service.getAllCurrencies();
        model.addAttribute("currencies", rates);
        return "AllCurrencies"; // Thymeleaf template
    }
    
    //loading the currency in js file for historical data 
    @GetMapping("/show")
    public ResponseEntity<Map<String, String>> getCurrencies() {
        String url = "http://data.fixer.io/api/symbols?access_key="+API_KEY;

        // Fetching the response from the Fixer API
        Map<String, Object> response = restTemplate.getForObject(url, Map.class);

        // Extracting the 'symbols' map from the response
        Map<String, String> symbols = (Map<String, String>) response.get("symbols");

        // Returning only the 'symbols' map to the client
        return ResponseEntity.ok(symbols);
    }
    
    @GetMapping("/historicalHtml")
    public String HistoricalData() {
    	return"historicalData";
    }
    

    
    @GetMapping("/historical")
    public ResponseEntity<List<CurrencyRate>> getHistoricalData(
            @RequestParam String base,
            @RequestParam String target,
            @RequestParam String startDate,
            @RequestParam String endDate) {
        List<CurrencyRate> rates = service.getHistoricalData(base, target, startDate, endDate);
        return ResponseEntity.ok(rates);
    }

    

    
    }