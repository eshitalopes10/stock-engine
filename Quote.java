package com.stockanalyzer.dto;

import java.time.Instant;

public record Quote(String symbol, double price, double change, double changePct, long volume,
                    double marketCapCr, Double pe, Freshness freshness, String provider, Instant asOf) {}
