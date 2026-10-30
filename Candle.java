package com.stockanalyzer.dto;

import java.time.LocalDate;

public record Candle(LocalDate date, double open, double high, double low, double close, long volume) {}
