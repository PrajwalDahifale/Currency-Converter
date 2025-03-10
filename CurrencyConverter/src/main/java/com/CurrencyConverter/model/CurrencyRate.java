package com.CurrencyConverter.model;

	import jakarta.persistence.*;
	import java.time.LocalDateTime;

	@Entity
	public class CurrencyRate {

	    @Id
	    @GeneratedValue(strategy = GenerationType.IDENTITY)
	    private Long id;
	    private String baseCurrency;
	    private String targetCurrency;
	    private double rate;
	    private LocalDateTime timestamp;
		public Long getId() {
			return id;
		}
		public void setId(Long id) {
			this.id = id;
		}
		public String getBaseCurrency() {
			return baseCurrency;
		}
		public void setBaseCurrency(String baseCurrency) {
			this.baseCurrency = baseCurrency;
		}
		public String getTargetCurrency() {
			return targetCurrency;
		}
		public void setTargetCurrency(String targetCurrency) {
			this.targetCurrency = targetCurrency;
		}
		public double getRate() {
			return rate;
		}
		public void setRate(double rate) {
			this.rate = rate;
		}
		public LocalDateTime getTimestamp() {
			return timestamp;
		}
		public void setTimestamp(LocalDateTime timestamp) {
			this.timestamp = timestamp;
		}

	    
	    
	    
	}



