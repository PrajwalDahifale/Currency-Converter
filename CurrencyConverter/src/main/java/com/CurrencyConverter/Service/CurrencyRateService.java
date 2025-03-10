package com.CurrencyConverter.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.CurrencyConverter.Repository.CurrencyRateRepository;
import com.CurrencyConverter.model.CurrencyRate;

@Service
public class CurrencyRateService {
    private final CurrencyRateRepository repository;
    private final RestTemplate restTemplate;

    private static final String API_KEY = "921541f60ee967921f203e2d1a43407a";
    private static final String API_URL = "https://data.fixer.io/api/latest?access_key=" + API_KEY;

    @Autowired
    public CurrencyRateService(CurrencyRateRepository repository, RestTemplate restTemplate) {
        this.repository = repository;
        this.restTemplate = restTemplate;
    }

    
    // for fatching the conversion rate and store it in database 
    public double getExchangeRate(String base, String target) {
        Map<String, Double> rates = getAllCurrencies();

        if (rates == null || !rates.containsKey(base) || !rates.containsKey(target)) {
            throw new IllegalArgumentException("Invalid currency code provided.");
        }

        double rate = rates.get(target) / rates.get(base);

        CurrencyRate currencyRate = new CurrencyRate();
        currencyRate.setBaseCurrency(base);
        currencyRate.setTargetCurrency(target);
        currencyRate.setRate(rate);
        currencyRate.setTimestamp(LocalDateTime.now());
        repository.save(currencyRate);

        return rate;
    }
    
  //show all currencies
    public Map<String, Double> getAllCurrencies() {
        Map<String, Object> response = restTemplate.getForObject(API_URL, Map.class);

        if (response == null || !response.containsKey("rates")) {
            throw new RuntimeException("Invalid API response.");
        }

        return (Map<String, Double>) response.get("rates");
    }
    
    //historical data reprentation
    public List<CurrencyRate> getHistoricalData(String base, String target, String startDate, String endDate) {
        List<CurrencyRate> historicalRates = new ArrayList<>();
        LocalDate start = LocalDate.parse(startDate);
        LocalDate end = LocalDate.parse(endDate);

        // Ensure start date is before or equal to end date
        if (start.isAfter(end)) {
            throw new IllegalArgumentException("Start date must be before or equal to end date.");
        }

        while (!start.isAfter(end)) {
            try {
                String url = "https://data.fixer.io/api/" + start + "?access_key=" + API_KEY;
                Map<String, Object> response = restTemplate.getForObject(url, Map.class);

                if (response != null && response.containsKey("rates")) {
                    Map<String, Double> rates = (Map<String, Double>) response.get("rates");

                    if (rates.containsKey(base) && rates.containsKey(target)) {
                        double rate = rates.get(target) / rates.get(base);

                        CurrencyRate currencyRate = new CurrencyRate();
                        currencyRate.setBaseCurrency(base);
                        currencyRate.setTargetCurrency(target);
                        currencyRate.setRate(rate);
                        currencyRate.setTimestamp(start.atStartOfDay());

                        repository.save(currencyRate);
                        historicalRates.add(currencyRate);
                    } else {
                        System.out.println("Skipping date " + start + " due to missing rates.");
                    }
                } else {
                    System.out.println("Invalid response for date: " + start);
                }

                // Move to the next day
                start = start.plusDays(1);

            } catch (Exception e) {
                System.err.println("Error fetching data for date: " + start + " - " + e.getMessage());
                break; // Prevent infinite loop in case of repeated failures
            }
        }

        return historicalRates;
    }

}
